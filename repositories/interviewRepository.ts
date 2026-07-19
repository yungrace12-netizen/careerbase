import { readData, writeData } from '@/repositories/careerbaseStorage';
import type {
  ActualInterviewQuestion,
  CreateInterviewStageInput,
  InterviewQuestion,
  InterviewStage,
  UpdateInterviewStageInput,
} from '@/types/interview';
import type { EntityId } from '@/types/job';

function sortStages(stages: InterviewStage[]) {
  return [...stages].sort((a, b) => a.order - b.order);
}

function normalizeStageOrder(stages: InterviewStage[]) {
  return sortStages(stages).map((stage, index) => ({
    ...stage,
    order: index + 1,
  }));
}

function getInterviewStages(): InterviewStage[] {
  return sortStages(readData().interviews);
}

function getInterviewStagesByJobId(jobId: EntityId): InterviewStage[] {
  return sortStages(
    readData().interviews.filter((stage) => stage.jobId === jobId),
  );
}

function getInterviewStage(id: EntityId): InterviewStage | null {
  return readData().interviews.find((stage) => stage.id === id) ?? null;
}

function createInterviewStage(
  input: CreateInterviewStageInput,
): InterviewStage | null {
  const data = readData();
  const jobExists = data.jobs.some((job) => job.id === input.jobId);

  if (!jobExists) {
    return null;
  }

  const now = new Date().toISOString();
  const stage: InterviewStage = {
    id: crypto.randomUUID(),
    jobId: input.jobId,
    name: input.name,
    order: input.order,
    status: input.status,
    scheduleId: null,
    expectedQuestions: [],
    actualQuestions: [],
    retrospective: '',
    attachmentIds: [],
    isSample: false,
    createdAt: now,
    updatedAt: now,
  };

  const otherStages = data.interviews.filter(
    (item) => item.jobId !== input.jobId,
  );
  const jobStages = normalizeStageOrder([
    ...data.interviews.filter((item) => item.jobId === input.jobId),
    stage,
  ]);

  writeData({
    ...data,
    interviews: [...otherStages, ...jobStages],
    lastUpdatedAt: now,
  });

  return stage;
}

function updateInterviewStage(
  id: EntityId,
  input: UpdateInterviewStageInput,
): InterviewStage | null {
  const data = readData();
  const now = new Date().toISOString();
  const targetStage = data.interviews.find((stage) => stage.id === id);

  if (!targetStage) {
    return null;
  }

  const updatedStage: InterviewStage = {
    ...targetStage,
    ...input,
    updatedAt: now,
  };
  const interviews = data.interviews.map((stage) => {
    if (stage.id !== id) {
      return stage;
    }

    return updatedStage;
  });

  writeData({
    ...data,
    interviews,
    lastUpdatedAt: now,
  });

  return updatedStage;
}

function deleteInterviewStage(id: EntityId): void {
  const data = readData();
  const now = new Date().toISOString();
  const targetStage = data.interviews.find((stage) => stage.id === id);

  if (!targetStage) {
    return;
  }

  const remainingStages = data.interviews.filter((stage) => stage.id !== id);
  const otherStages = remainingStages.filter(
    (stage) => stage.jobId !== targetStage.jobId,
  );
  const jobStages = normalizeStageOrder(
    remainingStages.filter((stage) => stage.jobId === targetStage.jobId),
  );

  writeData({
    ...data,
    interviews: [...otherStages, ...jobStages],
    lastUpdatedAt: now,
  });
}

function reorderInterviewStages(jobId: EntityId, orderedIds: EntityId[]): void {
  const data = readData();
  const now = new Date().toISOString();
  const jobStages = data.interviews.filter((stage) => stage.jobId === jobId);
  const stageById = new Map(jobStages.map((stage) => [stage.id, stage]));
  const orderedStages = orderedIds
    .map((id) => stageById.get(id))
    .filter((stage): stage is InterviewStage => Boolean(stage))
    .map((stage, index) => ({
      ...stage,
      order: index + 1,
      updatedAt: now,
    }));
  const otherStages = data.interviews.filter((stage) => stage.jobId !== jobId);

  writeData({
    ...data,
    interviews: [...otherStages, ...orderedStages],
    lastUpdatedAt: now,
  });
}

function addExpectedQuestion(
  stageId: EntityId,
  question: string,
  extras?: Partial<
    Pick<
      InterviewQuestion,
      'answer' | 'followUpQuestions' | 'sourceReason' | 'aiGenerated'
    >
  >,
): InterviewStage | null {
  const now = new Date().toISOString();
  const interviewQuestion: InterviewQuestion = {
    id: crypto.randomUUID(),
    question,
    answer: extras?.answer ?? '',
    experienceIds: [],
    followUpQuestions: extras?.followUpQuestions,
    sourceReason: extras?.sourceReason,
    aiGenerated: extras?.aiGenerated,
    createdAt: now,
    updatedAt: now,
  };

  return updateStage(stageId, (stage) => ({
    ...stage,
    expectedQuestions: [...stage.expectedQuestions, interviewQuestion],
    updatedAt: now,
  }));
}

function updateExpectedQuestion(
  stageId: EntityId,
  questionId: EntityId,
  input: Partial<
    Pick<
      InterviewQuestion,
      | 'question'
      | 'answer'
      | 'experienceIds'
      | 'followUpQuestions'
      | 'sourceReason'
      | 'aiGenerated'
    >
  >,
): InterviewStage | null {
  const now = new Date().toISOString();

  return updateStage(stageId, (stage) => ({
    ...stage,
    expectedQuestions: stage.expectedQuestions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            ...input,
            updatedAt: now,
          }
        : question,
    ),
    updatedAt: now,
  }));
}

function deleteExpectedQuestion(
  stageId: EntityId,
  questionId: EntityId,
): InterviewStage | null {
  const now = new Date().toISOString();

  return updateStage(stageId, (stage) => ({
    ...stage,
    expectedQuestions: stage.expectedQuestions.filter(
      (question) => question.id !== questionId,
    ),
    updatedAt: now,
  }));
}

function addActualQuestion(
  stageId: EntityId,
  question: string,
): InterviewStage | null {
  const now = new Date().toISOString();
  const actualQuestion: ActualInterviewQuestion = {
    id: crypto.randomUUID(),
    question,
    myAnswerMemo: '',
    improvementMemo: '',
    createdAt: now,
    updatedAt: now,
  };

  return updateStage(stageId, (stage) => ({
    ...stage,
    actualQuestions: [...stage.actualQuestions, actualQuestion],
    updatedAt: now,
  }));
}

function updateActualQuestion(
  stageId: EntityId,
  questionId: EntityId,
  input: Partial<
    Pick<ActualInterviewQuestion, 'question' | 'myAnswerMemo' | 'improvementMemo'>
  >,
): InterviewStage | null {
  const now = new Date().toISOString();

  return updateStage(stageId, (stage) => ({
    ...stage,
    actualQuestions: stage.actualQuestions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            ...input,
            updatedAt: now,
          }
        : question,
    ),
    updatedAt: now,
  }));
}

function deleteActualQuestion(
  stageId: EntityId,
  questionId: EntityId,
): InterviewStage | null {
  const now = new Date().toISOString();

  return updateStage(stageId, (stage) => ({
    ...stage,
    actualQuestions: stage.actualQuestions.filter(
      (question) => question.id !== questionId,
    ),
    updatedAt: now,
  }));
}

function updateStage(
  stageId: EntityId,
  updater: (stage: InterviewStage) => InterviewStage,
): InterviewStage | null {
  const data = readData();
  const targetStage = data.interviews.find((stage) => stage.id === stageId);

  if (!targetStage) {
    return null;
  }

  const updatedStage = updater(targetStage);
  const interviews = data.interviews.map((stage) => {
    if (stage.id !== stageId) {
      return stage;
    }

    return updatedStage;
  });

  writeData({
    ...data,
    interviews,
    lastUpdatedAt: updatedStage.updatedAt,
  });

  return updatedStage;
}

export const interviewRepository = {
  getInterviewStages,
  getInterviewStagesByJobId,
  getInterviewStage,
  createInterviewStage,
  updateInterviewStage,
  deleteInterviewStage,
  reorderInterviewStages,
  addExpectedQuestion,
  updateExpectedQuestion,
  deleteExpectedQuestion,
  addActualQuestion,
  updateActualQuestion,
  deleteActualQuestion,
};
