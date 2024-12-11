/** 열차 정보를 나타내는 인터페이스 */
export interface TrainInfo {
  /** 출발 시간 */
  departureTime: Date;
  /** 도착 시간 */
  arrivalTime: Date;
  /** 특실 예매 가능 상태 */
  firstClassStatus: string;
  /** 일반실 예매 가능 상태 */
  economyClassStatus: string;
  /** 예매 페이지 URL */
  url: string;
}

export interface KorailConfig {
  /** 코레일 예매 페이지 URL */
  url: string;
  /** 성인 승객 수 */
  adultCount: string;
  /** 조회 시작 날짜 (YYYY-MM-DD) */
  startDate: string;
  /** 조회 시작 시간 (HH:mm) */
  startTime: string;
  /** 조회 종료 시간 (HH:mm) */
  endTime: string;
  /** 출발역 */
  departureStation: string;
  /** 도착역 */
  arrivalStation: string;
  /** 헤드리스 모드 실행 여부 */
  headlessMode: boolean;
  /** 요소 대기 시간 (ms) */
  waitTimeout: number;
  /** 페이지 전환 딜레이 (ms) */
  pageTransitionDelay: number;
  /** 에러 발생 시 대기 시간 (ms) */
  errorWaitTime: number;
}

