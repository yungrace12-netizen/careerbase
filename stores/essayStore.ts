import { create } from 'zustand';

import { essayRepository } from '@/repositories/essayRepository';
import { experienceRepository } from '@/repositories/experienceRepository';
import type {
  AttachmentMetadata,
  CreateAttachmentMetadataInput,
  Essay,
  Experience,
  UpdateAttachmentMetadataInput,
} from '@/types/essay';
import type { EntityId } from '@/types/job';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface EssaySaveStatus {
  state: SaveState;
  savedAt: string | null;
}

interface EssayStore {
  essays: Essay[];
  attachments: AttachmentMetadata[];
  experiences: Experience[];
  saveStatuses: Record<EntityId, EssaySaveStatus>;
  loadEssaysByJobId: (jobId: EntityId) => void;
  createEssay: (input: { jobId: EntityId; question: string }) => void;
  updateEssayQuestion: (id: EntityId, question: string) => void;
  deleteEssay: (id: EntityId, jobId: EntityId) => void;
  saveAnswer: (id: EntityId, finalAnswer: string, jobId: EntityId) => void;
  createAttachment: (input: CreateAttachmentMetadataInput) => void;
  updateAttachment: (
    id: EntityId,
    input: UpdateAttachmentMetadataInput,
    jobId: EntityId,
  ) => void;
  deleteAttachment: (id: EntityId, jobId: EntityId) => void;
  updateEssayExperienceLinks: (
    id: EntityId,
    experienceIds: EntityId[],
    jobId: EntityId,
  ) => void;
}

const defaultSaveStatus: EssaySaveStatus = {
  state: 'idle',
  savedAt: null,
};

function loadJobScopedData(jobId: EntityId) {
  const essays = essayRepository.getEssaysByJobId(jobId);
  return {
    essays,
    attachments: essayRepository.getAttachmentsByJobId(jobId),
    experiences: experienceRepository.getExperiences(),
  };
}

export const useEssayStore = create<EssayStore>((set, get) => ({
  essays: [],
  attachments: [],
  experiences: [],
  saveStatuses: {},
  loadEssaysByJobId: (jobId) => {
    set(loadJobScopedData(jobId));
  },
  createEssay: (input) => {
    essayRepository.createEssay(input);
    set(loadJobScopedData(input.jobId));
  },
  updateEssayQuestion: (id, question) => {
    const essay = get().essays.find((item) => item.id === id);

    if (!essay) {
      return;
    }

    essayRepository.updateEssay(id, { question });
    set(loadJobScopedData(essay.jobId));
  },
  deleteEssay: (id, jobId) => {
    essayRepository.deleteEssay(id);
    set((state) => {
      const saveStatuses = { ...state.saveStatuses };
      delete saveStatuses[id];

      return {
        ...loadJobScopedData(jobId),
        saveStatuses,
      };
    });
  },
  saveAnswer: (id, finalAnswer, jobId) => {
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
      const updatedEssay = essayRepository.updateEssay(id, { finalAnswer });
      const savedAt = updatedEssay?.updatedAt ?? new Date().toISOString();

      set((state) => ({
        ...loadJobScopedData(jobId),
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
  createAttachment: (input) => {
    essayRepository.createAttachment(input);

    if (input.jobId) {
      set(loadJobScopedData(input.jobId));
    }
  },
  updateAttachment: (id, input, jobId) => {
    essayRepository.updateAttachment(id, input);
    set(loadJobScopedData(jobId));
  },
  deleteAttachment: (id, jobId) => {
    essayRepository.deleteAttachment(id);
    set(loadJobScopedData(jobId));
  },
  updateEssayExperienceLinks: (id, experienceIds, jobId) => {
    essayRepository.updateEssay(id, { experienceIds });
    set(loadJobScopedData(jobId));
  },
}));

export type { EssaySaveStatus, SaveState };
