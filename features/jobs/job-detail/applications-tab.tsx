import { CheckCircle2, Circle, CircleDot, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type {
  ApplicationBoardColumn,
  ApplicationResult,
  ApplicationStatus,
  Job,
} from '@/types/job';

type ApplicationStatusOption =
  | '지원 전'
  | '지원 완료'
  | '서류 합격'
  | '서류 불합격'
  | '인적성 합격'
  | '인적성 불합격'
  | '1차 면접 합격'
  | '1차 면접 불합격'
  | '2차 면접 합격'
  | '2차 면접 불합격'
  | '최종 합격'
  | '최종 불합격'
  | '지원 포기';

type TimelineItemState = 'done' | 'current' | 'upcoming' | 'danger';

interface ApplicationsTabProps {
  job: Job;
  onStatusChange: (
    input: {
      boardColumn: ApplicationBoardColumn;
      detailedStatus: ApplicationStatus;
      applicationResult: ApplicationResult;
    },
  ) => void;
}

interface TimelineItem {
  label: string;
  description: string;
  state: TimelineItemState;
}

const statusOptions: ApplicationStatusOption[] = [
  '지원 전',
  '지원 완료',
  '서류 합격',
  '서류 불합격',
  '인적성 합격',
  '인적성 불합격',
  '1차 면접 합격',
  '1차 면접 불합격',
  '2차 면접 합격',
  '2차 면접 불합격',
  '최종 합격',
  '최종 불합격',
  '지원 포기',
];

const optionToStatus: Record<
  ApplicationStatusOption,
  {
    detailedStatus: ApplicationStatus;
    boardColumn: ApplicationBoardColumn;
    applicationResult: ApplicationResult;
  }
> = {
  '지원 전': {
    detailedStatus: '지원전',
    boardColumn: '관심',
    applicationResult: '미정',
  },
  '지원 완료': {
    detailedStatus: '지원중',
    boardColumn: '제출 완료',
    applicationResult: '미정',
  },
  '서류 합격': {
    detailedStatus: '서류합격',
    boardColumn: '전형 진행',
    applicationResult: '미정',
  },
  '서류 불합격': {
    detailedStatus: '서류불합격',
    boardColumn: '최종 결과',
    applicationResult: '서류불합격',
  },
  '인적성 합격': {
    detailedStatus: '인적성합격',
    boardColumn: '전형 진행',
    applicationResult: '미정',
  },
  '인적성 불합격': {
    detailedStatus: '인적성불합격',
    boardColumn: '최종 결과',
    applicationResult: '인적성불합격',
  },
  '1차 면접 합격': {
    detailedStatus: '1차면접합격',
    boardColumn: '전형 진행',
    applicationResult: '미정',
  },
  '1차 면접 불합격': {
    detailedStatus: '1차면접불합격',
    boardColumn: '최종 결과',
    applicationResult: '1차면접불합격',
  },
  '2차 면접 합격': {
    detailedStatus: '2차면접합격',
    boardColumn: '전형 진행',
    applicationResult: '미정',
  },
  '2차 면접 불합격': {
    detailedStatus: '2차면접불합격',
    boardColumn: '최종 결과',
    applicationResult: '2차면접불합격',
  },
  '최종 합격': {
    detailedStatus: '최종합격',
    boardColumn: '최종 결과',
    applicationResult: '최종합격',
  },
  '최종 불합격': {
    detailedStatus: '최종불합격',
    boardColumn: '최종 결과',
    applicationResult: '최종불합격',
  },
  '지원 포기': {
    detailedStatus: '지원포기',
    boardColumn: '최종 결과',
    applicationResult: '지원포기',
  },
};

function ApplicationsTab({ job, onStatusChange }: ApplicationsTabProps) {
  const selectedOption = getStatusOption(job.detailedStatus, job.boardColumn);
  const summary = getApplicationSummary(job);
  const timeline = getTimelineItems(job);

  return (
    <div className="grid gap-4 lg:h-full lg:grid-rows-[auto_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>지원현황</CardTitle>
          <CardDescription>
            현재 위치와 다음 단계를 Timeline으로 확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryItem label="현재 지원 상태" value={summary.currentStatus} />
            <SummaryItem label="현재 단계" value={summary.currentStep} />
            <SummaryItem label="다음 단계" value={summary.nextStep} />
            <SummaryItem label="지원 결과" value={summary.result} />
          </div>

          <div className="mt-4">
            <Select
              label="지원 상태 변경"
              id="application-status"
              value={selectedOption}
              onChange={(event) => {
                const nextStatus = event.target.value as ApplicationStatusOption;
                onStatusChange(optionToStatus[nextStatus]);
              }}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-0 overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle>Timeline</CardTitle>
          <CardDescription>완료, 현재, 예정 단계를 구분합니다.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto pr-1">
          <ol className="grid gap-3">
            {timeline.map((item, index) => (
              <TimelineListItem
                key={`${item.label}-${index}`}
                item={item}
                isLast={index === timeline.length - 1}
              />
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-background p-4">
      <Typography variant="caption" tone="secondary">
        {label}
      </Typography>
      <Typography variant="small" className="mt-2 font-semibold">
        {value}
      </Typography>
    </div>
  );
}

function TimelineListItem({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  const Icon =
    item.state === 'done'
      ? CheckCircle2
      : item.state === 'current'
        ? CircleDot
        : item.state === 'danger'
          ? XCircle
          : Circle;

  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-[var(--radius-badge)]',
            item.state === 'done' && 'bg-success/10 text-success',
            item.state === 'current' && 'bg-primary/10 text-primary',
            item.state === 'upcoming' && 'bg-muted text-text-secondary',
            item.state === 'danger' && 'bg-danger/10 text-danger',
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        {!isLast ? <span className="min-h-8 w-px flex-1 bg-border" /> : null}
      </div>

      <div
        className={cn(
          'rounded-[var(--radius-card)] border border-border p-4',
          item.state === 'current' && 'border-primary/30 bg-primary/10',
          item.state === 'done' && 'border-success/30 bg-success/10',
          item.state === 'danger' && 'border-danger/30 bg-danger/10',
          item.state === 'upcoming' && 'bg-background',
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Typography variant="small" className="font-semibold">
            {item.label}
          </Typography>
          <Badge variant={getTimelineBadgeVariant(item.state)}>
            {getTimelineStateLabel(item.state)}
          </Badge>
        </div>
        <Typography variant="caption" tone="secondary" className="mt-2 block">
          {item.description}
        </Typography>
      </div>
    </li>
  );
}

function getTimelineBadgeVariant(state: TimelineItemState) {
  if (state === 'done') {
    return 'success';
  }

  if (state === 'current') {
    return 'primary';
  }

  if (state === 'danger') {
    return 'danger';
  }

  return 'default';
}

function getTimelineStateLabel(state: TimelineItemState) {
  if (state === 'done') {
    return '완료';
  }

  if (state === 'current') {
    return '현재';
  }

  if (state === 'danger') {
    return '종료';
  }

  return '예정';
}

function getApplicationSummary(job: Job) {
  const selectedOption = getStatusOption(job.detailedStatus, job.boardColumn);
  const terminalStatus = isTerminalStatus(job.detailedStatus);

  return {
    currentStatus: selectedOption,
    currentStep: getCurrentStep(job.detailedStatus, job.boardColumn),
    nextStep: terminalStatus ? '없음' : getNextStep(job.detailedStatus, job.boardColumn),
    result: getResultLabel(job),
  };
}

function getTimelineItems(job: Job): TimelineItem[] {
  const status = job.detailedStatus;

  if (status === '지원전') {
    return [
      createCurrentItem('지원 전', '아직 지원을 완료하지 않았습니다.'),
      createUpcomingItem('지원 완료', '지원서를 제출하면 다음 단계로 이동합니다.'),
      createUpcomingItem('서류 발표 예정', '서류 결과를 기다립니다.'),
      createUpcomingItem('인적성 예정', '필요 시 인적성을 준비합니다.'),
      createUpcomingItem('1차 면접 예정', '면접 준비 단계입니다.'),
      createUpcomingItem('2차 면접 예정', '후속 면접이 있을 수 있습니다.'),
      createUpcomingItem('최종 발표 예정', '최종 결과를 기다립니다.'),
    ];
  }

  if (isFailureStatus(status) || status === '지원포기') {
    const completedItems = getCompletedItemsBeforeTerminal(status);
    return [
      ...completedItems,
      {
        label: getStatusOption(status, job.boardColumn),
        description:
          status === '지원포기'
            ? '사용자가 지원을 포기했습니다.'
            : '전형이 불합격으로 종료되었습니다.',
        state: 'danger',
      },
    ];
  }

  if (status === '최종합격') {
    return [
      createDoneItem('지원 완료'),
      createDoneItem('서류 합격'),
      createDoneItem('인적성 합격'),
      createDoneItem('1차 면접 합격'),
      createDoneItem('2차 면접 합격'),
      createDoneItem('최종 합격'),
    ];
  }

  const passedCount = getPassedStepCount(status);
  const steps = [
    '지원 완료',
    '서류 합격',
    '인적성 합격',
    '1차 면접 합격',
    '2차 면접 합격',
  ];
  const upcoming = [
    '서류 발표 예정',
    '인적성 예정',
    '1차 면접 진행 중',
    '2차 면접 예정',
    '최종 발표 예정',
  ];
  const currentIndex = Math.max(passedCount - 1, 0);

  return [
    ...steps.slice(0, passedCount).map(createDoneItem),
    createCurrentItem(upcoming[currentIndex], '현재 준비하거나 기다리는 단계입니다.'),
    ...upcoming.slice(currentIndex + 1).map((label) =>
      createUpcomingItem(label, '이전 단계 완료 후 진행합니다.'),
    ),
  ];
}

function getCompletedItemsBeforeTerminal(status: ApplicationStatus) {
  if (status === '서류불합격') {
    return [createDoneItem('지원 완료')];
  }

  if (status === '인적성불합격') {
    return [createDoneItem('지원 완료'), createDoneItem('서류 합격')];
  }

  if (status === '1차면접불합격') {
    return [
      createDoneItem('지원 완료'),
      createDoneItem('서류 합격'),
      createDoneItem('인적성 합격'),
    ];
  }

  if (status === '2차면접불합격') {
    return [
      createDoneItem('지원 완료'),
      createDoneItem('서류 합격'),
      createDoneItem('인적성 합격'),
      createDoneItem('1차 면접 합격'),
    ];
  }

  if (status === '최종불합격') {
    return [
      createDoneItem('지원 완료'),
      createDoneItem('서류 합격'),
      createDoneItem('인적성 합격'),
      createDoneItem('1차 면접 합격'),
      createDoneItem('2차 면접 합격'),
    ];
  }

  if (status === '지원포기') {
    return [];
  }

  return [];
}

function getPassedStepCount(status: ApplicationStatus) {
  const passedCount: Record<ApplicationStatus, number> = {
    지원전: 0,
    지원중: 1,
    서류합격: 2,
    서류불합격: 1,
    인적성합격: 3,
    인적성불합격: 2,
    '1차면접합격': 4,
    '1차면접불합격': 3,
    '2차면접합격': 5,
    '2차면접불합격': 4,
    최종합격: 6,
    최종불합격: 5,
    지원포기: 0,
  };

  return passedCount[status];
}

function getStatusOption(
  detailedStatus: ApplicationStatus,
  boardColumn: ApplicationBoardColumn,
): ApplicationStatusOption {
  if (detailedStatus === '지원중' && boardColumn === '제출 완료') {
    return '지원 완료';
  }

  const statusMap: Record<ApplicationStatus, ApplicationStatusOption> = {
    지원전: '지원 전',
    지원중: '지원 완료',
    서류합격: '서류 합격',
    서류불합격: '서류 불합격',
    인적성합격: '인적성 합격',
    인적성불합격: '인적성 불합격',
    '1차면접합격': '1차 면접 합격',
    '1차면접불합격': '1차 면접 불합격',
    '2차면접합격': '2차 면접 합격',
    '2차면접불합격': '2차 면접 불합격',
    최종합격: '최종 합격',
    최종불합격: '최종 불합격',
    지원포기: '지원 포기',
  };

  return statusMap[detailedStatus];
}

function getCurrentStep(
  detailedStatus: ApplicationStatus,
  boardColumn: ApplicationBoardColumn,
) {
  if (isTerminalStatus(detailedStatus)) {
    return getStatusOption(detailedStatus, boardColumn);
  }

  const currentStepMap: Record<ApplicationStatus, string> = {
    지원전: '지원 전',
    지원중: '서류 발표 대기',
    서류합격: '인적성 진행 중',
    서류불합격: '서류 불합격',
    인적성합격: '1차 면접 진행 중',
    인적성불합격: '인적성 불합격',
    '1차면접합격': '2차 면접 진행 중',
    '1차면접불합격': '1차 면접 불합격',
    '2차면접합격': '최종 발표 예정',
    '2차면접불합격': '2차 면접 불합격',
    최종합격: '최종 합격',
    최종불합격: '최종 불합격',
    지원포기: '지원 포기',
  };

  return currentStepMap[detailedStatus];
}

function getNextStep(
  detailedStatus: ApplicationStatus,
  boardColumn: ApplicationBoardColumn,
) {
  if (boardColumn === '관심') {
    return '지원 완료';
  }

  const nextStepMap: Record<ApplicationStatus, string> = {
    지원전: '지원 완료',
    지원중: '서류 발표',
    서류합격: '인적성',
    서류불합격: '없음',
    인적성합격: '1차 면접',
    인적성불합격: '없음',
    '1차면접합격': '2차 면접',
    '1차면접불합격': '없음',
    '2차면접합격': '최종 발표',
    '2차면접불합격': '없음',
    최종합격: '없음',
    최종불합격: '없음',
    지원포기: '없음',
  };

  return nextStepMap[detailedStatus];
}

function getResultLabel(job: Job) {
  if (job.applicationResult === '미정') {
    return isTerminalStatus(job.detailedStatus)
      ? getStatusOption(job.detailedStatus, job.boardColumn)
      : '진행 중';
  }

  return getApplicationResultLabel(job.applicationResult);
}

function getApplicationResultLabel(result: ApplicationResult) {
  const resultMap: Record<ApplicationResult, string> = {
    미정: '진행 중',
    서류합격: '서류 합격',
    서류불합격: '서류 불합격',
    인적성합격: '인적성 합격',
    인적성불합격: '인적성 불합격',
    '1차면접합격': '1차 면접 합격',
    '1차면접불합격': '1차 면접 불합격',
    '2차면접합격': '2차 면접 합격',
    '2차면접불합격': '2차 면접 불합격',
    최종합격: '최종 합격',
    최종불합격: '최종 불합격',
    지원포기: '지원 포기',
  };

  return resultMap[result];
}

function isTerminalStatus(status: ApplicationStatus) {
  return isFailureStatus(status) || status === '최종합격' || status === '지원포기';
}

function isFailureStatus(status: ApplicationStatus) {
  return status.endsWith('불합격') || status === '최종불합격';
}

function createDoneItem(label: string): TimelineItem {
  return {
    label,
    description: '완료된 단계입니다.',
    state: 'done',
  };
}

function createCurrentItem(label: string, description: string): TimelineItem {
  return {
    label,
    description,
    state: 'current',
  };
}

function createUpcomingItem(label: string, description: string): TimelineItem {
  return {
    label,
    description,
    state: 'upcoming',
  };
}

export { ApplicationsTab };
