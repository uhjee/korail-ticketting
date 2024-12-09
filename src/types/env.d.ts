declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KORAIL_URL: string;
      DEPARTURE_STATION: string;
      ARRIVAL_STATION: string;
      ADULT_COUNT: string;
      HEADLESS_MODE: string;
      WAIT_TIMEOUT: string;
      PAGE_TRANSITION_DELAY: string;
      ERROR_WAIT_TIME: string;
      START_DATE: string;
      START_TIME: string;
      END_TIME: string;

      EMAIL_USER: string;
      EMAIL_PASSWORD: string;
    }
  }
}

export {};
