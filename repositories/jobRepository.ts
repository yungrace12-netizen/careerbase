import { readData, STORAGE_KEY, writeData } from '@/repositories/careerbaseStorage';
import type {
  ApplicationBoardColumn,
  ApplicationResult,
  ApplicationStatus,
  CreateJobInput,
  EntityId,
  Job,
  UpdateJobInput,
} from '@/types/job';

function sortJobsByDeadline(jobs: Job[]) {
  return [...jobs].sort((a, b) => {
    if (!a.applicationEndDate && !b.applicationEndDate) {
      return b.updatedAt.localeCompare(a.updatedAt);
    }

    if (!a.applicationEndDate) {
      return 1;
    }

    if (!b.applicationEndDate) {
      return -1;
    }

    return a.applicationEndDate.localeCompare(b.applicationEndDate);
  });
}

function getJobs(): Job[] {
  return sortJobsByDeadline(
    readData().jobs.filter((job) => !job.isArchived),
  );
}

function getAllJobs(): Job[] {
  return sortJobsByDeadline(readData().jobs);
}

function getJob(id: EntityId): Job | null {
  return readData().jobs.find((job) => job.id === id) ?? null;
}

function createJob(input: CreateJobInput): Job {
  const data = readData();
  const now = new Date().toISOString();
  const job: Job = {
    id: crypto.randomUUID(),
    ...input,
    boardColumn: '관심',
    detailedStatus: '지원전',
    applicationResult: '미정',
    isArchived: false,
    archivedAt: null,
    isSample: false,
    createdAt: now,
    updatedAt: now,
  };

  const nextData = {
    ...data,
    jobs: [...data.jobs, job],
    lastUpdatedAt: now,
  };

  writeData(nextData);
  return job;
}

function updateJob(id: EntityId, input: UpdateJobInput): Job | null {
  const data = readData();
  const now = new Date().toISOString();
  let updatedJob: Job | null = null;

  const jobs = data.jobs.map((job) => {
    if (job.id !== id) {
      return job;
    }

    updatedJob = {
      ...job,
      ...input,
      updatedAt: now,
    };

    return updatedJob;
  });

  if (!updatedJob) {
    return null;
  }

  writeData({
    ...data,
    jobs,
    lastUpdatedAt: now,
  });

  return updatedJob;
}

function updateApplicationStatus(
  id: EntityId,
  input: {
    boardColumn: ApplicationBoardColumn;
    detailedStatus: ApplicationStatus;
    applicationResult: ApplicationResult;
  },
): Job | null {
  const data = readData();
  const now = new Date().toISOString();
  let updatedJob: Job | null = null;

  const jobs = data.jobs.map((job) => {
    if (job.id !== id) {
      return job;
    }

    updatedJob = {
      ...job,
      boardColumn: input.boardColumn,
      detailedStatus: input.detailedStatus,
      applicationResult: input.applicationResult,
      updatedAt: now,
    };

    return updatedJob;
  });

  if (!updatedJob) {
    return null;
  }

  writeData({
    ...data,
    jobs,
    lastUpdatedAt: now,
  });

  return updatedJob;
}

function archiveJob(id: EntityId): Job | null {
  const data = readData();
  const now = new Date().toISOString();
  let archivedJob: Job | null = null;

  const jobs = data.jobs.map((job) => {
    if (job.id !== id) {
      return job;
    }

    archivedJob = {
      ...job,
      isArchived: true,
      archivedAt: now,
      updatedAt: now,
    };

    return archivedJob;
  });

  if (!archivedJob) {
    return null;
  }

  writeData({
    ...data,
    jobs,
    lastUpdatedAt: now,
  });

  return archivedJob;
}

function restoreJob(id: EntityId): Job | null {
  const data = readData();
  const now = new Date().toISOString();
  let restoredJob: Job | null = null;

  const jobs = data.jobs.map((job) => {
    if (job.id !== id) {
      return job;
    }

    restoredJob = {
      ...job,
      isArchived: false,
      archivedAt: null,
      updatedAt: now,
    };

    return restoredJob;
  });

  if (!restoredJob) {
    return null;
  }

  writeData({
    ...data,
    jobs,
    lastUpdatedAt: now,
  });

  return restoredJob;
}

function permanentlyDeleteJob(id: EntityId): void {
  const data = readData();
  const now = new Date().toISOString();
  const deletedEssayIds = new Set(
    data.essays.filter((essay) => essay.jobId === id).map((essay) => essay.id),
  );
  const withoutJobReferences = <T>(items: T[]) =>
    items.filter((item) => {
      if (!item || typeof item !== 'object') {
        return true;
      }

      return (item as { jobId?: EntityId | null }).jobId !== id;
    });

  writeData({
    ...data,
    jobs: data.jobs.filter((job) => job.id !== id),
    essays: data.essays.filter((essay) => essay.jobId !== id),
    interviews: data.interviews.filter((stage) => stage.jobId !== id),
    experiences: data.experiences.map((experience) => ({
      ...experience,
      relatedJobIds: experience.relatedJobIds.filter((jobId) => jobId !== id),
      updatedAt: experience.relatedJobIds.includes(id)
        ? now
        : experience.updatedAt,
    })),
    attachments: data.attachments.filter(
      (attachment) =>
        attachment.jobId !== id &&
        (!attachment.essayId || !deletedEssayIds.has(attachment.essayId)),
    ),
    schedules: withoutJobReferences(data.schedules),
    todos: withoutJobReferences(
      data.todos as unknown as Array<Record<string, unknown>>,
    ) as typeof data.todos,
    notes: withoutJobReferences(
      data.notes as unknown as Array<Record<string, unknown>>,
    ) as typeof data.notes,
    lastUpdatedAt: now,
  });
}

export const jobRepository = {
  createJob,
  updateJob,
  updateApplicationStatus,
  archiveJob,
  restoreJob,
  permanentlyDeleteJob,
  getJob,
  getAllJobs,
  getJobs,
};

export { STORAGE_KEY };
