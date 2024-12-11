# 코레일 티켓팅 자동화 프로그램

KTX/SRT 열차 예매를 자동으로 모니터링하고 예매 가능한 좌석이 있을 경우 이메일로 알림을 보내주는 프로그램입니다.

## 기능

- KTX/SRT 열차 예매 페이지 자동 모니터링
- 지정된 시간대의 예매 가능한 좌석 검색
- 예매 가능한 좌석 발견 시 이메일 알림
- 특실/일반실 좌석 상태 확인
- 직통 열차 검색 지원
- 헤드리스 모드 지원

## 기술 스택

- Node.js
- TypeScript
- Selenium WebDriver (Chrome)
- Nodemailer (이메일 발송)

## 설치 방법

1. 저장소 클론

```bash
git clone [repository-url]
cd korail-ticketing
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 설정합니다:

```bash
# 코레일 URL
KORAIL_URL=https://www.letskorail.com/ebizprd/EbizPrdTicketpr21100W_pr21110.do

# 검색 조건
START_DATE=2024-12-14        # 조회 시작 날짜 (YYYY-MM-DD)
START_TIME=08:00             # 조회 시작 시간 (HH:mm)
END_TIME=13:30              # 조회 종료 시간 (HH:mm)
DEPARTURE_STATION=서울       # 출발역
ARRIVAL_STATION=부산         # 도착역
ADULT_COUNT=2               # 성인 승객 수

# 크롬 드라이버 설정
HEADLESS_MODE=true          # 헤드리스 모드 실행 여부

# 검색 대기 시간 (밀리초)
WAIT_TIMEOUT=10000          # 요소 대기 시간
PAGE_TRANSITION_DELAY=1000  # 페이지 전환 딜레이
ERROR_WAIT_TIME=1000        # 에러 발생 시 대기 시간

# 이메일 설정
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_RECEIVER=receiver1@gmail.com,receiver2@gmail.com

# 수행 주기 (분)
INTERVAL_TIME=3
```

## 실행 방법

개발 모드 실행 (hot reload):

```bash
npm run dev
```

프로덕션 모드 실행:

```bash
npm start
```

## 주요 기능 설명

1. **검색 조건 설정**
    - 출발/도착역 설정
    - 날짜 및 시간 설정
    - 승객 수 설정
    - KTX/SRT 및 직통 열차 선택

2. **자동 검색**
    - 설정된 주기로 자동 검색 수행
    - 3페이지까지 검색 결과 확인
    - 예매 가능한 좌석 발견 시 정보 수집

3. **이메일 알림**
    - 예매 가능한 좌석 발견 시 지정된 수신자에게 이메일 발송
    - HTML 형식의 깔끔한 메일 템플릿
    - 예매 페이지 바로가기 링크 제공

## 주의사항

- Chrome 브라우저가 설치되어 있어야 합니다.
- Gmail을 사용할 경우 앱 비밀번호를 생성하여 사용해야 합니다.
- 과도한 요청은 서버 차단의 원인이 될 수 있으니 적절한 검색 주기를 설정하세요.

## 브라우저 최적화 옵션

Chrome 브라우저는 다음과 같은 최적화 옵션이 적용되어 있습니다:
- GPU 하드웨어 가속 비활성화
- 샌드박스 비활성화
- 공유 메모리 사용 비활성화
- 확장 프로그램 비활성화
- 알림 비활성화
- 정보 표시줄 비활성화

## 라이선스

ISC
