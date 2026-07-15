import { CalendarClock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Typography } from '@/components/ui/typography';
import type { CalendarSchedule } from '@/features/calendar/calendar-data';

interface ScheduleListProps {
  schedules: CalendarSchedule[];
  emptyTitle: string;
  emptyDescription: string;
  showDate?: boolean;
}

function ScheduleList({
  schedules,
  emptyTitle,
  emptyDescription,
  showDate = false,
}: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        illustration={<CalendarClock className="size-8" aria-hidden />}
        className="min-h-48 rounded-[var(--radius-card)] border border-border bg-background py-10"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="rounded-[var(--radius-card)] border border-border bg-background p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                schedule.isDanger
                  ? 'size-2 rounded-[var(--radius-badge)] bg-danger'
                  : 'size-2 rounded-[var(--radius-badge)] bg-primary'
              }
            />
            <Badge variant={schedule.isDanger ? 'danger' : 'primary'}>
              {schedule.type}
            </Badge>
            <Badge variant={schedule.isDanger ? 'danger' : 'primary'}>
              {schedule.dDayLabel}
            </Badge>
            {showDate ? (
              <Typography variant="caption" tone="secondary">
                {schedule.date ?? schedule.approximateText ?? '미정'}
              </Typography>
            ) : null}
            {schedule.time ? (
              <Typography variant="caption" tone="secondary">
                {schedule.time}
              </Typography>
            ) : null}
          </div>

          <Typography variant="small" className="mt-3 font-semibold">
            {schedule.type} - {schedule.companyName}
          </Typography>
          <Typography variant="caption" tone="secondary" className="mt-1 block">
            {schedule.postingTitle}
          </Typography>
        </div>
      ))}
    </div>
  );
}

export { ScheduleList };
