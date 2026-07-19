'use client';

import * as React from 'react';
import { CalendarClock, Circle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Typography } from '@/components/ui/typography';
import {
  getScheduleTimelineLabel,
  type CalendarSchedule,
} from '@/features/calendar/calendar-data';
import { cn } from '@/lib/utils';
import { calendarRepository } from '@/repositories/calendarRepository';
import type { Job } from '@/types/job';

interface ScheduleTabProps {
  job: Job;
}

function ScheduleTab({ job }: ScheduleTabProps) {
  const schedules = React.useMemo(
    () =>
      calendarRepository
        .getCalendarSchedulesByJobId(job.id)
        .filter((schedule) => Boolean(schedule.date)),
    [job],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>일정</CardTitle>
        <CardDescription>
          이 공고의 채용 일정을 진행 순서대로 확인합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length > 0 ? (
          <ol className="grid gap-0">
            {schedules.map((schedule, index) => (
              <ScheduleTimelineItem
                key={schedule.id}
                schedule={schedule}
                isLast={index === schedules.length - 1}
              />
            ))}
          </ol>
        ) : (
          <EmptyState
            title="표시할 일정이 없습니다."
            description="날짜가 등록된 지원 시작·마감, 발표, 면접 일정이 여기에 표시됩니다."
            illustration={<CalendarClock className="size-8" aria-hidden />}
            className="min-h-48 rounded-[var(--radius-card)] border border-border bg-background py-10"
          />
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleTimelineItem({
  schedule,
  isLast,
}: {
  schedule: CalendarSchedule;
  isLast: boolean;
}) {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-[var(--radius-badge)]',
            schedule.isDanger
              ? 'bg-danger/10 text-danger'
              : 'bg-primary/10 text-primary',
          )}
        >
          <Circle className="size-3 fill-current" aria-hidden />
        </span>
        {!isLast ? <span className="min-h-8 w-px flex-1 bg-border" /> : null}
      </div>

      <div
        className={cn(
          'mb-3 rounded-[var(--radius-card)] border border-border p-4',
          isLast && 'mb-0',
          schedule.isDanger
            ? 'border-danger/30 bg-danger/10'
            : 'border-primary/20 bg-background',
        )}
      >
        <Typography variant="small" className="font-semibold">
          {getScheduleTimelineLabel(schedule.type)}
        </Typography>
        <Typography variant="caption" tone="secondary" className="mt-2 block">
          {formatTimelineDate(schedule.date)}
          {schedule.time ? ` ${schedule.time}` : ''}
        </Typography>
      </div>
    </li>
  );
}

function formatTimelineDate(date: string | null) {
  if (!date) {
    return '미정';
  }

  const [year, month, day] = date.split('-');

  if (!year || !month || !day) {
    return date;
  }

  return `${year}.${month}.${day}`;
}

export { ScheduleTab };
