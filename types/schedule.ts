import type { EntityId } from '@/types/job';

export type ScheduleType =
  | '지원 시작'
  | '지원 마감'
  | '서류 발표'
  | '인적성'
  | '인적성 발표'
  | '1차 면접'
  | '2차 면접'
  | '최종 발표'
  | '기타 면접';

export type SchedulePrecision = 'exact' | 'approximate' | 'unknown';

export interface Schedule {
  id: EntityId;
  jobId: EntityId;
  type: ScheduleType;
  title: string;
  precision: SchedulePrecision;
  exactDate: string | null;
  exactTime: string | null;
  approximateText: string;
  note: string;
  isConfirmed: boolean;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
}
