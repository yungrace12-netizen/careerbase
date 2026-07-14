'use client';

import * as React from 'react';

import {
  Container,
  ContentWrapper,
  PageWrapper,
} from '@/components/layout';
import { Modal } from '@/components/ui/modal';
import { Typography } from '@/components/ui/typography';
import {
  calendarSchedules,
  getSchedulesByDate,
  type CalendarSchedule,
} from '@/features/calendar/calendar-data';
import { CareerBaseCalendar } from '@/features/calendar/components/careerbase-calendar';
import { ScheduleDetailModal } from '@/features/calendar/components/schedule-detail-modal';

const defaultSelectedDate = '2026-07-14';

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
  const [selectedDate, setSelectedDate] = React.useState(defaultSelectedDate);
  const [selectedSchedule, setSelectedSchedule] =
    React.useState<CalendarSchedule | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [moreEventsDate, setMoreEventsDate] = React.useState<string | null>(
    null,
  );

  const moreEventsSchedules = moreEventsDate
    ? getSchedulesByDate(calendarSchedules, moreEventsDate)
    : [];

  const handleScheduleClick = (schedule: CalendarSchedule) => {
    setSelectedSchedule(schedule);
    setModalOpen(true);
  };

  const handleMoreEventScheduleClick = (schedule: CalendarSchedule) => {
    setMoreEventsDate(null);
    handleScheduleClick(schedule);
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
              />
            </div>
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
            <button
              key={schedule.id}
              type="button"
              className="flex min-w-0 items-center gap-2 rounded-[var(--radius-card)] border border-border bg-background p-3 text-left transition-colors hover:bg-muted"
              onClick={() => handleMoreEventScheduleClick(schedule)}
            >
              <Typography
                as="span"
                variant="small"
                className={
                  schedule.type === '지원 마감' ? 'text-danger' : 'text-primary'
                }
              >
                {schedule.type}
              </Typography>
              <Typography as="span" variant="small" tone="secondary">
                -
              </Typography>
              <Typography as="span" variant="small" className="truncate">
                {schedule.companyName}
              </Typography>
            </button>
          ))}
        </div>
      </Modal>

      <ScheduleDetailModal
        schedule={selectedSchedule}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </PageWrapper>
  );
}

export { CalendarPage };
