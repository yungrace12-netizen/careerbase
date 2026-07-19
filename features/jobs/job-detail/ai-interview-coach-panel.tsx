'use client';

import * as React from 'react';
import {
  Check,
  ClipboardPaste,
  Copy,
  ExternalLink,
  FileDown,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { buildInterviewCoachPrompt } from '@/features/jobs/job-detail/build-interview-coach-prompt';
import {
  createEmptyImportDraft,
  parseInterviewCoachResultText,
  splitLinesToList,
} from '@/features/jobs/job-detail/parse-interview-coach-result';
import { interviewCoachImportRepository } from '@/repositories/interviewCoachImportRepository';
import {
  INTERVIEW_COACH_AI_LINKS,
  type InterviewCoachImport,
  type InterviewCoachImportDraft,
  type InterviewCoachImportFieldKey,
} from '@/types/interview-coach';
import type { EntityId } from '@/types/job';

interface AiInterviewCoachPanelProps {
  jobId: EntityId;
  onAddQuestion: (input: {
    question: string;
    answer: string;
    followUpQuestions: string[];
    sourceReason: string;
  }) => void;
}

const fieldOptions: Array<{
  key: InterviewCoachImportFieldKey;
  label: string;
}> = [
  { key: 'expectedQuestionsText', label: '예상질문' },
  { key: 'followUpQuestionsText', label: '꼬리질문' },
  { key: 'opinion', label: 'AI 의견' },
  { key: 'gaps', label: '부족한 부분' },
  { key: 'recommendedExperiences', label: '추천 경험' },
  { key: 'recommendedEssayContent', label: '추천 자소서' },
  { key: 'interviewScore', label: '면접 점수' },
  { key: 'companyUnderstandingScore', label: '회사 이해도 점수' },
  { key: 'jobUnderstandingScore', label: '직무 이해도 점수' },
];

function AiInterviewCoachPanel({
  jobId,
  onAddQuestion,
}: AiInterviewCoachPanelProps) {
  const [prompt, setPrompt] = React.useState('');
  const [savedImport, setSavedImport] =
    React.useState<InterviewCoachImport | null>(null);
  const [copyDone, setCopyDone] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [rawResult, setRawResult] = React.useState('');
  const [draft, setDraft] = React.useState<InterviewCoachImportDraft>(
    createEmptyImportDraft(),
  );
  const [selectedFields, setSelectedFields] = React.useState<
    InterviewCoachImportFieldKey[]
  >(fieldOptions.map((field) => field.key));
  const [addQuestionsToStage, setAddQuestionsToStage] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSavedImport(
        interviewCoachImportRepository.getInterviewCoachImportByJobId(jobId),
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [jobId]);

  const handleGeneratePrompt = () => {
    const nextPrompt = buildInterviewCoachPrompt(jobId);

    if (!nextPrompt) {
      setErrorMessage('공고 정보를 불러오지 못해 Prompt를 생성하지 못했습니다.');
      return;
    }

    setPrompt(nextPrompt);
    setErrorMessage(null);
    setToastMessage('AI Prompt를 생성했습니다.');
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
      setErrorMessage('Prompt 복사에 실패했습니다. 텍스트를 직접 선택해 복사해주세요.');
    }
  };

  const openExternalAi = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenImport = () => {
    setRawResult(savedImport?.rawText ?? '');
    setDraft(
      savedImport
        ? {
            expectedQuestionsText: savedImport.expectedQuestions.join('\n'),
            followUpQuestionsText: savedImport.followUpQuestions.join('\n'),
            opinion: savedImport.opinion,
            gaps: savedImport.gaps,
            recommendedExperiences: savedImport.recommendedExperiences,
            recommendedEssayContent: savedImport.recommendedEssayContent,
            interviewScore: savedImport.interviewScore,
            companyUnderstandingScore: savedImport.companyUnderstandingScore,
            jobUnderstandingScore: savedImport.jobUnderstandingScore,
          }
        : createEmptyImportDraft(),
    );
    setSelectedFields(fieldOptions.map((field) => field.key));
    setAddQuestionsToStage(true);
    setImportOpen(true);
  };

  const handleParseRawResult = () => {
    setDraft(parseInterviewCoachResultText(rawResult));
  };

  const toggleField = (key: InterviewCoachImportFieldKey) => {
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

    const existing =
      interviewCoachImportRepository.getInterviewCoachImportByJobId(jobId);
    const nextInput = {
      rawText: rawResult,
      expectedQuestions: selectedFields.includes('expectedQuestionsText')
        ? splitLinesToList(draft.expectedQuestionsText)
        : (existing?.expectedQuestions ?? []),
      followUpQuestions: selectedFields.includes('followUpQuestionsText')
        ? splitLinesToList(draft.followUpQuestionsText)
        : (existing?.followUpQuestions ?? []),
      opinion: selectedFields.includes('opinion')
        ? draft.opinion.trim()
        : (existing?.opinion ?? ''),
      gaps: selectedFields.includes('gaps')
        ? draft.gaps.trim()
        : (existing?.gaps ?? ''),
      recommendedExperiences: selectedFields.includes('recommendedExperiences')
        ? draft.recommendedExperiences.trim()
        : (existing?.recommendedExperiences ?? ''),
      recommendedEssayContent: selectedFields.includes(
        'recommendedEssayContent',
      )
        ? draft.recommendedEssayContent.trim()
        : (existing?.recommendedEssayContent ?? ''),
      interviewScore: selectedFields.includes('interviewScore')
        ? draft.interviewScore.trim()
        : (existing?.interviewScore ?? ''),
      companyUnderstandingScore: selectedFields.includes(
        'companyUnderstandingScore',
      )
        ? draft.companyUnderstandingScore.trim()
        : (existing?.companyUnderstandingScore ?? ''),
      jobUnderstandingScore: selectedFields.includes('jobUnderstandingScore')
        ? draft.jobUnderstandingScore.trim()
        : (existing?.jobUnderstandingScore ?? ''),
      includeInPdf: existing?.includeInPdf ?? false,
    };

    const saved = interviewCoachImportRepository.upsertInterviewCoachImport(
      jobId,
      nextInput,
    );

    if (!saved) {
      setErrorMessage('AI 결과를 저장하지 못했습니다.');
      return;
    }

    if (addQuestionsToStage && selectedFields.includes('expectedQuestionsText')) {
      const followUps = splitLinesToList(draft.followUpQuestionsText);
      splitLinesToList(draft.expectedQuestionsText).forEach((question) => {
        onAddQuestion({
          question,
          answer: '',
          followUpQuestions: followUps,
          sourceReason: '외부 생성형 AI 결과에서 가져옴',
        });
      });
    }

    setSavedImport(saved);
    setImportOpen(false);
    setErrorMessage(null);
    setToastMessage('선택한 AI 결과를 저장했습니다.');
  };

  const handleTogglePdf = () => {
    if (!savedImport) {
      setErrorMessage('먼저 AI 결과를 가져와 저장해주세요.');
      return;
    }

    const saved = interviewCoachImportRepository.upsertInterviewCoachImport(
      jobId,
      {
        includeInPdf: !savedImport.includeInPdf,
      },
    );

    if (!saved) {
      setErrorMessage('PDF 포함 설정을 저장하지 못했습니다.');
      return;
    }

    setSavedImport(saved);
    setToastMessage(
      saved.includeInPdf
        ? 'PDF에 AI 결과를 포함하도록 설정했습니다.'
        : 'PDF에서 AI 결과 포함을 해제했습니다.',
    );
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>AI 면접 코치</CardTitle>
              <CardDescription className="mt-2">
                CareerBase 데이터로 Prompt를 만들고, ChatGPT·Claude·Gemini 등에서
                분석한 뒤 결과를 선택적으로 가져옵니다. AI 없이도 면접 준비는
                그대로 사용할 수 있습니다.
              </CardDescription>
            </div>
            <Badge variant="default">보조 기능</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleGeneratePrompt}>
              <Sparkles className="size-4" aria-hidden />
              AI Prompt 생성하기
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
              onClick={() => openExternalAi(INTERVIEW_COACH_AI_LINKS.chatgpt)}
            >
              <ExternalLink className="size-4" aria-hidden />
              ChatGPT 열기
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => openExternalAi(INTERVIEW_COACH_AI_LINKS.claude)}
            >
              <ExternalLink className="size-4" aria-hidden />
              Claude 열기
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => openExternalAi(INTERVIEW_COACH_AI_LINKS.gemini)}
            >
              <ExternalLink className="size-4" aria-hidden />
              Gemini 열기
            </Button>
            <Button type="button" variant="secondary" onClick={handleOpenImport}>
              <ClipboardPaste className="size-4" aria-hidden />
              AI 결과 가져오기
            </Button>
            <Button type="button" variant="ghost" onClick={handleTogglePdf}>
              <FileDown className="size-4" aria-hidden />
              {savedImport?.includeInPdf
                ? 'PDF 포함 해제'
                : 'PDF에 포함하기'}
            </Button>
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
              Prompt를 생성하면 공고·자소서·Profile·회사정보·면접준비 내용이
              하나의 분석 요청문으로 정리됩니다.
            </Typography>
          )}
        </CardContent>
      </Card>

      {savedImport ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-[length:var(--text-body)]">
                저장된 AI 결과
              </CardTitle>
              {savedImport.includeInPdf ? (
                <Badge variant="primary">PDF 포함</Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ScoreRow
              label="회사 이해도"
              value={savedImport.companyUnderstandingScore}
            />
            <ScoreRow
              label="직무 이해도"
              value={savedImport.jobUnderstandingScore}
            />
            <ScoreRow label="면접 점수" value={savedImport.interviewScore} />
            <ListBlock label="예상질문" items={savedImport.expectedQuestions} />
            <ListBlock label="꼬리질문" items={savedImport.followUpQuestions} />
            <TextBlock label="AI 의견" value={savedImport.opinion} />
            <TextBlock label="부족한 부분" value={savedImport.gaps} />
            <TextBlock
              label="추천 경험"
              value={savedImport.recommendedExperiences}
            />
            <TextBlock
              label="추천 자소서"
              value={savedImport.recommendedEssayContent}
            />
          </CardContent>
        </Card>
      ) : null}

      <Modal
        open={importOpen}
        onOpenChange={setImportOpen}
        title="AI 결과 가져오기"
        description="생성형 AI 답변을 붙여넣고, 저장할 항목만 선택하세요."
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
          <Button type="button" variant="secondary" onClick={handleParseRawResult}>
            붙여넣은 내용 자동 분류
          </Button>

          <div className="grid gap-2">
            <Typography variant="small" className="font-semibold">
              저장할 항목
            </Typography>
            <div className="grid gap-2 sm:grid-cols-2">
              {fieldOptions.map((field) => (
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
            <label className="flex items-center gap-2 rounded-[var(--radius-button)] border border-border px-3 py-2">
              <input
                type="checkbox"
                checked={addQuestionsToStage}
                onChange={(event) => setAddQuestionsToStage(event.target.checked)}
              />
              <Typography variant="small">
                선택한 예상질문을 현재 면접 준비에도 추가
              </Typography>
            </label>
          </div>

          {fieldOptions.map((field) => (
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
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) {
    return null;
  }

  return (
    <Typography variant="small">
      {label}: {value}
    </Typography>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  if (!value.trim()) {
    return null;
  }

  return (
    <div>
      <Typography variant="caption" tone="secondary">
        {label}
      </Typography>
      <Typography variant="small" className="mt-1 whitespace-pre-wrap">
        {value}
      </Typography>
    </div>
  );
}

function ListBlock({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <Typography variant="caption" tone="secondary">
        {label}
      </Typography>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>
            <Typography variant="small">{item}</Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { AiInterviewCoachPanel };
