import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { KorailConfig, TrainInfo } from '../types/types';
import {
  createDateFromStrings,
  extractTimeToDateWithBase,
} from '../utils/dateUtil';

export class KorailTicketing {
  private readonly config: KorailConfig;
  private readonly UNAVAILABLE_STATUSES = [
    '좌석매진',
    '요구하신 좌석보다 남아 있는 좌석이 부족합니다',
  ] as string[];
  private driver: WebDriver;
  private START_DATETIME: Date;
  private END_DATETIME: Date;

  constructor(config: KorailConfig) {
    this.config = config;

    const options = new Options();
    if (this.config.headlessMode) {
      options.addArguments('--headless');
    }

    this.driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    this.START_DATETIME = createDateFromStrings(
      this.config.startDate,
      this.config.startTime,
    );
    this.END_DATETIME = createDateFromStrings(
      this.config.startDate,
      this.config.endTime,
    );
  }

  /**
   * 초기 검색 페이지 초기화
   *
   * @return  {Promise<void>}
   */
  private async initializeSearch(): Promise<void> {
    await this.driver.get(this.config.url);

    const adultSelect = await this.driver.findElement(By.name('txtPsgFlg_1'));
    await this.driver.executeScript(
      "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change'))",
      adultSelect,
      this.config.adultCount,
    );

    // KTX/SRT 체크박스 클릭
    const ktxRadio = await this.driver.findElement(By.id('selGoTrainRa00'));
    await this.driver.executeScript(
      "arguments[0].click(); arguments[0].dispatchEvent(new Event('change'))",
      ktxRadio,
    );

    // 직통 선택
    const directRadio = await this.driver.findElement(By.id('route01'));
    await this.driver.executeScript(
      "arguments[0].click(); arguments[0].dispatchEvent(new Event('change'))",
      directRadio,
    );
  }

  /**
   * 출발역과 도착역 설정
   *
   * @return  {Promise<void>}
   */
  private async setStations(): Promise<void> {
    await this.setStation('start', this.config.departureStation);
    await this.setStation('end', this.config.arrivalStation);
  }

  /**
   * 출발역 또는 도착역 설정
   *
   * @param type 출발역 또는 도착역
   * @param stationName 역 이름
   * @return  {Promise<void>}
   */
  private async setStation(
    type: 'start' | 'end',
    stationName: string,
  ): Promise<void> {
    const inputId = type === 'start' ? 'start' : 'get';

    // input 요소 찾기 및 값 설정
    const stationInput = await this.driver.findElement(By.id(inputId));
    await this.driver.executeScript(
      `
      arguments[0].value = arguments[1];
      arguments[0].dispatchEvent(new Event('change'));
      `,
      stationInput,
      stationName,
    );
  }

  /**
   * 날짜와 시간 설정
   *
   * @param date 날짜
   * @return  {Promise<void>}
   */
  private async setDateTime(date: Date): Promise<void> {
    const dateTimeSettings = [
      { id: 's_year', value: date.getFullYear().toString() },
      {
        id: 's_month',
        value: (date.getMonth() + 1).toString().padStart(2, '0'),
      },
      { id: 's_day', value: date.getDate().toString().padStart(2, '0') },
      { id: 's_hour', value: '00' }, // 코레일에서 2페이지부터 querystring을 세팅하기 때문에 첫 페이지는 00:00으로 세팅
    ];

    for (const setting of dateTimeSettings) {
      const element = await this.driver.findElement(By.id(setting.id));
      await this.driver.executeScript(
        "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change'))",
        element,
        setting.value,
      );
    }
  }

  /**
   * 검색 결과 파싱
   *
   * @param startDatetime 출발 시간
   * @param endDatetime 도착 시간
   * @return  {Promise<TrainInfo[]>}
   */
  private async parseResults(
    startDatetime: Date,
    endDatetime: Date,
  ): Promise<TrainInfo[]> {
    const availableTrains: TrainInfo[] = [];

    for (let page = 1; page <= 3; page++) {
      await this.driver.wait(
        until.elementLocated(By.id('tableResult')),
        this.config.waitTimeout,
      );

      const currentUrl = await this.driver.getCurrentUrl();
      const rows = await this.driver.findElements(By.css('#tableResult tr'));

      for (const row of rows) {
        try {
          const departureTime =
            (
              await row.findElement(By.css('td:nth-child(3)')).getText()
            )?.replace(/\n/g, '') || 'Error';
          const arrivalTime =
            (
              await row.findElement(By.css('td:nth-child(4)')).getText()
            )?.replace(/\n/g, '') || 'Error';

          const firstClassImg = await row.findElement(
            By.css('td:nth-child(5) img'),
          );
          const economyClassImg = await row.findElement(
            By.css('td:nth-child(6) img'),
          );

          const firstClassStatus = await firstClassImg.getAttribute('alt');
          const economyClassStatus = await economyClassImg.getAttribute('alt');

          if (
            !this.UNAVAILABLE_STATUSES.includes(firstClassStatus) ||
            !this.UNAVAILABLE_STATUSES.includes(economyClassStatus)
          ) {
            availableTrains.push({
              departureTime: extractTimeToDateWithBase(
                departureTime,
                this.config.startDate,
              ),
              arrivalTime: extractTimeToDateWithBase(
                arrivalTime,
                this.config.startDate,
              ),
              firstClassStatus,
              economyClassStatus,
              url: currentUrl,
            });
          }
        } catch (error) {
          continue; // 유효하지 않은 행은 건너뜀
        }
      }

      if (page < 3) {
        const nextButton = await this.driver.findElement(
          By.css('img[alt="다음"]'),
        );
        await nextButton.click();
        await this.driver.sleep(this.config.pageTransitionDelay);
      }
    }

    const filteredTrains = availableTrains.filter((train) => {
      try {
        if (
          isNaN(this.START_DATETIME.getTime()) ||
          isNaN(this.END_DATETIME.getTime())
        ) {
          console.error(
            '잘못된 시간 형식:',
            `${this.config.startDate} ${this.config.startTime}`,
            `${this.config.startDate} ${this.config.endTime}`,
          );
          return false;
        }
        return (
          train.departureTime >= this.START_DATETIME &&
          train.arrivalTime <= this.END_DATETIME
        );
      } catch (error) {
        console.error('시간 비교 중 오류 발생:', error);
        return false;
      }
    });

    return filteredTrains;
  }

  /**
   * 크롤링 실행
   *
   * @return  {Promise<TrainInfo[]>}
   */
  public async runCrawling(): Promise<TrainInfo[]> {
    try {
      // 01. 검색조건 설정
      await this.initializeSearch();
      await this.setStations();
      await this.setDateTime(this.START_DATETIME);

      // 02. 검색 버튼 클릭
      const searchButton = await this.driver.findElement(
        By.css('div.ticket_box > p.btn_inq'),
      );
      await searchButton.click();

      // 03. 검색 결과 파싱
      const availableTrains = await this.parseResults(
        this.START_DATETIME,
        this.END_DATETIME,
      );

      return availableTrains;
    } catch (error) {
      console.error('크롤링 에러 발생:', error);
      await this.driver.sleep(this.config.errorWaitTime);
    } finally {
      await this.driver.quit();
    }
  }
}
