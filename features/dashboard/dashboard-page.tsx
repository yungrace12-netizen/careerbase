import {
  Container,
  ContentWrapper,
  PageHeader,
  PageWrapper,
} from '@/components/layout';
import { calendarSchedules } from '@/features/calendar';
import { CalendarPreviewCard } from './calendar-preview-card';
import { dashboardData, type DashboardData } from './dashboard-data';
import { ThisWeekCard, TodayScheduleCard } from './schedule-cards';

interface DashboardPageProps {
  data?: DashboardData;
}

function DashboardPage({ data = dashboardData }: DashboardPageProps) {
  return (
    <PageWrapper className="py-4 xl:h-[calc(100dvh-4rem)] xl:gap-0 xl:overflow-hidden xl:py-3">
      <Container className="xl:h-full xl:px-4">
        <ContentWrapper className="gap-4 xl:h-full xl:gap-3 xl:overflow-hidden">
          <PageHeader
            className="xl:gap-1"
            title="대시보드"
            description="오늘 일정과 이번 주 일정을 확인하세요."
          />

          <div className="grid grid-cols-1 gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,68fr)_minmax(360px,32fr)] xl:grid-rows-1 xl:gap-3 xl:overflow-hidden 2xl:grid-cols-[minmax(0,70fr)_minmax(400px,30fr)]">
            <CalendarPreviewCard schedules={calendarSchedules} />

            <div className="flex min-w-0 flex-col gap-4 xl:min-h-0 xl:gap-3 xl:overflow-hidden">
              <TodayScheduleCard
                schedules={data.todaySchedules}
                className="xl:flex-1"
              />
              <ThisWeekCard
                schedules={data.weekSchedules}
                className="xl:flex-1"
              />
            </div>
          </div>
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
}

export { DashboardPage };
