'use client';

import * as React from 'react';
import { FileText, Pencil, Plus, Save, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { useEssayStore, type EssaySaveStatus } from '@/stores/essayStore';
import type {
  AttachmentMetadata,
  AttachmentType,
  Essay,
  Experience,
} from '@/types/essay';
import { ATTACHMENT_TYPES } from '@/types/essay';
import type { EntityId, Job } from '@/types/job';

interface EssayTabProps {
  job: Job;
}

interface EssayQuestionModalState {
  mode: 'create' | 'edit';
  essay: Essay | null;
  question: string;
}

interface AttachmentModalState {
  essay: Essay;
  attachment: AttachmentMetadata | null;
  fileName: string;
  fileType: AttachmentType;
  versionDescription: string;
  localPathDescription: string;
  registeredDate: string;
}

function EssayTab({ job }: EssayTabProps) {
  const essays = useEssayStore((state) => state.essays);
  const attachments = useEssayStore((state) => state.attachments);
  const experiences = useEssayStore((state) => state.experiences);
  const saveStatuses = useEssayStore((state) => state.saveStatuses);
  const loadEssaysByJobId = useEssayStore((state) => state.loadEssaysByJobId);
  const createEssay = useEssayStore((state) => state.createEssay);
  const updateEssayQuestion = useEssayStore(
    (state) => state.updateEssayQuestion,
  );
  const deleteEssay = useEssayStore((state) => state.deleteEssay);
  const saveAnswer = useEssayStore((state) => state.saveAnswer);
  const createAttachment = useEssayStore((state) => state.createAttachment);
  const updateAttachment = useEssayStore((state) => state.updateAttachment);
  const updateEssayExperienceLinks = useEssayStore(
    (state) => state.updateEssayExperienceLinks,
  );

  const [questionModal, setQuestionModal] =
    React.useState<EssayQuestionModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Essay | null>(null);
  const [attachmentModal, setAttachmentModal] =
    React.useState<AttachmentModalState | null>(null);

  React.useEffect(() => {
    loadEssaysByJobId(job.id);
  }, [job.id, loadEssaysByJobId]);

  const handleSaveAnswer = React.useCallback(
    (essayId: EntityId, finalAnswer: string) => {
      saveAnswer(essayId, finalAnswer, job.id);
    },
    [job.id, saveAnswer],
  );

  const handleSubmitQuestion = () => {
    const question = questionModal?.question.trim();

    if (!questionModal || !question) {
      return;
    }

    if (questionModal.mode === 'create') {
      createEssay({
        jobId: job.id,
        question,
      });
    } else if (questionModal.essay) {
      updateEssayQuestion(questionModal.essay.id, question);
    }

    setQuestionModal(null);
  };

  const handleSubmitAttachment = () => {
    if (!attachmentModal || !attachmentModal.fileName.trim()) {
      return;
    }

    const input = {
      fileName: attachmentModal.fileName.trim(),
      fileType: attachmentModal.fileType,
      versionDescription: attachmentModal.versionDescription.trim(),
      localPathDescription: attachmentModal.localPathDescription.trim(),
      registeredDate: attachmentModal.registeredDate,
    };

    if (attachmentModal.attachment) {
      updateAttachment(attachmentModal.attachment.id, input, job.id);
    } else {
      createAttachment({
        jobId: job.id,
        essayId: attachmentModal.essay.id,
        ...input,
      });
    }

    setAttachmentModal(null);
  };

  return (
    <div className="grid gap-4">
      <Card className="shrink-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>자소서</CardTitle>
            <CardDescription className="mt-2">
              공고별 문항과 최종 제출 답변을 관리합니다.
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={() =>
              setQuestionModal({
                mode: 'create',
                essay: null,
                question: '',
              })
            }
          >
            <Plus className="size-4" aria-hidden />
            문항 추가
          </Button>
        </div>
      </Card>

      {essays.length === 0 ? (
        <Card>
          <EmptyState
            title="아직 등록된 자소서 문항이 없습니다."
            description="공고의 자소서 문항을 추가해보세요."
            action={
              <Button
                type="button"
                onClick={() =>
                  setQuestionModal({
                    mode: 'create',
                    essay: null,
                    question: '',
                  })
                }
              >
                <Plus className="size-4" aria-hidden />
                문항 추가
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {essays.map((essay, index) => (
            <EssayCard
              key={essay.id}
              essay={essay}
              number={index + 1}
              attachments={attachments.filter((item) =>
                essay.attachmentIds.includes(item.id),
              )}
              experiences={experiences}
              saveStatus={saveStatuses[essay.id]}
              onSaveAnswer={handleSaveAnswer}
              onEditQuestion={() =>
                setQuestionModal({
                  mode: 'edit',
                  essay,
                  question: essay.question,
                })
              }
              onDelete={() => setDeleteTarget(essay)}
              onOpenAttachmentModal={(attachment) =>
                setAttachmentModal(createAttachmentModalState(essay, attachment))
              }
              onExperienceIdsChange={(experienceIds) =>
                updateEssayExperienceLinks(essay.id, experienceIds, job.id)
              }
            />
          ))}
        </div>
      )}

      <QuestionModal
        state={questionModal}
        onStateChange={setQuestionModal}
        onSubmit={handleSubmitQuestion}
      />

      <AttachmentModal
        state={attachmentModal}
        onStateChange={setAttachmentModal}
        onSubmit={handleSubmitAttachment}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="자소서 문항 삭제"
        confirmLabel="삭제"
        danger
        onConfirm={() => {
          if (!deleteTarget) {
            return;
          }

          deleteEssay(deleteTarget.id, job.id);
          setDeleteTarget(null);
        }}
      >
        <Typography variant="body">
          이 자소서 문항과 작성한 답변을 삭제할까요?
        </Typography>
      </Modal>
    </div>
  );
}

function EssayCard({
  essay,
  number,
  attachments,
  experiences,
  saveStatus,
  onSaveAnswer,
  onEditQuestion,
  onDelete,
  onOpenAttachmentModal,
  onExperienceIdsChange,
}: {
  essay: Essay;
  number: number;
  attachments: AttachmentMetadata[];
  experiences: Experience[];
  saveStatus?: EssaySaveStatus;
  onSaveAnswer: (essayId: EntityId, finalAnswer: string) => void;
  onEditQuestion: () => void;
  onDelete: () => void;
  onOpenAttachmentModal: (attachment: AttachmentMetadata | null) => void;
  onExperienceIdsChange: (experienceIds: EntityId[]) => void;
}) {
  const [draftAnswer, setDraftAnswer] = React.useState(essay.finalAnswer);
  const isDirty = draftAnswer !== essay.finalAnswer;

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onSaveAnswer(essay.id, draftAnswer);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [draftAnswer, essay.id, isDirty, onSaveAnswer]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">문항 {number}</Badge>
              <SaveStatusText status={saveStatus} isDirty={isDirty} />
            </div>
            <CardTitle className="mt-3 whitespace-pre-wrap">
              {essay.question}
            </CardTitle>
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button type="button" variant="secondary" onClick={onEditQuestion}>
              <Pencil className="size-4" aria-hidden />
              수정
            </Button>
            <Button type="button" variant="secondary" onClick={onDelete}>
              <Trash2 className="size-4" aria-hidden />
              삭제
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Textarea
            label="최종 제출 답변"
            value={draftAnswer}
            onChange={(event) => setDraftAnswer(event.target.value)}
            className="min-h-64"
            placeholder="최종 제출할 답변을 입력하세요."
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Typography variant="caption" tone="secondary">
              {draftAnswer.length.toLocaleString('ko-KR')}자
            </Typography>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onSaveAnswer(essay.id, draftAnswer)}
            >
              <Save className="size-4" aria-hidden />
              수동 저장
            </Button>
          </div>

          <AttachmentSection
            attachments={attachments}
            onCreate={() => onOpenAttachmentModal(null)}
            onEdit={onOpenAttachmentModal}
          />

          <ExperienceSection
            experiences={experiences}
            selectedIds={essay.experienceIds}
            onChange={onExperienceIdsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AttachmentSection({
  attachments,
  onCreate,
  onEdit,
}: {
  attachments: AttachmentMetadata[];
  onCreate: () => void;
  onEdit: (attachment: AttachmentMetadata) => void;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Typography variant="card-title">첨부파일 정보</Typography>
          <Typography variant="caption" tone="secondary" className="mt-1 block">
            실제 파일은 업로드하지 않고 보관 위치 정보만 기록합니다.
          </Typography>
        </div>
        <Button type="button" variant="secondary" onClick={onCreate}>
          <Plus className="size-4" aria-hidden />
          파일 정보 등록
        </Button>
      </div>

      {attachments.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {attachments.map((attachment) => (
            <button
              key={attachment.id}
              type="button"
              className="rounded-[var(--radius-card)] border border-border bg-surface p-3 text-left transition-colors hover:bg-muted"
              onClick={() => onEdit(attachment)}
            >
              <div className="flex flex-wrap items-center gap-2">
                <FileText className="size-4 text-primary" aria-hidden />
                <Typography variant="small" className="font-medium">
                  {attachment.fileName}
                </Typography>
                <Badge variant="default">{attachment.fileType}</Badge>
              </div>
              <Typography variant="caption" tone="secondary" className="mt-2 block">
                {attachment.versionDescription || '설명 미입력'} ·{' '}
                {attachment.localPathDescription || '보관 위치 미입력'} ·{' '}
                {attachment.registeredDate || '등록일 미입력'}
              </Typography>
            </button>
          ))}
        </div>
      ) : (
        <Typography variant="caption" tone="secondary" className="mt-4 block">
          등록된 첨부파일 정보가 없습니다.
        </Typography>
      )}
    </section>
  );
}

function ExperienceSection({
  experiences,
  selectedIds,
  onChange,
}: {
  experiences: Experience[];
  selectedIds: EntityId[];
  onChange: (experienceIds: EntityId[]) => void;
}) {
  const selectedExperiences = experiences.filter((experience) =>
    selectedIds.includes(experience.id),
  );

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-background p-4">
      <Typography variant="card-title">Experience 연결</Typography>
      <Typography variant="caption" tone="secondary" className="mt-1 block">
        연결해도 경험 원문은 답변에 자동 복사되지 않습니다.
      </Typography>

      {experiences.length > 0 ? (
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2">
            {experiences.map((experience) => {
              const checked = selectedIds.includes(experience.id);

              return (
                <label
                  key={experience.id}
                  className="flex min-h-10 items-center gap-3 rounded-[var(--radius-card)] border border-border bg-surface px-3"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onChange([...selectedIds, experience.id]);
                        return;
                      }

                      onChange(selectedIds.filter((id) => id !== experience.id));
                    }}
                  />
                  <Typography variant="small">{experience.title}</Typography>
                </label>
              );
            })}
          </div>
          <LinkedExperienceList experiences={selectedExperiences} />
        </div>
      ) : (
        <EmptyState
          title="연결할 Experience가 없습니다."
          description="Experience 기능이 준비되면 이 문항과 연결할 수 있습니다."
        />
      )}
    </section>
  );
}

function LinkedExperienceList({
  experiences,
}: {
  experiences: Experience[];
}) {
  if (experiences.length === 0) {
    return (
      <Typography variant="caption" tone="secondary">
        연결된 Experience가 없습니다.
      </Typography>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {experiences.map((experience) => (
        <Badge key={experience.id} variant="primary">
          {experience.title}
        </Badge>
      ))}
    </div>
  );
}

function QuestionModal({
  state,
  onStateChange,
  onSubmit,
}: {
  state: EssayQuestionModalState | null;
  onStateChange: (state: EssayQuestionModalState | null) => void;
  onSubmit: () => void;
}) {
  return (
    <Modal
      open={Boolean(state)}
      onOpenChange={(open) => {
        if (!open) {
          onStateChange(null);
        }
      }}
      title={state?.mode === 'edit' ? '문항 수정' : '문항 추가'}
      confirmLabel={state?.mode === 'edit' ? '수정' : '추가'}
      onConfirm={onSubmit}
    >
      <Textarea
        label="문항"
        value={state?.question ?? ''}
        onChange={(event) => {
          if (!state) {
            return;
          }

          onStateChange({
            ...state,
            question: event.target.value,
          });
        }}
        placeholder="자소서 문항을 입력하세요."
      />
    </Modal>
  );
}

function AttachmentModal({
  state,
  onStateChange,
  onSubmit,
}: {
  state: AttachmentModalState | null;
  onStateChange: (state: AttachmentModalState | null) => void;
  onSubmit: () => void;
}) {
  return (
    <Modal
      open={Boolean(state)}
      onOpenChange={(open) => {
        if (!open) {
          onStateChange(null);
        }
      }}
      title={state?.attachment ? '첨부파일 정보 수정' : '첨부파일 정보 등록'}
      confirmLabel={state?.attachment ? '수정' : '등록'}
      onConfirm={onSubmit}
    >
      <div className="grid gap-4">
        <Input
          label="파일명"
          value={state?.fileName ?? ''}
          onChange={(event) => updateAttachmentModalField(state, onStateChange, 'fileName', event.target.value)}
        />
        <Select
          label="파일 종류"
            id="attachment-type"
            value={state?.fileType ?? '자소서'}
            onChange={(event) =>
              updateAttachmentModalField(
                state,
                onStateChange,
                'fileType',
                event.target.value as AttachmentType,
              )
            }
          >
            {ATTACHMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </Select>
        <Input
          label="버전 또는 설명"
          value={state?.versionDescription ?? ''}
          onChange={(event) =>
            updateAttachmentModalField(
              state,
              onStateChange,
              'versionDescription',
              event.target.value,
            )
          }
        />
        <Input
          label="내 컴퓨터의 보관 위치"
          value={state?.localPathDescription ?? ''}
          onChange={(event) =>
            updateAttachmentModalField(
              state,
              onStateChange,
              'localPathDescription',
              event.target.value,
            )
          }
        />
        <Input
          label="등록일"
          type="date"
          value={state?.registeredDate ?? ''}
          onChange={(event) =>
            updateAttachmentModalField(
              state,
              onStateChange,
              'registeredDate',
              event.target.value,
            )
          }
        />
      </div>
    </Modal>
  );
}

function SaveStatusText({
  status,
  isDirty,
}: {
  status?: EssaySaveStatus;
  isDirty: boolean;
}) {
  if (status?.state === 'saving') {
    return (
      <Typography variant="caption" className="text-primary">
        저장 중...
      </Typography>
    );
  }

  if (status?.state === 'error') {
    return (
      <Typography variant="caption" className="text-danger">
        저장하지 못했습니다.
      </Typography>
    );
  }

  if (isDirty) {
    return (
      <Typography variant="caption" tone="secondary">
        저장 대기 중...
      </Typography>
    );
  }

  if (status?.state === 'saved' && status.savedAt) {
    return (
      <Typography variant="caption" className="text-success">
        저장 완료 · {formatSavedAt(status.savedAt)}
      </Typography>
    );
  }

  return (
    <Typography variant="caption" tone="secondary">
      저장 준비 완료
    </Typography>
  );
}

function createAttachmentModalState(
  essay: Essay,
  attachment: AttachmentMetadata | null,
): AttachmentModalState {
  return {
    essay,
    attachment,
    fileName: attachment?.fileName ?? '',
    fileType: attachment?.fileType ?? '자소서',
    versionDescription: attachment?.versionDescription ?? '',
    localPathDescription: attachment?.localPathDescription ?? '',
    registeredDate:
      attachment?.registeredDate ?? new Date().toISOString().slice(0, 10),
  };
}

function updateAttachmentModalField<TKey extends keyof AttachmentModalState>(
  state: AttachmentModalState | null,
  onStateChange: (state: AttachmentModalState | null) => void,
  key: TKey,
  value: AttachmentModalState[TKey],
) {
  if (!state) {
    return;
  }

  onStateChange({
    ...state,
    [key]: value,
  });
}

function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export { EssayTab };
