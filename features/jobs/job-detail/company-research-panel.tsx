'use client';

import * as React from 'react';
import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Toast, ToastViewport } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import {
  COMPANY_RESEARCH_CONTENT_PLACEHOLDER,
  getCompanyResearchDisplayContent,
} from '@/types/company-research';
import type { EntityId } from '@/types/job';
import {
  useCompanyResearchStore,
  type CompanyResearchSaveStatus,
} from '@/stores/companyResearchStore';

interface CompanyResearchPanelProps {
  jobId: EntityId;
}

function CompanyResearchPanel({ jobId }: CompanyResearchPanelProps) {
  return <CompanyResearchEditor key={jobId} jobId={jobId} />;
}

function CompanyResearchEditor({ jobId }: CompanyResearchPanelProps) {
  const saveStatus = useCompanyResearchStore((state) => state.saveStatus);
  const loadByJobId = useCompanyResearchStore((state) => state.loadByJobId);
  const saveResearch = useCompanyResearchStore((state) => state.saveResearch);

  const [draft, setDraft] = React.useState('');
  const [baseline, setBaseline] = React.useState('');
  const [ready, setReady] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);

  React.useEffect(() => {
    loadByJobId(jobId);

    const timeoutId = window.setTimeout(() => {
      const research = useCompanyResearchStore.getState().research;
      const text = getCompanyResearchDisplayContent(research);
      setDraft(text);
      setBaseline(text);
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [jobId, loadByJobId]);

  const isDirty = ready && draft !== baseline;

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const saved = saveResearch(jobId, { content: draft });

      if (saved) {
        const text = getCompanyResearchDisplayContent(saved);
        setBaseline(text);
        setDraft(text);
      }
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [draft, isDirty, jobId, saveResearch]);

  const handleManualSave = () => {
    const saved = saveResearch(jobId, { content: draft });

    if (saved) {
      const text = getCompanyResearchDisplayContent(saved);
      setBaseline(text);
      setDraft(text);
      setToastOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>회사정보</CardTitle>
              <CardDescription className="mt-2">
                면접 준비에 활용할 회사 이해 내용을 하나의 메모로 자유롭게
                정리합니다.
              </CardDescription>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <CompanyResearchSaveStatusText
                saveStatus={saveStatus}
                isDirty={isDirty}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleManualSave}
                disabled={!ready}
              >
                <Save className="size-4" aria-hidden />
                수동 저장
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            label="회사정보"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={COMPANY_RESEARCH_CONTENT_PLACEHOLDER}
            className="min-h-[32rem] whitespace-pre-wrap"
            disabled={!ready}
          />
        </CardContent>
      </Card>

      {toastOpen ? (
        <ToastViewport>
          <Toast
            variant="success"
            title="저장되었습니다."
            onClose={() => setToastOpen(false)}
          />
        </ToastViewport>
      ) : null}
    </>
  );
}

function CompanyResearchSaveStatusText({
  saveStatus,
  isDirty,
}: {
  saveStatus: CompanyResearchSaveStatus;
  isDirty: boolean;
}) {
  if (saveStatus.state === 'saving') {
    return (
      <Typography variant="caption" tone="secondary">
        저장 중...
      </Typography>
    );
  }

  if (saveStatus.state === 'error') {
    return (
      <Typography variant="caption" className="text-danger">
        저장하지 못했습니다.
      </Typography>
    );
  }

  if (isDirty) {
    return (
      <Typography variant="caption" tone="secondary">
        저장 대기 중...
      </Typography>
    );
  }

  if (saveStatus.state === 'saved' && saveStatus.savedAt) {
    return (
      <Typography variant="caption" tone="secondary">
        저장 완료 · {formatSavedAt(saveStatus.savedAt)}
      </Typography>
    );
  }

  return (
    <Typography variant="caption" tone="secondary">
      저장 준비 완료
    </Typography>
  );
}

function formatSavedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export { CompanyResearchPanel };
