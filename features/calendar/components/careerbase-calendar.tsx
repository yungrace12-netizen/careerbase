'use client';

import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import type {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import type { EventInput } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { CalendarSchedule } from '@/features/calendar/calendar-data';
import {
  getCalendarCellTypeLabel,
  getExactSchedules,
} from '@/features/calendar/calendar-data';

interface CareerBaseCalendarProps {
  schedules: CalendarSchedule[];
  selectedDate?: string;
  compact?: boolean;
  fullHeight?: boolean;
  onDateClick?: (date: string) => void;
  onScheduleClick?: (schedule: CalendarSchedule) => void;
  onMoreLinkClick?: (date: string) => void;
  onMonthChange?: (month: string) => void;
}

function CareerBaseCalendar({
  schedules,
  selectedDate,
  compact = false,
  fullHeight = false,
  onDateClick,
  onScheduleClick,
  onMoreLinkClick,
  onMonthChange,
}: CareerBaseCalendarProps) {
  const eventSchedules = React.useMemo(
    () => getExactSchedules(schedules),
    [schedules],
  );

  const events = React.useMemo<EventInput[]>(
    () =>
      eventSchedules.map((schedule) => ({
        id: schedule.id,
        title: `${getCalendarCellTypeLabel(schedule.type)} - ${schedule.companyName}`,
        date: schedule.date ?? undefined,
        extendedProps: {
          schedule,
        },
      })),
    [eventSchedules],
  );

  const handleDateClick = React.useCallback(
    (arg: DateClickArg) => {
      onDateClick?.(arg.dateStr);
    },
    [onDateClick],
  );

  const handleEventClick = React.useCallback(
    (arg: EventClickArg) => {
      const schedule = arg.event.extendedProps.schedule as
        | CalendarSchedule
        | undefined;

      if (schedule) {
        onScheduleClick?.(schedule);
      }
    },
    [onScheduleClick],
  );

  const handleDatesSet = React.useCallback(
    (arg: DatesSetArg) => {
      onMonthChange?.(formatCalendarMonth(arg.view.currentStart));
    },
    [onMonthChange],
  );

  const renderEventContent = React.useCallback(
    (arg: EventContentArg) => {
      const schedule = arg.event.extendedProps.schedule as CalendarSchedule;

      return (
        <div
          className={cn(
            'flex min-w-0 items-center gap-1 overflow-hidden rounded-[var(--radius-badge)] px-2 py-0.5',
            schedule.isDanger
              ? 'bg-danger/10 text-danger'
              : 'bg-primary/10 text-primary',
          )}
        >
          <span className="shrink-0 text-[length:var(--text-caption)] font-semibold">
            {getCalendarCellTypeLabel(schedule.type)}
          </span>
          <span className="shrink-0 text-[length:var(--text-caption)]">
            -
          </span>
          <span className="min-w-0 truncate text-[length:var(--text-caption)] font-medium">
            {schedule.companyName}
          </span>
        </div>
      );
    },
    [],
  );

  return (
    <div
      className={cn(
        'careerbase-calendar',
        compact && 'careerbase-calendar--compact',
      )}
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={koLocale}
        initialView="dayGridMonth"
        initialDate={selectedDate}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        buttonText={{
          today: '오늘',
        }}
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        datesSet={handleDatesSet}
        height={compact ? 520 : 'auto'}
        dayMaxEvents={compact ? 2 : 3}
        moreLinkClick={(arg) => {
          onMoreLinkClick?.(formatCalendarDate(arg.date));
          window.setTimeout(() => {
            document.querySelectorAll('.fc-popover').forEach((popover) => {
              popover.remove();
            });
          }, 0);
        }}
        moreLinkContent={(arg) => `+${arg.num}개 더보기`}
        fixedWeekCount={fullHeight}
        showNonCurrentDates
        nowIndicator={false}
        eventDisplay="block"
        eventClassNames="careerbase-calendar-event"
        dayCellClassNames={(arg) =>
          formatCalendarDate(arg.date) === selectedDate
            ? ['careerbase-calendar-selected-day']
            : []
        }
      />
      {fullHeight ? null : (
        <Typography variant="caption" tone="secondary" className="mt-3 block">
          월간 보기만 지원합니다.
        </Typography>
      )}
    </div>
  );
}

function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatCalendarMonth(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

export { CareerBaseCalendar };
