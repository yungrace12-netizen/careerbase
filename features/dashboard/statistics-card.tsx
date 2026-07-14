import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import type { DashboardStatistic } from './dashboard-data';

interface StatisticsCardProps {
  statistics: DashboardStatistic[];
}

function StatisticsCard({ statistics }: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>지원 통계</CardTitle>
        <CardDescription>차트 없이 숫자 중심으로 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
          {statistics.map((statistic) => (
            <div
              key={statistic.label}
              className="rounded-[var(--radius-card)] border border-border bg-background p-4"
            >
              <Typography variant="caption" tone="secondary">
                {statistic.label}
              </Typography>
              <Typography variant="section" className="mt-2">
                {statistic.value}
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatisticsCard };
