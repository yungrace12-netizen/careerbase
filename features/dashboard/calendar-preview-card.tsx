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

const dashboardCalendarClassName = [
  'h-[520px] overflow-hidden',
  'xl:h-auto xl:min-h-0 xl:flex-1',
  'xl:[&_.careerbase-calendar>span]:hidden',
  'xl:[&_.careerbase-calendar]:flex xl:[&_.careerbase-calendar]:h-full',
  'xl:[&_.careerbase-calendar]:min-h-0 xl:[&_.careerbase-calendar]:overflow-hidden',
  'xl:[&_.careerbase-calendar]:flex-col',
  'xl:[&_.careerbase-calendar_.fc]:!h-full xl:[&_.careerbase-calendar_.fc]:min-h-0',
  'xl:[&_.careerbase-calendar_.fc]:flex xl:[&_.careerbase-calendar_.fc]:flex-1',
  'xl:[&_.careerbase-calendar_.fc]:flex-col',
  'xl:[&_.careerbase-calendar_.fc-button]:!min-h-8',
  'xl:[&_.careerbase-calendar_.fc-button]:!px-2',
  'xl:[&_.careerbase-calendar_.fc-button]:!text-[length:var(--text-caption)]',
  'xl:[&_.careerbase-calendar_.fc-col-header-cell]:!py-1',
  'xl:[&_.careerbase-calendar_.fc-daygrid-day-frame]:!min-h-0',
  'xl:[&_.careerbase-calendar_.fc-daygrid-day-frame]:!p-1',
  'xl:[&_.careerbase-calendar_.fc-daygrid-day-number]:!text-[length:var(--text-caption)]',
  'xl:[&_.careerbase-calendar_.fc-daygrid-event]:!py-0',
  'xl:[&_.careerbase-calendar_.fc-scroller]:!overflow-hidden',
  'xl:[&_.careerbase-calendar_.fc-scrollgrid]:!h-full',
  'xl:[&_.careerbase-calendar_.fc-toolbar-title]:!text-[length:var(--text-card-title)]',
  'xl:[&_.careerbase-calendar_.fc-toolbar]:!mb-2',
  'xl:[&_.careerbase-calendar_.fc-toolbar]:!gap-2',
  'xl:[&_.careerbase-calendar_.fc-view-harness]:!h-auto',
  'xl:[&_.careerbase-calendar_.fc-view-harness]:min-h-0',
  'xl:[&_.careerbase-calendar_.fc-view-harness]:flex-1',
].join(' ');

function CalendarPreviewCard({ schedules }: CalendarPreviewCardProps) {
  return (
    <Card className="min-h-0 overflow-hidden gap-2 p-3 xl:p-3">
      <CardHeader className="shrink-0 flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-[length:var(--text-body)]">
            월간 달력
          </CardTitle>
          <CardDescription className="text-[length:var(--text-caption)]">
            이번 달 지원 일정
          </CardDescription>
        </div>
        <div className="flex size-9 items-center justify-center rounded-[var(--radius-button)] bg-primary/10 text-primary">
          <CalendarDays className="size-4" aria-hidden />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-hidden">
        <div className={dashboardCalendarClassName}>
          <CareerBaseCalendar schedules={schedules} compact />
        </div>
      </CardContent>
    </Card>
  );
}

export { CalendarPreviewCard };
