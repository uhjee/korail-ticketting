import { TrainInfo } from '../types/types';

/**
 * 시간 형식을 HH:mm 형태로 변환합니다
 */
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * 열차 정보 목록을 HTML 테이블 형식으로 변환합니다
 */
export const formatTrainListToHtml = (trainList: TrainInfo[]): string => {
  const title = `<h2>열차정보 [${trainList.length}]건</h2>`;

  const tableHeader = `
    <tr>
      <th>출발시간</th>
      <th>도착시간</th>
      <th>특등석</th>
      <th>일반석</th>
      <th>URL</th>
    </tr>
  `;

  const tableRows = trainList
    .map(
      (train) => `
    <tr>
      <td>${formatTime(train.departureTime)}</td>
      <td>${formatTime(train.arrivalTime)}</td>
      <td>${train.firstClassStatus}</td>
      <td>${train.economyClassStatus}</td>
      <td><a href="${train.url}">링크</a></td>
    </tr>
  `,
    )
    .join('');

  const table = `
    <table border="1" style="border-collapse: collapse;">
      ${tableHeader}
      ${tableRows}
    </table>
  `;

  return `
    <div style="font-family: Arial, sans-serif;">
      ${title}
      ${table}
    </div>
  `;
};
