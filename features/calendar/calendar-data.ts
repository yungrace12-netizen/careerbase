export type CalendarScheduleType =
  | '지원 시작'
  | '지원 마감'
  | '서류 발표'
  | '인적성 발표'
  | '1차 면접'
  | '2차 면접'
  | '기타 면접'
  | '최종 발표';

export type CalendarSchedulePrecision = 'exact' | 'approximate' | 'unknown';

export interface CalendarSchedule {
  id: string;
  jobId: string;
  companyName: string;
  postingTitle: string;
  position: string;
  type: CalendarScheduleType;
  precision: CalendarSchedulePrecision;
  date: string | null;
  time?: string;
  approximateText?: string;
  dDayLabel: string;
  isPast: boolean;
  isToday: boolean;
  isDanger: boolean;
}

export const calendarSchedules: CalendarSchedule[] = [];

export const calendarEventTypes: CalendarScheduleType[] = [
  '지원 시작',
  '지원 마감',
  '서류 발표',
  '인적성 발표',
  '1차 면접',
  '2차 면접',
  '기타 면접',
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

export function getSchedulesByMonth(
  schedules: CalendarSchedule[],
  month: string,
) {
  return getExactSchedules(schedules).filter((schedule) =>
    schedule.date?.startsWith(month),
  );
}

export function createDdayInfo(date: string, today = new Date()) {
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const targetDate = new Date(`${date}T00:00:00`);
  const diff = Math.ceil(
    (targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) {
    return {
      label: formatDateLabel(date),
      isPast: true,
      isToday: false,
    };
  }

  if (diff === 0) {
    return {
      label: 'TODAY',
      isPast: false,
      isToday: true,
    };
  }

  return {
    label: `D-${diff}`,
    isPast: false,
    isToday: false,
  };
}

function formatDateLabel(date: string) {
  const [, month, day] = date.split('-');

  return `${Number(month)}.${Number(day)}`;
}
