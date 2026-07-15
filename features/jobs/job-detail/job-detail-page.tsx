'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Archive, ExternalLink, Pencil, ArrowLeft } from 'lucide-react';

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
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useJobStore } from '@/stores/jobStore';
import type { ApplicationBoardColumn, CreateJobInput, Job } from '@/types/job';
import { JobFormModal } from '../job-form-modal';
import { ApplicationsTab } from './applications-tab';
import { EssayTab } from './essay-tab';
import { InterviewTab } from './interview-tab';

interface JobDetailPageProps {
  jobId: string;
}

type JobDetailTab = 'info' | 'essay' | 'interview' | 'schedule' | 'application';

const tabs: Array<{
  id: JobDetailTab;
  label: string;
}> = [
  { id: 'info', label: '공고정보' },
  { id: 'essay', label: '자소서' },
  { id: 'interview', label: '면접' },
  { id: 'schedule', label: '일정' },
  { id: 'application', label: '지원현황' },
];

const statusVariant: Record<
  ApplicationBoardColumn,
  React.ComponentProps<typeof Badge>['variant']
> = {
  관심: 'pending',
  '준비 중': 'warning',
  '제출 완료': 'primary',
  '전형 진행': 'inProgress',
  '최종 결과': 'archive',
};

function JobDetailPage({ jobId }: JobDetailPageProps) {
  const router = useRouter();
  const allJobs = useJobStore((state) => state.allJobs);
  const loadAllJobs = useJobStore((state) => state.loadAllJobs);
  const updateJob = useJobStore((state) => state.updateJob);
  const updateApplicationStatus = useJobStore(
    (state) => state.updateApplicationStatus,
  );
  const archiveJob = useJobStore((state) => state.archiveJob);

  const [loaded, setLoaded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<JobDetailTab>('info');
  const [editOpen, setEditOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);

  React.useEffect(() => {
    loadAllJobs();

    const timeoutId = window.setTimeout(() => {
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAllJobs]);

  const job = allJobs.find((item) => item.id === jobId) ?? null;

  const handleUpdate = (input: CreateJobInput) => {
    if (!job) {
      return;
    }

    updateJob(job.id, input);
  };

  const handleArchive = () => {
    if (!job) {
      return;
    }

    archiveJob(job.id);
    router.push('/jobs#archived');
  };

  if (!loaded) {
    return (
      <PageWrapper>
        <Container>
          <EmptyState
            title="공고 정보를 불러오는 중입니다."
            description="잠시만 기다려주세요."
          />
        </Container>
      </PageWrapper>
    );
  }

  if (!job) {
    return <JobDetailNotFound />;
  }

  return (
    <PageWrapper className="lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
      <Container className="lg:h-full">
        <ContentWrapper className="lg:h-full lg:overflow-hidden">
          <JobDetailHeader
            job={job}
            onEdit={() => setEditOpen(true)}
            onArchive={() => setArchiveOpen(true)}
          />

          <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
            <nav
              className="flex shrink-0 gap-2 overflow-x-auto border-b border-border pb-2"
              aria-label="Job detail tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    activeTab === tab.id
                      ? 'shrink-0 rounded-[var(--radius-button)] bg-primary px-4 py-2 text-[length:var(--text-small)] font-medium text-primary-foreground'
                      : 'shrink-0 rounded-[var(--radius-button)] px-4 py-2 text-[length:var(--text-small)] font-medium text-text-secondary transition-colors hover:bg-muted hover:text-text-primary'
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {activeTab === 'info' ? (
                <JobInfoTab job={job} />
              ) : activeTab === 'essay' ? (
                <EssayTab job={job} />
              ) : activeTab === 'interview' ? (
                <InterviewTab job={job} />
              ) : activeTab === 'application' ? (
                <ApplicationsTab
                  job={job}
                  onStatusChange={(input) =>
                    updateApplicationStatus(job.id, input)
                  }
                />
              ) : (
                <JobDetailTabPlaceholder
                  title={tabs.find((tab) => tab.id === activeTab)?.label ?? ''}
                />
              )}
            </div>
          </section>
        </ContentWrapper>
      </Container>

      <JobFormModal
        open={editOpen}
        job={job}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
      />

      <Modal
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive 이동"
        confirmLabel="Archive 이동"
        onConfirm={handleArchive}
      >
        <Typography variant="body">이 공고를 Archive로 이동할까요?</Typography>
      </Modal>

    </PageWrapper>
  );
}

function JobDetailHeader({
  job,
  onEdit,
  onArchive,
}: {
  job: Job;
  onEdit: () => void;
  onArchive: () => void;
}) {
  return (
    <Card className="shrink-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link
            href={job.isArchived ? '/archive' : '/jobs'}
            className="mb-3 inline-flex items-center gap-2 text-[length:var(--text-small)] font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {job.isArchived ? 'Archive' : 'Jobs'}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[job.boardColumn]}>
              {job.boardColumn}
            </Badge>
            {job.isArchived ? <Badge variant="archive">보관중</Badge> : null}
            <Typography variant="caption" className="font-medium text-primary">
              {getDday(job.applicationEndDate)}
            </Typography>
          </div>
          <Typography variant="heading" className="mt-3">
            {job.companyName}
          </Typography>
          <Typography variant="body" tone="secondary" className="mt-1">
            {job.postingTitle}
          </Typography>
          <Typography variant="small" tone="secondary" className="mt-2">
            {job.position || '미입력'}
          </Typography>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          {job.postingUrl ? (
            <a
              href={job.postingUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'secondary' })}
            >
              <ExternalLink className="size-4" aria-hidden />
              공고 URL 열기
            </a>
          ) : null}
          <Button type="button" variant="secondary" onClick={onEdit}>
            <Pencil className="size-4" aria-hidden />
            공고 수정
          </Button>
          {!job.isArchived ? (
            <Button type="button" variant="secondary" onClick={onArchive}>
              <Archive className="size-4" aria-hidden />
              Archive 이동
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function JobInfoTab({ job }: { job: Job }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>등록한 공고 정보를 읽기 전용으로 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <InfoItem label="기업명" value={job.companyName} />
            <InfoItem label="공고명" value={job.postingTitle} />
            <InfoItem label="직무" value={job.position} />
            <InfoItem label="고용형태" value={job.employmentType} />
            <InfoItem label="신입·경력 구분" value={job.applicantType} />
            <InfoItem label="근무지" value={job.location} />
            <InfoItem label="공고 URL" value={job.postingUrl} isUrl />
            <InfoItem
              label="지원 시작일"
              value={formatDateTime(job.applicationStartDate, job.applicationStartTime)}
            />
            <InfoItem
              label="지원 마감일"
              value={formatDateTime(job.applicationEndDate, job.applicationEndTime)}
            />
            <InfoItem label="현재 지원 상태" value={job.detailedStatus} />
            <InfoItem label="지원 결과" value={job.applicationResult} />
          </div>
        </CardContent>
      </Card>

      <LongTextSection title="공고 내용" value={job.postingContent} />
      <LongTextSection title="자격요건" value={job.qualifications} />
    </div>
  );
}

function InfoItem({
  label,
  value,
  isUrl = false,
}: {
  label: string;
  value: string | null;
  isUrl?: boolean;
}) {
  const displayValue = normalizeValue(value);

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-background p-4">
      <Typography variant="caption" tone="secondary">
        {label}
      </Typography>
      {isUrl && value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block truncate text-[length:var(--text-small)] font-medium text-primary underline-offset-4 hover:underline"
        >
          {value}
        </a>
      ) : (
        <Typography variant="small" className="mt-2 font-medium">
          {displayValue}
        </Typography>
      )}
    </div>
  );
}

function LongTextSection({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Typography
          variant="body"
          className="whitespace-pre-wrap rounded-[var(--radius-card)] border border-border bg-background p-4"
        >
          {normalizeValue(value)}
        </Typography>
      </CardContent>
    </Card>
  );
}

function JobDetailTabPlaceholder({ title }: { title: string }) {
  return (
    <Card>
      <EmptyState
        title={`${title} 탭은 아직 준비 중입니다.`}
        description="이번 Sprint 범위에 포함되지 않은 기능입니다."
      />
    </Card>
  );
}

function JobDetailNotFound() {
  return (
    <PageWrapper>
      <Container>
        <EmptyState
          title="공고를 찾을 수 없습니다."
          description="존재하지 않는 공고입니다."
          action={
            <Link href="/jobs" className={cn(buttonVariants())}>
              Jobs로 돌아가기
            </Link>
          }
        />
      </Container>
    </PageWrapper>
  );
}

function normalizeValue(value: string | null | undefined) {
  if (!value || value.trim() === '') {
    return '미입력';
  }

  return value;
}

function formatDateTime(date: string | null, time: string | null) {
  if (!date) {
    return '미입력';
  }

  return time ? `${date} ${time}` : date;
}

function getDday(applicationEndDate: string | null) {
  if (!applicationEndDate) {
    return '마감 미정';
  }

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endDate = new Date(`${applicationEndDate}T00:00:00`);
  const diff = Math.ceil(
    (endDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) {
    return 'D-Day';
  }

  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}

export { JobDetailPage };
