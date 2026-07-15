import { create } from 'zustand';

import { jobRepository } from '@/repositories/jobRepository';
import type {
  ApplicationBoardColumn,
  ApplicationResult,
  ApplicationStatus,
  CreateJobInput,
  EntityId,
  Job,
  UpdateJobInput,
} from '@/types/job';

interface JobStore {
  jobs: Job[];
  allJobs: Job[];
  loadJobs: () => void;
  loadAllJobs: () => void;
  createJob: (input: CreateJobInput) => void;
  updateJob: (id: EntityId, input: UpdateJobInput) => void;
  updateApplicationStatus: (
    id: EntityId,
    input: {
      boardColumn: ApplicationBoardColumn;
      detailedStatus: ApplicationStatus;
      applicationResult: ApplicationResult;
    },
  ) => void;
  archiveJob: (id: EntityId) => void;
  restoreJob: (id: EntityId) => void;
  permanentlyDeleteJob: (id: EntityId) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  allJobs: [],
  loadJobs: () => {
    set({ jobs: jobRepository.getJobs() });
  },
  loadAllJobs: () => {
    set({
      jobs: jobRepository.getJobs(),
      allJobs: jobRepository.getAllJobs(),
    });
  },
  createJob: (input) => {
    jobRepository.createJob(input);
    set({
      jobs: jobRepository.getJobs(),
      allJobs: jobRepository.getAllJobs(),
    });
  },
  updateJob: (id, input) => {
    jobRepository.updateJob(id, input);
    set({
      jobs: jobRepository.getJobs(),
      allJobs: jobRepository.getAllJobs(),
    });
  },
  updateApplicationStatus: (id, input) => {
    jobRepository.updateApplicationStatus(id, input);
    set({
      jobs: jobRepository.getJobs(),
      allJobs: jobRepository.getAllJobs(),
    });
  },
  archiveJob: (id) => {
    jobRepository.archiveJob(id);
    set({
      jobs: jobRepository.getJobs(),
      allJobs: jobRepository.getAllJobs(),
    });
  },
  restoreJob: (id) => {
    jobRepository.restoreJob(id);
    set({
      jobs: jobRepository.getJobs(),
      allJobs: jobRepository.getAllJobs(),
    });
  },
  permanentlyDeleteJob: (id) => {
    jobRepository.permanentlyDeleteJob(id);
    set({
      jobs: jobRepository.getJobs(),
      allJobs: jobRepository.getAllJobs(),
    });
  },
}));
