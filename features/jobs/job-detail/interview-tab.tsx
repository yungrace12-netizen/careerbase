'use client';

import * as React from 'react';
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import {
  saveStatusKey,
  useInterviewStore,
  type InterviewSaveStatus,
} from '@/stores/interviewStore';
import type { Experience } from '@/types/essay';
import type {
  ActualInterviewQuestion,
  InterviewQuestion,
  InterviewStage,
  InterviewStatus,
} from '@/types/interview';
import {
  CUSTOM_INTERVIEW_STAGE_NAMES,
  INTERVIEW_STATUSES,
} from '@/types/interview';
import type { EntityId, Job } from '@/types/job';

type InterviewSubTab = 'prepare' | 'completed';
type QuestionModalType = 'expected' | 'actual';

interface InterviewTabProps {
  job: Job;
}

interface StageModalState {
  mode: 'create' | 'edit';
  stage: InterviewStage | null;
  name: string;
  order: string;
  status: InterviewStatus;
}

interface QuestionModalState {
  type: QuestionModalType;
  stageId: EntityId;
  questionId: EntityId | null;
  question: string;
}

interface DeleteQuestionTarget {
  type: QuestionModalType;
  stageId: EntityId;
  questionId: EntityId;
}

function InterviewTab({ job }: InterviewTabProps) {
  const stages = useInterviewStore((state) => state.stages);
  const experiences = useInterviewStore((state) => state.experiences);
  const saveStatuses = useInterviewStore((state) => state.saveStatuses);
  const loadStagesByJobId = useInterviewStore(
    (state) => state.loadStagesByJobId,
  );
  const createDefaultStages = useInterviewStore(
    (state) => state.createDefaultStages,
  );
  const createStage = useInterviewStore((state) => state.createStage);
  const updateStage = useInterviewStore((state) => state.updateStage);
  const deleteStage = useInterviewStore((state) => state.deleteStage);
  const reorderStages = useInterviewStore((state) => state.reorderStages);
  const updateStageStatus = useInterviewStore(
    (state) => state.updateStageStatus,
  );
  const addExpectedQuestion = useInterviewStore(
    (state) => state.addExpectedQuestion,
  );
  const updateExpectedQuestion = useInterviewStore(
    (state) => state.updateExpectedQuestion,
  );
  const deleteExpectedQuestion = useInterviewStore(
    (state) => state.deleteExpectedQuestion,
  );
  const saveExpectedAnswer = useInterviewStore(
    (state) => state.saveExpectedAnswer,
  );
  const updateExpectedQuestionExperienceLinks = useInterviewStore(
    (state) => state.updateExpectedQuestionExperienceLinks,
  );
  const addActualQuestion = useInterviewStore((state) => state.addActualQuestion);
  const updateActualQuestion = useInterviewStore(
    (state) => state.updateActualQuestion,
  );
  const deleteActualQuestion = useInterviewStore(
    (state) => state.deleteActualQuestion,
  );
  const saveActualQuestionMemo = useInterviewStore(
    (state) => state.saveActualQuestionMemo,
  );
  const saveRetrospective = useInterviewStore(
    (state) => state.saveRetrospective,
  );

  const [selectedStageId, setSelectedStageId] = React.useState<EntityId | null>(
    null,
  );
  const [activeSubTab, setActiveSubTab] =
    React.useState<InterviewSubTab>('prepare');
  const [stageModal, setStageModal] = React.useState<StageModalState | null>(
    null,
  );
  const [deleteStageTarget, setDeleteStageTarget] =
    React.useState<InterviewStage | null>(null);
  const [questionModal, setQuestionModal] =
    React.useState<QuestionModalState | null>(null);
  const [deleteQuestionTarget, setDeleteQuestionTarget] =
    React.useState<DeleteQuestionTarget | null>(null);

  React.useEffect(() => {
    loadStagesByJobId(job.id);
  }, [job.id, loadStagesByJobId]);

  const selectedStage =
    stages.find((stage) => stage.id === selectedStageId) ?? stages[0] ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const openCreateStageModal = () => {
    setStageModal({
      mode: 'create',
      stage: null,
      name: '직무면접',
      order: String(stages.length + 1),
      status: '준비 전',
    });
  };

  const openEditStageModal = (stage: InterviewStage) => {
    setStageModal({
      mode: 'edit',
      stage,
      name: stage.name,
      order: String(stage.order),
      status: stage.status,
    });
  };

  const handleSubmitStage = () => {
    if (!stageModal || !stageModal.name.trim()) {
      return;
    }

    const order = Number(stageModal.order) || stages.length + 1;

    if (stageModal.mode === 'create') {
      createStage({
        jobId: job.id,
        name: stageModal.name.trim(),
        order,
        status: stageModal.status,
      });
    } else if (stageModal.stage) {
      updateStage(
        stageModal.stage.id,
        {
          name: stageModal.name.trim(),
          order,
          status: stageModal.status,
        },
        job.id,
      );
    }

    setStageModal(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = stages.findIndex((stage) => stage.id === active.id);
    const newIndex = stages.findIndex((stage) => stage.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    setSelectedStageId(String(active.id));
    reorderStages(
      job.id,
      arrayMove(stages, oldIndex, newIndex).map((stage) => stage.id),
    );
  };

  const moveStage = (stageId: EntityId, direction: 'up' | 'down') => {
    const currentIndex = stages.findIndex((stage) => stage.id === stageId);
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= stages.length) {
      return;
    }

    setSelectedStageId(stageId);
    reorderStages(
      job.id,
      arrayMove(stages, currentIndex, nextIndex).map((stage) => stage.id),
    );
  };

  const handleSubmitQuestion = () => {
    if (!questionModal || !questionModal.question.trim()) {
      return;
    }

    if (questionModal.type === 'expected') {
      if (questionModal.questionId) {
        updateExpectedQuestion(
          questionModal.stageId,
          questionModal.questionId,
          questionModal.question.trim(),
          job.id,
        );
      } else {
        addExpectedQuestion(
          questionModal.stageId,
          questionModal.question.trim(),
          job.id,
        );
      }
    } else if (questionModal.questionId) {
      updateActualQuestion(
        questionModal.stageId,
        questionModal.questionId,
        questionModal.question.trim(),
        job.id,
      );
    } else {
      addActualQuestion(
        questionModal.stageId,
        questionModal.question.trim(),
        job.id,
      );
    }

    setQuestionModal(null);
  };

  if (stages.length === 0) {
    return (
      <InterviewEmptyState
        onCreateDefault={() => createDefaultStages(job.id)}
        onCreateCustom={openCreateStageModal}
        stageModal={stageModal}
        onStageModalChange={setStageModal}
        onSubmitStage={handleSubmitStage}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="shrink-0">
        <div className="grid gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>면접</CardTitle>
              <CardDescription className="mt-2">
                면접 단계별 준비와 완료 기록을 관리합니다.
              </CardDescription>
            </div>
            <Button type="button" onClick={openCreateStageModal}>
              <Plus className="size-4" aria-hidden />
              단계 추가
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stages.map((stage) => stage.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-2 overflow-x-auto pb-1">
                {stages.map((stage) => (
                  <SortableStageButton
                    key={stage.id}
                    stage={stage}
                    selected={selectedStage?.id === stage.id}
                    onSelect={() => setSelectedStageId(stage.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </Card>

      {selectedStage ? (
        <>
          <StageSummaryCard
            stage={selectedStage}
            isFirst={stages[0]?.id === selectedStage.id}
            isLast={stages[stages.length - 1]?.id === selectedStage.id}
            onEdit={() => openEditStageModal(selectedStage)}
            onDelete={() => setDeleteStageTarget(selectedStage)}
            onMoveUp={() => moveStage(selectedStage.id, 'up')}
            onMoveDown={() => moveStage(selectedStage.id, 'down')}
            onStatusChange={(status) =>
              updateStageStatus(selectedStage.id, status, job.id)
            }
          />

          <nav
            className="flex gap-2 overflow-x-auto border-b border-border pb-2"
            aria-label="Interview sub tabs"
          >
            {[
              { id: 'prepare', label: '면접 준비' },
              { id: 'completed', label: '면접 완료' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeSubTab === tab.id}
                onClick={() => setActiveSubTab(tab.id as InterviewSubTab)}
                className={
                  activeSubTab === tab.id
                    ? 'shrink-0 rounded-[var(--radius-button)] bg-primary px-4 py-2 text-[length:var(--text-small)] font-medium text-primary-foreground'
                    : 'shrink-0 rounded-[var(--radius-button)] px-4 py-2 text-[length:var(--text-small)] font-medium text-text-secondary transition-colors hover:bg-muted hover:text-text-primary'
                }
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeSubTab === 'prepare' ? (
            <InterviewPreparePanel
              stage={selectedStage}
              experiences={experiences}
              saveStatuses={saveStatuses}
              onAddQuestion={() =>
                setQuestionModal({
                  type: 'expected',
                  stageId: selectedStage.id,
                  questionId: null,
                  question: '',
                })
              }
              onEditQuestion={(question) =>
                setQuestionModal({
                  type: 'expected',
                  stageId: selectedStage.id,
                  questionId: question.id,
                  question: question.question,
                })
              }
              onDeleteQuestion={(questionId) =>
                setDeleteQuestionTarget({
                  type: 'expected',
                  stageId: selectedStage.id,
                  questionId,
                })
              }
              onSaveAnswer={(questionId, answer) =>
                saveExpectedAnswer(selectedStage.id, questionId, answer, job.id)
              }
              onExperienceIdsChange={(questionId, experienceIds) =>
                updateExpectedQuestionExperienceLinks(
                  selectedStage.id,
                  questionId,
                  experienceIds,
                  job.id,
                )
              }
            />
          ) : (
            <InterviewCompletedPanel
              stage={selectedStage}
              saveStatuses={saveStatuses}
              onAddQuestion={() =>
                setQuestionModal({
                  type: 'actual',
                  stageId: selectedStage.id,
                  questionId: null,
                  question: '',
                })
              }
              onEditQuestion={(question) =>
                setQuestionModal({
                  type: 'actual',
                  stageId: selectedStage.id,
                  questionId: question.id,
                  question: question.question,
                })
              }
              onDeleteQuestion={(questionId) =>
                setDeleteQuestionTarget({
                  type: 'actual',
                  stageId: selectedStage.id,
                  questionId,
                })
              }
              onSaveActualMemo={(questionId, input) =>
                saveActualQuestionMemo(
                  selectedStage.id,
                  questionId,
                  input,
                  job.id,
                )
              }
              onSaveRetrospective={(retrospective) =>
                saveRetrospective(selectedStage.id, retrospective, job.id)
              }
            />
          )}
        </>
      ) : null}

      <StageModal
        state={stageModal}
        onStateChange={setStageModal}
        onSubmit={handleSubmitStage}
      />

      <QuestionModal
        state={questionModal}
        onStateChange={setQuestionModal}
        onSubmit={handleSubmitQuestion}
      />

      <Modal
        open={Boolean(deleteStageTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteStageTarget(null);
          }
        }}
        title="면접 단계 삭제"
        confirmLabel="삭제"
        danger
        onConfirm={() => {
          if (!deleteStageTarget) {
            return;
          }

          deleteStage(deleteStageTarget.id, job.id);
          setDeleteStageTarget(null);
        }}
      >
        <Typography variant="body">
          이 면접 단계와 연결된 예상 질문, 실제 질문 및 회고를 삭제할까요?
        </Typography>
      </Modal>

      <Modal
        open={Boolean(deleteQuestionTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteQuestionTarget(null);
          }
        }}
        title="면접 질문 삭제"
        confirmLabel="삭제"
        danger
        onConfirm={() => {
          if (!deleteQuestionTarget) {
            return;
          }

          if (deleteQuestionTarget.type === 'expected') {
            deleteExpectedQuestion(
              deleteQuestionTarget.stageId,
              deleteQuestionTarget.questionId,
              job.id,
            );
          } else {
            deleteActualQuestion(
              deleteQuestionTarget.stageId,
              deleteQuestionTarget.questionId,
              job.id,
            );
          }

          setDeleteQuestionTarget(null);
        }}
      >
        <Typography variant="body">이 면접 질문을 삭제할까요?</Typography>
      </Modal>
    </div>
  );
}

function InterviewEmptyState({
  onCreateDefault,
  onCreateCustom,
  stageModal,
  onStageModalChange,
  onSubmitStage,
}: {
  onCreateDefault: () => void;
  onCreateCustom: () => void;
  stageModal: StageModalState | null;
  onStageModalChange: (state: StageModalState | null) => void;
  onSubmitStage: () => void;
}) {
  return (
    <div className="grid gap-4">
      <Card>
        <EmptyState
          title="아직 등록된 면접 단계가 없습니다."
          description="기본 단계를 추가하거나 사용자 지정 단계를 만들어보세요."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" onClick={onCreateDefault}>
                기본 단계 추가
              </Button>
              <Button type="button" variant="secondary" onClick={onCreateCustom}>
                사용자 지정 단계 추가
              </Button>
            </div>
          }
        />
      </Card>
      <StageModal
        state={stageModal}
        onStateChange={onStageModalChange}
        onSubmit={onSubmitStage}
      />
    </div>
  );
}

function SortableStageButton({
  stage,
  selected,
  onSelect,
}: {
  stage: InterviewStage;
  selected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="flex shrink-0 items-center gap-1"
    >
      <button
        type="button"
        className="rounded-[var(--radius-button)] p-2 text-text-secondary hover:bg-muted"
        aria-label={`${stage.name} 순서 변경`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onSelect}
        className={
          selected
            ? 'rounded-[var(--radius-button)] bg-primary px-4 py-2 text-[length:var(--text-small)] font-medium text-primary-foreground'
            : 'rounded-[var(--radius-button)] bg-background px-4 py-2 text-[length:var(--text-small)] font-medium text-text-secondary hover:bg-muted hover:text-text-primary'
        }
      >
        {stage.name}
      </button>
    </div>
  );
}

function StageSummaryCard({
  stage,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onStatusChange,
}: {
  stage: InterviewStage;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onStatusChange: (status: InterviewStatus) => void;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">순서 {stage.order}</Badge>
            <Badge variant={getStatusBadgeVariant(stage.status)}>
              {stage.status}
            </Badge>
            <Badge variant="default">
              {stage.scheduleId ? '예정일 연결됨' : '예정일 미연결'}
            </Badge>
          </div>
          <Typography variant="section">{stage.name}</Typography>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <select
            value={stage.status}
            onChange={(event) =>
              onStatusChange(event.target.value as InterviewStatus)
            }
            className="h-[var(--input-height)] rounded-[var(--radius-input)] border border-border bg-surface px-4 text-body text-text-primary outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label="면접 단계 상태"
          >
            {INTERVIEW_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ArrowUp className="size-4" aria-hidden />
            위
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ArrowDown className="size-4" aria-hidden />
            아래
          </Button>
          <Button type="button" variant="secondary" onClick={onEdit}>
            <Pencil className="size-4" aria-hidden />
            수정
          </Button>
          <Button type="button" variant="secondary" onClick={onDelete}>
            <Trash2 className="size-4" aria-hidden />
            삭제
          </Button>
        </div>
      </div>
    </Card>
  );
}

function InterviewPreparePanel({
  stage,
  experiences,
  saveStatuses,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onSaveAnswer,
  onExperienceIdsChange,
}: {
  stage: InterviewStage;
  experiences: Experience[];
  saveStatuses: Record<string, InterviewSaveStatus>;
  onAddQuestion: () => void;
  onEditQuestion: (question: InterviewQuestion) => void;
  onDeleteQuestion: (questionId: EntityId) => void;
  onSaveAnswer: (questionId: EntityId, answer: string) => void;
  onExperienceIdsChange: (
    questionId: EntityId,
    experienceIds: EntityId[],
  ) => void;
}) {
  return (
    <div className="grid gap-4">
      <Card className="shrink-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>예상 질문</CardTitle>
            <CardDescription className="mt-2">
              면접 전에 준비할 질문과 답변을 관리합니다.
            </CardDescription>
          </div>
          <Button type="button" onClick={onAddQuestion}>
            <Plus className="size-4" aria-hidden />
            질문 추가
          </Button>
        </div>
      </Card>

      {stage.expectedQuestions.length === 0 ? (
        <Card>
          <EmptyState
            title="아직 등록된 예상 질문이 없습니다."
            description="면접 준비를 위해 예상 질문을 추가해보세요."
            action={
              <Button type="button" onClick={onAddQuestion}>
                질문 추가
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {stage.expectedQuestions.map((question, index) => (
            <ExpectedQuestionCard
              key={question.id}
              question={question}
              number={index + 1}
              experiences={experiences}
              saveStatus={saveStatuses[saveStatusKey('expected', question.id)]}
              onEdit={() => onEditQuestion(question)}
              onDelete={() => onDeleteQuestion(question.id)}
              onSaveAnswer={(answer) => onSaveAnswer(question.id, answer)}
              onExperienceIdsChange={(experienceIds) =>
                onExperienceIdsChange(question.id, experienceIds)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InterviewCompletedPanel({
  stage,
  saveStatuses,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onSaveActualMemo,
  onSaveRetrospective,
}: {
  stage: InterviewStage;
  saveStatuses: Record<string, InterviewSaveStatus>;
  onAddQuestion: () => void;
  onEditQuestion: (question: ActualInterviewQuestion) => void;
  onDeleteQuestion: (questionId: EntityId) => void;
  onSaveActualMemo: (
    questionId: EntityId,
    input: {
      myAnswerMemo: string;
      improvementMemo: string;
    },
  ) => void;
  onSaveRetrospective: (retrospective: string) => void;
}) {
  return (
    <div className="grid gap-4">
      <RetrospectiveCard
        stage={stage}
        saveStatus={saveStatuses[saveStatusKey('retrospective', stage.id)]}
        onSave={onSaveRetrospective}
      />

      <Card className="shrink-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>실제 받은 질문</CardTitle>
            <CardDescription className="mt-2">
              면접 후 실제 질문과 답변 메모, 개선점을 기록합니다.
            </CardDescription>
          </div>
          <Button type="button" onClick={onAddQuestion}>
            <Plus className="size-4" aria-hidden />
            질문 추가
          </Button>
        </div>
      </Card>

      {stage.actualQuestions.length === 0 ? (
        <Card>
          <EmptyState
            title="아직 등록된 실제 면접 질문이 없습니다."
            description="면접에서 받은 질문을 추가해보세요."
            action={
              <Button type="button" onClick={onAddQuestion}>
                질문 추가
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {stage.actualQuestions.map((question, index) => (
            <ActualQuestionCard
              key={question.id}
              question={question}
              number={index + 1}
              saveStatus={saveStatuses[saveStatusKey('actual', question.id)]}
              onEdit={() => onEditQuestion(question)}
              onDelete={() => onDeleteQuestion(question.id)}
              onSave={(input) => onSaveActualMemo(question.id, input)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExpectedQuestionCard({
  question,
  number,
  experiences,
  saveStatus,
  onEdit,
  onDelete,
  onSaveAnswer,
  onExperienceIdsChange,
}: {
  question: InterviewQuestion;
  number: number;
  experiences: Experience[];
  saveStatus?: InterviewSaveStatus;
  onEdit: () => void;
  onDelete: () => void;
  onSaveAnswer: (answer: string) => void;
  onExperienceIdsChange: (experienceIds: EntityId[]) => void;
}) {
  const [draftAnswer, setDraftAnswer] = React.useState(question.answer);
  const isDirty = draftAnswer !== question.answer;

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onSaveAnswer(draftAnswer);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [draftAnswer, isDirty, onSaveAnswer]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">예상 질문 {number}</Badge>
              <SaveStatusText status={saveStatus} isDirty={isDirty} />
            </div>
            <CardTitle className="mt-3 whitespace-pre-wrap">
              {question.question}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button type="button" variant="secondary" onClick={onEdit}>
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
        <Textarea
          label="예상 답변"
          value={draftAnswer}
          onChange={(event) => setDraftAnswer(event.target.value)}
          className="min-h-56"
          placeholder="예상 답변을 입력하세요."
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSaveAnswer(draftAnswer)}
          >
            <Save className="size-4" aria-hidden />
            수동 저장
          </Button>
        </div>
        <ExperienceSection
          experiences={experiences}
          selectedIds={question.experienceIds}
          onChange={onExperienceIdsChange}
        />
      </CardContent>
    </Card>
  );
}

function ActualQuestionCard({
  question,
  number,
  saveStatus,
  onEdit,
  onDelete,
  onSave,
}: {
  question: ActualInterviewQuestion;
  number: number;
  saveStatus?: InterviewSaveStatus;
  onEdit: () => void;
  onDelete: () => void;
  onSave: (input: { myAnswerMemo: string; improvementMemo: string }) => void;
}) {
  const [myAnswerMemo, setMyAnswerMemo] = React.useState(question.myAnswerMemo);
  const [improvementMemo, setImprovementMemo] = React.useState(
    question.improvementMemo,
  );
  const isDirty =
    myAnswerMemo !== question.myAnswerMemo ||
    improvementMemo !== question.improvementMemo;

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onSave({ myAnswerMemo, improvementMemo });
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [improvementMemo, isDirty, myAnswerMemo, onSave]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">실제 질문 {number}</Badge>
              <SaveStatusText status={saveStatus} isDirty={isDirty} />
            </div>
            <CardTitle className="mt-3 whitespace-pre-wrap">
              {question.question}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button type="button" variant="secondary" onClick={onEdit}>
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
        <Textarea
          label="실제 답변 메모"
          value={myAnswerMemo}
          onChange={(event) => setMyAnswerMemo(event.target.value)}
          className="min-h-40"
          placeholder="면접에서 답변한 내용을 기록하세요."
        />
        <Textarea
          label="다음 개선점"
          value={improvementMemo}
          onChange={(event) => setImprovementMemo(event.target.value)}
          className="min-h-40"
          placeholder="다음 면접에서 개선할 점을 기록하세요."
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSave({ myAnswerMemo, improvementMemo })}
          >
            <Save className="size-4" aria-hidden />
            수동 저장
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RetrospectiveCard({
  stage,
  saveStatus,
  onSave,
}: {
  stage: InterviewStage;
  saveStatus?: InterviewSaveStatus;
  onSave: (retrospective: string) => void;
}) {
  const [draftRetrospective, setDraftRetrospective] = React.useState(
    stage.retrospective,
  );
  const isDirty = draftRetrospective !== stage.retrospective;

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onSave(draftRetrospective);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [draftRetrospective, isDirty, onSave]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>면접 회고</CardTitle>
          <SaveStatusText status={saveStatus} isDirty={isDirty} />
        </div>
        <CardDescription>
          단계 전체에 대한 회고와 다음 준비 방향을 작성합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          label="개선점 메모 및 회고"
          value={draftRetrospective}
          onChange={(event) => setDraftRetrospective(event.target.value)}
          className="min-h-48"
          placeholder="면접 회고를 입력하세요."
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSave(draftRetrospective)}
          >
            <Save className="size-4" aria-hidden />
            수동 저장
          </Button>
        </div>
      </CardContent>
    </Card>
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
          <div className="flex flex-wrap gap-2">
            {selectedExperiences.length > 0 ? (
              selectedExperiences.map((experience) => (
                <Badge key={experience.id} variant="primary">
                  {experience.title}
                </Badge>
              ))
            ) : (
              <Typography variant="caption" tone="secondary">
                연결된 Experience가 없습니다.
              </Typography>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          title="연결할 Experience가 없습니다."
          description="Experience 기능이 준비되면 이 답변과 연결할 수 있습니다."
        />
      )}
    </section>
  );
}

function StageModal({
  state,
  onStateChange,
  onSubmit,
}: {
  state: StageModalState | null;
  onStateChange: (state: StageModalState | null) => void;
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
      title={state?.mode === 'edit' ? '면접 단계 수정' : '면접 단계 추가'}
      confirmLabel={state?.mode === 'edit' ? '수정' : '추가'}
      onConfirm={onSubmit}
    >
      <div className="grid gap-4">
        <Input
          label="단계명"
          value={state?.name ?? ''}
          onChange={(event) =>
            state ? onStateChange({ ...state, name: event.target.value }) : null
          }
          list="interview-stage-name-options"
        />
        <datalist id="interview-stage-name-options">
          {CUSTOM_INTERVIEW_STAGE_NAMES.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <Input
          label="순서"
          type="number"
          value={state?.order ?? ''}
          onChange={(event) =>
            state ? onStateChange({ ...state, order: event.target.value }) : null
          }
        />
        <div className="grid gap-2">
          <Typography
            as="label"
            variant="small"
            className="font-medium"
            htmlFor="interview-stage-status"
          >
            상태
          </Typography>
          <select
            id="interview-stage-status"
            value={state?.status ?? '준비 전'}
            onChange={(event) =>
              state
                ? onStateChange({
                    ...state,
                    status: event.target.value as InterviewStatus,
                  })
                : null
            }
            className="h-[var(--input-height)] rounded-[var(--radius-input)] border border-border bg-surface px-4 text-body text-text-primary outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {INTERVIEW_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

function QuestionModal({
  state,
  onStateChange,
  onSubmit,
}: {
  state: QuestionModalState | null;
  onStateChange: (state: QuestionModalState | null) => void;
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
      title={state?.questionId ? '질문 수정' : '질문 추가'}
      confirmLabel={state?.questionId ? '수정' : '추가'}
      onConfirm={onSubmit}
    >
      <Textarea
        label="질문"
        value={state?.question ?? ''}
        onChange={(event) =>
          state
            ? onStateChange({
                ...state,
                question: event.target.value,
              })
            : null
        }
        placeholder="면접 질문을 입력하세요."
      />
    </Modal>
  );
}

function SaveStatusText({
  status,
  isDirty,
}: {
  status?: InterviewSaveStatus;
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

function getStatusBadgeVariant(status: InterviewStatus) {
  if (status === '완료') {
    return 'success';
  }

  if (status === '취소') {
    return 'danger';
  }

  if (status === '준비 중') {
    return 'inProgress';
  }

  if (status === '예정') {
    return 'primary';
  }

  return 'default';
}

function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export { InterviewTab };
