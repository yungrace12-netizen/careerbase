import { readData } from '@/repositories/careerbaseStorage';
import {
  createDdayInfo,
  getScheduleTimelineOrder,
  type CalendarSchedule,
  type CalendarSchedulePrecision,
  type CalendarScheduleType,
} from '@/features/calendar/calendar-data';
import type { InterviewStage } from '@/types/interview';
import type { Job } from '@/types/job';
import type { Schedule, ScheduleType } from '@/types/schedule';

function getCalendarSchedules(): CalendarSchedule[] {
  const data = readData();
  const activeJobs = data.jobs.filter((job) => !job.isArchived);
  const activeJobIds = new Set(activeJobs.map((job) => job.id));
  const jobsById = new Map(activeJobs.map((job) => [job.id, job]));
  const schedulesById = new Map(data.schedules.map((schedule) => [schedule.id, schedule]));
  const generatedSchedules = [
    ...activeJobs.flatMap(jobToCalendarSchedules),
    ...data.schedules
      .filter((schedule) => activeJobIds.has(schedule.jobId))
      .map((schedule) =>
        sourceScheduleToCalendarSchedule(schedule, jobsById.get(schedule.jobId)),
      )
      .filter((schedule): schedule is CalendarSchedule => Boolean(schedule)),
    ...data.interviews
      .filter((stage) => activeJobIds.has(stage.jobId))
      .map((stage) =>
        interviewStageToCalendarSchedule(
          stage,
          jobsById.get(stage.jobId),
          schedulesById.get(stage.scheduleId ?? ''),
        ),
      )
      .filter((schedule): schedule is CalendarSchedule => Boolean(schedule)),
  ];

  return sortCalendarSchedules(dedupeSchedules(generatedSchedules));
}

function getCalendarSchedulesByJobId(jobId: string): CalendarSchedule[] {
  const data = readData();
  const job = data.jobs.find((item) => item.id === jobId);

  if (!job) {
    return [];
  }

  const schedulesById = new Map(
    data.schedules.map((schedule) => [schedule.id, schedule]),
  );
  const generatedSchedules = [
    ...jobToCalendarSchedules(job),
    ...data.schedules
      .filter((schedule) => schedule.jobId === jobId)
      .map((schedule) => sourceScheduleToCalendarSchedule(schedule, job))
      .filter((schedule): schedule is CalendarSchedule => Boolean(schedule)),
    ...data.interviews
      .filter((stage) => stage.jobId === jobId)
      .map((stage) =>
        interviewStageToCalendarSchedule(
          stage,
          job,
          schedulesById.get(stage.scheduleId ?? ''),
        ),
      )
      .filter((schedule): schedule is CalendarSchedule => Boolean(schedule)),
  ];

  return sortCalendarSchedulesByProgress(dedupeSchedules(generatedSchedules));
}

function jobToCalendarSchedules(job: Job): CalendarSchedule[] {
  const schedules: CalendarSchedule[] = [];

  if (job.applicationStartDate) {
    schedules.push(
      buildCalendarSchedule({
        id: `job-${job.id}-application-start`,
        job,
        type: '지원 시작',
        date: job.applicationStartDate,
        time: job.applicationStartTime,
        precision: 'exact',
      }),
    );
  }

  if (job.applicationEndDate) {
    schedules.push(
      buildCalendarSchedule({
        id: `job-${job.id}-application-end`,
        job,
        type: '지원 마감',
        date: job.applicationEndDate,
        time: job.applicationEndTime,
        precision: 'exact',
      }),
    );
  }

  return schedules;
}

function sourceScheduleToCalendarSchedule(
  schedule: Schedule,
  job: Job | undefined,
): CalendarSchedule | null {
  if (!job) {
    return null;
  }

  return buildCalendarSchedule({
    id: `schedule-${schedule.id}`,
    job,
    type: normalizeScheduleType(schedule.type),
    date: schedule.exactDate,
    time: schedule.exactTime,
    precision: schedule.precision,
    approximateText: schedule.approximateText,
  });
}

function interviewStageToCalendarSchedule(
  stage: InterviewStage,
  job: Job | undefined,
  schedule: Schedule | undefined,
): CalendarSchedule | null {
  if (!job || !schedule) {
    return null;
  }

  return buildCalendarSchedule({
    id: `interview-${stage.id}-${schedule.id}`,
    job,
    type: normalizeInterviewType(stage.name, schedule.type),
    date: schedule.exactDate,
    time: schedule.exactTime,
    precision: schedule.precision,
    approximateText: schedule.approximateText,
  });
}

function buildCalendarSchedule({
  id,
  job,
  type,
  date,
  time,
  precision,
  approximateText,
}: {
  id: string;
  job: Job;
  type: CalendarScheduleType;
  date: string | null;
  time: string | null;
  precision: CalendarSchedulePrecision;
  approximateText?: string;
}): CalendarSchedule {
  const dDayInfo = date
    ? createDdayInfo(date)
    : { label: approximateText || '미정', isPast: false, isToday: false };

  return {
    id,
    jobId: job.id,
    companyName: job.companyName,
    postingTitle: job.postingTitle,
    position: job.position,
    type,
    precision,
    date,
    time: time ?? undefined,
    approximateText,
    dDayLabel: dDayInfo.label,
    isPast: dDayInfo.isPast,
    isToday: dDayInfo.isToday,
    isDanger: type === '지원 마감',
  };
}

function normalizeScheduleType(type: ScheduleType): CalendarScheduleType {
  if (type === '인적성') {
    return '인적성 발표';
  }

  if (type === '기타 면접') {
    return '기타 면접';
  }

  return type;
}

function normalizeInterviewType(
  stageName: string,
  scheduleType: ScheduleType,
): CalendarScheduleType {
  if (stageName.includes('1차') || scheduleType === '1차 면접') {
    return '1차 면접';
  }

  if (stageName.includes('2차') || scheduleType === '2차 면접') {
    return '2차 면접';
  }

  return '기타 면접';
}

function dedupeSchedules(schedules: CalendarSchedule[]) {
  const seen = new Set<string>();

  return schedules.filter((schedule) => {
    const key = [
      schedule.jobId,
      schedule.type,
      schedule.date ?? schedule.approximateText ?? '',
      schedule.time ?? '',
    ].join('|');

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function sortCalendarSchedules(schedules: CalendarSchedule[]) {
  return [...schedules].sort((a, b) => {
    if (!a.date && !b.date) {
      return a.companyName.localeCompare(b.companyName);
    }

    if (!a.date) {
      return 1;
    }

    if (!b.date) {
      return -1;
    }

    const dateCompare = a.date.localeCompare(b.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return (a.time ?? '').localeCompare(b.time ?? '');
  });
}

function sortCalendarSchedulesByProgress(schedules: CalendarSchedule[]) {
  return [...schedules].sort((a, b) => {
    const orderCompare =
      getScheduleTimelineOrder(a.type) - getScheduleTimelineOrder(b.type);

    if (orderCompare !== 0) {
      return orderCompare;
    }

    if (!a.date && !b.date) {
      return 0;
    }

    if (!a.date) {
      return 1;
    }

    if (!b.date) {
      return -1;
    }

    const dateCompare = a.date.localeCompare(b.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return (a.time ?? '').localeCompare(b.time ?? '');
  });
}

export const calendarRepository = {
  getCalendarSchedules,
  getCalendarSchedulesByJobId,
};
