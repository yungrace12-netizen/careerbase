import type { EntityId } from '@/types/job';

export interface CompanyResearch {
  id: EntityId;
  jobId: EntityId;
  mission: string;
  vision: string;
  coreValues: string;
  talentProfile: string;
  mainBusiness: string;
  companyOverview: string;
  recentIssues: string;
  jobConnection: string;
  expectedContribution: string;
  memo: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateCompanyResearchInput = {
  jobId: EntityId;
} & Partial<
  Pick<
    CompanyResearch,
    | 'mission'
    | 'vision'
    | 'coreValues'
    | 'talentProfile'
    | 'mainBusiness'
    | 'companyOverview'
    | 'recentIssues'
    | 'jobConnection'
    | 'expectedContribution'
    | 'memo'
  >
>;

export type UpdateCompanyResearchInput = Partial<
  Pick<
    CompanyResearch,
    | 'mission'
    | 'vision'
    | 'coreValues'
    | 'talentProfile'
    | 'mainBusiness'
    | 'companyOverview'
    | 'recentIssues'
    | 'jobConnection'
    | 'expectedContribution'
    | 'memo'
  >
>;

export function createEmptyCompanyResearchFields() {
  return {
    mission: '',
    vision: '',
    coreValues: '',
    talentProfile: '',
    mainBusiness: '',
    companyOverview: '',
    recentIssues: '',
    jobConnection: '',
    expectedContribution: '',
    memo: '',
  };
}
