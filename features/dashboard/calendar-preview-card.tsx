import { CalendarDays } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CareerBaseCalendar } from '@/features/calendar';
import type { CalendarSchedule } from '@/features/calendar';

interface CalendarPreviewCardProps {
  schedules: CalendarSchedule[];
}

function CalendarPreviewCard({ schedules }: CalendarPreviewCardProps) {
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

      <CardContent>
        <CareerBaseCalendar schedules={schedules} compact />
      </CardContent>
    </Card>
  );
}

export { CalendarPreviewCard };
