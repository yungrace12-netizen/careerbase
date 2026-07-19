import type { CompanyResearch } from '@/types/company-research';
import type { InterviewCoachImport } from '@/types/interview-coach';
import type { Job } from '@/types/job';
import type {
  AttachmentMetadata,
  Essay,
  Experience,
} from '@/types/essay';
import type { InterviewStage } from '@/types/interview';
import type { Profile } from '@/types/profile';
import type { Schedule } from '@/types/schedule';

export interface OnboardingData {
  isCompleted: boolean;
  selectedMode: 'sample' | 'empty' | null;
  completedAt: string | null;
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
  schedules: Schedule[];
  essays: Essay[];
  interviews: InterviewStage[];
  companyResearch: CompanyResearch[];
  interviewCoachImports: InterviewCoachImport[];
  profile: Profile;
  experiences: Experience[];
  todos: [];
  notes: [];
  attachments: AttachmentMetadata[];
  settings: AppSettings;
}
