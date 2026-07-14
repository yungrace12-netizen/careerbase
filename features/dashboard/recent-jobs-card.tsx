import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { DashboardEmptyState } from './dashboard-empty-state';
import type { DashboardRecentJob, JobStatus } from './dashboard-data';

interface RecentJobsCardProps {
  jobs: DashboardRecentJob[];
}

const statusVariant: Record<JobStatus, React.ComponentProps<typeof Badge>['variant']> = {
  관심: 'pending',
  '준비 중': 'warning',
  '제출 완료': 'primary',
  '전형 진행': 'inProgress',
  '최종 결과': 'archive',
};

function RecentJobsCard({ jobs }: RecentJobsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 등록 공고</CardTitle>
        <CardDescription>최대 5개의 최근 공고를 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Typography variant="small" className="font-semibold">
                      {job.companyName}
                    </Typography>
                    <Typography variant="caption" tone="secondary" className="mt-1 block">
                      {job.postingTitle}
                    </Typography>
                  </div>
                  <Typography variant="caption" className="shrink-0 font-medium text-primary">
                    {job.dDay}
                  </Typography>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                  <Typography variant="caption" tone="secondary">
                    {job.position}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="아직 등록한 공고가 없습니다."
            description="첫 번째 공고를 등록하면 최근 공고가 이곳에 표시됩니다."
          />
        )}
      </CardContent>
    </Card>
  );
}

export { RecentJobsCard };
