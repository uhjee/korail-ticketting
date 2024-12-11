import * as dotenv from 'dotenv';
import { emailService } from './utils/mailer';
import { createDateFromStrings } from './utils/dateUtil';
import { formatTrainListToHtml } from './utils/htmlFormatter';
import { KorailTicketing } from './services/KorailTicketing';
import { KorailConfig } from './types/types.d';

// .env 파일 로드
dotenv.config();

/**
 * 크롤링 및 이메일 송부
 *
 * @return  {Promise<void>}
 */
const run = async () => {
  const config: KorailConfig = {
    url: process.env.KORAIL_URL,
    adultCount: process.env.ADULT_COUNT,
    startDate: process.env.START_DATE,
    startTime: process.env.START_TIME,
    endTime: process.env.END_TIME,
    departureStation: process.env.DEPARTURE_STATION,
    arrivalStation: process.env.ARRIVAL_STATION,
    headlessMode: process.env.HEADLESS_MODE === 'true',
    waitTimeout: parseInt(process.env.WAIT_TIMEOUT || '10000'),
    pageTransitionDelay: parseInt(process.env.PAGE_TRANSITION_DELAY || '1000'),
    errorWaitTime: parseInt(process.env.ERROR_WAIT_TIME || '100'),
  };

  // 01. 크롤링 실행
  const ticketing = new KorailTicketing(config);
  const availableTrains = await ticketing.runCrawling();

  if (availableTrains.length === 0) {
    console.log('예매 가능한 열차가 없습니다.');
    return;
  }
  const receivers = process.env.EMAIL_RECEIVER.split(',');

  // 02. 이메일 전송
  await emailService.sendEmail(
    receivers,
    process.env.START_DATE,
    formatTrainListToHtml(availableTrains),
  );
};

/**
 * 3분 주기로 실행하는 함수
 *
 * @return  {Promise<void>}
 */
const runWithInterval = () => {
  try {
    console.log('프로그램을 시작합니다.');

    // 첫 실행
    run().catch((error) => {
      console.error('실행 중 에러 발생:', error);
    });

    // 3분마다 실행
    setInterval(
      () => {
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
      },
      parseInt(process.env.INTERVAL_TIME) * 60 * 1000,
      10,
    );
  } catch (error) {
    console.error('프로그램 초기화 중 에러 발생:', error);
  }
};

// 프로그램 시작
runWithInterval();
