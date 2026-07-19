import type { ExperienceReportDraft } from '@/types/experience-report';

const SECTION_STOP_TITLES = [
  '나를\\s*한\\s*줄로\\s*표현하면\\??',
  '나의\\s*강점',
  '나의\\s*약점',
  '나의\\s*성향',
  '추천\\s*직무',
  '추천\\s*기업\\s*유형',
  '추천\\s*경험',
  '추천\\s*자소서',
  '예상\\s*질문',
  '꼬리\\s*질문',
  '압박\\s*질문',
  '답변\\s*보완\\s*사항',
  '취업\\s*전략',
  '면접\\s*준비도',
  '취업\\s*준비도',
  'AI\\s*의견',
  '추가하면\\s*좋은\\s*경험',
  '자주\\s*등장하는\\s*경험',
  '강조해야\\s*하는\\s*경험',
  '키워드',
  '차별점',
  '부족한\\s*부분',
  'STAR',
  '정량',
  '지원동기',
  '직무\\s*연결성',
].join('|');

function createEmptyExperienceReportDraft(): ExperienceReportDraft {
  return {
    oneLiner: '',
    strengths: '',
    weaknesses: '',
    personality: '',
    recommendedRoles: '',
    recommendedCompanyTypes: '',
    recommendedExperiences: '',
    recommendedEssays: '',
    expectedQuestionsText: '',
    followUpQuestionsText: '',
    pressureQuestionsText: '',
    answerImprovements: '',
    careerStrategy: '',
    interviewReadiness: '',
    careerReadiness: '',
    aiOpinion: '',
    suggestedAdditionalData: '',
  };
}

function parseExperienceReportResultText(
  rawText: string,
): ExperienceReportDraft {
  const draft = createEmptyExperienceReportDraft();
  const normalized = rawText.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return draft;
  }

  draft.oneLiner = extractSection(normalized, [
    '나를 한 줄로 표현하면?',
    '나를 한 줄로 표현하면',
    '한 줄 표현',
  ]);
  draft.strengths = extractSection(normalized, ['나의 강점', '강점']);
  draft.weaknesses = extractSection(normalized, ['나의 약점', '약점']);
  draft.personality = extractSection(normalized, ['나의 성향', '성향']);
  draft.recommendedRoles = extractSection(normalized, [
    '추천 직무',
    '어울리는 직무',
  ]);
  draft.recommendedCompanyTypes = extractSection(normalized, [
    '추천 기업 유형',
    '기업 유형',
    '어울리는 기업',
  ]);

  const recurringExperience = extractSection(normalized, [
    '자주 등장하는 경험',
    '가장 자주 등장하는 경험',
  ]);
  const emphasizeExperience = extractSection(normalized, [
    '강조해야 하는 경험',
    '가장 강조해야 하는 경험',
  ]);
  draft.recommendedExperiences = extractSection(normalized, [
    '추천 경험',
  ]);
  if (!draft.recommendedExperiences) {
    draft.recommendedExperiences = [recurringExperience, emphasizeExperience]
      .filter(Boolean)
      .join('\n\n');
  } else if (recurringExperience || emphasizeExperience) {
    draft.recommendedExperiences = [
      draft.recommendedExperiences,
      recurringExperience ? `자주 등장하는 경험:\n${recurringExperience}` : '',
      emphasizeExperience
        ? `강조해야 하는 경험:\n${emphasizeExperience}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  draft.recommendedEssays = extractSection(normalized, [
    '추천 자소서',
    '추천하는 자소서',
  ]);
  draft.expectedQuestionsText = extractSection(normalized, [
    '예상 질문',
    '예상질문',
  ]);
  draft.followUpQuestionsText = extractSection(normalized, [
    '꼬리 질문',
    '꼬리질문',
  ]);
  draft.pressureQuestionsText = extractSection(normalized, [
    '압박 질문',
    '압박질문',
  ]);

  const answerGaps = extractSection(normalized, [
    '답변에서 부족한 부분',
    '답변 부족',
  ]);
  const starGaps = extractSection(normalized, [
    'STAR 기법이 부족한 부분',
    'STAR',
  ]);
  const quantGaps = extractSection(normalized, [
    '정량적인 성과가 부족한 부분',
    '정량',
  ]);
  const motivationGaps = extractSection(normalized, [
    '지원동기에서 부족한 부분',
    '지원동기',
  ]);
  const jobLinkGaps = extractSection(normalized, [
    '직무 연결성이 부족한 부분',
    '직무 연결성',
  ]);
  const generalGaps = extractSection(normalized, [
    '답변 보완 사항',
    '부족한 부분',
    '가장 부족한 부분',
  ]);

  draft.answerImprovements = [
    generalGaps,
    answerGaps ? `답변 부족:\n${answerGaps}` : '',
    starGaps ? `STAR:\n${starGaps}` : '',
    quantGaps ? `정량 성과:\n${quantGaps}` : '',
    motivationGaps ? `지원동기:\n${motivationGaps}` : '',
    jobLinkGaps ? `직무 연결성:\n${jobLinkGaps}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  draft.careerStrategy = extractSection(normalized, [
    '취업 전략',
    '나만의 취업 전략',
  ]);
  draft.interviewReadiness = extractSection(normalized, [
    '면접 준비도',
  ]);
  draft.careerReadiness = extractSection(normalized, [
    '취업 준비도',
  ]);

  const differentiation = extractSection(normalized, [
    '차별점',
    '나만의 차별점',
  ]);
  const keywords = extractSection(normalized, ['키워드']);
  draft.aiOpinion = extractSection(normalized, ['AI 의견', '의견', '총평']);
  if (!draft.aiOpinion) {
    draft.aiOpinion = [differentiation, keywords].filter(Boolean).join('\n\n');
  } else if (differentiation || keywords) {
    draft.aiOpinion = [
      draft.aiOpinion,
      differentiation ? `차별점:\n${differentiation}` : '',
      keywords ? `키워드:\n${keywords}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  draft.suggestedAdditionalData = extractSection(normalized, [
    '추가하면 좋은 경험',
    '추가로 작성하면 좋을 데이터',
    '추가 데이터',
  ]);

  if (!hasAnyParsedContent(draft)) {
    draft.aiOpinion = normalized;
  }

  return draft;
}

function hasAnyParsedContent(draft: ExperienceReportDraft) {
  return Object.values(draft).some((value) => value.trim().length > 0);
}

function extractSection(text: string, titles: string[]) {
  for (const title of titles) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `(?:^|\\n)#{0,3}\\s*${escaped}\\s*[:：]?\\s*\\n([\\s\\S]*?)(?=\\n#{0,3}\\s*(?:${SECTION_STOP_TITLES})\\b|$)`,
      'i',
    );
    const match = text.match(pattern);

    if (match?.[1]?.trim()) {
      return match[1].trim();
    }

    const inlinePattern = new RegExp(
      `(?:^|\\n)#{0,3}\\s*${escaped}\\s*[:：]\\s*([^\\n]+)`,
      'i',
    );
    const inlineMatch = text.match(inlinePattern);

    if (inlineMatch?.[1]?.trim()) {
      return inlineMatch[1].trim();
    }
  }

  return '';
}

function splitLinesToList(value: string) {
  return value
    .split('\n')
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);
}

export {
  createEmptyExperienceReportDraft,
  parseExperienceReportResultText,
  splitLinesToList,
};
