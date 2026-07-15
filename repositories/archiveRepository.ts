import { readData } from '@/repositories/careerbaseStorage';
import { jobRepository } from '@/repositories/jobRepository';
import type { ApplicationResult, EntityId, Job } from '@/types/job';

export type ArchiveStatusFilter =
  | '전체'
  | '최종 합격'
  | '최종 불합격'
  | '지원 포기'
  | '보관중';

export interface ArchiveFilters {
  query: string;
  year: string;
  status: ArchiveStatusFilter;
}

export interface ArchiveStats {
  totalApplications: number;
  finalPassed: number;
  finalFailed: number;
  abandoned: number;
  archived: number;
}

function sortArchivedJobs(jobs: Job[]) {
  return [...jobs].sort((a, b) => {
    const archivedCompare = (b.archivedAt ?? '').localeCompare(a.archivedAt ?? '');

    if (archivedCompare !== 0) {
      return archivedCompare;
    }

    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

function getArchivedJobs(): Job[] {
  return sortArchivedJobs(readData().jobs.filter((job) => job.isArchived));
}

function getArchiveYears(): string[] {
  return Array.from(
    new Set(
      getArchivedJobs()
        .map((job) => archiveYear(job))
        .filter((year): year is string => Boolean(year)),
    ),
  ).sort((a, b) => b.localeCompare(a));
}

function getArchiveStats(): ArchiveStats {
  const data = readData();
  const jobs = data.jobs;

  return {
    totalApplications: jobs.length,
    finalPassed: jobs.filter((job) => job.applicationResult === '최종합격').length,
    finalFailed: jobs.filter((job) => job.applicationResult === '최종불합격')
      .length,
    abandoned: jobs.filter((job) => job.applicationResult === '지원포기').length,
    archived: jobs.filter((job) => job.isArchived).length,
  };
}

function searchArchivedJobs(filters: ArchiveFilters): Job[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return getArchivedJobs().filter((job) => {
    const matchesQuery = query
      ? [job.companyName, job.postingTitle, job.position]
          .join(' ')
          .toLocaleLowerCase()
          .includes(query)
      : true;
    const matchesYear = filters.year
      ? archiveYear(job) === filters.year
      : true;
    const matchesStatus = statusMatches(job, filters.status);

    return matchesQuery && matchesYear && matchesStatus;
  });
}

function restoreJob(id: EntityId): Job | null {
  return jobRepository.restoreJob(id);
}

function permanentlyDeleteJob(id: EntityId): void {
  jobRepository.permanentlyDeleteJob(id);
}

function archiveYear(job: Job): string | null {
  const sourceDate = job.archivedAt ?? job.applicationEndDate ?? job.updatedAt;

  return sourceDate ? sourceDate.slice(0, 4) : null;
}

function statusMatches(job: Job, status: ArchiveStatusFilter) {
  if (status === '전체') {
    return true;
  }

  if (status === '보관중') {
    return job.isArchived;
  }

  return job.applicationResult === statusToApplicationResult(status);
}

function statusToApplicationResult(status: ArchiveStatusFilter): ApplicationResult {
  switch (status) {
    case '최종 합격':
      return '최종합격';
    case '최종 불합격':
      return '최종불합격';
    case '지원 포기':
      return '지원포기';
    case '전체':
    case '보관중':
      return '미정';
  }
}

export const archiveRepository = {
  getArchivedJobs,
  getArchiveYears,
  getArchiveStats,
  searchArchivedJobs,
  restoreJob,
  permanentlyDeleteJob,
};
