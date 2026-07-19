import { create } from 'zustand';

import { companyResearchRepository } from '@/repositories/companyResearchRepository';
import {
  composeCompanyResearchContent,
  type CompanyResearch,
  type UpdateCompanyResearchInput,
} from '@/types/company-research';
import type { EntityId } from '@/types/job';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface CompanyResearchSaveStatus {
  state: SaveState;
  savedAt: string | null;
}

interface CompanyResearchStore {
  research: CompanyResearch | null;
  saveStatus: CompanyResearchSaveStatus;
  loadByJobId: (jobId: EntityId) => void;
  saveResearch: (
    jobId: EntityId,
    input: UpdateCompanyResearchInput,
  ) => CompanyResearch | null;
}

const defaultSaveStatus: CompanyResearchSaveStatus = {
  state: 'idle',
  savedAt: null,
};

function hydrateCompanyResearch(jobId: EntityId): CompanyResearch | null {
  const research =
    companyResearchRepository.getCompanyResearchByJobId(jobId);

  if (!research) {
    return null;
  }

  if (research.content?.trim()) {
    return research;
  }

  const composed = composeCompanyResearchContent(research);

  if (!composed) {
    return research;
  }

  return (
    companyResearchRepository.upsertCompanyResearch(jobId, {
      content: composed,
    }) ?? research
  );
}

export const useCompanyResearchStore = create<CompanyResearchStore>(
  (set) => ({
    research: null,
    saveStatus: defaultSaveStatus,
    loadByJobId: (jobId) => {
      set({
        research: hydrateCompanyResearch(jobId),
        saveStatus: defaultSaveStatus,
      });
    },
    saveResearch: (jobId, input) => {
      set((state) => ({
        saveStatus: {
          ...state.saveStatus,
          state: 'saving',
        },
      }));

      try {
        const saved = companyResearchRepository.upsertCompanyResearch(
          jobId,
          input,
        );

        if (!saved) {
          set((state) => ({
            saveStatus: {
              ...state.saveStatus,
              state: 'error',
            },
          }));
          return null;
        }

        set({
          research: saved,
          saveStatus: {
            state: 'saved',
            savedAt: saved.updatedAt,
          },
        });

        return saved;
      } catch {
        set((state) => ({
          saveStatus: {
            ...state.saveStatus,
            state: 'error',
          },
        }));
        return null;
      }
    },
  }),
);

export type { CompanyResearchSaveStatus, SaveState };
