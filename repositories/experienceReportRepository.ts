import { readData, writeData } from '@/repositories/careerbaseStorage';
import type {
  ExperienceReport,
  UpdateExperienceReportInput,
} from '@/types/experience-report';

function getLatestExperienceReport(): ExperienceReport | null {
  const reports = readData().experienceReports;

  if (reports.length === 0) {
    return null;
  }

  return [...reports].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];
}

function upsertExperienceReport(
  input: UpdateExperienceReportInput,
): ExperienceReport {
  const data = readData();
  const now = new Date().toISOString();
  const existing =
    data.experienceReports.length === 0
      ? null
      : [...data.experienceReports].sort((a, b) =>
          b.updatedAt.localeCompare(a.updatedAt),
        )[0];

  if (existing) {
    const updated: ExperienceReport = {
      ...existing,
      ...input,
      updatedAt: now,
    };

    writeData({
      ...data,
      experienceReports: data.experienceReports.map((item) =>
        item.id === existing.id ? updated : item,
      ),
      lastUpdatedAt: now,
    });

    return updated;
  }

  const created: ExperienceReport = {
    id: crypto.randomUUID(),
    oneLiner: '',
    strengths: '',
    weaknesses: '',
    personality: '',
    recommendedRoles: '',
    recommendedCompanyTypes: '',
    recommendedExperiences: '',
    recommendedEssays: '',
    expectedQuestions: [],
    followUpQuestions: [],
    pressureQuestions: [],
    answerImprovements: '',
    careerStrategy: '',
    interviewReadiness: '',
    careerReadiness: '',
    aiOpinion: '',
    suggestedAdditionalData: '',
    rawText: '',
    isSample: false,
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  writeData({
    ...data,
    experienceReports: [...data.experienceReports, created],
    lastUpdatedAt: now,
  });

  return created;
}

export const experienceReportRepository = {
  getLatestExperienceReport,
  upsertExperienceReport,
};
