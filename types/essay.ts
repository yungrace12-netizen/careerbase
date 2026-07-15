import type { EntityId } from '@/types/job';

export type AttachmentType =
  | '이력서'
  | '자소서'
  | '경력기술서'
  | '포트폴리오'
  | '면접자료'
  | '증명사진'
  | '기타';

export interface Essay {
  id: EntityId;
  jobId: EntityId;

  question: string;
  finalAnswer: string;

  attachmentIds: EntityId[];
  experienceIds: EntityId[];

  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AttachmentMetadata {
  id: EntityId;
  jobId: EntityId | null;
  essayId: EntityId | null;

  fileName: string;
  fileType: AttachmentType;
  versionDescription: string;
  localPathDescription: string;
  registeredDate: string;

  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: EntityId;

  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  measurableOutcome: string;

  competencyTags: string[];
  relatedJobIds: EntityId[];

  memo: string;
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}

export type CreateEssayInput = Pick<Essay, 'jobId' | 'question'>;

export type UpdateEssayInput = Partial<
  Pick<Essay, 'question' | 'finalAnswer' | 'attachmentIds' | 'experienceIds'>
>;

export type CreateAttachmentMetadataInput = Pick<
  AttachmentMetadata,
  | 'jobId'
  | 'essayId'
  | 'fileName'
  | 'fileType'
  | 'versionDescription'
  | 'localPathDescription'
  | 'registeredDate'
>;

export type UpdateAttachmentMetadataInput = Partial<
  Pick<
    AttachmentMetadata,
    | 'fileName'
    | 'fileType'
    | 'versionDescription'
    | 'localPathDescription'
    | 'registeredDate'
  >
>;

export const ATTACHMENT_TYPES: AttachmentType[] = [
  '이력서',
  '자소서',
  '경력기술서',
  '포트폴리오',
  '면접자료',
  '증명사진',
  '기타',
];
