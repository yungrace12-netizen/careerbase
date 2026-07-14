export type ScheduleType =
  | '지원 마감'
  | '서류 발표'
  | '인적성'
  | '1차 면접'
  | '2차 면접'
  | '최종 발표';

export type TodoSource = '자동' | '직접';

export type JobStatus =
  | '관심'
  | '준비 중'
  | '제출 완료'
  | '전형 진행'
  | '최종 결과';

export interface DashboardSchedule {
  id: string;
  type: ScheduleType;
  companyName: string;
  title: string;
  dateLabel: string;
  timeLabel?: string;
  dDay?: string;
}

export interface DashboardTodo {
  id: string;
  title: string;
  source: TodoSource;
  completed: boolean;
}

export interface DashboardStatistic {
  label: string;
  value: number;
}

export interface DashboardRecentJob {
  id: string;
  companyName: string;
  postingTitle: string;
  position: string;
  status: JobStatus;
  dDay: string;
}

export interface DashboardCalendarDay {
  date: number;
  currentMonth: boolean;
  today?: boolean;
  events: ScheduleType[];
}

export interface DashboardData {
  monthLabel: string;
  calendarDays: DashboardCalendarDay[];
  todaySchedules: DashboardSchedule[];
  weekSchedules: DashboardSchedule[];
  todos: DashboardTodo[];
  statistics: DashboardStatistic[];
  recentJobs: DashboardRecentJob[];
}

export const dashboardData: DashboardData = {
  monthLabel: '2026년 7월',
  calendarDays: [
    { date: 29, currentMonth: false, events: [] },
    { date: 30, currentMonth: false, events: [] },
    { date: 1, currentMonth: true, events: [] },
    { date: 2, currentMonth: true, events: ['지원 마감'] },
    { date: 3, currentMonth: true, events: [] },
    { date: 4, currentMonth: true, events: [] },
    { date: 5, currentMonth: true, events: [] },
    { date: 6, currentMonth: true, events: [] },
    { date: 7, currentMonth: true, events: ['서류 발표'] },
    { date: 8, currentMonth: true, events: [] },
    { date: 9, currentMonth: true, events: [] },
    { date: 10, currentMonth: true, events: [] },
    { date: 11, currentMonth: true, events: ['인적성'] },
    { date: 12, currentMonth: true, events: [] },
    { date: 13, currentMonth: true, events: [] },
    { date: 14, currentMonth: true, today: true, events: ['지원 마감', '1차 면접'] },
    { date: 15, currentMonth: true, events: [] },
    { date: 16, currentMonth: true, events: [] },
    { date: 17, currentMonth: true, events: ['서류 발표'] },
    { date: 18, currentMonth: true, events: [] },
    { date: 19, currentMonth: true, events: [] },
    { date: 20, currentMonth: true, events: [] },
    { date: 21, currentMonth: true, events: ['지원 마감'] },
    { date: 22, currentMonth: true, events: [] },
    { date: 23, currentMonth: true, events: ['2차 면접'] },
    { date: 24, currentMonth: true, events: [] },
    { date: 25, currentMonth: true, events: [] },
    { date: 26, currentMonth: true, events: [] },
    { date: 27, currentMonth: true, events: ['최종 발표'] },
    { date: 28, currentMonth: true, events: [] },
    { date: 29, currentMonth: true, events: [] },
    { date: 30, currentMonth: true, events: [] },
    { date: 31, currentMonth: true, events: ['지원 마감'] },
    { date: 1, currentMonth: false, events: [] },
    { date: 2, currentMonth: false, events: [] },
  ],
  todaySchedules: [
    {
      id: 'today-1',
      type: '지원 마감',
      companyName: 'KT',
      title: 'IT기획 신입',
      dateLabel: '오늘',
      timeLabel: '18:00',
      dDay: 'D-Day',
    },
    {
      id: 'today-2',
      type: '1차 면접',
      companyName: '현대오토에버',
      title: '서비스 기획',
      dateLabel: '오늘',
      timeLabel: '15:30',
    },
  ],
  weekSchedules: [
    {
      id: 'week-1',
      type: '지원 마감',
      companyName: 'KT',
      title: 'IT기획 신입',
      dateLabel: '7월 14일',
      timeLabel: '18:00',
    },
    {
      id: 'week-2',
      type: '서류 발표',
      companyName: 'LG CNS',
      title: 'DX Engineer',
      dateLabel: '7월 17일',
    },
    {
      id: 'week-3',
      type: '지원 마감',
      companyName: '삼성SDS',
      title: '클라우드 플랫폼',
      dateLabel: '7월 21일',
      dDay: 'D-7',
    },
  ],
  todos: [
    {
      id: 'todo-1',
      title: 'KT IT기획 자소서 최종 검토',
      source: '자동',
      completed: false,
    },
    {
      id: 'todo-2',
      title: '현대오토에버 1차 면접 예상 질문 정리',
      source: '직접',
      completed: false,
    },
    {
      id: 'todo-3',
      title: 'LG CNS 제출 서류 확인',
      source: '자동',
      completed: true,
    },
  ],
  statistics: [
    { label: '전체 지원', value: 12 },
    { label: '준비 중', value: 4 },
    { label: '제출 완료', value: 3 },
    { label: '전형 진행', value: 3 },
    { label: '최종 합격', value: 1 },
  ],
  recentJobs: [
    {
      id: 'job-1',
      companyName: 'KT',
      postingTitle: 'IT기획 신입',
      position: '서비스 기획',
      status: '준비 중',
      dDay: 'D-Day',
    },
    {
      id: 'job-2',
      companyName: 'LG CNS',
      postingTitle: 'DX Engineer',
      position: 'DX',
      status: '제출 완료',
      dDay: 'D+2',
    },
    {
      id: 'job-3',
      companyName: '현대오토에버',
      postingTitle: '서비스 기획',
      position: '기획',
      status: '전형 진행',
      dDay: 'D-3',
    },
    {
      id: 'job-4',
      companyName: '삼성SDS',
      postingTitle: '클라우드 플랫폼',
      position: 'Cloud',
      status: '관심',
      dDay: 'D-7',
    },
    {
      id: 'job-5',
      companyName: '네이버',
      postingTitle: 'Product Manager',
      position: 'PM',
      status: '최종 결과',
      dDay: '완료',
    },
  ],
};

export const emptyDashboardData: DashboardData = {
  monthLabel: '2026년 7월',
  calendarDays: dashboardData.calendarDays.map((day) => ({
    ...day,
    events: [],
  })),
  todaySchedules: [],
  weekSchedules: [],
  todos: [],
  statistics: dashboardData.statistics.map((statistic) => ({
    ...statistic,
    value: 0,
  })),
  recentJobs: [],
};
