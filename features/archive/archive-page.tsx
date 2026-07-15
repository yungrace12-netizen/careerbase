'use client';

import * as React from 'react';
import Link from 'next/link';
import { RotateCcw, Trash2 } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import {
  useArchiveStore,
  type ArchiveStatusFilter,
} from '@/stores/archiveStore';
import type { ApplicationResult, Job } from '@/types/job';

type DeleteStep = 'first' | 'second';

const statusOptions: ArchiveStatusFilter[] = [
  '전체',
  '최종 합격',
  '최종 불합격',
  '지원 포기',
  '보관중',
];

const resultVariant: Record<
  ApplicationResult,
  React.ComponentProps<typeof Badge>['variant']
> = {
  미정: 'default',
  서류합격: 'success',
  서류불합격: 'danger',
  인적성합격: 'success',
  인적성불합격: 'danger',
  '1차면접합격': 'success',
  '1차면접불합격': 'danger',
  '2차면접합격': 'success',
  '2차면접불합격': 'danger',
  최종합격: 'success',
  최종불합격: 'danger',
  지원포기: 'archive',
};

function ArchivePage() {
  const archivedJobs = useArchiveStore((state) => state.archivedJobs);
  const filteredJobs = useArchiveStore((state) => state.filteredJobs);
  const years = useArchiveStore((state) => state.years);
  const stats = useArchiveStore((state) => state.stats);
  const filters = useArchiveStore((state) => state.filters);
  const loadArchive = useArchiveStore((state) => state.loadArchive);
  const setQuery = useArchiveStore((state) => state.setQuery);
  const setYearFilter = useArchiveStore((state) => state.setYearFilter);
  const setStatusFilter = useArchiveStore((state) => state.setStatusFilter);
  const resetFilters = useArchiveStore((state) => state.resetFilters);
  const restoreJob = useArchiveStore((state) => state.restoreJob);
  const permanentlyDeleteJob = useArchiveStore(
    (state) => state.permanentlyDeleteJob,
  );

  const [restoreTarget, setRestoreTarget] = React.useState<Job | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Job | null>(null);
  const [deleteStep, setDeleteStep] = React.useState<DeleteStep>('first');

  React.useEffect(() => {
    loadArchive();
  }, [loadArchive]);

  const hasActiveFilter = Boolean(filters.query || filters.year || filters.status !== '전체');

  const openDelete = (job: Job) => {
    setDeleteTarget(job);
    setDeleteStep('first');
  };

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteStep('first');
  };

  return (
    <PageWrapper>
      <Container>
        <ContentWrapper>
          <Typography variant="body" tone="secondary">
            삭제 목록이 아니라 취업 준비가 끝난 공고와 기록을 보관하는 공간입니다.
          </Typography>

          <ArchiveStatsCards stats={stats} />

          <Card>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto] lg:items-end">
                <Input
                  label="검색"
                  value={filters.query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="기업명, 공고명, 직무를 검색하세요."
                />
                <Select
                  id="archive-year-filter"
                  label="연도"
                  value={filters.year}
                  onChange={(event) => setYearFilter(event.target.value)}
                >
                  <option value="">전체</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
                <Select
                  id="archive-status-filter"
                  label="상태"
                  value={filters.status}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as ArchiveStatusFilter)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetFilters}
                  disabled={!hasActiveFilter}
                >
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>보관된 공고</CardTitle>
              <CardDescription>
                Archive 이동은 데이터를 삭제하지 않으며, 복원 또는 영구 삭제를 직접 선택할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {archivedJobs.length === 0 ? (
                <EmptyState
                  title="아직 보관된 공고가 없습니다."
                  description="취업 준비가 끝난 공고를 보관해보세요."
                  action={
                    <Link href="/jobs" className={cn(buttonVariants())}>
                      Jobs로 이동
                    </Link>
                  }
                />
              ) : filteredJobs.length === 0 ? (
                <EmptyState
                  title="조건에 맞는 보관 공고가 없습니다."
                  description="검색어와 필터를 초기화해 다시 확인해보세요."
                  action={
                    <Button type="button" variant="secondary" onClick={resetFilters}>
                      검색어와 필터 초기화
                    </Button>
                  }
                />
              ) : (
                <ArchiveTable
                  jobs={filteredJobs}
                  onRestore={setRestoreTarget}
                  onDelete={openDelete}
                />
              )}
            </CardContent>
          </Card>
        </ContentWrapper>
      </Container>

      <Modal
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setRestoreTarget(null);
          }
        }}
        title="Jobs로 복원"
        confirmLabel="복원"
        onConfirm={() => {
          if (!restoreTarget) {
            return;
          }

          restoreJob(restoreTarget.id);
          setRestoreTarget(null);
        }}
      >
        <Typography variant="body">
          이 공고를 Jobs로 복원할까요? 연결된 모든 데이터는 그대로 유지됩니다.
        </Typography>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            closeDelete();
          }
        }}
        title={deleteStep === 'first' ? '영구 삭제 확인' : '영구 삭제 최종 확인'}
        danger={deleteStep === 'second'}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={closeDelete}>
              취소
            </Button>
            <Button
              type="button"
              variant={deleteStep === 'second' ? 'danger' : 'primary'}
              onClick={() => {
                if (!deleteTarget) {
                  return;
                }

                if (deleteStep === 'first') {
                  setDeleteStep('second');
                  return;
                }

                permanentlyDeleteJob(deleteTarget.id);
                closeDelete();
              }}
            >
              {deleteStep === 'first' ? '다음' : '영구 삭제'}
            </Button>
          </>
        }
      >
        {deleteStep === 'first' ? (
          <Typography variant="body">이 공고를 영구 삭제할까요?</Typography>
        ) : (
          <div className="flex flex-col gap-4">
            <Typography variant="body">
              연결된 모든 데이터가 삭제됩니다.
            </Typography>
            <ul className="list-disc space-y-1 pl-5 text-[length:var(--text-small)] text-text-secondary">
              <li>Job</li>
              <li>Applications</li>
              <li>Essay</li>
              <li>Interview</li>
              <li>Experience 연결 정보</li>
              <li>Calendar 일정(향후 연결 예정)</li>
            </ul>
            <Typography variant="body" className="text-danger">
              복구할 수 없습니다.
            </Typography>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}

function ArchiveStatsCards({ stats }: { stats: ReturnType<typeof useArchiveStore.getState>['stats'] }) {
  const items = [
    { label: '총 지원', value: stats.totalApplications },
    { label: '최종 합격', value: stats.finalPassed },
    { label: '최종 불합격', value: stats.finalFailed },
    { label: '지원 포기', value: stats.abandoned },
    { label: '보관중', value: stats.archived },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent>
            <Typography variant="caption" tone="secondary">
              {item.label}
            </Typography>
            <Typography variant="heading" className="mt-2">
              {item.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function ArchiveTable({
  jobs,
  onRestore,
  onDelete,
}: {
  jobs: Job[];
  onRestore: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
        <thead>
          <tr className="text-[length:var(--text-caption)] text-text-secondary">
            <th className="px-3 py-2 font-medium">공고</th>
            <th className="px-3 py-2 font-medium">직무</th>
            <th className="px-3 py-2 font-medium">결과</th>
            <th className="px-3 py-2 font-medium">보관일</th>
            <th className="px-3 py-2 text-right font-medium">작업</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="bg-background">
              <td className="rounded-l-[var(--radius-card)] border-y border-l border-border px-3 py-3">
                <Link
                  href={`/jobs/${job.id}`}
                  className="group block rounded-[var(--radius-button)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Typography
                    variant="small"
                    className="font-semibold group-hover:text-primary"
                  >
                    {job.companyName}
                  </Typography>
                  <Typography variant="caption" tone="secondary" className="mt-1">
                    {job.postingTitle}
                  </Typography>
                </Link>
              </td>
              <td className="border-y border-border px-3 py-3">
                <Typography variant="small">{job.position || '미입력'}</Typography>
              </td>
              <td className="border-y border-border px-3 py-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={resultVariant[job.applicationResult]}>
                    {job.applicationResult}
                  </Badge>
                  <Badge variant="archive">보관중</Badge>
                </div>
              </td>
              <td className="border-y border-border px-3 py-3">
                <Typography variant="small">
                  {formatDate(job.archivedAt)}
                </Typography>
              </td>
              <td className="rounded-r-[var(--radius-card)] border-y border-r border-border px-3 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onRestore(job)}
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    복원
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onDelete(job)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                    영구 삭제
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return '미입력';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export { ArchivePage };
