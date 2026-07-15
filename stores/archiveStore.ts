import { create } from 'zustand';

import {
  archiveRepository,
  type ArchiveFilters,
  type ArchiveStats,
  type ArchiveStatusFilter,
} from '@/repositories/archiveRepository';
import type { EntityId, Job } from '@/types/job';

interface ArchiveStore {
  archivedJobs: Job[];
  filteredJobs: Job[];
  years: string[];
  stats: ArchiveStats;
  filters: ArchiveFilters;
  loadArchive: () => void;
  setQuery: (query: string) => void;
  setYearFilter: (year: string) => void;
  setStatusFilter: (status: ArchiveStatusFilter) => void;
  resetFilters: () => void;
  restoreJob: (id: EntityId) => void;
  permanentlyDeleteJob: (id: EntityId) => void;
}

const defaultFilters: ArchiveFilters = {
  query: '',
  year: '',
  status: '전체',
};

const defaultStats: ArchiveStats = {
  totalApplications: 0,
  finalPassed: 0,
  finalFailed: 0,
  abandoned: 0,
  archived: 0,
};

function loadArchiveData(filters: ArchiveFilters) {
  return {
    archivedJobs: archiveRepository.getArchivedJobs(),
    filteredJobs: archiveRepository.searchArchivedJobs(filters),
    years: archiveRepository.getArchiveYears(),
    stats: archiveRepository.getArchiveStats(),
  };
}

export const useArchiveStore = create<ArchiveStore>((set, get) => ({
  archivedJobs: [],
  filteredJobs: [],
  years: [],
  stats: defaultStats,
  filters: defaultFilters,
  loadArchive: () => {
    set(loadArchiveData(get().filters));
  },
  setQuery: (query) => {
    set((state) => {
      const filters = { ...state.filters, query };

      return {
        filters,
        ...loadArchiveData(filters),
      };
    });
  },
  setYearFilter: (year) => {
    set((state) => {
      const filters = { ...state.filters, year };

      return {
        filters,
        ...loadArchiveData(filters),
      };
    });
  },
  setStatusFilter: (status) => {
    set((state) => {
      const filters = { ...state.filters, status };

      return {
        filters,
        ...loadArchiveData(filters),
      };
    });
  },
  resetFilters: () => {
    set({
      filters: defaultFilters,
      ...loadArchiveData(defaultFilters),
    });
  },
  restoreJob: (id) => {
    archiveRepository.restoreJob(id);
    set((state) => loadArchiveData(state.filters));
  },
  permanentlyDeleteJob: (id) => {
    archiveRepository.permanentlyDeleteJob(id);
    set((state) => loadArchiveData(state.filters));
  },
}));

export type { ArchiveStatusFilter };
