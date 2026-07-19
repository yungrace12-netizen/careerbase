'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Check,
  ClipboardPaste,
  Copy,
  ExternalLink,
  FileDown,
  Sparkles,
} from 'lucide-react';

import {
  Container,
  ContentWrapper,
  PageWrapper,
} from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Toast, ToastViewport } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { buildExperienceReportPrompt } from '@/features/experience/build-experience-report-prompt';
import {
  createEmptyExperienceReportDraft,
  parseExperienceReportResultText,
  splitLinesToList,
} from '@/features/experience/parse-experience-report-result';
import { experienceReportRepository } from '@/repositories/experienceReportRepository';
import {
  EXPERIENCE_REPORT_AI_LINKS,
  EXPERIENCE_REPORT_FIELD_OPTIONS,
  type ExperienceReport,
  type ExperienceReportDraft,
  type ExperienceReportFieldKey,
} from '@/types/experience-report';

function ExperiencePage() {
  const [prompt, setPrompt] = React.useState('');
  const [savedReport, setSavedReport] =
    React.useState<ExperienceReport | null>(null);
  const [copyDone, setCopyDone] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [rawResult, setRawResult] = React.useState('');
  const [draft, setDraft] = React.useState<ExperienceReportDraft>(
    createEmptyExperienceReportDraft(),
  );
  const [selectedFields, setSelectedFields] = React.useState<
    ExperienceReportFieldKey[]
  >(EXPERIENCE_REPORT_FIELD_OPTIONS.map((field) => field.key));
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSavedReport(experienceReportRepository.getLatestExperienceReport());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleGeneratePrompt = () => {
    const nextPrompt = buildExperienceReportPrompt();
    setPrompt(nextPrompt);
    setErrorMessage(null);
    setToastMessage('모든 취업 데이터를 모아 AI Prompt를 생성했습니다.');
  };

  const handleCopyPrompt = async () => {
    if (!prompt.trim()) {
      setErrorMessage('먼저 AI Prompt를 생성해주세요.');
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);
      setCopyDone(true);
      setToastMessage('Prompt를 복사했습니다.');
      window.setTimeout(() => setCopyDone(false), 1500);
    } catch {
      setErrorMessage(
        'Prompt 복사에 실패했습니다. 텍스트를 직접 선택해 복사해주세요.',
      );
    }
  };

  const openExternalAi = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenImport = () => {
    setRawResult(savedReport?.rawText ?? '');
    setDraft(
      savedReport
        ? reportToDraft(savedReport)
        : createEmptyExperienceReportDraft(),
    );
    setSelectedFields(
      EXPERIENCE_REPORT_FIELD_OPTIONS.map((field) => field.key),
    );
    setImportOpen(true);
  };

  const handleParseRawResult = () => {
    setDraft(parseExperienceReportResultText(rawResult));
  };

  const toggleField = (key: ExperienceReportFieldKey) => {
    setSelectedFields((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  const handleSaveImport = () => {
    if (selectedFields.length === 0) {
      setErrorMessage('저장할 항목을 하나 이상 선택해주세요.');
      return;
    }

    const existing = experienceReportRepository.getLatestExperienceReport();
    const nextInput = {
      rawText: rawResult,
      oneLiner: selectedFields.includes('oneLiner')
        ? draft.oneLiner.trim()
        : (existing?.oneLiner ?? ''),
      strengths: selectedFields.includes('strengths')
        ? draft.strengths.trim()
        : (existing?.strengths ?? ''),
      weaknesses: selectedFields.includes('weaknesses')
        ? draft.weaknesses.trim()
        : (existing?.weaknesses ?? ''),
      personality: selectedFields.includes('personality')
        ? draft.personality.trim()
        : (existing?.personality ?? ''),
      recommendedRoles: selectedFields.includes('recommendedRoles')
        ? draft.recommendedRoles.trim()
        : (existing?.recommendedRoles ?? ''),
      recommendedCompanyTypes: selectedFields.includes(
        'recommendedCompanyTypes',
      )
        ? draft.recommendedCompanyTypes.trim()
        : (existing?.recommendedCompanyTypes ?? ''),
      recommendedExperiences: selectedFields.includes(
        'recommendedExperiences',
      )
        ? draft.recommendedExperiences.trim()
        : (existing?.recommendedExperiences ?? ''),
      recommendedEssays: selectedFields.includes('recommendedEssays')
        ? draft.recommendedEssays.trim()
        : (existing?.recommendedEssays ?? ''),
      expectedQuestions: selectedFields.includes('expectedQuestionsText')
        ? splitLinesToList(draft.expectedQuestionsText)
        : (existing?.expectedQuestions ?? []),
      followUpQuestions: selectedFields.includes('followUpQuestionsText')
        ? splitLinesToList(draft.followUpQuestionsText)
        : (existing?.followUpQuestions ?? []),
      pressureQuestions: selectedFields.includes('pressureQuestionsText')
        ? splitLinesToList(draft.pressureQuestionsText)
        : (existing?.pressureQuestions ?? []),
      answerImprovements: selectedFields.includes('answerImprovements')
        ? draft.answerImprovements.trim()
        : (existing?.answerImprovements ?? ''),
      careerStrategy: selectedFields.includes('careerStrategy')
        ? draft.careerStrategy.trim()
        : (existing?.careerStrategy ?? ''),
      interviewReadiness: selectedFields.includes('interviewReadiness')
        ? draft.interviewReadiness.trim()
        : (existing?.interviewReadiness ?? ''),
      careerReadiness: selectedFields.includes('careerReadiness')
        ? draft.careerReadiness.trim()
        : (existing?.careerReadiness ?? ''),
      aiOpinion: selectedFields.includes('aiOpinion')
        ? draft.aiOpinion.trim()
        : (existing?.aiOpinion ?? ''),
      suggestedAdditionalData: selectedFields.includes(
        'suggestedAdditionalData',
      )
        ? draft.suggestedAdditionalData.trim()
        : (existing?.suggestedAdditionalData ?? ''),
    };

    const saved =
      experienceReportRepository.upsertExperienceReport(nextInput);
    setSavedReport(saved);
    setImportOpen(false);
    setErrorMessage(null);
    setToastMessage('선택한 AI 분석 결과를 저장했습니다.');
  };

  return (
    <PageWrapper>
      <Container>
        <ContentWrapper className="grid gap-6">
          <div className="grid gap-2">
            <Typography variant="heading">AI Experience Library</Typography>
            <Typography variant="body" tone="secondary">
              CareerBase에 쌓인 모든 취업 데이터를 자동으로 모아, 나라는 사람을
              설명하는 AI 취업 데이터 리포트를 만듭니다. 경험 입력란은 없으며,
              AI는 분석만 수행합니다.
            </Typography>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>AI 분석하기</CardTitle>
                  <CardDescription className="mt-2">
                    Profile · 공고 · 자소서 · 면접 · 회사정보 · Archive · 기존
                    경험 · AI 분석 결과를 모아 Prompt를 만든 뒤, ChatGPT /
                    Claude / Gemini에서 분석하고 결과를 선택 저장하세요.
                  </CardDescription>
                </div>
                <Badge variant="primary">Experience AI</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleGeneratePrompt}>
                  <Sparkles className="size-4" aria-hidden />
                  AI 분석하기
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleCopyPrompt()}
                >
                  {copyDone ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <Copy className="size-4" aria-hidden />
                  )}
                  Prompt 복사하기
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    openExternalAi(EXPERIENCE_REPORT_AI_LINKS.chatgpt)
                  }
                >
                  <ExternalLink className="size-4" aria-hidden />
                  ChatGPT 열기
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    openExternalAi(EXPERIENCE_REPORT_AI_LINKS.claude)
                  }
                >
                  <ExternalLink className="size-4" aria-hidden />
                  Claude 열기
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    openExternalAi(EXPERIENCE_REPORT_AI_LINKS.gemini)
                  }
                >
                  <ExternalLink className="size-4" aria-hidden />
                  Gemini 열기
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleOpenImport}
                >
                  <ClipboardPaste className="size-4" aria-hidden />
                  AI 결과 가져오기
                </Button>
                {savedReport ? (
                  <Link
                    href="/experience/print"
                    className={cn(buttonVariants({ variant: 'ghost' }))}
                  >
                    <FileDown className="size-4" aria-hidden />
                    PDF 저장하기
                  </Link>
                ) : null}
              </div>

              {errorMessage ? (
                <Typography variant="small" className="text-danger">
                  {errorMessage}
                </Typography>
              ) : null}

              {prompt ? (
                <Textarea
                  label="생성된 AI Prompt"
                  value={prompt}
                  readOnly
                  className="min-h-64 font-mono text-[length:var(--text-small)]"
                />
              ) : (
                <Typography variant="small" tone="secondary">
                  AI 분석하기를 누르면 CareerBase의 모든 취업 데이터가 하나의
                  분석 요청문으로 정리됩니다. 사용자는 아무것도 입력하지
                  않습니다.
                </Typography>
              )}
            </CardContent>
          </Card>

          {savedReport ? (
            <ExperienceReportView report={savedReport} />
          ) : (
            <Card>
              <CardContent className="py-10">
                <Typography variant="body" tone="secondary" className="text-center">
                  아직 저장된 AI Experience Report가 없습니다. Prompt를 생성해
                  외부 AI에서 분석한 뒤, 결과를 가져와 검토·저장하세요.
                </Typography>
              </CardContent>
            </Card>
          )}
        </ContentWrapper>
      </Container>

      <Modal
        open={importOpen}
        onOpenChange={setImportOpen}
        title="AI 결과 가져오기"
        description="생성형 AI 답변을 붙여넣고 자동 분류한 뒤, 저장할 항목만 선택하세요. 자동 저장되지 않습니다."
        confirmLabel="선택 항목 저장"
        onConfirm={handleSaveImport}
        className="max-h-[90dvh] max-w-3xl overflow-y-auto"
      >
        <div className="grid gap-4">
          <Textarea
            label="AI 결과 붙여넣기"
            value={rawResult}
            onChange={(event) => setRawResult(event.target.value)}
            className="min-h-40"
            placeholder="ChatGPT, Claude, Gemini 등의 답변을 붙여넣으세요."
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleParseRawResult}
          >
            붙여넣은 내용 자동 분류
          </Button>

          <div className="grid gap-2">
            <Typography variant="small" className="font-semibold">
              저장할 항목
            </Typography>
            <div className="grid gap-2 sm:grid-cols-2">
              {EXPERIENCE_REPORT_FIELD_OPTIONS.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-2 rounded-[var(--radius-button)] border border-border px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => toggleField(field.key)}
                  />
                  <Typography variant="small">{field.label}</Typography>
                </label>
              ))}
            </div>
          </div>

          {EXPERIENCE_REPORT_FIELD_OPTIONS.map((field) => (
            <Textarea
              key={field.key}
              label={field.label}
              value={draft[field.key]}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
              className="min-h-24"
            />
          ))}
        </div>
      </Modal>

      {toastMessage ? (
        <ToastViewport>
          <Toast
            variant="success"
            title={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </ToastViewport>
      ) : null}
    </PageWrapper>
  );
}

function ExperienceReportView({ report }: { report: ExperienceReport }) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Typography variant="section">AI Experience Report</Typography>
        <Link
          href="/experience/print"
          className={cn(buttonVariants({ variant: 'secondary' }))}
        >
          <FileDown className="size-4" aria-hidden />
          PDF 저장하기
        </Link>
      </div>

      <ReportSection title="나를 한 줄로 표현하면?" value={report.oneLiner} />
      <ReportSection title="나의 강점" value={report.strengths} />
      <ReportSection title="나의 약점" value={report.weaknesses} />
      <ReportSection title="나의 성향" value={report.personality} />
      <ReportSection title="추천 직무" value={report.recommendedRoles} />
      <ReportSection
        title="추천 기업 유형"
        value={report.recommendedCompanyTypes}
      />
      <ReportSection title="추천 경험" value={report.recommendedExperiences} />
      <ReportSection title="추천 자소서" value={report.recommendedEssays} />
      <ReportListSection title="예상 질문" items={report.expectedQuestions} />
      <ReportListSection title="꼬리 질문" items={report.followUpQuestions} />
      <ReportListSection title="압박 질문" items={report.pressureQuestions} />
      <ReportSection
        title="답변 보완 사항"
        value={report.answerImprovements}
      />
      <ReportSection title="취업 전략" value={report.careerStrategy} />
      <ReportSection title="면접 준비도" value={report.interviewReadiness} />
      <ReportSection title="취업 준비도" value={report.careerReadiness} />
      <ReportSection title="AI 의견" value={report.aiOpinion} />
      <ReportSection
        title="추가하면 좋은 경험"
        value={report.suggestedAdditionalData}
      />
    </div>
  );
}

function ReportSection({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[length:var(--text-body)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Typography variant="small" className="whitespace-pre-wrap">
          {value.trim() ? value : '저장된 내용 없음'}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ReportListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[length:var(--text-body)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Typography variant="small" tone="secondary">
            저장된 내용 없음
          </Typography>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            {items.map((item) => (
              <li key={item}>
                <Typography variant="small">{item}</Typography>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function reportToDraft(report: ExperienceReport): ExperienceReportDraft {
  return {
    oneLiner: report.oneLiner,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    personality: report.personality,
    recommendedRoles: report.recommendedRoles,
    recommendedCompanyTypes: report.recommendedCompanyTypes,
    recommendedExperiences: report.recommendedExperiences,
    recommendedEssays: report.recommendedEssays,
    expectedQuestionsText: report.expectedQuestions.join('\n'),
    followUpQuestionsText: report.followUpQuestions.join('\n'),
    pressureQuestionsText: report.pressureQuestions.join('\n'),
    answerImprovements: report.answerImprovements,
    careerStrategy: report.careerStrategy,
    interviewReadiness: report.interviewReadiness,
    careerReadiness: report.careerReadiness,
    aiOpinion: report.aiOpinion,
    suggestedAdditionalData: report.suggestedAdditionalData,
  };
}

export { ExperiencePage };
