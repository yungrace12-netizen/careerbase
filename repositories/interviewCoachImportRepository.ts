import { readData, writeData } from '@/repositories/careerbaseStorage';
import type {
  InterviewCoachImport,
  UpdateInterviewCoachImportInput,
} from '@/types/interview-coach';
import type { EntityId } from '@/types/job';

function getInterviewCoachImportByJobId(
  jobId: EntityId,
): InterviewCoachImport | null {
  return (
    readData().interviewCoachImports.find((item) => item.jobId === jobId) ??
    null
  );
}

function upsertInterviewCoachImport(
  jobId: EntityId,
  input: UpdateInterviewCoachImportInput,
): InterviewCoachImport | null {
  const data = readData();
  const jobExists = data.jobs.some((job) => job.id === jobId);

  if (!jobExists) {
    return null;
  }

  const now = new Date().toISOString();
  const existing = data.interviewCoachImports.find(
    (item) => item.jobId === jobId,
  );

  if (existing) {
    const updated: InterviewCoachImport = {
      ...existing,
      ...input,
      updatedAt: now,
    };

    writeData({
      ...data,
      interviewCoachImports: data.interviewCoachImports.map((item) =>
        item.id === existing.id ? updated : item,
      ),
      lastUpdatedAt: now,
    });

    return updated;
  }

  const created: InterviewCoachImport = {
    id: crypto.randomUUID(),
    jobId,
    expectedQuestions: [],
    followUpQuestions: [],
    opinion: '',
    gaps: '',
    recommendedExperiences: '',
    recommendedEssayContent: '',
    interviewScore: '',
    companyUnderstandingScore: '',
    jobUnderstandingScore: '',
    includeInPdf: false,
    rawText: '',
    isSample: false,
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  writeData({
    ...data,
    interviewCoachImports: [...data.interviewCoachImports, created],
    lastUpdatedAt: now,
  });

  return created;
}

export const interviewCoachImportRepository = {
  getInterviewCoachImportByJobId,
  upsertInterviewCoachImport,
};
