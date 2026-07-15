import Link from 'next/link';
import { Archive, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Typography } from '@/components/ui/typography';
import type { ApplicationBoardColumn, Job } from '@/types/job';

interface JobsListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
}

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

function JobsList({ jobs, onEdit, onArchive }: JobsListProps) {
  return (
    <Card className="min-h-full">
      <CardHeader>
        <CardTitle>공고 목록</CardTitle>
        <CardDescription>지원 마감일 기준으로 정렬됩니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-[var(--radius-card)] border border-border bg-background p-4 transition-colors hover:bg-muted"
              >
                <Link
                  href={`/jobs/${job.id}`}
                  className="block rounded-[var(--radius-button)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Typography variant="small" className="font-semibold">
                        {job.companyName}
                      </Typography>
                      <Typography
                        variant="caption"
                        tone="secondary"
                        className="mt-1 block"
                      >
                        {job.postingTitle}
                      </Typography>
                    </div>
                    <Typography
                      variant="caption"
                      className="shrink-0 font-medium text-primary"
                    >
                      {getDday(job.applicationEndDate)}
                    </Typography>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[job.boardColumn]}>
                      {job.boardColumn}
                    </Badge>
                    <Typography variant="caption" tone="secondary">
                      {job.position}
                    </Typography>
                    <Typography variant="caption" tone="secondary">
                      마감 {job.applicationEndDate ?? '미정'}
                    </Typography>
                  </div>
                </Link>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onEdit(job)}
                  >
                    <Pencil className="size-4" aria-hidden />
                    수정
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onArchive(job)}
                  >
                    <Archive className="size-4" aria-hidden />
                    Archive 이동
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="아직 등록된 공고가 없습니다."
            description="상단의 새 공고 등록 버튼으로 첫 번째 공고를 등록해보세요."
          />
        )}
      </CardContent>
    </Card>
  );
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

export { JobsList };
