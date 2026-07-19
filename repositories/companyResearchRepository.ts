import { readData, writeData } from '@/repositories/careerbaseStorage';
import {
  createEmptyCompanyResearchFields,
  type CompanyResearch,
  type CreateCompanyResearchInput,
  type UpdateCompanyResearchInput,
} from '@/types/company-research';
import type { EntityId } from '@/types/job';

function getCompanyResearchByJobId(jobId: EntityId): CompanyResearch | null {
  return (
    readData().companyResearch.find((item) => item.jobId === jobId) ?? null
  );
}

function upsertCompanyResearch(
  jobId: EntityId,
  input: UpdateCompanyResearchInput,
): CompanyResearch | null {
  const data = readData();
  const jobExists = data.jobs.some((job) => job.id === jobId);

  if (!jobExists) {
    return null;
  }

  const now = new Date().toISOString();
  const existing = data.companyResearch.find((item) => item.jobId === jobId);

  if (existing) {
    const updated: CompanyResearch = {
      ...existing,
      ...input,
      updatedAt: now,
    };

    writeData({
      ...data,
      companyResearch: data.companyResearch.map((item) =>
        item.id === existing.id ? updated : item,
      ),
      lastUpdatedAt: now,
    });

    return updated;
  }

  const created: CompanyResearch = {
    id: crypto.randomUUID(),
    jobId,
    ...createEmptyCompanyResearchFields(),
    ...input,
    isSample: false,
    createdAt: now,
    updatedAt: now,
  };

  writeData({
    ...data,
    companyResearch: [...data.companyResearch, created],
    lastUpdatedAt: now,
  });

  return created;
}

function createCompanyResearch(
  input: CreateCompanyResearchInput,
): CompanyResearch | null {
  const { jobId, ...fields } = input;
  return upsertCompanyResearch(jobId, fields);
}

export const companyResearchRepository = {
  getCompanyResearchByJobId,
  upsertCompanyResearch,
  createCompanyResearch,
};
