import { readData, writeData } from '@/repositories/careerbaseStorage';
import type {
  AttachmentMetadata,
  CreateAttachmentMetadataInput,
  CreateEssayInput,
  Essay,
  Experience,
  UpdateAttachmentMetadataInput,
  UpdateEssayInput,
} from '@/types/essay';
import type { EntityId } from '@/types/job';

function sortEssaysByCreatedAt(essays: Essay[]) {
  return [...essays].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function getEssays(): Essay[] {
  return sortEssaysByCreatedAt(readData().essays);
}

function getEssaysByJobId(jobId: EntityId): Essay[] {
  return sortEssaysByCreatedAt(
    readData().essays.filter((essay) => essay.jobId === jobId),
  );
}

function getEssay(id: EntityId): Essay | null {
  return readData().essays.find((essay) => essay.id === id) ?? null;
}

function createEssay(input: CreateEssayInput): Essay | null {
  const data = readData();
  const jobExists = data.jobs.some((job) => job.id === input.jobId);

  if (!jobExists) {
    return null;
  }

  const now = new Date().toISOString();
  const essay: Essay = {
    id: crypto.randomUUID(),
    jobId: input.jobId,
    question: input.question,
    finalAnswer: '',
    attachmentIds: [],
    experienceIds: [],
    isSample: false,
    createdAt: now,
    updatedAt: now,
  };

  writeData({
    ...data,
    essays: [...data.essays, essay],
    lastUpdatedAt: now,
  });

  return essay;
}

function updateEssay(id: EntityId, input: UpdateEssayInput): Essay | null {
  const data = readData();
  const now = new Date().toISOString();
  let updatedEssay: Essay | null = null;

  const essays = data.essays.map((essay) => {
    if (essay.id !== id) {
      return essay;
    }

    updatedEssay = {
      ...essay,
      ...input,
      updatedAt: now,
    };

    return updatedEssay;
  });

  if (!updatedEssay) {
    return null;
  }

  writeData({
    ...data,
    essays,
    lastUpdatedAt: now,
  });

  return updatedEssay;
}

function deleteEssay(id: EntityId): void {
  const data = readData();
  const now = new Date().toISOString();
  const deletedAttachmentIds = new Set(
    data.attachments
      .filter((attachment) => attachment.essayId === id)
      .map((attachment) => attachment.id),
  );

  writeData({
    ...data,
    essays: data.essays.filter((essay) => essay.id !== id),
    attachments: data.attachments.filter(
      (attachment) => !deletedAttachmentIds.has(attachment.id),
    ),
    lastUpdatedAt: now,
  });
}

function getAttachmentsByEssayId(essayId: EntityId): AttachmentMetadata[] {
  return readData().attachments.filter(
    (attachment) => attachment.essayId === essayId,
  );
}

function createAttachment(
  input: CreateAttachmentMetadataInput,
): AttachmentMetadata | null {
  const data = readData();
  const essay = input.essayId
    ? data.essays.find((item) => item.id === input.essayId)
    : null;

  if (!essay) {
    return null;
  }

  const now = new Date().toISOString();
  const attachment: AttachmentMetadata = {
    id: crypto.randomUUID(),
    ...input,
    isSample: false,
    createdAt: now,
    updatedAt: now,
  };

  writeData({
    ...data,
    essays: data.essays.map((item) =>
      item.id === essay.id
        ? {
            ...item,
            attachmentIds: [...item.attachmentIds, attachment.id],
            updatedAt: now,
          }
        : item,
    ),
    attachments: [...data.attachments, attachment],
    lastUpdatedAt: now,
  });

  return attachment;
}

function updateAttachment(
  id: EntityId,
  input: UpdateAttachmentMetadataInput,
): AttachmentMetadata | null {
  const data = readData();
  const now = new Date().toISOString();
  let updatedAttachment: AttachmentMetadata | null = null;

  const attachments = data.attachments.map((attachment) => {
    if (attachment.id !== id) {
      return attachment;
    }

    updatedAttachment = {
      ...attachment,
      ...input,
      updatedAt: now,
    };

    return updatedAttachment;
  });

  if (!updatedAttachment) {
    return null;
  }

  writeData({
    ...data,
    attachments,
    lastUpdatedAt: now,
  });

  return updatedAttachment;
}

function getExperiences(): Experience[] {
  return readData().experiences;
}

export const essayRepository = {
  getEssays,
  getEssaysByJobId,
  getEssay,
  createEssay,
  updateEssay,
  deleteEssay,
  getAttachmentsByEssayId,
  createAttachment,
  updateAttachment,
  getExperiences,
};
