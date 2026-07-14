'use client';

import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Container,
  ContentWrapper,
  PageHeader,
  PageWrapper,
} from '@/components/layout';
import {
  calendarSchedules,
  getPendingSchedules,
  getSchedulesByDate,
  type CalendarSchedule,
} from '@/features/calendar/calendar-data';
import { CareerBaseCalendar } from '@/features/calendar/components/careerbase-calendar';
import { ScheduleDetailModal } from '@/features/calendar/components/schedule-detail-modal';
import { ScheduleList } from '@/features/calendar/components/schedule-list';

const defaultSelectedDate = '2026-07-14';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState(defaultSelectedDate);
  const [selectedSchedule, setSelectedSchedule] =
    React.useState<CalendarSchedule | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const selectedDateSchedules = getSchedulesByDate(
    calendarSchedules,
    selectedDate,
  );
  const pendingSchedules = getPendingSchedules(calendarSchedules);

  const handleScheduleClick = (schedule: CalendarSchedule) => {
    setSelectedSchedule(schedule);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <Container>
        <ContentWrapper>
          <PageHeader
            title="Calendar"
            description="공고별 채용 일정을 월간 보기로 확인합니다."
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card>
              <CardHeader>
                <CardTitle>월간 달력</CardTitle>
                <CardDescription>
                  월간 보기만 제공하며, 날짜와 일정을 클릭할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CareerBaseCalendar
                  schedules={calendarSchedules}
                  selectedDate={selectedDate}
                  onDateClick={setSelectedDate}
                  onScheduleClick={handleScheduleClick}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>선택한 날짜 일정</CardTitle>
                  <CardDescription>{selectedDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleList
                    schedules={selectedDateSchedules}
                    emptyTitle="선택한 날짜에 일정이 없습니다."
                    emptyDescription="다른 날짜를 선택하면 해당 날짜의 일정이 표시됩니다."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>예정·미정 일정</CardTitle>
                  <CardDescription>
                    정확한 날짜가 없는 일정은 달력에 임의 표시하지 않습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleList
                    schedules={pendingSchedules}
                    emptyTitle="예정·미정 일정이 없습니다."
                    emptyDescription="정확한 날짜가 없는 일정이 이곳에 표시됩니다."
                    showDate
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </ContentWrapper>
      </Container>

      <ScheduleDetailModal
        schedule={selectedSchedule}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </PageWrapper>
  );
}

export { CalendarPage };
