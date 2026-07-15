import type { CareerBaseData } from '@/types/careerbase-data';
import type {
  ApplicationBoardColumn,
  ApplicationResult,
  ApplicationStatus,
  CreateJobInput,
  EntityId,
  Job,
  UpdateJobInput,
} from '@/types/job';

const STORAGE_KEY = 'careerbase_data';
const SCHEMA_VERSION = '1.0.0';

function createInitialData(now = new Date().toISOString()): CareerBaseData {
  return {
    schemaVersion: SCHEMA_VERSION,
    initializedAt: now,
    lastUpdatedAt: now,
    onboarding: {
      isCompleted: false,
      selectedMode: null,
      completedAt: null,
    },
    jobs: [],
    schedules: [],
    essays: [],
    interviews: [],
    profile: {
      personalInfo: {
        name: '',
        birthDate: null,
        address: '',
        englishAddress: '',
        profilePhotoFileName: '',
        profilePhotoLocation: '',
        desiredSalary: null,
        salaryCurrency: 'KRW',
        updatedAt: now,
      },
      highSchools: [],
      universities: [],
      careers: [],
      languages: [],
      certificates: [],
      awards: [],
      activities: [],
      otherInfo: {
        hobby: '',
        specialty: '',
        updatedAt: now,
      },
      updatedAt: now,
    },
    experiences: [],
    todos: [],
    notes: [],
    attachments: [],
    settings: {
      theme: 'light',
      sidebarCollapsed: false,
      autoSaveDelayMs: 1000,
      automaticTodoDaysBeforeDeadline: 3,
      lastBackupAt: null,
      updatedAt: now,
    },
  };
}

function readData(): CareerBaseData {
  if (typeof window === 'undefined') {
    return createInitialData();
  }

  const rawData = window.localStorage.getItem(STORAGE_KEY);

  if (!rawData) {
    const initialData = createInitialData();
    writeData(initialData);
    return initialData;
  }

  try {
    const parsedData = JSON.parse(rawData) as CareerBaseData;

    if (!Array.isArray(parsedData.jobs)) {
      const initialData = createInitialData();
      writeData(initialData);
      return initialData;
    }

    return parsedData;
  } catch {
    const initialData = createInitialData();
    writeData(initialData);
    return initialData;
  }
}

function writeData(data: CareerBaseData) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

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

  const nextData: CareerBaseData = {
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

  writeData({
    ...data,
    jobs: data.jobs.filter((job) => job.id !== id),
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
  getJobs,
};

export { STORAGE_KEY };
