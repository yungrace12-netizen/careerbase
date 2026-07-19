import type { InterviewCoachImportDraft } from '@/types/interview-coach';

function createEmptyImportDraft(): InterviewCoachImportDraft {
  return {
    expectedQuestionsText: '',
    followUpQuestionsText: '',
    opinion: '',
    gaps: '',
    recommendedExperiences: '',
    recommendedEssayContent: '',
    interviewScore: '',
    companyUnderstandingScore: '',
    jobUnderstandingScore: '',
  };
}

function parseInterviewCoachResultText(rawText: string): InterviewCoachImportDraft {
  const draft = createEmptyImportDraft();
  const normalized = rawText.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return draft;
  }

  draft.companyUnderstandingScore = extractScore(
    normalized,
    /회사\s*이해도(?:\s*점수)?\s*[:：]?\s*([^\n]+)/i,
  );
  draft.jobUnderstandingScore = extractScore(
    normalized,
    /직무\s*이해도(?:\s*점수)?\s*[:：]?\s*([^\n]+)/i,
  );
  draft.interviewScore = extractScore(
    normalized,
    /(?:최종\s*)?면접\s*점수\s*[:：]?\s*([^\n]+)/i,
  );

  draft.expectedQuestionsText = extractSection(normalized, [
    '예상질문',
    '예상 질문',
  ]);
  draft.followUpQuestionsText = extractSection(normalized, [
    '꼬리질문',
    '꼬리 질문',
    '압박질문',
    '압박 질문',
  ]);
  draft.opinion = extractSection(normalized, ['AI 의견', '의견', '총평']);
  draft.gaps = extractSection(normalized, [
    '부족한 부분',
    '보완',
    '보완사항',
    '부족한 점',
  ]);
  draft.recommendedExperiences = extractSection(normalized, [
    '추천 경험',
    '추천하면 좋은 경험',
  ]);
  draft.recommendedEssayContent = extractSection(normalized, [
    '추천 자소서',
    '추천하면 좋은 자소서',
  ]);

  if (
    !draft.expectedQuestionsText &&
    !draft.followUpQuestionsText &&
    !draft.opinion &&
    !draft.gaps
  ) {
    draft.opinion = normalized;
  }

  return draft;
}

function extractScore(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  return match?.[1]?.trim() ?? '';
}

function extractSection(text: string, titles: string[]) {
  for (const title of titles) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `(?:^|\\n)#{0,3}\\s*${escaped}\\s*[:：]?\\s*\\n([\\s\\S]*?)(?=\\n#{0,3}\\s*(?:회사\\s*이해도|직무\\s*이해도|최종\\s*면접\\s*점수|면접\\s*점수|예상질문|예상\\s*질문|꼬리질문|꼬리\\s*질문|압박질문|압박\\s*질문|AI\\s*의견|의견|총평|부족한\\s*부분|부족한\\s*점|보완|보완사항|추천\\s*경험|추천하면\\s*좋은\\s*경험|추천\\s*자소서|추천하면\\s*좋은\\s*자소서)\\b|$)`,
      'i',
    );
    const match = text.match(pattern);

    if (match?.[1]?.trim()) {
      return match[1].trim();
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
  createEmptyImportDraft,
  parseInterviewCoachResultText,
  splitLinesToList,
};
