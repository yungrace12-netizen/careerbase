'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Container,
  ContentWrapper,
  PageWrapper,
} from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { Typography } from '@/components/ui/typography';
import {
  getSchedulesByMonth,
  getSchedulesByDate,
  type CalendarSchedule,
} from '@/features/calendar/calendar-data';
import { CareerBaseCalendar } from '@/features/calendar/components/careerbase-calendar';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/stores/calendarStore';

const defaultSelectedDate = formatCalendarDate(new Date());

const fullScreenCalendarClassName = [
  'h-[620px] overflow-hidden',
  'xl:h-full xl:min-h-0',
  'xl:[&_.careerbase-calendar]:flex xl:[&_.careerbase-calendar]:h-full',
  'xl:[&_.careerbase-calendar]:min-h-0 xl:[&_.careerbase-calendar]:overflow-hidden',
  'xl:[&_.careerbase-calendar]:flex-col',
  'xl:[&_.careerbase-calendar_.fc]:!h-full xl:[&_.careerbase-calendar_.fc]:min-h-0',
  'xl:[&_.careerbase-calendar_.fc]:flex xl:[&_.careerbase-calendar_.fc]:flex-1',
  'xl:[&_.careerbase-calendar_.fc]:flex-col',
  'xl:[&_.careerbase-calendar_.fc-button]:!min-h-8',
  'xl:[&_.careerbase-calendar_.fc-button]:!px-3',
  'xl:[&_.careerbase-calendar_.fc-button]:!text-[length:var(--text-caption)]',
  'xl:[&_.careerbase-calendar_.fc-col-header-cell]:!py-1',
  'xl:[&_.careerbase-calendar_.fc-daygrid-day-frame]:!min-h-0',
  'xl:[&_.careerbase-calendar_.fc-daygrid-day-frame]:!p-1',
  'xl:[&_.careerbase-calendar_.fc-daygrid-day-number]:!text-[length:var(--text-caption)]',
  'xl:[&_.careerbase-calendar_.fc-daygrid-event]:!py-0',
  'xl:[&_.careerbase-calendar_.fc-daygrid-event]:!whitespace-nowrap',
  'xl:[&_.careerbase-calendar_.fc-event-main]:!overflow-hidden',
  'xl:[&_.careerbase-calendar_.fc-more-link]:!text-[length:var(--text-caption)]',
  'xl:[&_.careerbase-calendar_.fc-scroller]:!overflow-hidden',
  'xl:[&_.careerbase-calendar_.fc-scrollgrid]:!h-full',
  'xl:[&_.careerbase-calendar_.fc-toolbar-title]:!text-[length:var(--text-card-title)]',
  'xl:[&_.careerbase-calendar_.fc-toolbar]:!mb-2',
  'xl:[&_.careerbase-calendar_.fc-toolbar]:!gap-2',
  'xl:[&_.careerbase-calendar_.fc-view-harness]:!h-auto',
  'xl:[&_.careerbase-calendar_.fc-view-harness]:min-h-0',
  'xl:[&_.careerbase-calendar_.fc-view-harness]:flex-1',
].join(' ');

function CalendarPage() {
  const router = useRouter();
  const schedules = useCalendarStore((state) => state.schedules);
  const loadSchedules = useCalendarStore((state) => state.loadSchedules);
  const [selectedDate, setSelectedDate] = React.useState(defaultSelectedDate);
  const [visibleMonth, setVisibleMonth] = React.useState(
    defaultSelectedDate.slice(0, 7),
  );
  const [moreEventsDate, setMoreEventsDate] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const calendarSchedules = schedules ?? [];
  const loaded = schedules !== null;
  const moreEventsSchedules = moreEventsDate
    ? getSchedulesByDate(calendarSchedules, moreEventsDate)
    : [];
  const visibleMonthSchedules = getSchedulesByMonth(
    calendarSchedules,
    visibleMonth,
  );

  const handleScheduleClick = (schedule: CalendarSchedule) => {
    router.push(`/jobs/${schedule.jobId}`);
  };

  return (
    <PageWrapper className="py-4 xl:h-[calc(100dvh-4rem)] xl:overflow-hidden xl:py-3">
      <Container className="xl:h-full xl:max-w-none xl:px-4">
        <ContentWrapper className="xl:h-full xl:overflow-hidden">
          <div className="min-h-0 overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface p-3 xl:h-full">
            <div className={fullScreenCalendarClassName}>
              <CareerBaseCalendar
                schedules={calendarSchedules}
                selectedDate={selectedDate}
                fullHeight
                onDateClick={setSelectedDate}
                onScheduleClick={handleScheduleClick}
                onMoreLinkClick={setMoreEventsDate}
                onMonthChange={setVisibleMonth}
              />
            </div>
            {loaded && visibleMonthSchedules.length === 0 ? (
              <EmptyState
                title="아직 등록된 일정이 없습니다."
                description="공고를 등록하면 일정이 자동으로 표시됩니다."
                action={
                  <Link href="/jobs" className={cn(buttonVariants())}>
                    Jobs로 이동
                  </Link>
                }
                className="py-8"
              />
            ) : null}
          </div>
        </ContentWrapper>
      </Container>

      <Modal
        open={Boolean(moreEventsDate)}
        onOpenChange={(open) => {
          if (!open) {
            setMoreEventsDate(null);
          }
        }}
        title="전체 일정"
        description={moreEventsDate ?? undefined}
        confirmLabel="닫기"
      >
        <div className="flex flex-col gap-2">
          {moreEventsSchedules.map((schedule) => (
            <Link
              key={schedule.id}
              className="flex min-w-0 items-center gap-2 rounded-[var(--radius-card)] border border-border bg-background p-3 text-left transition-colors hover:bg-muted"
              href={`/jobs/${schedule.jobId}`}
              onClick={() => setMoreEventsDate(null)}
            >
              <Badge variant={schedule.isDanger ? 'danger' : 'primary'}>
                {schedule.dDayLabel}
              </Badge>
              <Typography
                as="span"
                variant="small"
                className={schedule.isDanger ? 'text-danger' : 'text-primary'}
              >
                {schedule.type} - {schedule.companyName}
              </Typography>
              <Typography as="span" variant="caption" tone="secondary">
                {schedule.postingTitle}
              </Typography>
            </Link>
          ))}
          {moreEventsSchedules.length === 0 ? (
            <Typography variant="body" tone="secondary">
              해당 날짜에 표시할 일정이 없습니다.
            </Typography>
          ) : null}
        </div>
      </Modal>
    </PageWrapper>
  );
}

function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export { CalendarPage };
