'use client';

import * as React from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';

import {
  Container,
  ContentWrapper,
  PageHeader,
  PageWrapper,
} from '@/components/layout';
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
  useExperienceStore,
  type ExperienceSaveStatus,
} from '@/stores/experienceStore';
import type {
  CreateExperienceInput,
  Experience,
  UpdateExperienceInput,
} from '@/types/essay';
import type { EntityId, Job } from '@/types/job';

type EditorMode = 'create' | 'edit';

interface ExperienceDraft {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  measurableOutcome: string;
  competencyTags: string[];
  relatedJobIds: EntityId[];
  memo: string;
}

const emptyDraft: ExperienceDraft = {
  title: '',
  situation: '',
  task: '',
  action: '',
  result: '',
  measurableOutcome: '',
  competencyTags: [],
  relatedJobIds: [],
  memo: '',
};

const suggestedTags = ['문제 해결', '협업', '데이터 분석', '기획', '커뮤니케이션'];

function ExperiencePage() {
  const experiences = useExperienceStore((state) => state.experiences);
  const filteredExperiences = useExperienceStore(
    (state) => state.filteredExperiences,
  );
  const jobs = useExperienceStore((state) => state.jobs);
  const query = useExperienceStore((state) => state.query);
  const selectedTag = useExperienceStore((state) => state.selectedTag);
  const selectedJobId = useExperienceStore((state) => state.selectedJobId);
  const saveStatuses = useExperienceStore((state) => state.saveStatuses);
  const loadExperiences = useExperienceStore((state) => state.loadExperiences);
  const createExperience = useExperienceStore(
    (state) => state.createExperience,
  );
  const deleteExperience = useExperienceStore(
    (state) => state.deleteExperience,
  );
  const saveExperience = useExperienceStore((state) => state.saveExperience);
  const search = useExperienceStore((state) => state.search);
  const setTagFilter = useExperienceStore((state) => state.setTagFilter);
  const setJobFilter = useExperienceStore((state) => state.setJobFilter);
  const resetFilters = useExperienceStore((state) => state.resetFilters);

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [editorMode, setEditorMode] = React.useState<EditorMode>('create');
  const [editingExperienceId, setEditingExperienceId] =
    React.useState<EntityId | null>(null);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Experience | null>(
    null,
  );

  React.useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const editingExperience =
    experiences.find((experience) => experience.id === editingExperienceId) ??
    null;
  const allTags = Array.from(
    new Set(experiences.flatMap((experience) => experience.competencyTags)),
  ).sort((a, b) => a.localeCompare(b, 'ko-KR'));
  const hasActiveFilter = Boolean(query || selectedTag || selectedJobId);

  const openCreateEditor = () => {
    setEditorMode('create');
    setEditingExperienceId(null);
    setEditorOpen(true);
  };

  const openEditEditor = (experience: Experience) => {
    setEditorMode('edit');
    setEditingExperienceId(experience.id);
    setEditorOpen(true);
  };

  const handleCreate = (input: CreateExperienceInput) => {
    const experience = createExperience(input);
    setEditorMode('edit');
    setEditingExperienceId(experience.id);
  };

  return (
    <PageWrapper className="lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
      <Container className="lg:h-full">
        <ContentWrapper className="lg:h-full lg:overflow-hidden">
          <PageHeader
            title="Experience Library"
            description="프로젝트, 업무, 활동 경험을 STAR 구조로 기록하고 자소서와 면접에서 연결합니다."
          >
            <Button type="button" onClick={openCreateEditor}>
              <Plus className="size-5" aria-hidden />
              경험 추가
            </Button>
          </PageHeader>

          <section className="grid min-h-0 flex-1 gap-4 lg:overflow-hidden">
            <Card className="shrink-0">
              <div className="grid gap-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                  <Input
                    label="검색"
                    value={query}
                    onChange={(event) => search(event.target.value)}
                    placeholder="제목, STAR 내용, 메모를 검색하세요."
                    containerClassName="lg:flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="md:hidden"
                    onClick={() => setFilterOpen((open) => !open)}
                  >
                    {filterOpen ? '필터 닫기' : '필터 열기'}
                  </Button>
                </div>

                <div
                  className={
                    filterOpen
                      ? 'grid gap-3 md:grid'
                      : 'hidden gap-3 md:grid md:grid-cols-2'
                  }
                >
                  <div className="grid gap-2">
                    <Typography variant="small" className="font-medium">
                      핵심 역량 태그
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setTagFilter('')}
                        className={
                          selectedTag
                            ? 'rounded-[var(--radius-badge)] bg-muted px-3 py-2 text-[length:var(--text-caption)] text-text-secondary'
                            : 'rounded-[var(--radius-badge)] bg-primary/10 px-3 py-2 text-[length:var(--text-caption)] font-medium text-primary'
                        }
                      >
                        전체
                      </button>
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setTagFilter(tag)}
                          className={
                            selectedTag === tag
                              ? 'rounded-[var(--radius-badge)] bg-primary/10 px-3 py-2 text-[length:var(--text-caption)] font-medium text-primary'
                              : 'rounded-[var(--radius-badge)] bg-muted px-3 py-2 text-[length:var(--text-caption)] text-text-secondary'
                          }
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Typography
                      as="label"
                      htmlFor="experience-job-filter"
                      variant="small"
                      className="font-medium"
                    >
                      관련 공고
                    </Typography>
                    <select
                      id="experience-job-filter"
                      value={selectedJobId}
                      onChange={(event) => setJobFilter(event.target.value)}
                      className="h-[var(--input-height)] rounded-[var(--radius-input)] border border-border bg-surface px-4 text-body text-text-primary outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                    >
                      <option value="">전체 공고</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.companyName} · {job.postingTitle}
                          {job.isArchived ? ' (Archive)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {hasActiveFilter ? (
                  <div className="flex justify-end">
                    <Button type="button" variant="secondary" onClick={resetFilters}>
                      검색어와 필터 초기화
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>

            <div className="min-h-0 lg:overflow-y-auto lg:pr-1">
              {experiences.length === 0 ? (
                <Card>
                  <EmptyState
                    title="아직 저장된 경험이 없습니다."
                    description="프로젝트, 업무, 활동 경험을 기록해두면 자소서와 면접에서 재사용할 수 있습니다."
                    action={
                      <Button type="button" onClick={openCreateEditor}>
                        경험 추가
                      </Button>
                    }
                  />
                </Card>
              ) : filteredExperiences.length === 0 ? (
                <Card>
                  <EmptyState
                    title="조건에 맞는 경험이 없습니다."
                    description="검색어나 필터 조건을 바꿔 다시 확인해보세요."
                    action={
                      <Button type="button" variant="secondary" onClick={resetFilters}>
                        검색어와 필터 초기화
                      </Button>
                    }
                  />
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredExperiences.map((experience) => (
                    <ExperienceCard
                      key={experience.id}
                      experience={experience}
                      jobs={jobs}
                      onOpen={() => openEditEditor(experience)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </ContentWrapper>
      </Container>

      {editorOpen ? (
        <ExperienceEditorModal
          key={`${editorMode}-${editingExperience?.id ?? 'new'}`}
          mode={editorMode}
          open={editorOpen}
          experience={editingExperience}
          jobs={jobs}
          saveStatus={
            editingExperience ? saveStatuses[editingExperience.id] : undefined
          }
          onOpenChange={setEditorOpen}
          onCreate={handleCreate}
          onSave={(id, input) => saveExperience(id, input)}
          onDelete={(experience) => {
            setEditorOpen(false);
            setDeleteTarget(experience);
          }}
        />
      ) : null}

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Experience 삭제"
        confirmLabel="삭제"
        danger
        onConfirm={() => {
          if (!deleteTarget) {
            return;
          }

          deleteExperience(deleteTarget.id);
          setDeleteTarget(null);
        }}
      >
        <Typography variant="body">
          이 경험을 삭제할까요? 자소서와 면접에 연결된 기록에서도 연결이
          해제됩니다.
        </Typography>
      </Modal>
    </PageWrapper>
  );
}

function ExperienceCard({
  experience,
  jobs,
  onOpen,
}: {
  experience: Experience;
  jobs: Job[];
  onOpen: () => void;
}) {
  return (
    <button type="button" className="h-full text-left" onClick={onOpen}>
      <Card className="h-full transition-colors hover:border-primary/40">
        <CardHeader>
          <CardTitle>{experience.title || '제목 없는 경험'}</CardTitle>
          <CardDescription>
            최근 수정일 {formatDateTime(experience.updatedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {experience.competencyTags.length > 0 ? (
              experience.competencyTags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge variant="default">태그 없음</Badge>
            )}
          </div>
          <SummaryItem label="결과 요약" value={experience.result} />
          <SummaryItem label="수치 성과" value={experience.measurableOutcome} />
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              연결된 공고 {experience.relatedJobIds.length}개
            </Badge>
            {getRelatedJobs(experience, jobs).some((job) => job.isArchived) ? (
              <Badge variant="archive">Archive 포함</Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <Typography variant="caption" tone="secondary">
        {label}
      </Typography>
      <Typography variant="small" className="line-clamp-3">
        {value || '미입력'}
      </Typography>
    </div>
  );
}

function ExperienceEditorModal({
  mode,
  open,
  experience,
  jobs,
  saveStatus,
  onOpenChange,
  onCreate,
  onSave,
  onDelete,
}: {
  mode: EditorMode;
  open: boolean;
  experience: Experience | null;
  jobs: Job[];
  saveStatus?: ExperienceSaveStatus;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: CreateExperienceInput) => void;
  onSave: (id: EntityId, input: UpdateExperienceInput) => void;
  onDelete: (experience: Experience) => void;
}) {
  const [draft, setDraft] = React.useState<ExperienceDraft>(
    experience ? experienceToDraft(experience) : emptyDraft,
  );
  const [tagInput, setTagInput] = React.useState('');

  const autoSaveDirty = experience
    ? draft.situation !== experience.situation ||
      draft.task !== experience.task ||
      draft.action !== experience.action ||
      draft.result !== experience.result ||
      draft.measurableOutcome !== experience.measurableOutcome ||
      draft.memo !== experience.memo
    : false;
  const canSubmit = draft.title.trim().length > 0;

  React.useEffect(() => {
    if (!experience || !autoSaveDirty) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onSave(experience.id, {
        situation: draft.situation,
        task: draft.task,
        action: draft.action,
        result: draft.result,
        measurableOutcome: draft.measurableOutcome,
        memo: draft.memo,
      });
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [
    autoSaveDirty,
    draft.action,
    draft.measurableOutcome,
    draft.memo,
    draft.result,
    draft.situation,
    draft.task,
    experience,
    onSave,
  ]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag || draft.competencyTags.includes(trimmedTag)) {
      setTagInput('');
      return;
    }

    setDraft((current) => ({
      ...current,
      competencyTags: [...current.competencyTags, trimmedTag],
    }));
    setTagInput('');
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    const input = draftToInput(draft);

    if (mode === 'create') {
      onCreate(input);
      return;
    }

    if (experience) {
      onSave(experience.id, input);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? '경험 추가' : '경험 상세 및 수정'}
      description="STAR 구조와 핵심 역량, 관련 공고를 기록합니다."
      className="max-h-[90dvh] max-w-4xl overflow-hidden"
      footer={
        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <div>
            {mode === 'edit' && experience ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onDelete(experience)}
              >
                <Trash2 className="size-4" aria-hidden />
                삭제
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              닫기
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
              <Save className="size-4" aria-hidden />
              {mode === 'create' ? '추가' : '수동 저장'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="max-h-[calc(90dvh-12rem)] overflow-y-auto pr-1">
        <div className="grid gap-5">
          {mode === 'edit' ? (
            <SaveStatusText status={saveStatus} isDirty={autoSaveDirty} />
          ) : null}

          <Input
            label="경험명"
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="경험 제목을 입력하세요."
          />

          <section className="grid gap-4 rounded-[var(--radius-card)] border border-border bg-background p-4">
            <div>
              <Typography variant="card-title">STAR 구조</Typography>
              <Typography variant="small" tone="secondary" className="mt-1">
                각 항목을 분리해두면 자소서와 면접에서 필요한 경험을 빠르게
                찾을 수 있습니다.
              </Typography>
            </div>
            <Textarea
              label="Situation: 당시 상황"
              value={draft.situation}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  situation: event.target.value,
                }))
              }
              placeholder="당시 상황을 입력하세요."
              className="min-h-28"
            />
            <Textarea
              label="Task: 해결해야 했던 과제"
              value={draft.task}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  task: event.target.value,
                }))
              }
              placeholder="과제 또는 문제를 입력하세요."
              className="min-h-28"
            />
            <Textarea
              label="Action: 직접 수행한 행동"
              value={draft.action}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  action: event.target.value,
                }))
              }
              placeholder="직접 수행한 행동을 입력하세요."
              className="min-h-28"
            />
            <Textarea
              label="Result: 결과와 성과"
              value={draft.result}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  result: event.target.value,
                }))
              }
              placeholder="결과와 성과를 입력하세요."
              className="min-h-28"
            />
          </section>

          <Textarea
            label="수치 성과"
            value={draft.measurableOutcome}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                measurableOutcome: event.target.value,
              }))
            }
            placeholder="예: 전환율 12% 개선, 처리 시간 30% 단축"
            className="min-h-24"
          />

          <TagEditor
            tags={draft.competencyTags}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onAddTag={addTag}
            onRemoveTag={(tag) =>
              setDraft((current) => ({
                ...current,
                competencyTags: current.competencyTags.filter(
                  (item) => item !== tag,
                ),
              }))
            }
          />

          <RelatedJobSelector
            jobs={jobs}
            selectedIds={draft.relatedJobIds}
            onChange={(relatedJobIds) =>
              setDraft((current) => ({
                ...current,
                relatedJobIds,
              }))
            }
          />

          <Textarea
            label="자유 메모"
            value={draft.memo}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                memo: event.target.value,
              }))
            }
            placeholder="이 경험과 관련해 추가로 기억할 내용을 입력하세요."
            className="min-h-32"
          />
        </div>
      </div>
    </Modal>
  );
}

function TagEditor({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}) {
  return (
    <section className="grid gap-3 rounded-[var(--radius-card)] border border-border bg-background p-4">
      <div>
        <Typography variant="card-title">핵심 역량 태그</Typography>
        <Typography variant="small" tone="secondary" className="mt-1">
          중복 태그와 빈 태그는 저장하지 않습니다.
        </Typography>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          label="태그 입력"
          value={tagInput}
          onChange={(event) => onTagInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAddTag(tagInput);
            }
          }}
          placeholder="예: 문제 해결"
          containerClassName="sm:flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          className="self-end"
          onClick={() => onAddTag(tagInput)}
        >
          태그 추가
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onAddTag(tag)}
            className="rounded-[var(--radius-badge)] bg-muted px-3 py-2 text-[length:var(--text-caption)] text-text-secondary hover:text-text-primary"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge key={tag} variant="primary" className="gap-2">
              {tag}
              <button
                type="button"
                aria-label={`${tag} 태그 삭제`}
                onClick={() => onRemoveTag(tag)}
                className="rounded-[var(--radius-button)]"
              >
                <X className="size-3" aria-hidden />
              </button>
            </Badge>
          ))
        ) : (
          <Typography variant="caption" tone="secondary">
            등록된 태그가 없습니다.
          </Typography>
        )}
      </div>
    </section>
  );
}

function RelatedJobSelector({
  jobs,
  selectedIds,
  onChange,
}: {
  jobs: Job[];
  selectedIds: EntityId[];
  onChange: (jobIds: EntityId[]) => void;
}) {
  const selectedJobs = jobs.filter((job) => selectedIds.includes(job.id));

  return (
    <section className="grid gap-3 rounded-[var(--radius-card)] border border-border bg-background p-4">
      <div>
        <Typography variant="card-title">관련 공고</Typography>
        <Typography variant="small" tone="secondary" className="mt-1">
          여러 공고를 연결할 수 있으며, Job 원본 데이터는 변경하지 않습니다.
        </Typography>
      </div>
      {jobs.length > 0 ? (
        <div className="grid gap-2">
          {jobs.map((job) => {
            const checked = selectedIds.includes(job.id);

            return (
              <label
                key={job.id}
                className="flex min-h-10 items-center gap-3 rounded-[var(--radius-card)] border border-border bg-surface px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onChange([...selectedIds, job.id]);
                      return;
                    }

                    onChange(selectedIds.filter((id) => id !== job.id));
                  }}
                />
                <span className="min-w-0 flex-1">
                  <Typography variant="small" className="truncate">
                    {job.companyName} · {job.postingTitle}
                  </Typography>
                </span>
                {job.isArchived ? <Badge variant="archive">Archive</Badge> : null}
              </label>
            );
          })}
        </div>
      ) : (
        <Typography variant="small" tone="secondary">
          연결할 공고가 없습니다.
        </Typography>
      )}
      <div className="flex flex-wrap gap-2">
        {selectedJobs.length > 0 ? (
          selectedJobs.map((job) => (
            <Badge key={job.id} variant={job.isArchived ? 'archive' : 'primary'}>
              {job.companyName}
              {job.isArchived ? ' · Archive' : ''}
            </Badge>
          ))
        ) : (
          <Typography variant="caption" tone="secondary">
            연결된 공고가 없습니다.
          </Typography>
        )}
      </div>
    </section>
  );
}

function SaveStatusText({
  status,
  isDirty,
}: {
  status?: ExperienceSaveStatus;
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
        저장 완료 · {formatTime(status.savedAt)}
      </Typography>
    );
  }

  return (
    <Typography variant="caption" tone="secondary">
      저장 준비 완료
    </Typography>
  );
}

function experienceToDraft(experience: Experience): ExperienceDraft {
  return {
    title: experience.title,
    situation: experience.situation,
    task: experience.task,
    action: experience.action,
    result: experience.result,
    measurableOutcome: experience.measurableOutcome,
    competencyTags: experience.competencyTags,
    relatedJobIds: experience.relatedJobIds,
    memo: experience.memo,
  };
}

function draftToInput(draft: ExperienceDraft): CreateExperienceInput {
  return {
    title: draft.title.trim(),
    situation: draft.situation,
    task: draft.task,
    action: draft.action,
    result: draft.result,
    measurableOutcome: draft.measurableOutcome,
    competencyTags: draft.competencyTags,
    relatedJobIds: draft.relatedJobIds,
    memo: draft.memo,
  };
}

function getRelatedJobs(experience: Experience, jobs: Job[]) {
  return jobs.filter((job) => experience.relatedJobIds.includes(job.id));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export { ExperiencePage };
