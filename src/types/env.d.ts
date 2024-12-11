declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** 코레일 예매 페이지 URL */
      KORAIL_URL: string;
      /** 출발역 */
      DEPARTURE_STATION: string;
      /** 도착역 */
      ARRIVAL_STATION: string;
      /** 성인 승객 수 */
      ADULT_COUNT: string;
      /** 헤드리스 모드 실행 여부 */
      HEADLESS_MODE: string;
      /** 요소 대기 시간 (ms) */
      WAIT_TIMEOUT: string;
      /** 페이지 전환 딜레이 (ms) */
      PAGE_TRANSITION_DELAY: string;
      /** 에러 발생 시 대기 시간 (ms) */
      ERROR_WAIT_TIME: string;
      /** 조회 시작 날짜 (YYYY-MM-DD) */
      START_DATE: string;
      /** 조회 시작 시간 (HH:mm) */
      START_TIME: string;
      /** 조회 종료 시간 (HH:mm) */
      END_TIME: string;

      /** 이메일 계정 */
      EMAIL_USER: string;
      /** 이메일 비밀번호 */
      EMAIL_PASSWORD: string;
      /** 조회 주기 (ms) */
      INTERVAL_TIME: string;
    }
  }
}

export {};
