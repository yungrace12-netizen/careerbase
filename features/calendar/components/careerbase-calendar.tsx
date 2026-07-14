'use client';

import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import type { EventClickArg, EventContentArg } from '@fullcalendar/core';
import type { EventInput } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';

import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { CalendarSchedule } from '@/features/calendar/calendar-data';
import { getExactSchedules } from '@/features/calendar/calendar-data';

interface CareerBaseCalendarProps {
  schedules: CalendarSchedule[];
  selectedDate?: string;
  compact?: boolean;
  onDateClick?: (date: string) => void;
  onScheduleClick?: (schedule: CalendarSchedule) => void;
}

function CareerBaseCalendar({
  schedules,
  selectedDate,
  compact = false,
  onDateClick,
  onScheduleClick,
}: CareerBaseCalendarProps) {
  const eventSchedules = React.useMemo(
    () => getExactSchedules(schedules),
    [schedules],
  );

  const events = React.useMemo<EventInput[]>(
    () =>
      eventSchedules.map((schedule) => ({
        id: schedule.id,
        title: `${schedule.type} · ${schedule.companyName}`,
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

  const renderEventContent = React.useCallback(
    (arg: EventContentArg) => {
      const schedule = arg.event.extendedProps.schedule as CalendarSchedule;

      return (
        <div className="flex min-w-0 items-center gap-1">
          <span className="size-2 shrink-0 rounded-[var(--radius-badge)] bg-primary" />
          {compact ? (
            <span className="truncate text-[length:var(--text-caption)]">
              {schedule.type}
            </span>
          ) : (
            <Badge variant="primary" className="max-w-full truncate px-2 py-1">
              {schedule.type} · {schedule.companyName}
            </Badge>
          )}
        </div>
      );
    },
    [compact],
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
        height={compact ? 520 : 'auto'}
        dayMaxEvents={compact ? 2 : 3}
        fixedWeekCount={false}
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
      <Typography variant="caption" tone="secondary" className="mt-3 block">
        월간 보기만 지원합니다.
      </Typography>
    </div>
  );
}

function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export { CareerBaseCalendar };
