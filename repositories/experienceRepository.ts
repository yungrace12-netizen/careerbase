import { readData, writeData } from '@/repositories/careerbaseStorage';
import type {
  CreateExperienceInput,
  Experience,
  UpdateExperienceInput,
} from '@/types/essay';
import type { EntityId, Job } from '@/types/job';

interface ExperienceSearchFilters {
  query?: string;
  tag?: string;
  jobId?: EntityId;
}

function sortExperiences(experiences: Experience[]) {
  return [...experiences].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function normalizeTags(tags: string[]) {
  const seen = new Set<string>();

  return tags
    .map((tag) => tag.trim())
    .filter((tag) => {
      if (!tag || seen.has(tag)) {
        return false;
      }

      seen.add(tag);
      return true;
    });
}

function getExperiences(): Experience[] {
  return sortExperiences(readData().experiences);
}

function getExperience(id: EntityId): Experience | null {
  return readData().experiences.find((experience) => experience.id === id) ?? null;
}

function getJobsForExperienceLinks(): Job[] {
  return readData().jobs;
}

function createExperience(input: CreateExperienceInput): Experience {
  const data = readData();
  const now = new Date().toISOString();
  const experience: Experience = {
    id: crypto.randomUUID(),
    title: input.title,
    situation: input.situation,
    task: input.task,
    action: input.action,
    result: input.result,
    measurableOutcome: input.measurableOutcome,
    competencyTags: normalizeTags(input.competencyTags),
    relatedJobIds: input.relatedJobIds,
    memo: input.memo,
    isSample: false,
    createdAt: now,
    updatedAt: now,
  };

  writeData({
    ...data,
    experiences: [...data.experiences, experience],
    lastUpdatedAt: now,
  });

  return experience;
}

function updateExperience(
  id: EntityId,
  input: UpdateExperienceInput,
): Experience | null {
  const data = readData();
  const now = new Date().toISOString();
  const targetExperience = data.experiences.find(
    (experience) => experience.id === id,
  );

  if (!targetExperience) {
    return null;
  }

  const updatedExperience: Experience = {
    ...targetExperience,
    ...input,
    competencyTags: input.competencyTags
      ? normalizeTags(input.competencyTags)
      : targetExperience.competencyTags,
    updatedAt: now,
  };

  writeData({
    ...data,
    experiences: data.experiences.map((experience) =>
      experience.id === id ? updatedExperience : experience,
    ),
    lastUpdatedAt: now,
  });

  return updatedExperience;
}

function deleteExperience(id: EntityId): void {
  const data = readData();
  const now = new Date().toISOString();

  writeData({
    ...data,
    experiences: data.experiences.filter((experience) => experience.id !== id),
    essays: data.essays.map((essay) => ({
      ...essay,
      experienceIds: essay.experienceIds.filter(
        (experienceId) => experienceId !== id,
      ),
      updatedAt: essay.experienceIds.includes(id) ? now : essay.updatedAt,
    })),
    interviews: data.interviews.map((stage) => ({
      ...stage,
      expectedQuestions: stage.expectedQuestions.map((question) => ({
        ...question,
        experienceIds: question.experienceIds.filter(
          (experienceId) => experienceId !== id,
        ),
        updatedAt: question.experienceIds.includes(id)
          ? now
          : question.updatedAt,
      })),
      updatedAt: stage.expectedQuestions.some((question) =>
        question.experienceIds.includes(id),
      )
        ? now
        : stage.updatedAt,
    })),
    lastUpdatedAt: now,
  });
}

function searchExperiences(filters: ExperienceSearchFilters): Experience[] {
  const query = filters.query?.trim().toLocaleLowerCase() ?? '';
  const tag = filters.tag?.trim() ?? '';
  const jobId = filters.jobId?.trim() ?? '';

  return getExperiences().filter((experience) => {
    const matchesQuery = query
      ? [
          experience.title,
          experience.situation,
          experience.task,
          experience.action,
          experience.result,
          experience.memo,
        ]
          .join(' ')
          .toLocaleLowerCase()
          .includes(query)
      : true;
    const matchesTag = tag ? experience.competencyTags.includes(tag) : true;
    const matchesJob = jobId ? experience.relatedJobIds.includes(jobId) : true;

    return matchesQuery && matchesTag && matchesJob;
  });
}

export const experienceRepository = {
  getExperiences,
  getExperience,
  getJobsForExperienceLinks,
  createExperience,
  updateExperience,
  deleteExperience,
  searchExperiences,
};

export type { ExperienceSearchFilters };
