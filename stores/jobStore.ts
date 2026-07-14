import { create } from 'zustand';

import { jobRepository } from '@/repositories/jobRepository';
import type { CreateJobInput, EntityId, Job, UpdateJobInput } from '@/types/job';

interface JobStore {
  jobs: Job[];
  loadJobs: () => void;
  createJob: (input: CreateJobInput) => void;
  updateJob: (id: EntityId, input: UpdateJobInput) => void;
  archiveJob: (id: EntityId) => void;
  restoreJob: (id: EntityId) => void;
  permanentlyDeleteJob: (id: EntityId) => void;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  loadJobs: () => {
    set({ jobs: jobRepository.getJobs() });
  },
  createJob: (input) => {
    jobRepository.createJob(input);
    set({ jobs: jobRepository.getJobs() });
  },
  updateJob: (id, input) => {
    jobRepository.updateJob(id, input);
    set({ jobs: jobRepository.getJobs() });
  },
  archiveJob: (id) => {
    jobRepository.archiveJob(id);
    set({ jobs: jobRepository.getJobs() });
  },
  restoreJob: (id) => {
    jobRepository.restoreJob(id);
    set({ jobs: jobRepository.getJobs() });
  },
  permanentlyDeleteJob: (id) => {
    jobRepository.permanentlyDeleteJob(id);
    set({ jobs: jobRepository.getJobs() });
  },
}));
