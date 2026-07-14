import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Container,
  ContentWrapper,
  PageHeader,
  PageWrapper,
} from '@/components/layout';
import { calendarSchedules } from '@/features/calendar';
import { CalendarPreviewCard } from './calendar-preview-card';
import { dashboardData, type DashboardData } from './dashboard-data';
import { DashboardEmptyState } from './dashboard-empty-state';
import { RecentJobsCard } from './recent-jobs-card';
import { StatisticsCard } from './statistics-card';
import { ThisWeekCard, TodayScheduleCard } from './schedule-cards';
import { TodoCard } from './todo-card';

interface DashboardPageProps {
  data?: DashboardData;
}

function DashboardPage({ data = dashboardData }: DashboardPageProps) {
  const dashboardIsEmpty =
    data.todaySchedules.length === 0 &&
    data.weekSchedules.length === 0 &&
    data.todos.length === 0 &&
    data.recentJobs.length === 0 &&
    data.statistics.every((statistic) => statistic.value === 0);

  return (
    <PageWrapper>
      <Container>
        <ContentWrapper>
          <PageHeader
            title="대시보드"
            description="오늘의 일정과 지원 현황을 한 화면에서 확인하세요."
          >
            <Button type="button" aria-label="새 공고 등록">
              <Plus className="size-5" aria-hidden />
              새 공고 등록
            </Button>
          </PageHeader>

          {dashboardIsEmpty ? (
            <DashboardEmptyState
              title="아직 Dashboard에 표시할 데이터가 없습니다."
              description="공고를 등록하면 일정, TODO, 통계가 이곳에 표시됩니다."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.9fr)]">
              <div className="flex min-w-0 flex-col gap-6">
                <CalendarPreviewCard schedules={calendarSchedules} />
                <RecentJobsCard jobs={data.recentJobs} />
              </div>

              <div className="flex min-w-0 flex-col gap-6">
                <TodayScheduleCard schedules={data.todaySchedules} />
                <ThisWeekCard schedules={data.weekSchedules} />
                <TodoCard todos={data.todos} />
                <StatisticsCard statistics={data.statistics} />
              </div>
            </div>
          )}
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
}

export { DashboardPage };
