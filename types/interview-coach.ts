import type { EntityId } from '@/types/job';

export interface InterviewCoachImport {
  id: EntityId;
  jobId: EntityId;
  expectedQuestions: string[];
  followUpQuestions: string[];
  opinion: string;
  gaps: string;
  recommendedExperiences: string;
  recommendedEssayContent: string;
  interviewScore: string;
  companyUnderstandingScore: string;
  jobUnderstandingScore: string;
  includeInPdf: boolean;
  rawText: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UpdateInterviewCoachImportInput = Partial<
  Pick<
    InterviewCoachImport,
    | 'expectedQuestions'
    | 'followUpQuestions'
    | 'opinion'
    | 'gaps'
    | 'recommendedExperiences'
    | 'recommendedEssayContent'
    | 'interviewScore'
    | 'companyUnderstandingScore'
    | 'jobUnderstandingScore'
    | 'includeInPdf'
    | 'rawText'
  >
>;

export interface InterviewCoachImportDraft {
  expectedQuestionsText: string;
  followUpQuestionsText: string;
  opinion: string;
  gaps: string;
  recommendedExperiences: string;
  recommendedEssayContent: string;
  interviewScore: string;
  companyUnderstandingScore: string;
  jobUnderstandingScore: string;
}

export type InterviewCoachImportFieldKey = keyof InterviewCoachImportDraft;

export const INTERVIEW_COACH_AI_LINKS = {
  chatgpt: 'https://chatgpt.com/',
  claude: 'https://claude.ai/new',
  gemini: 'https://gemini.google.com/app',
} as const;
