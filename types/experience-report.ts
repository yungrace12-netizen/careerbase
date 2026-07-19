import type { EntityId } from '@/types/job';

export interface ExperienceReport {
  id: EntityId;
  oneLiner: string;
  strengths: string;
  weaknesses: string;
  personality: string;
  recommendedRoles: string;
  recommendedCompanyTypes: string;
  recommendedExperiences: string;
  recommendedEssays: string;
  expectedQuestions: string[];
  followUpQuestions: string[];
  pressureQuestions: string[];
  answerImprovements: string;
  careerStrategy: string;
  interviewReadiness: string;
  careerReadiness: string;
  aiOpinion: string;
  suggestedAdditionalData: string;
  rawText: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UpdateExperienceReportInput = Partial<
  Pick<
    ExperienceReport,
    | 'oneLiner'
    | 'strengths'
    | 'weaknesses'
    | 'personality'
    | 'recommendedRoles'
    | 'recommendedCompanyTypes'
    | 'recommendedExperiences'
    | 'recommendedEssays'
    | 'expectedQuestions'
    | 'followUpQuestions'
    | 'pressureQuestions'
    | 'answerImprovements'
    | 'careerStrategy'
    | 'interviewReadiness'
    | 'careerReadiness'
    | 'aiOpinion'
    | 'suggestedAdditionalData'
    | 'rawText'
  >
>;

export interface ExperienceReportDraft {
  oneLiner: string;
  strengths: string;
  weaknesses: string;
  personality: string;
  recommendedRoles: string;
  recommendedCompanyTypes: string;
  recommendedExperiences: string;
  recommendedEssays: string;
  expectedQuestionsText: string;
  followUpQuestionsText: string;
  pressureQuestionsText: string;
  answerImprovements: string;
  careerStrategy: string;
  interviewReadiness: string;
  careerReadiness: string;
  aiOpinion: string;
  suggestedAdditionalData: string;
}

export type ExperienceReportFieldKey = keyof ExperienceReportDraft;

export const EXPERIENCE_REPORT_AI_LINKS = {
  chatgpt: 'https://chatgpt.com/',
  claude: 'https://claude.ai/new',
  gemini: 'https://gemini.google.com/app',
} as const;

export const EXPERIENCE_REPORT_FIELD_OPTIONS: Array<{
  key: ExperienceReportFieldKey;
  label: string;
}> = [
  { key: 'oneLiner', label: '나를 한 줄로 표현하면?' },
  { key: 'strengths', label: '나의 강점' },
  { key: 'weaknesses', label: '나의 약점' },
  { key: 'personality', label: '나의 성향' },
  { key: 'recommendedRoles', label: '추천 직무' },
  { key: 'recommendedCompanyTypes', label: '추천 기업 유형' },
  { key: 'recommendedExperiences', label: '추천 경험' },
  { key: 'recommendedEssays', label: '추천 자소서' },
  { key: 'expectedQuestionsText', label: '예상 질문' },
  { key: 'followUpQuestionsText', label: '꼬리 질문' },
  { key: 'pressureQuestionsText', label: '압박 질문' },
  { key: 'answerImprovements', label: '답변 보완 사항' },
  { key: 'careerStrategy', label: '취업 전략' },
  { key: 'interviewReadiness', label: '면접 준비도' },
  { key: 'careerReadiness', label: '취업 준비도' },
  { key: 'aiOpinion', label: 'AI 의견' },
  { key: 'suggestedAdditionalData', label: '추가하면 좋은 경험' },
];
