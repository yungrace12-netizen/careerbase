import type { EntityId } from '@/types/job';

export type InterviewStatus = '준비 전' | '준비 중' | '예정' | '완료' | '취소';

export interface InterviewQuestion {
  id: EntityId;
  question: string;
  answer: string;
  experienceIds: EntityId[];

  createdAt: string;
  updatedAt: string;
}

export interface ActualInterviewQuestion {
  id: EntityId;
  question: string;
  myAnswerMemo: string;
  improvementMemo: string;

  createdAt: string;
  updatedAt: string;
}

export interface InterviewStage {
  id: EntityId;
  jobId: EntityId;

  name: string;
  order: number;
  status: InterviewStatus;

  scheduleId: EntityId | null;

  expectedQuestions: InterviewQuestion[];
  actualQuestions: ActualInterviewQuestion[];
  retrospective: string;

  attachmentIds: EntityId[];
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}

export type CreateInterviewStageInput = Pick<
  InterviewStage,
  'jobId' | 'name' | 'order' | 'status'
>;

export type UpdateInterviewStageInput = Partial<
  Pick<InterviewStage, 'name' | 'order' | 'status' | 'retrospective'>
>;

export const INTERVIEW_STATUSES: InterviewStatus[] = [
  '준비 전',
  '준비 중',
  '예정',
  '완료',
  '취소',
];

export const DEFAULT_INTERVIEW_STAGE_NAMES = ['1차 면접', '2차 면접'] as const;

export const CUSTOM_INTERVIEW_STAGE_NAMES = [
  '직무면접',
  '인성면접',
  '임원면접',
  'PT면접',
  '화상면접',
  '기타',
] as const;
