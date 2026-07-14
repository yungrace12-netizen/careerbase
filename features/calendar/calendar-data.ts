export type CalendarScheduleType =
  | '지원 시작'
  | '지원 마감'
  | '서류 발표'
  | '인적성'
  | '1차 면접'
  | '2차 면접'
  | '최종 발표';

export type CalendarSchedulePrecision = 'exact' | 'approximate' | 'unknown';

export interface CalendarSchedule {
  id: string;
  jobId: string;
  companyName: string;
  postingTitle: string;
  type: CalendarScheduleType;
  precision: CalendarSchedulePrecision;
  date: string | null;
  time?: string;
  approximateText?: string;
}

export const calendarSchedules: CalendarSchedule[] = [
  {
    id: 'schedule-1',
    jobId: 'job-kt-it',
    companyName: 'KT',
    postingTitle: 'IT기획 신입',
    type: '지원 시작',
    precision: 'exact',
    date: '2026-07-02',
  },
  {
    id: 'schedule-2',
    jobId: 'job-kt-it',
    companyName: 'KT',
    postingTitle: 'IT기획 신입',
    type: '지원 마감',
    precision: 'exact',
    date: '2026-07-14',
    time: '18:00',
  },
  {
    id: 'schedule-3',
    jobId: 'job-lg-dx',
    companyName: 'LG CNS',
    postingTitle: 'DX Engineer',
    type: '서류 발표',
    precision: 'exact',
    date: '2026-07-17',
  },
  {
    id: 'schedule-4',
    jobId: 'job-hyundai-service',
    companyName: '현대오토에버',
    postingTitle: '서비스 기획',
    type: '1차 면접',
    precision: 'exact',
    date: '2026-07-14',
    time: '15:30',
  },
  {
    id: 'schedule-5',
    jobId: 'job-samsung-cloud',
    companyName: '삼성SDS',
    postingTitle: '클라우드 플랫폼',
    type: '지원 마감',
    precision: 'exact',
    date: '2026-07-21',
    time: '23:59',
  },
  {
    id: 'schedule-6',
    jobId: 'job-naver-pm',
    companyName: '네이버',
    postingTitle: 'Product Manager',
    type: '2차 면접',
    precision: 'exact',
    date: '2026-07-23',
    time: '10:00',
  },
  {
    id: 'schedule-7',
    jobId: 'job-kakao-platform',
    companyName: '카카오',
    postingTitle: '플랫폼 기획',
    type: '최종 발표',
    precision: 'exact',
    date: '2026-07-27',
  },
  {
    id: 'schedule-8',
    jobId: 'job-toss-data',
    companyName: '토스',
    postingTitle: 'Data Analyst',
    type: '인적성',
    precision: 'exact',
    date: '2026-07-11',
    time: '14:00',
  },
  {
    id: 'schedule-9',
    jobId: 'job-line-design',
    companyName: 'LINE',
    postingTitle: 'Product Designer',
    type: '서류 발표',
    precision: 'approximate',
    date: null,
    approximateText: '7월 말',
  },
  {
    id: 'schedule-10',
    jobId: 'job-coupang-pm',
    companyName: '쿠팡',
    postingTitle: 'PM 인턴',
    type: '최종 발표',
    precision: 'unknown',
    date: null,
    approximateText: '추후 안내',
  },
];

export const calendarEventTypes: CalendarScheduleType[] = [
  '지원 시작',
  '지원 마감',
  '서류 발표',
  '인적성',
  '1차 면접',
  '2차 면접',
  '최종 발표',
];

export function getExactSchedules(schedules: CalendarSchedule[]) {
  return schedules.filter(
    (schedule) => schedule.precision === 'exact' && schedule.date,
  );
}

export function getPendingSchedules(schedules: CalendarSchedule[]) {
  return schedules.filter((schedule) => schedule.precision !== 'exact');
}

export function getSchedulesByDate(
  schedules: CalendarSchedule[],
  date: string,
) {
  return getExactSchedules(schedules).filter(
    (schedule) => schedule.date === date,
  );
}
