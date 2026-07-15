import { create } from 'zustand';

import {
  searchCategories,
  searchRepository,
  type SearchFilter,
  type SearchResultsByCategory,
} from '@/repositories/searchRepository';

interface SearchStore {
  results: SearchResultsByCategory;
  search: (query: string, filter: SearchFilter) => void;
  reset: () => void;
}

const emptyResults: SearchResultsByCategory = {
  Jobs: [],
  Experience: [],
  Essay: [],
  Interview: [],
  Profile: [],
  Archive: [],
};

export const useSearchStore = create<SearchStore>((set) => ({
  results: emptyResults,
  search: (query, filter) => {
    set({ results: searchRepository.search(query, filter) });
  },
  reset: () => {
    set({ results: emptyResults });
  },
}));

export { searchCategories };
export type { SearchFilter };
