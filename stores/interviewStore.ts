import { create } from 'zustand';

import { experienceRepository } from '@/repositories/experienceRepository';
import { interviewRepository } from '@/repositories/interviewRepository';
import type { Experience } from '@/types/essay';
import type {
  CreateInterviewStageInput,
  InterviewStage,
  InterviewStatus,
} from '@/types/interview';
import type { EntityId } from '@/types/job';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface InterviewSaveStatus {
  state: SaveState;
  savedAt: string | null;
}

interface InterviewStore {
  stages: InterviewStage[];
  experiences: Experience[];
  saveStatuses: Record<string, InterviewSaveStatus>;
  loadStagesByJobId: (jobId: EntityId) => void;
  createDefaultStages: (jobId: EntityId) => void;
  createStage: (input: CreateInterviewStageInput) => void;
  updateStage: (
    id: EntityId,
    input: Partial<Pick<InterviewStage, 'name' | 'order' | 'status'>>,
    jobId: EntityId,
  ) => void;
  deleteStage: (id: EntityId, jobId: EntityId) => void;
  reorderStages: (jobId: EntityId, orderedIds: EntityId[]) => void;
  updateStageStatus: (
    id: EntityId,
    status: InterviewStatus,
    jobId: EntityId,
  ) => void;
  addExpectedQuestion: (
    stageId: EntityId,
    question: string,
    jobId: EntityId,
    extras?: Partial<
      Pick<
        InterviewStage['expectedQuestions'][number],
        'answer' | 'followUpQuestions' | 'sourceReason' | 'aiGenerated'
      >
    >,
  ) => void;
  updateExpectedQuestion: (
    stageId: EntityId,
    questionId: EntityId,
    question: string,
    jobId: EntityId,
  ) => void;
  deleteExpectedQuestion: (
    stageId: EntityId,
    questionId: EntityId,
    jobId: EntityId,
  ) => void;
  saveExpectedAnswer: (
    stageId: EntityId,
    questionId: EntityId,
    answer: string,
    jobId: EntityId,
  ) => void;
  updateExpectedQuestionExperienceLinks: (
    stageId: EntityId,
    questionId: EntityId,
    experienceIds: EntityId[],
    jobId: EntityId,
  ) => void;
  addActualQuestion: (stageId: EntityId, question: string, jobId: EntityId) => void;
  updateActualQuestion: (
    stageId: EntityId,
    questionId: EntityId,
    question: string,
    jobId: EntityId,
  ) => void;
  deleteActualQuestion: (
    stageId: EntityId,
    questionId: EntityId,
    jobId: EntityId,
  ) => void;
  saveActualQuestionMemo: (
    stageId: EntityId,
    questionId: EntityId,
    input: {
      myAnswerMemo: string;
      improvementMemo: string;
    },
    jobId: EntityId,
  ) => void;
  saveRetrospective: (
    stageId: EntityId,
    retrospective: string,
    jobId: EntityId,
  ) => void;
}

const defaultSaveStatus: InterviewSaveStatus = {
  state: 'idle',
  savedAt: null,
};

function loadJobScopedData(jobId: EntityId) {
  return {
    stages: interviewRepository.getInterviewStagesByJobId(jobId),
    experiences: experienceRepository.getExperiences(),
  };
}

function saveStatusKey(type: 'expected' | 'actual' | 'retrospective', id: EntityId) {
  return `${type}:${id}`;
}

function setSavingStatus(
  get: () => InterviewStore,
  set: (
    partial:
      | Partial<InterviewStore>
      | ((state: InterviewStore) => Partial<InterviewStore>),
  ) => void,
  key: string,
) {
  set((state) => ({
    saveStatuses: {
      ...state.saveStatuses,
      [key]: {
        ...defaultSaveStatus,
        ...get().saveStatuses[key],
        state: 'saving',
      },
    },
  }));
}

function setSavedStatus(
  set: (
    partial:
      | Partial<InterviewStore>
      | ((state: InterviewStore) => Partial<InterviewStore>),
  ) => void,
  key: string,
  jobId: EntityId,
  savedAt: string,
) {
  set((state) => ({
    ...loadJobScopedData(jobId),
    saveStatuses: {
      ...state.saveStatuses,
      [key]: {
        state: 'saved',
        savedAt,
      },
    },
  }));
}

function setErrorStatus(
  set: (
    partial:
      | Partial<InterviewStore>
      | ((state: InterviewStore) => Partial<InterviewStore>),
  ) => void,
  key: string,
) {
  set((state) => ({
    saveStatuses: {
      ...state.saveStatuses,
      [key]: {
        ...defaultSaveStatus,
        ...state.saveStatuses[key],
        state: 'error',
      },
    },
  }));
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  stages: [],
  experiences: [],
  saveStatuses: {},
  loadStagesByJobId: (jobId) => {
    set(loadJobScopedData(jobId));
  },
  createDefaultStages: (jobId) => {
    const currentStages = interviewRepository.getInterviewStagesByJobId(jobId);
    const nextOrder = currentStages.length + 1;
    interviewRepository.createInterviewStage({
      jobId,
      name: '1차 면접',
      order: nextOrder,
      status: '준비 전',
    });
    interviewRepository.createInterviewStage({
      jobId,
      name: '2차 면접',
      order: nextOrder + 1,
      status: '준비 전',
    });
    set(loadJobScopedData(jobId));
  },
  createStage: (input) => {
    interviewRepository.createInterviewStage(input);
    set(loadJobScopedData(input.jobId));
  },
  updateStage: (id, input, jobId) => {
    interviewRepository.updateInterviewStage(id, input);
    set(loadJobScopedData(jobId));
  },
  deleteStage: (id, jobId) => {
    interviewRepository.deleteInterviewStage(id);
    set(loadJobScopedData(jobId));
  },
  reorderStages: (jobId, orderedIds) => {
    interviewRepository.reorderInterviewStages(jobId, orderedIds);
    set(loadJobScopedData(jobId));
  },
  updateStageStatus: (id, status, jobId) => {
    interviewRepository.updateInterviewStage(id, { status });
    set(loadJobScopedData(jobId));
  },
  addExpectedQuestion: (stageId, question, jobId, extras) => {
    interviewRepository.addExpectedQuestion(stageId, question, extras);
    set(loadJobScopedData(jobId));
  },
  updateExpectedQuestion: (stageId, questionId, question, jobId) => {
    interviewRepository.updateExpectedQuestion(stageId, questionId, {
      question,
    });
    set(loadJobScopedData(jobId));
  },
  deleteExpectedQuestion: (stageId, questionId, jobId) => {
    interviewRepository.deleteExpectedQuestion(stageId, questionId);
    set(loadJobScopedData(jobId));
  },
  saveExpectedAnswer: (stageId, questionId, answer, jobId) => {
    const key = saveStatusKey('expected', questionId);
    setSavingStatus(get, set, key);

    try {
      const updatedStage = interviewRepository.updateExpectedQuestion(
        stageId,
        questionId,
        { answer },
      );
      setSavedStatus(
        set,
        key,
        jobId,
        updatedStage?.updatedAt ?? new Date().toISOString(),
      );
    } catch {
      setErrorStatus(set, key);
    }
  },
  updateExpectedQuestionExperienceLinks: (
    stageId,
    questionId,
    experienceIds,
    jobId,
  ) => {
    interviewRepository.updateExpectedQuestion(stageId, questionId, {
      experienceIds,
    });
    set(loadJobScopedData(jobId));
  },
  addActualQuestion: (stageId, question, jobId) => {
    interviewRepository.addActualQuestion(stageId, question);
    set(loadJobScopedData(jobId));
  },
  updateActualQuestion: (stageId, questionId, question, jobId) => {
    interviewRepository.updateActualQuestion(stageId, questionId, {
      question,
    });
    set(loadJobScopedData(jobId));
  },
  deleteActualQuestion: (stageId, questionId, jobId) => {
    interviewRepository.deleteActualQuestion(stageId, questionId);
    set(loadJobScopedData(jobId));
  },
  saveActualQuestionMemo: (stageId, questionId, input, jobId) => {
    const key = saveStatusKey('actual', questionId);
    setSavingStatus(get, set, key);

    try {
      const updatedStage = interviewRepository.updateActualQuestion(
        stageId,
        questionId,
        input,
      );
      setSavedStatus(
        set,
        key,
        jobId,
        updatedStage?.updatedAt ?? new Date().toISOString(),
      );
    } catch {
      setErrorStatus(set, key);
    }
  },
  saveRetrospective: (stageId, retrospective, jobId) => {
    const key = saveStatusKey('retrospective', stageId);
    setSavingStatus(get, set, key);

    try {
      const updatedStage = interviewRepository.updateInterviewStage(stageId, {
        retrospective,
      });
      setSavedStatus(
        set,
        key,
        jobId,
        updatedStage?.updatedAt ?? new Date().toISOString(),
      );
    } catch {
      setErrorStatus(set, key);
    }
  },
}));

export { saveStatusKey };
export type { InterviewSaveStatus, SaveState };
