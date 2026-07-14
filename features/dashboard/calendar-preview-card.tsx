import { CalendarDays } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import type { DashboardCalendarDay } from './dashboard-data';

interface CalendarPreviewCardProps {
  monthLabel: string;
  days: DashboardCalendarDay[];
}

const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

function CalendarPreviewCard({ monthLabel, days }: CalendarPreviewCardProps) {
  return (
    <Card className="min-h-full">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>월간 달력</CardTitle>
          <CardDescription>이번 달 지원 일정을 한눈에 확인합니다.</CardDescription>
        </div>
        <div className="flex size-12 items-center justify-center rounded-[var(--radius-button)] bg-primary/10 text-primary">
          <CalendarDays className="size-5" aria-hidden />
        </div>
      </CardHeader>

      <CardContent className="gap-5">
        <div className="flex items-center justify-between">
          <Typography variant="section">{monthLabel}</Typography>
          <Typography variant="caption" tone="secondary">
            Calendar 기능은 다음 Sprint에서 연결
          </Typography>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-[length:var(--text-caption)] font-medium text-text-secondary"
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <div
              key={`${day.date}-${index}`}
              className={cn(
                'flex min-h-20 flex-col rounded-[var(--radius-card)] border border-border bg-background p-2',
                !day.currentMonth && 'opacity-50',
                day.today && 'border-primary bg-primary/10',
              )}
            >
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-[var(--radius-badge)] text-[length:var(--text-small)] font-medium',
                  day.today
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-primary',
                )}
              >
                {day.date}
              </div>
              <div className="mt-auto flex flex-wrap gap-1">
                {day.events.slice(0, 3).map((event) => (
                  <span
                    key={event}
                    className="size-2 rounded-[var(--radius-badge)] bg-primary"
                    aria-label={event}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { CalendarPreviewCard };
