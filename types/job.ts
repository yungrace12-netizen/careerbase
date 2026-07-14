export type EntityId = string;

export type EmploymentType =
  | '정규직'
  | '계약직'
  | '인턴'
  | '전환형 인턴'
  | '파견직'
  | '프리랜서'
  | '기타';

export type ApplicantType = '신입' | '경력' | '신입·경력' | '무관';

export type ApplicationBoardColumn =
  | '관심'
  | '준비 중'
  | '제출 완료'
  | '전형 진행'
  | '최종 결과';

export type ApplicationStatus =
  | '지원전'
  | '지원중'
  | '서류합격'
  | '서류불합격'
  | '인적성합격'
  | '인적성불합격'
  | '1차면접합격'
  | '1차면접불합격'
  | '2차면접합격'
  | '2차면접불합격'
  | '최종합격'
  | '최종불합격'
  | '지원포기';

export type ApplicationResult =
  | '미정'
  | '서류합격'
  | '서류불합격'
  | '인적성합격'
  | '인적성불합격'
  | '1차면접합격'
  | '1차면접불합격'
  | '2차면접합격'
  | '2차면접불합격'
  | '최종합격'
  | '최종불합격'
  | '지원포기';

export interface Job {
  id: EntityId;

  companyName: string;
  postingTitle: string;
  position: string;
  employmentType: EmploymentType | '';
  applicantType: ApplicantType | '';
  postingUrl: string;

  applicationStartDate: string | null;
  applicationStartTime: string | null;
  applicationEndDate: string | null;
  applicationEndTime: string | null;

  postingContent: string;
  qualifications: string;
  location: string;

  boardColumn: ApplicationBoardColumn;
  detailedStatus: ApplicationStatus;
  applicationResult: ApplicationResult;

  isArchived: boolean;
  archivedAt: string | null;
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}

export type CreateJobInput = Omit<
  Job,
  | 'id'
  | 'boardColumn'
  | 'detailedStatus'
  | 'applicationResult'
  | 'isArchived'
  | 'archivedAt'
  | 'isSample'
  | 'createdAt'
  | 'updatedAt'
>;

export type UpdateJobInput = Partial<CreateJobInput>;

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  '정규직',
  '계약직',
  '인턴',
  '전환형 인턴',
  '파견직',
  '프리랜서',
  '기타',
];

export const APPLICANT_TYPES: ApplicantType[] = [
  '신입',
  '경력',
  '신입·경력',
  '무관',
];

export const APPLICATION_BOARD_COLUMNS: ApplicationBoardColumn[] = [
  '관심',
  '준비 중',
  '제출 완료',
  '전형 진행',
  '최종 결과',
];
