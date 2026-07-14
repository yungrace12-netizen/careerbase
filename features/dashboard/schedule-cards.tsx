import { Clock } from 'lucide-react';

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
import type { DashboardSchedule } from './dashboard-data';

interface TodayScheduleCardProps {
  schedules: DashboardSchedule[];
}

interface ThisWeekCardProps {
  schedules: DashboardSchedule[];
}

function TodayScheduleCard({ schedules }: TodayScheduleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>오늘 일정</CardTitle>
        <CardDescription>마감과 면접 일정을 빠르게 확인합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length > 0 ? (
          <div className="flex flex-col gap-3">
            {schedules.map((schedule) => (
              <ScheduleListItem key={schedule.id} schedule={schedule} compact />
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="오늘은 예정된 일정이 없습니다."
            description="새 공고를 등록하면 마감 일정이 이곳에 표시됩니다."
          />
        )}
      </CardContent>
    </Card>
  );
}

function ThisWeekCard({ schedules }: ThisWeekCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>이번 주 일정</CardTitle>
        <CardDescription>이번 주 마감과 발표 일정을 정리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length > 0 ? (
          <div className="flex flex-col gap-3">
            {schedules.map((schedule) => (
              <ScheduleListItem key={schedule.id} schedule={schedule} />
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="이번 주 일정이 없습니다."
            description="등록된 일정이 생기면 날짜순으로 표시됩니다."
          />
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleListItem({
  schedule,
  compact = false,
}: {
  schedule: DashboardSchedule;
  compact?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-background p-3">
      <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-primary/10 text-primary">
        <Clock className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{schedule.type}</Badge>
          <Typography variant="caption" tone="secondary">
            {compact ? schedule.timeLabel ?? schedule.dDay : schedule.dateLabel}
          </Typography>
        </div>
        <Typography variant="small" className="mt-2 font-medium">
          {schedule.companyName}
        </Typography>
        <Typography variant="caption" tone="secondary">
          {schedule.title}
        </Typography>
      </div>
      {schedule.dDay ? (
        <Typography variant="caption" className="shrink-0 font-medium text-primary">
          {schedule.dDay}
        </Typography>
      ) : null}
    </div>
  );
}

export { TodayScheduleCard, ThisWeekCard };
