import type { Job } from '@/types/job';
import type {
  AttachmentMetadata,
  Essay,
  Experience,
} from '@/types/essay';
import type { InterviewStage } from '@/types/interview';

export interface OnboardingData {
  isCompleted: boolean;
  selectedMode: 'sample' | 'empty' | null;
  completedAt: string | null;
}

export interface PersonalInfo {
  name: string;
  birthDate: string | null;
  address: string;
  englishAddress: string;
  profilePhotoFileName: string;
  profilePhotoLocation: string;
  desiredSalary: number | null;
  salaryCurrency: 'KRW';
  updatedAt: string;
}

export interface OtherInfo {
  hobby: string;
  specialty: string;
  updatedAt: string;
}

export interface Profile {
  personalInfo: PersonalInfo;
  highSchools: [];
  universities: [];
  careers: [];
  languages: [];
  certificates: [];
  awards: [];
  activities: [];
  otherInfo: OtherInfo;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light';
  sidebarCollapsed: boolean;
  autoSaveDelayMs: number;
  automaticTodoDaysBeforeDeadline: number;
  lastBackupAt: string | null;
  updatedAt: string;
}

export interface CareerBaseData {
  schemaVersion: string;
  initializedAt: string;
  lastUpdatedAt: string;

  onboarding: OnboardingData;
  jobs: Job[];
  schedules: [];
  essays: Essay[];
  interviews: InterviewStage[];
  profile: Profile;
  experiences: Experience[];
  todos: [];
  notes: [];
  attachments: AttachmentMetadata[];
  settings: AppSettings;
}
