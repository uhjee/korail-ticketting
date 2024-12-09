/**
 * 날짜 문자열과 시간 문자열에서 Date 객체를 생성합니다
 * @param timeString 시간이 포함된 문자열 (예: '서울13:58')
 * @param baseDate 날짜 문자열 (예: '1992-10-20')
 * @returns Date 객체
 */
export function extractTimeToDateWithBase(
  timeString: string,
  baseDate: string,
): Date {
  try {
    // 시간 추출
    const timeRegex = /(\d{2}):(\d{2})/;
    const timeMatches = timeString.match(timeRegex);
    console.log(timeString);

    if (!timeMatches) {
      throw new Error(`유효하지 않은 시간 형식입니다: ${timeString}`);
    }

    const [_, hours, minutes] = timeMatches;

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(baseDate)) {
      throw new Error(`유효하지 않은 날짜 형식입니다: ${baseDate}`);
    }

    // 날짜와 시간 결합
    const date = new Date(`${baseDate}T${hours}:${minutes}:00`);

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      throw new Error('유효하지 않은 날짜/시간입니다');
    }

    return date;
  } catch (error) {
    console.error('시간 추출 실패:', error);
    throw error;
  }
}

/**
 * 날짜 문자열(YYYY-MM-DD)과 시간 문자열(HH:mm)을 결합하여 Date 객체를 생성합니다
 * @param dateStr 날짜 문자열 (예: '2024-12-16')
 * @param timeStr 시간 문자열 (예: '08:00')
 * @returns Date 객체
 */
export function createDateFromStrings(dateStr: string, timeStr: string): Date {
  try {
    // 날짜 형식(YYYY-MM-DD) 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      throw new Error(`유효하지 않은 날짜 형식입니다: ${dateStr}`);
    }

    // 시간 형식(HH:mm) 검증
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeStr)) {
      throw new Error(`유효하지 않은 시간 형식입니다: ${timeStr}`);
    }

    // 날짜와 시간 문자열 결합
    const dateTimeStr = `${dateStr}T${timeStr}:00`;
    const date = new Date(dateTimeStr);

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      throw new Error('유효하지 않은 날짜/시간입니다');
    }

    return date;
  } catch (error) {
    console.error('날짜/시간 생성 실패:', error);
    throw error;
  }
}
