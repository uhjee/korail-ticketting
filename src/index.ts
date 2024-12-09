import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import * as dotenv from 'dotenv';
import { emailService } from './utils/mailer';
import {
  createDateFromStrings,
  extractTimeToDateWithBase,
} from './utils/dateUtil';
import { TrainInfo } from './types/types';
import { formatTrainListToHtml } from './utils/htmlFormatter';

// .env 파일 로드
dotenv.config();

class KorailTicketing {
  private driver: WebDriver;
  private readonly URL = process.env.KORAIL_URL;
  private readonly START_DATE = process.env.START_DATE;
  private readonly START_TIME = process.env.START_TIME;
  private readonly END_TIME = process.env.END_TIME;
  private readonly WAIT_TIMEOUT = parseInt(process.env.WAIT_TIMEOUT || '10000');
  private readonly PAGE_TRANSITION_DELAY = parseInt(
    process.env.PAGE_TRANSITION_DELAY || '1000',
  );
  private readonly ERROR_WAIT_TIME = parseInt(
    process.env.ERROR_WAIT_TIME || '100',
  );

  constructor() {
    const options = new Options();
    if (process.env.HEADLESS_MODE === 'true') {
      options.addArguments('--headless');
    }

    this.driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  /**
   * 기차 조회 페이지를 초기화하고 검색 조건을 설정합니다
   */
  private async initializeSearch(): Promise<void> {
    await this.driver.get(this.URL);

    // 인원정보 설정
    const adultSelect = await this.driver.findElement(By.name('txtPsgFlg_1'));
    await this.driver.executeScript(
      "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change'))",
      adultSelect,
      process.env.ADULT_COUNT,
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
   * 출발역과 도착역을 설정합니다
   */
  private async setStations(): Promise<void> {
    await this.setStation('start', process.env.DEPARTURE_STATION);
    await this.setStation('end', process.env.ARRIVAL_STATION);
  }

  /**
   * 특정 역을 선택합니다
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
   * 날짜와 시간을 설정합니다
   * @param date 설정할 날짜와 시간
   */
  private async setDateTime(date: Date): Promise<void> {
    const dateTimeSettings = [
      { id: 's_year', value: date.getFullYear().toString() },
      {
        id: 's_month',
        value: (date.getMonth() + 1).toString().padStart(2, '0'),
      },
      { id: 's_day', value: date.getDate().toString().padStart(2, '0') },
      { id: 's_hour', value: date.getHours().toString().padStart(2, '0') },
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
   * 조회 결과를 파싱하여 예매 가능한 열차 정보를 반환합니다
   */
  private async parseResults(): Promise<TrainInfo[]> {
    const availableTrains: TrainInfo[] = [];

    for (let page = 1; page <= 3; page++) {
      // 테이블이 로드될 때까지 대기
      await this.driver.wait(until.elementLocated(By.id('tableResult')), 10000);

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

          const unavailableStatuses = [
            '좌석매진',
            '요구하신 좌석보다 남아 있는 좌석이 부족합니다',
          ];

          if (
            !unavailableStatuses.includes(firstClassStatus) ||
            !unavailableStatuses.includes(economyClassStatus)
          ) {
            availableTrains.push({
              departureTime: extractTimeToDateWithBase(
                departureTime,
                this.START_DATE,
              ),
              arrivalTime: extractTimeToDateWithBase(
                arrivalTime,
                this.START_DATE,
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
        // 다음 페이지로 이동
        const nextButton = await this.driver.findElement(
          By.css('img[alt="다음"]'),
        );
        await nextButton.click();
        // 페이지 전환 대기
        await this.driver.sleep(1000);
      }
    }

    // END_TIME 기준으로 필터링
    const filteredTrains = availableTrains.filter((train) => {
      const endTime = new Date(
        `${process.env.START_DATE} ${process.env.END_TIME}`,
      );
      return train.arrivalTime <= endTime;
    });

    return availableTrains;
  }

  /**
   * 티켓팅 프로세스를 실행합니다
   */
  public async runCrawling(date: Date): Promise<TrainInfo[]> {
    try {
      await this.initializeSearch();
      await this.setStations();
      await this.setDateTime(date);

      const searchButton = await this.driver.findElement(
        By.css('div.ticket_box > p.btn_inq'),
      );
      await searchButton.click();

      const availableTrains = await this.parseResults();

      return availableTrains;
    } catch (error) {
      console.error('에러 발생:', error);
      await this.driver.sleep(this.ERROR_WAIT_TIME);
    } finally {
      await this.driver.quit();
    }
  }
}

// 프로그램 실행

const run = async () => {
  const ticketing = new KorailTicketing();
  const availableTrains = await ticketing.runCrawling(
    createDateFromStrings(process.env.START_DATE, process.env.START_TIME),
  );

  // 이메일 전송
  if (availableTrains.length === 0) {
    console.log('예매 가능한 열차가 없습니다.');
    return;
  }
  const receivers = process.env.EMAIL_RECEIVER.split(',');
  console.log(receivers);

  await emailService.sendEmail(
    receivers,
    'korail-test',
    formatTrainListToHtml(availableTrains),
  );
};
// 3분 주기로 실행하는 함수
const runWithInterval = () => {
  try {
    console.log('프로그램을 시작합니다.');

    // 첫 실행
    run().catch((error) => {
      console.error('실행 중 에러 발생:', error);
    });

    // 3분마다 실행
    setInterval(() => {
      try {
        console.log(
          `\n${new Date().toLocaleString()} - 새로운 검색을 시작합니다.`,
        );
        run().catch((error) => {
          console.error('실행 중 에러 발생:', error);
        });
      } catch (error) {
        console.error('예기치 않은 에러 발생:', error);
      }
    }, 180000); // 3분 = 180000ms
  } catch (error) {
    console.error('프로그램 초기화 중 에러 발생:', error);
  }
};

// 프로그램 시작
runWithInterval();
