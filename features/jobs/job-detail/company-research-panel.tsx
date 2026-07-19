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
import { companyResearchRepository } from '@/repositories/companyResearchRepository';
import {
  createEmptyCompanyResearchFields,
  type CompanyResearch,
  type UpdateCompanyResearchInput,
} from '@/types/company-research';
import type { EntityId } from '@/types/job';
import {
  useCompanyResearchStore,
  type CompanyResearchSaveStatus,
} from '@/stores/companyResearchStore';

interface CompanyResearchPanelProps {
  jobId: EntityId;
}

type CompanyResearchDraft = UpdateCompanyResearchInput;

const fieldConfigs: Array<{
  key: keyof CompanyResearchDraft;
  label: string;
}> = [
  { key: 'mission', label: 'Mission' },
  { key: 'vision', label: 'Vision' },
  { key: 'coreValues', label: '핵심가치' },
  { key: 'talentProfile', label: '인재상' },
  { key: 'mainBusiness', label: '주요 사업' },
  { key: 'companyOverview', label: '회사 및 조직 이해' },
  { key: 'recentIssues', label: '최근 주요 이슈' },
  { key: 'jobConnection', label: '지원 직무와 회사의 연결점' },
  { key: 'expectedContribution', label: '내가 기여할 수 있는 부분' },
  { key: 'memo', label: '자유 메모' },
];

function toDraft(research: CompanyResearch | null): CompanyResearchDraft {
  return {
    ...createEmptyCompanyResearchFields(),
    mission: research?.mission ?? '',
    vision: research?.vision ?? '',
    coreValues: research?.coreValues ?? '',
    talentProfile: research?.talentProfile ?? '',
    mainBusiness: research?.mainBusiness ?? '',
    companyOverview: research?.companyOverview ?? '',
    recentIssues: research?.recentIssues ?? '',
    jobConnection: research?.jobConnection ?? '',
    expectedContribution: research?.expectedContribution ?? '',
    memo: research?.memo ?? '',
  };
}

function CompanyResearchPanel({ jobId }: CompanyResearchPanelProps) {
  return <CompanyResearchEditor key={jobId} jobId={jobId} />;
}

function CompanyResearchEditor({ jobId }: CompanyResearchPanelProps) {
  const saveStatus = useCompanyResearchStore((state) => state.saveStatus);
  const loadByJobId = useCompanyResearchStore((state) => state.loadByJobId);
  const saveResearch = useCompanyResearchStore((state) => state.saveResearch);

  const [draft, setDraft] = React.useState<CompanyResearchDraft>(() =>
    toDraft(companyResearchRepository.getCompanyResearchByJobId(jobId)),
  );
  const [baseline, setBaseline] = React.useState<CompanyResearchDraft>(() =>
    toDraft(companyResearchRepository.getCompanyResearchByJobId(jobId)),
  );
  const [toastOpen, setToastOpen] = React.useState(false);

  React.useEffect(() => {
    loadByJobId(jobId);
  }, [jobId, loadByJobId]);

  const isDirty = fieldConfigs.some(
    ({ key }) => (draft[key] ?? '') !== (baseline[key] ?? ''),
  );

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const saved = saveResearch(jobId, draft);

      if (saved) {
        setBaseline(toDraft(saved));
      }
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [draft, isDirty, jobId, saveResearch]);

  const handleManualSave = () => {
    const saved = saveResearch(jobId, draft);

    if (saved) {
      setBaseline(toDraft(saved));
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
                면접 준비에 활용할 회사 이해 내용을 공고별로 정리합니다.
              </CardDescription>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <CompanyResearchSaveStatusText
                saveStatus={saveStatus}
                isDirty={isDirty}
              />
              <Button type="button" variant="secondary" onClick={handleManualSave}>
                <Save className="size-4" aria-hidden />
                수동 저장
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {fieldConfigs.map((field) => (
            <Textarea
              key={field.key}
              label={field.label}
              value={draft[field.key] ?? ''}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
              className="min-h-28"
            />
          ))}
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
