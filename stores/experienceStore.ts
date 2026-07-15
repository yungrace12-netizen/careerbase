import { create } from 'zustand';

import {
  experienceRepository,
  type ExperienceSearchFilters,
} from '@/repositories/experienceRepository';
import type {
  CreateExperienceInput,
  Experience,
  UpdateExperienceInput,
} from '@/types/essay';
import type { EntityId, Job } from '@/types/job';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface ExperienceSaveStatus {
  state: SaveState;
  savedAt: string | null;
}

interface ExperienceStore {
  experiences: Experience[];
  filteredExperiences: Experience[];
  jobs: Job[];
  query: string;
  selectedTag: string;
  selectedJobId: string;
  saveStatuses: Record<EntityId, ExperienceSaveStatus>;
  loadExperiences: () => void;
  createExperience: (input: CreateExperienceInput) => Experience;
  updateExperience: (id: EntityId, input: UpdateExperienceInput) => void;
  deleteExperience: (id: EntityId) => void;
  search: (query: string) => void;
  setTagFilter: (tag: string) => void;
  setJobFilter: (jobId: string) => void;
  resetFilters: () => void;
  saveExperience: (id: EntityId, input: UpdateExperienceInput) => void;
}

const defaultSaveStatus: ExperienceSaveStatus = {
  state: 'idle',
  savedAt: null,
};

function loadData(filters: ExperienceSearchFilters = {}) {
  return {
    experiences: experienceRepository.getExperiences(),
    filteredExperiences: experienceRepository.searchExperiences(filters),
    jobs: experienceRepository.getJobsForExperienceLinks(),
  };
}

function currentFilters(state: ExperienceStore): ExperienceSearchFilters {
  return {
    query: state.query,
    tag: state.selectedTag,
    jobId: state.selectedJobId,
  };
}

export const useExperienceStore = create<ExperienceStore>((set) => ({
  experiences: [],
  filteredExperiences: [],
  jobs: [],
  query: '',
  selectedTag: '',
  selectedJobId: '',
  saveStatuses: {},
  loadExperiences: () => {
    set((state) => ({
      ...loadData(currentFilters(state)),
    }));
  },
  createExperience: (input) => {
    const experience = experienceRepository.createExperience(input);
    set((state) => ({
      ...loadData(currentFilters(state)),
    }));
    return experience;
  },
  updateExperience: (id, input) => {
    experienceRepository.updateExperience(id, input);
    set((state) => ({
      ...loadData(currentFilters(state)),
    }));
  },
  deleteExperience: (id) => {
    experienceRepository.deleteExperience(id);
    set((state) => {
      const saveStatuses = { ...state.saveStatuses };
      delete saveStatuses[id];

      return {
        ...loadData(currentFilters(state)),
        saveStatuses,
      };
    });
  },
  search: (query) => {
    set((state) => ({
      query,
      filteredExperiences: experienceRepository.searchExperiences({
        ...currentFilters(state),
        query,
      }),
    }));
  },
  setTagFilter: (tag) => {
    set((state) => ({
      selectedTag: tag,
      filteredExperiences: experienceRepository.searchExperiences({
        ...currentFilters(state),
        tag,
      }),
    }));
  },
  setJobFilter: (jobId) => {
    set((state) => ({
      selectedJobId: jobId,
      filteredExperiences: experienceRepository.searchExperiences({
        ...currentFilters(state),
        jobId,
      }),
    }));
  },
  resetFilters: () => {
    set({
      query: '',
      selectedTag: '',
      selectedJobId: '',
      filteredExperiences: experienceRepository.getExperiences(),
    });
  },
  saveExperience: (id, input) => {
    set((state) => ({
      saveStatuses: {
        ...state.saveStatuses,
        [id]: {
          ...defaultSaveStatus,
          ...state.saveStatuses[id],
          state: 'saving',
        },
      },
    }));

    try {
      const updatedExperience = experienceRepository.updateExperience(id, input);
      const savedAt = updatedExperience?.updatedAt ?? new Date().toISOString();

      set((state) => ({
        ...loadData(currentFilters(state)),
        saveStatuses: {
          ...state.saveStatuses,
          [id]: {
            state: 'saved',
            savedAt,
          },
        },
      }));
    } catch {
      set((state) => ({
        saveStatuses: {
          ...state.saveStatuses,
          [id]: {
            ...defaultSaveStatus,
            ...state.saveStatuses[id],
            state: 'error',
          },
        },
      }));
    }
  },
}));

export type { ExperienceSaveStatus, SaveState };
