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
  /** 통합 회사정보 본문. 없으면 개별 필드를 fallback으로 사용한다. */
  content?: string;
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
    | 'content'
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
    | 'content'
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
    content: '',
  };
}

type CompanyResearchLegacyField =
  | 'mission'
  | 'vision'
  | 'coreValues'
  | 'talentProfile'
  | 'mainBusiness'
  | 'companyOverview'
  | 'recentIssues'
  | 'jobConnection'
  | 'expectedContribution'
  | 'memo';

const COMPANY_RESEARCH_CONTENT_SECTIONS: Array<{
  label: string;
  key: CompanyResearchLegacyField;
}> = [
  { label: 'Mission', key: 'mission' },
  { label: 'Vision', key: 'vision' },
  { label: '핵심가치', key: 'coreValues' },
  { label: '인재상', key: 'talentProfile' },
  { label: '주요 사업', key: 'mainBusiness' },
  { label: '회사 및 조직 이해', key: 'companyOverview' },
  { label: '최근 주요 이슈', key: 'recentIssues' },
  { label: '지원 직무와 회사의 연결점', key: 'jobConnection' },
  { label: '내가 기여할 수 있는 부분', key: 'expectedContribution' },
  { label: '자유 메모', key: 'memo' },
];

export function composeCompanyResearchContent(
  research: Pick<CompanyResearch, CompanyResearchLegacyField> | null | undefined,
) {
  if (!research) {
    return '';
  }

  const blocks = COMPANY_RESEARCH_CONTENT_SECTIONS.flatMap(({ label, key }) => {
    const value = research[key]?.trim();

    if (!value) {
      return [];
    }

    return [`${label}:`, value, ''];
  });

  return blocks.join('\n').trim();
}

export function getCompanyResearchDisplayContent(
  research: CompanyResearch | null | undefined,
) {
  if (research?.content != null && research.content.trim()) {
    return research.content;
  }

  return composeCompanyResearchContent(research);
}

export const COMPANY_RESEARCH_CONTENT_PLACEHOLDER = `Mission:
Vision:
핵심가치:
인재상:
주요 사업:
회사 및 조직 이해:
최근 주요 이슈:
지원 직무와 회사의 연결점:
내가 기여할 수 있는 부분:
면접 전에 꼭 기억할 내용:
자유 메모:`;
