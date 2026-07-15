import { create } from 'zustand';

import { calendarRepository } from '@/repositories/calendarRepository';
import type { CalendarSchedule } from '@/features/calendar/calendar-data';

interface CalendarStore {
  schedules: CalendarSchedule[] | null;
  loadSchedules: () => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  schedules: null,
  loadSchedules: () => {
    set({ schedules: calendarRepository.getCalendarSchedules() });
  },
}));
