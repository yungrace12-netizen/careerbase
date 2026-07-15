'use client';

import * as React from 'react';
import {
  ChevronDown,
  Download,
  ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';

import {
  Container,
  ContentWrapper,
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
import { DateInput } from '@/components/ui/date-input';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toast, ToastViewport } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import {
  scheduleCareerAutoSave,
  statusKey,
  useProfileStore,
  type ProfileSaveStatus,
} from '@/stores/profileStore';
import type { EntityId } from '@/types/job';
import type {
  Activity,
  ActivityType,
  Award,
  Career,
  Certificate,
  CreateActivityInput,
  CreateAwardInput,
  CreateCareerInput,
  CreateCertificateInput,
  CreateHighSchoolInput,
  CreateLanguageInput,
  CreateUniversityInput,
  HighSchool,
  LanguageQualification,
  Profile,
  University,
  UpdateCareerInput,
  UpdatePersonalInfoInput,
} from '@/types/profile';
import { ACTIVITY_TYPES } from '@/types/profile';

type SectionId =
  | 'personal'
  | 'highSchools'
  | 'universities'
  | 'careers'
  | 'languages'
  | 'certificates'
  | 'awards'
  | 'activities'
  | 'other';

type EditorState =
  | { kind: 'highSchool'; item: HighSchool | null }
  | { kind: 'university'; item: University | null }
  | { kind: 'career'; item: Career | null }
  | { kind: 'language'; item: LanguageQualification | null }
  | { kind: 'certificate'; item: Certificate | null }
  | { kind: 'award'; item: Award | null }
  | { kind: 'activity'; item: Activity | null };

type DeleteTarget = {
  kind: EditorState['kind'];
  id: EntityId;
  message: string;
};

const sectionTitles: Record<SectionId, string> = {
  personal: '기본 인적사항',
  highSchools: '고등학교',
  universities: '대학교',
  careers: '경력',
  languages: '어학',
  certificates: '자격증',
  awards: '수상경력',
  activities: '학내외활동',
  other: '기타',
};

function ProfilePage() {
  const profile = useProfileStore((state) => state.profile);
  const saveStatuses = useProfileStore((state) => state.saveStatuses);
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const updatePersonalInfoDraft = useProfileStore(
    (state) => state.updatePersonalInfoDraft,
  );
  const savePersonalInfo = useProfileStore((state) => state.savePersonalInfo);
  const updateOtherInfoDraft = useProfileStore(
    (state) => state.updateOtherInfoDraft,
  );
  const saveOtherInfo = useProfileStore((state) => state.saveOtherInfo);
  const addHighSchool = useProfileStore((state) => state.addHighSchool);
  const updateHighSchool = useProfileStore((state) => state.updateHighSchool);
  const deleteHighSchool = useProfileStore((state) => state.deleteHighSchool);
  const addUniversity = useProfileStore((state) => state.addUniversity);
  const updateUniversity = useProfileStore((state) => state.updateUniversity);
  const deleteUniversity = useProfileStore((state) => state.deleteUniversity);
  const addCareer = useProfileStore((state) => state.addCareer);
  const updateCareer = useProfileStore((state) => state.updateCareer);
  const deleteCareer = useProfileStore((state) => state.deleteCareer);
  const saveCareerLongFields = useProfileStore(
    (state) => state.saveCareerLongFields,
  );
  const addLanguage = useProfileStore((state) => state.addLanguage);
  const updateLanguage = useProfileStore((state) => state.updateLanguage);
  const deleteLanguage = useProfileStore((state) => state.deleteLanguage);
  const addCertificate = useProfileStore((state) => state.addCertificate);
  const updateCertificate = useProfileStore(
    (state) => state.updateCertificate,
  );
  const deleteCertificate = useProfileStore(
    (state) => state.deleteCertificate,
  );
  const addAward = useProfileStore((state) => state.addAward);
  const updateAward = useProfileStore((state) => state.updateAward);
  const deleteAward = useProfileStore((state) => state.deleteAward);
  const addActivity = useProfileStore((state) => state.addActivity);
  const updateActivity = useProfileStore((state) => state.updateActivity);
  const deleteActivity = useProfileStore((state) => state.deleteActivity);

  const [openSections, setOpenSections] = React.useState<Record<SectionId, boolean>>({
    personal: true,
    highSchools: false,
    universities: false,
    careers: false,
    languages: false,
    certificates: false,
    awards: false,
    activities: false,
    other: false,
  });
  const [editor, setEditor] = React.useState<EditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget | null>(
    null,
  );
  const [toast, setToast] = React.useState<{
    variant: 'success' | 'error';
    title: string;
  } | null>(null);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const toggleSection = (sectionId: SectionId) => {
    setOpenSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  const closeEditor = () => setEditor(null);
  const showSaveToast = (success: boolean) => {
    setToast({
      variant: success ? 'success' : 'error',
      title: success
        ? '저장되었습니다.'
        : '저장하지 못했습니다. 잠시 후 다시 시도해주세요.',
    });
  };

  const handleManualPersonalInfoSave = () => {
    showSaveToast(savePersonalInfo());
  };

  const handleManualOtherInfoSave = () => {
    showSaveToast(saveOtherInfo());
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    switch (deleteTarget.kind) {
      case 'highSchool':
        deleteHighSchool(deleteTarget.id);
        break;
      case 'university':
        deleteUniversity(deleteTarget.id);
        break;
      case 'career':
        deleteCareer(deleteTarget.id);
        break;
      case 'language':
        deleteLanguage(deleteTarget.id);
        break;
      case 'certificate':
        deleteCertificate(deleteTarget.id);
        break;
      case 'award':
        deleteAward(deleteTarget.id);
        break;
      case 'activity':
        deleteActivity(deleteTarget.id);
        break;
    }

    setDeleteTarget(null);
  };

  if (!profile) {
    return (
      <PageWrapper>
        <Container className="max-w-5xl">
          <Card>
            <EmptyState title="프로필 정보를 불러오는 중입니다." />
          </Card>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container className="max-w-5xl">
        <ContentWrapper>
          <Typography variant="body" tone="secondary">
            공통 이력 정보를 관리합니다. 저장한 정보는 특정 공고에 종속되지 않습니다.
          </Typography>

          <div className="flex flex-col gap-4">
            <AccordionSection
              title={sectionTitles.personal}
              open={openSections.personal}
              onToggle={() => toggleSection('personal')}
            >
              <PersonalInfoSection
                profile={profile}
                saveStatus={saveStatuses[statusKey('personalInfo')]}
                onChange={updatePersonalInfoDraft}
                onSave={handleManualPersonalInfoSave}
                onToast={setToast}
              />
            </AccordionSection>

            <ListSection
              sectionId="highSchools"
              open={openSections.highSchools}
              items={profile.highSchools}
              emptyTitle="등록된 고등학교가 없습니다."
              addLabel="고등학교 추가"
              onToggle={() => toggleSection('highSchools')}
              onAdd={() => setEditor({ kind: 'highSchool', item: null })}
              renderItem={(item) => (
                <ProfileItemCard
                  key={item.id}
                  title={item.schoolName || '학교명 미입력'}
                  description={joinSummary([
                    formatDateRange(item.admissionDate, item.graduationDate),
                    item.location,
                    item.academicTrack,
                  ])}
                  onEdit={() => setEditor({ kind: 'highSchool', item })}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'highSchool',
                      id: item.id,
                      message: '이 고등학교 정보를 삭제할까요?',
                    })
                  }
                />
              )}
            />

            <ListSection
              sectionId="universities"
              open={openSections.universities}
              items={profile.universities}
              emptyTitle="등록된 대학교가 없습니다."
              addLabel="대학교 추가"
              onToggle={() => toggleSection('universities')}
              onAdd={() => setEditor({ kind: 'university', item: null })}
              renderItem={(item) => (
                <ProfileItemCard
                  key={item.id}
                  title={item.universityName || '대학명 미입력'}
                  description={joinSummary([
                    item.major,
                    formatDateRange(item.admissionDate, item.graduationDate),
                    formatGpa(item.overallGpa, item.overallGpaScale),
                  ])}
                  onEdit={() => setEditor({ kind: 'university', item })}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'university',
                      id: item.id,
                      message: '이 대학교 정보를 삭제할까요?',
                    })
                  }
                />
              )}
            />

            <ListSection
              sectionId="careers"
              open={openSections.careers}
              items={profile.careers}
              emptyTitle="등록된 경력이 없습니다."
              addLabel="경력 추가"
              onToggle={() => toggleSection('careers')}
              onAdd={() => setEditor({ kind: 'career', item: null })}
              renderItem={(item) => (
                <ProfileItemCard
                  key={item.id}
                  title={item.companyName || '직장명 미입력'}
                  description={joinSummary([
                    item.position,
                    item.department,
                    formatDateRange(
                      item.employmentStartDate,
                      item.isCurrentlyEmployed ? null : item.employmentEndDate,
                      item.isCurrentlyEmployed ? '재직 중' : undefined,
                    ),
                  ])}
                  badges={item.isCurrentlyEmployed ? ['재직 중'] : []}
                  onEdit={() => setEditor({ kind: 'career', item })}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'career',
                      id: item.id,
                      message: '이 경력 정보를 삭제할까요?',
                    })
                  }
                />
              )}
            />

            <ListSection
              sectionId="languages"
              open={openSections.languages}
              items={profile.languages}
              emptyTitle="등록된 어학 정보가 없습니다."
              addLabel="어학 추가"
              onToggle={() => toggleSection('languages')}
              onAdd={() => setEditor({ kind: 'language', item: null })}
              renderItem={(item) => (
                <ProfileItemCard
                  key={item.id}
                  title={item.qualificationName || '자격증명 미입력'}
                  description={joinSummary([
                    item.registrationNumber,
                    formatScore(item.score, item.scoreScale),
                    item.testDate,
                  ])}
                  onEdit={() => setEditor({ kind: 'language', item })}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'language',
                      id: item.id,
                      message: '이 어학 정보를 삭제할까요?',
                    })
                  }
                />
              )}
            />

            <ListSection
              sectionId="certificates"
              open={openSections.certificates}
              items={profile.certificates}
              emptyTitle="등록된 자격증이 없습니다."
              addLabel="자격증 추가"
              onToggle={() => toggleSection('certificates')}
              onAdd={() => setEditor({ kind: 'certificate', item: null })}
              renderItem={(item) => (
                <ProfileItemCard
                  key={item.id}
                  title={item.certificateName || '자격증명 미입력'}
                  description={joinSummary([
                    item.issuingOrganization,
                    item.registrationNumber,
                    item.acquisitionDate,
                  ])}
                  onEdit={() => setEditor({ kind: 'certificate', item })}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'certificate',
                      id: item.id,
                      message: '이 자격증 정보를 삭제할까요?',
                    })
                  }
                />
              )}
            />

            <ListSection
              sectionId="awards"
              open={openSections.awards}
              items={profile.awards}
              emptyTitle="등록된 수상경력이 없습니다."
              addLabel="수상경력 추가"
              onToggle={() => toggleSection('awards')}
              onAdd={() => setEditor({ kind: 'award', item: null })}
              renderItem={(item) => (
                <ProfileItemCard
                  key={item.id}
                  title={item.awardName || '상훈명 미입력'}
                  description={joinSummary([
                    item.awardingOrganization,
                    item.awardDate,
                    item.description,
                  ])}
                  onEdit={() => setEditor({ kind: 'award', item })}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'award',
                      id: item.id,
                      message: '이 수상경력 정보를 삭제할까요?',
                    })
                  }
                />
              )}
            />

            <ListSection
              sectionId="activities"
              open={openSections.activities}
              items={profile.activities}
              emptyTitle="등록된 학내외활동이 없습니다."
              addLabel="학내외활동 추가"
              onToggle={() => toggleSection('activities')}
              onAdd={() => setEditor({ kind: 'activity', item: null })}
              renderItem={(item) => (
                <ProfileItemCard
                  key={item.id}
                  title={item.organizationName || '기관 및 조직명 미입력'}
                  description={joinSummary([
                    item.activityType,
                    item.role,
                    formatMonthRange(item.startMonth, item.endMonth),
                  ])}
                  onEdit={() => setEditor({ kind: 'activity', item })}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'activity',
                      id: item.id,
                      message: '이 학내외활동 정보를 삭제할까요?',
                    })
                  }
                />
              )}
            />

            <AccordionSection
              title={sectionTitles.other}
              open={openSections.other}
              onToggle={() => toggleSection('other')}
            >
              <OtherInfoSection
                profile={profile}
                saveStatus={saveStatuses[statusKey('otherInfo')]}
                onChange={updateOtherInfoDraft}
                onSave={handleManualOtherInfoSave}
              />
            </AccordionSection>
          </div>
        </ContentWrapper>
      </Container>

      {editor ? (
        <ProfileEditorModal
          key={`${editor.kind}-${editor.item?.id ?? 'new'}`}
          editor={editor}
          saveStatus={
            editor.kind === 'career' && editor.item
              ? saveStatuses[statusKey('career', editor.item.id)]
              : undefined
          }
          onOpenChange={(open) => {
            if (!open) {
              closeEditor();
            }
          }}
          onSubmit={(input) => {
            try {
              switch (editor.kind) {
                case 'highSchool':
                  if (editor.item) {
                    updateHighSchool(editor.item.id, input as CreateHighSchoolInput);
                  } else {
                    addHighSchool(input as CreateHighSchoolInput);
                  }
                  break;
                case 'university':
                  if (editor.item) {
                    updateUniversity(editor.item.id, input as CreateUniversityInput);
                  } else {
                    addUniversity(input as CreateUniversityInput);
                  }
                  break;
                case 'career':
                  if (editor.item) {
                    updateCareer(editor.item.id, input as CreateCareerInput);
                  } else {
                    addCareer(input as CreateCareerInput);
                  }
                  break;
                case 'language':
                  if (editor.item) {
                    updateLanguage(editor.item.id, input as CreateLanguageInput);
                  } else {
                    addLanguage(input as CreateLanguageInput);
                  }
                  break;
                case 'certificate':
                  if (editor.item) {
                    updateCertificate(editor.item.id, input as CreateCertificateInput);
                  } else {
                    addCertificate(input as CreateCertificateInput);
                  }
                  break;
                case 'award':
                  if (editor.item) {
                    updateAward(editor.item.id, input as CreateAwardInput);
                  } else {
                    addAward(input as CreateAwardInput);
                  }
                  break;
                case 'activity':
                  if (editor.item) {
                    updateActivity(editor.item.id, input as CreateActivityInput);
                  } else {
                    addActivity(input as CreateActivityInput);
                  }
                  break;
              }

              showSaveToast(true);
              closeEditor();
            } catch {
              showSaveToast(false);
            }
          }}
          onCareerLongFieldAutoSave={(id, input) =>
            saveCareerLongFields(id, input)
          }
        />
      ) : null}

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="정보 삭제"
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
      >
        <Typography variant="body">
          {deleteTarget?.message ?? '이 정보를 삭제할까요?'}
        </Typography>
      </Modal>

      {toast ? (
        <ToastViewport>
          <Toast
            variant={toast.variant}
            title={toast.title}
            onClose={() => setToast(null)}
          />
        </ToastViewport>
      ) : null}
    </PageWrapper>
  );
}

function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-[var(--touch-target)] w-full items-center justify-between gap-4 px-[var(--component-padding)] py-4 text-left"
      >
        <Typography variant="section">{title}</Typography>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-text-secondary transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="border-t border-border p-[var(--component-padding)]">
          {children}
        </div>
      ) : null}
    </Card>
  );
}

function ListSection<TItem>({
  sectionId,
  open,
  items,
  emptyTitle,
  addLabel,
  onToggle,
  onAdd,
  renderItem,
}: {
  sectionId: SectionId;
  open: boolean;
  items: TItem[];
  emptyTitle: string;
  addLabel: string;
  onToggle: () => void;
  onAdd: () => void;
  renderItem: (item: TItem) => React.ReactNode;
}) {
  return (
    <AccordionSection
      title={sectionTitles[sectionId]}
      open={open}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-4">
        {items.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3">{items.map(renderItem)}</div>
            <div className="flex justify-start">
              <Button type="button" variant="secondary" onClick={onAdd}>
                <Plus className="size-4" aria-hidden />
                {addLabel}
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState title={emptyTitle} actionLabel={addLabel} onAction={onAdd} />
        )}
      </div>
    </AccordionSection>
  );
}

function ProfileItemCard({
  title,
  description,
  badges = [],
  onEdit,
  onDelete,
}: {
  title: string;
  description: string;
  badges?: string[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-2">
              {description || '요약 정보가 없습니다.'}
            </CardDescription>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
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
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge} variant="primary">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function PersonalInfoSection({
  profile,
  saveStatus,
  onChange,
  onSave,
  onToast,
}: {
  profile: Profile;
  saveStatus?: ProfileSaveStatus;
  onChange: (input: UpdatePersonalInfoInput) => void;
  onSave: () => void;
  onToast: (toast: { variant: 'success' | 'error'; title: string }) => void;
}) {
  const personalInfo = profile.personalInfo;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const profilePhotoDataUrl = personalInfo.profilePhotoDataUrl ?? '';
  const profilePhotoFileName = personalInfo.profilePhotoFileName ?? '';

  const handlePhotoFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      onToast({
        variant: 'error',
        title: 'jpg, jpeg, png, webp 이미지만 업로드할 수 있습니다.',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onToast({
        variant: 'error',
        title: '증명사진은 2MB 이하로 업로드해주세요.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        profilePhotoFileName: file.name,
        profilePhotoDataUrl: String(reader.result ?? ''),
        profilePhotoMimeType: file.type,
      });
    };
    reader.onerror = () => {
      onToast({
        variant: 'error',
        title: '증명사진을 불러오지 못했습니다. 다시 시도해주세요.',
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SaveStatusText status={saveStatus} />
        <Button type="button" variant="secondary" onClick={onSave}>
          <Save className="size-4" aria-hidden />
          수동 저장
        </Button>
      </div>
      <section className="grid gap-3 rounded-[var(--radius-card)] border border-border bg-background p-4">
        <Typography variant="small" className="font-medium">
          증명사진
        </Typography>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            {profilePhotoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePhotoDataUrl}
                alt="증명사진 미리보기"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-text-secondary">
                <ImageIcon className="size-8" aria-hidden />
                <Typography variant="caption" tone="secondary">
                  사진 없음
                </Typography>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <Typography variant="caption" tone="secondary">
              jpg, jpeg, png, webp 형식과 2MB 이하 파일을 지원합니다.
            </Typography>
            {profilePhotoFileName ? (
              <Typography variant="caption" tone="secondary">
                {profilePhotoFileName}
              </Typography>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" aria-hidden />
                {profilePhotoDataUrl ? '증명사진 변경' : '증명사진 업로드'}
              </Button>
              {profilePhotoDataUrl ? (
                <>
                  <a
                    href={profilePhotoDataUrl}
                    download={profilePhotoFileName || 'profile-photo'}
                    className={cn(
                      'inline-flex min-h-[var(--button-height)] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-border bg-surface px-4 text-[length:var(--text-small)] font-medium text-text-primary transition-colors hover:bg-muted',
                    )}
                  >
                    <Download className="size-4" aria-hidden />
                    다운로드
                  </a>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      onChange({
                        profilePhotoFileName: '',
                        profilePhotoDataUrl: '',
                        profilePhotoMimeType: '',
                      })
                    }
                  >
                    <Trash2 className="size-4" aria-hidden />
                    삭제
                  </Button>
                </>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                handlePhotoFile(event.target.files?.[0] ?? null);
                event.target.value = '';
              }}
            />
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="이름"
          value={personalInfo.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
        <DateInput
          label="생년월일"
          value={personalInfo.birthDate}
          disallowFuture
          onChange={(birthDate) => onChange({ birthDate })}
        />
        <Input
          label="주소"
          value={personalInfo.address}
          onChange={(event) => onChange({ address: event.target.value })}
        />
        <Input
          label="영문 주소"
          value={personalInfo.englishAddress}
          onChange={(event) =>
            onChange({ englishAddress: event.target.value })
          }
        />
        <div className="relative">
          <Input
            label="희망연봉"
            inputMode="numeric"
            className="pr-12"
            value={numberToString(personalInfo.desiredSalary)}
            onChange={(event) => {
              if (!isNumericInput(event.target.value)) {
                return;
              }

              onChange({ desiredSalary: parseOptionalNumber(event.target.value) });
            }}
          />
          <span className="pointer-events-none absolute right-4 bottom-3 text-[length:var(--text-small)] text-text-secondary">
            원
          </span>
        </div>
      </div>
    </div>
  );
}

function OtherInfoSection({
  profile,
  saveStatus,
  onChange,
  onSave,
}: {
  profile: Profile;
  saveStatus?: ProfileSaveStatus;
  onChange: (input: { hobby?: string; specialty?: string }) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SaveStatusText status={saveStatus} />
        <Button type="button" variant="secondary" onClick={onSave}>
          <Save className="size-4" aria-hidden />
          수동 저장
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="취미"
          value={profile.otherInfo.hobby}
          onChange={(event) => onChange({ hobby: event.target.value })}
        />
        <Input
          label="특기"
          value={profile.otherInfo.specialty}
          onChange={(event) => onChange({ specialty: event.target.value })}
        />
      </div>
    </div>
  );
}

function SaveStatusText({ status }: { status?: ProfileSaveStatus }) {
  if (status?.state === 'pending') {
    return (
      <Typography variant="caption" tone="secondary">
        저장 대기 중...
      </Typography>
    );
  }

  if (status?.state === 'saving') {
    return (
      <Typography variant="caption" className="text-primary">
        저장 중...
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

  if (status?.state === 'error') {
    return (
      <Typography variant="caption" className="text-danger">
        저장하지 못했습니다.
      </Typography>
    );
  }

  return (
    <Typography variant="caption" tone="secondary">
      저장 준비 완료
    </Typography>
  );
}

type ProfileEditorInput =
  | CreateHighSchoolInput
  | CreateUniversityInput
  | CreateCareerInput
  | CreateLanguageInput
  | CreateCertificateInput
  | CreateAwardInput
  | CreateActivityInput;

function ProfileEditorModal({
  editor,
  saveStatus,
  onOpenChange,
  onSubmit,
  onCareerLongFieldAutoSave,
}: {
  editor: EditorState;
  saveStatus?: ProfileSaveStatus;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: ProfileEditorInput) => void;
  onCareerLongFieldAutoSave: (
    id: EntityId,
    input: Pick<UpdateCareerInput, 'responsibilities' | 'careerDescription'>,
  ) => void;
}) {
  const title = `${editor.item ? '수정' : '추가'} · ${editorTitle(editor.kind)}`;

  return (
    <Modal
      open
      onOpenChange={onOpenChange}
      title={title}
      className="max-h-[90dvh] max-w-3xl overflow-hidden"
      footer={<></>}
    >
      <div className="max-h-[calc(90dvh-8rem)] overflow-y-auto pr-1">
        {renderEditorForm({
          editor,
          saveStatus,
          onSubmit,
          onCancel: () => onOpenChange(false),
          onCareerLongFieldAutoSave,
        })}
      </div>
    </Modal>
  );
}

function renderEditorForm({
  editor,
  saveStatus,
  onSubmit,
  onCancel,
  onCareerLongFieldAutoSave,
}: {
  editor: EditorState;
  saveStatus?: ProfileSaveStatus;
  onSubmit: (input: ProfileEditorInput) => void;
  onCancel: () => void;
  onCareerLongFieldAutoSave: (
    id: EntityId,
    input: Pick<UpdateCareerInput, 'responsibilities' | 'careerDescription'>,
  ) => void;
}) {
  switch (editor.kind) {
    case 'highSchool':
      return (
        <HighSchoolForm
          item={editor.item}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    case 'university':
      return (
        <UniversityForm
          item={editor.item}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    case 'career':
      return (
        <CareerForm
          item={editor.item}
          saveStatus={saveStatus}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onLongFieldAutoSave={onCareerLongFieldAutoSave}
        />
      );
    case 'language':
      return (
        <LanguageForm item={editor.item} onSubmit={onSubmit} onCancel={onCancel} />
      );
    case 'certificate':
      return (
        <CertificateForm
          item={editor.item}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      );
    case 'award':
      return <AwardForm item={editor.item} onSubmit={onSubmit} onCancel={onCancel} />;
    case 'activity':
      return (
        <ActivityForm item={editor.item} onSubmit={onSubmit} onCancel={onCancel} />
      );
  }
}

interface FormProps<TItem, TInput> {
  item: TItem | null;
  onSubmit: (input: TInput) => void;
  onCancel: () => void;
}

function HighSchoolForm({
  item,
  onSubmit,
  onCancel,
}: FormProps<HighSchool, CreateHighSchoolInput>) {
  const [draft, setDraft] = React.useState({
    schoolName: item?.schoolName ?? '',
    admissionDate: item?.admissionDate ?? '',
    graduationDate: item?.graduationDate ?? '',
    location: item?.location ?? '',
    academicTrack: item?.academicTrack ?? '',
  });
  const errors = validateDateRange(
    draft.admissionDate,
    draft.graduationDate,
    '졸업일은 입학일보다 빠를 수 없습니다.',
  );
  const primaryError = draft.schoolName.trim() ? '' : '학교명을 입력해주세요.';
  const canSubmit = !primaryError && !errors.dateRange;

  return (
    <FormShell canSubmit={canSubmit} onCancel={onCancel} onSubmit={() => onSubmit({
      schoolName: draft.schoolName.trim(),
      admissionDate: nullableValue(draft.admissionDate),
      graduationDate: nullableValue(draft.graduationDate),
      location: draft.location,
      academicTrack: draft.academicTrack,
    })}>
      <Input
        label="학교명"
        value={draft.schoolName}
        error={primaryError || undefined}
        onChange={(event) => setDraft({ ...draft, schoolName: event.target.value })}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DateInput
          label="입학일"
          value={draft.admissionDate}
          onChange={(admissionDate) =>
            setDraft({ ...draft, admissionDate: admissionDate ?? '' })
          }
        />
        <DateInput
          label="졸업일"
          value={draft.graduationDate}
          error={errors.dateRange}
          onChange={(graduationDate) =>
            setDraft({ ...draft, graduationDate: graduationDate ?? '' })
          }
        />
      </div>
      <Input
        label="소재지"
        value={draft.location}
        onChange={(event) => setDraft({ ...draft, location: event.target.value })}
      />
      <Input
        label="계열"
        value={draft.academicTrack}
        onChange={(event) =>
          setDraft({ ...draft, academicTrack: event.target.value })
        }
      />
    </FormShell>
  );
}

function UniversityForm({
  item,
  onSubmit,
  onCancel,
}: FormProps<University, CreateUniversityInput>) {
  const [draft, setDraft] = React.useState({
    universityName: item?.universityName ?? '',
    admissionDate: item?.admissionDate ?? '',
    graduationDate: item?.graduationDate ?? '',
    major: item?.major ?? '',
    totalCredits: numberToString(item?.totalCredits ?? null),
    overallGpa: numberToString(item?.overallGpa ?? null),
    overallGpaScale: numberToString(item?.overallGpaScale ?? null),
    majorCredits: numberToString(item?.majorCredits ?? null),
    majorGpa: numberToString(item?.majorGpa ?? null),
    majorGpaScale: numberToString(item?.majorGpaScale ?? null),
  });
  const dateErrors = validateDateRange(
    draft.admissionDate,
    draft.graduationDate,
    '졸업일은 입학일보다 빠를 수 없습니다.',
  );
  const numberError = validateNumericFields(draft, [
    'totalCredits',
    'overallGpa',
    'overallGpaScale',
    'majorCredits',
    'majorGpa',
    'majorGpaScale',
  ]);
  const primaryError = draft.universityName.trim()
    ? ''
    : '대학명을 입력해주세요.';
  const canSubmit = !primaryError && !dateErrors.dateRange && !numberError;

  return (
    <FormShell canSubmit={canSubmit} onCancel={onCancel} onSubmit={() => onSubmit({
      universityName: draft.universityName.trim(),
      admissionDate: nullableValue(draft.admissionDate),
      graduationDate: nullableValue(draft.graduationDate),
      major: draft.major,
      totalCredits: parseOptionalNumber(draft.totalCredits),
      overallGpa: parseOptionalNumber(draft.overallGpa),
      overallGpaScale: parseOptionalNumber(draft.overallGpaScale),
      majorCredits: parseOptionalNumber(draft.majorCredits),
      majorGpa: parseOptionalNumber(draft.majorGpa),
      majorGpaScale: parseOptionalNumber(draft.majorGpaScale),
    })}>
      <Input
        label="대학명"
        value={draft.universityName}
        error={primaryError || undefined}
        onChange={(event) =>
          setDraft({ ...draft, universityName: event.target.value })
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DateInput
          label="입학일"
          value={draft.admissionDate}
          onChange={(admissionDate) =>
            setDraft({ ...draft, admissionDate: admissionDate ?? '' })
          }
        />
        <DateInput
          label="졸업일"
          value={draft.graduationDate}
          error={dateErrors.dateRange}
          onChange={(graduationDate) =>
            setDraft({ ...draft, graduationDate: graduationDate ?? '' })
          }
        />
      </div>
      <Input
        label="주전공"
        value={draft.major}
        onChange={(event) => setDraft({ ...draft, major: event.target.value })}
      />
      {numberError ? (
        <Typography variant="caption" className="text-danger">
          {numberError}
        </Typography>
      ) : null}
      <NumberGrid draft={draft} setDraft={setDraft} fields={[
        ['totalCredits', '학업 이수학점'],
        ['overallGpa', '전체 평점'],
        ['overallGpaScale', '전체 만점'],
        ['majorCredits', '전공 이수학점'],
        ['majorGpa', '전공 평점'],
        ['majorGpaScale', '전공 만점'],
      ]} />
    </FormShell>
  );
}

function CareerForm({
  item,
  saveStatus,
  onSubmit,
  onCancel,
  onLongFieldAutoSave,
}: FormProps<Career, CreateCareerInput> & {
  saveStatus?: ProfileSaveStatus;
  onLongFieldAutoSave: (
    id: EntityId,
    input: Pick<UpdateCareerInput, 'responsibilities' | 'careerDescription'>,
  ) => void;
}) {
  const [draft, setDraft] = React.useState({
    companyName: item?.companyName ?? '',
    employmentStartDate: item?.employmentStartDate ?? '',
    employmentEndDate: item?.employmentEndDate ?? '',
    isCurrentlyEmployed: item?.isCurrentlyEmployed ?? false,
    department: item?.department ?? '',
    position: item?.position ?? '',
    responsibilities: item?.responsibilities ?? '',
    careerDescription: item?.careerDescription ?? '',
    annualSalary: numberToString(item?.annualSalary ?? null),
  });
  const dateErrors = validateDateRange(
    draft.employmentStartDate,
    draft.isCurrentlyEmployed ? '' : draft.employmentEndDate,
    '재직 종료일은 재직 시작일보다 빠를 수 없습니다.',
  );
  const numberError = validateNumericFields(draft, ['annualSalary']);
  const primaryError = draft.companyName.trim()
    ? ''
    : '직장명을 입력해주세요.';
  const canSubmit = !primaryError && !dateErrors.dateRange && !numberError;
  const updateLongField = (
    input: Pick<typeof draft, 'responsibilities' | 'careerDescription'>,
  ) => {
    const nextDraft = { ...draft, ...input };
    setDraft(nextDraft);

    if (!item) {
      return;
    }

    scheduleCareerAutoSave(item.id, () =>
      onLongFieldAutoSave(item.id, {
        responsibilities: nextDraft.responsibilities,
        careerDescription: nextDraft.careerDescription,
      }),
    );
  };

  return (
    <FormShell canSubmit={canSubmit} onCancel={onCancel} onSubmit={() => onSubmit({
      companyName: draft.companyName.trim(),
      employmentStartDate: nullableValue(draft.employmentStartDate),
      employmentEndDate: draft.isCurrentlyEmployed
        ? null
        : nullableValue(draft.employmentEndDate),
      isCurrentlyEmployed: draft.isCurrentlyEmployed,
      department: draft.department,
      position: draft.position,
      responsibilities: draft.responsibilities,
      careerDescription: draft.careerDescription,
      annualSalary: parseOptionalNumber(draft.annualSalary),
      salaryCurrency: 'KRW',
    })}>
      {item ? <SaveStatusText status={saveStatus} /> : null}
      <Input
        label="직장명"
        value={draft.companyName}
        error={primaryError || undefined}
        onChange={(event) =>
          setDraft({ ...draft, companyName: event.target.value })
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DateInput
          label="재직 시작일"
          value={draft.employmentStartDate}
          onChange={(employmentStartDate) =>
            setDraft({
              ...draft,
              employmentStartDate: employmentStartDate ?? '',
            })
          }
        />
        <DateInput
          label="재직 종료일"
          value={draft.employmentEndDate}
          disabled={draft.isCurrentlyEmployed}
          error={dateErrors.dateRange}
          onChange={(employmentEndDate) =>
            setDraft({
              ...draft,
              employmentEndDate: employmentEndDate ?? '',
            })
          }
        />
      </div>
      <Select
        label="재직 여부"
        value={draft.isCurrentlyEmployed ? 'current' : 'ended'}
        onChange={(event) =>
          setDraft({
            ...draft,
            isCurrentlyEmployed: event.target.value === 'current',
            employmentEndDate:
              event.target.value === 'current' ? '' : draft.employmentEndDate,
          })
        }
      >
        <option value="ended">퇴사</option>
        <option value="current">재직 중</option>
      </Select>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="부서"
          value={draft.department}
          onChange={(event) =>
            setDraft({ ...draft, department: event.target.value })
          }
        />
        <Input
          label="직급"
          value={draft.position}
          onChange={(event) =>
            setDraft({ ...draft, position: event.target.value })
          }
        />
      </div>
      <Textarea
        label="담당업무"
        value={draft.responsibilities}
        className="min-h-32"
        onChange={(event) =>
          updateLongField({ responsibilities: event.target.value, careerDescription: draft.careerDescription })
        }
      />
      <Textarea
        label="경력기술서"
        value={draft.careerDescription}
        className="min-h-40"
        onChange={(event) =>
          updateLongField({ responsibilities: draft.responsibilities, careerDescription: event.target.value })
        }
      />
      {numberError ? (
        <Typography variant="caption" className="text-danger">
          {numberError}
        </Typography>
      ) : null}
      <div className="max-w-md">
        <div className="relative">
          <Input
            label="연봉"
            inputMode="numeric"
            className="pr-12"
            value={draft.annualSalary}
            onChange={(event) =>
              setDraft({ ...draft, annualSalary: event.target.value })
            }
          />
          <span className="pointer-events-none absolute right-4 bottom-3 text-[length:var(--text-small)] text-text-secondary">
            원
          </span>
        </div>
      </div>
    </FormShell>
  );
}

function LanguageForm({
  item,
  onSubmit,
  onCancel,
}: FormProps<LanguageQualification, CreateLanguageInput>) {
  const [draft, setDraft] = React.useState({
    qualificationName: item?.qualificationName ?? '',
    registrationNumber: item?.registrationNumber ?? '',
    score: numberToString(item?.score ?? null),
    scoreScale: numberToString(item?.scoreScale ?? null),
    testDate: item?.testDate ?? '',
  });
  const numberError = validateNumericFields(draft, ['score', 'scoreScale']);
  const primaryError = draft.qualificationName.trim()
    ? ''
    : '자격증명을 입력해주세요.';
  const canSubmit = !primaryError && !numberError;

  return (
    <FormShell canSubmit={canSubmit} onCancel={onCancel} onSubmit={() => onSubmit({
      qualificationName: draft.qualificationName.trim(),
      registrationNumber: draft.registrationNumber,
      score: parseOptionalNumber(draft.score),
      scoreScale: parseOptionalNumber(draft.scoreScale),
      testDate: nullableValue(draft.testDate),
    })}>
      <Input
        label="자격증명"
        value={draft.qualificationName}
        error={primaryError || undefined}
        onChange={(event) =>
          setDraft({ ...draft, qualificationName: event.target.value })
        }
      />
      <Input
        label="등록번호"
        value={draft.registrationNumber}
        onChange={(event) =>
          setDraft({ ...draft, registrationNumber: event.target.value })
        }
      />
      {numberError ? (
        <Typography variant="caption" className="text-danger">
          {numberError}
        </Typography>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="점수"
          value={draft.score}
          onChange={(event) => setDraft({ ...draft, score: event.target.value })}
        />
        <Input
          label="만점"
          value={draft.scoreScale}
          onChange={(event) =>
            setDraft({ ...draft, scoreScale: event.target.value })
          }
        />
      </div>
      <DateInput
        label="응시일"
        value={draft.testDate}
        onChange={(testDate) => setDraft({ ...draft, testDate: testDate ?? '' })}
      />
    </FormShell>
  );
}

function CertificateForm({
  item,
  onSubmit,
  onCancel,
}: FormProps<Certificate, CreateCertificateInput>) {
  const [draft, setDraft] = React.useState({
    certificateName: item?.certificateName ?? '',
    registrationNumber: item?.registrationNumber ?? '',
    issuingOrganization: item?.issuingOrganization ?? '',
    acquisitionDate: item?.acquisitionDate ?? '',
  });
  const primaryError = draft.certificateName.trim()
    ? ''
    : '자격증명을 입력해주세요.';
  const canSubmit = !primaryError;

  return (
    <FormShell canSubmit={canSubmit} onCancel={onCancel} onSubmit={() => onSubmit({
      certificateName: draft.certificateName.trim(),
      registrationNumber: draft.registrationNumber,
      issuingOrganization: draft.issuingOrganization,
      acquisitionDate: nullableValue(draft.acquisitionDate),
    })}>
      <Input
        label="자격증명"
        value={draft.certificateName}
        error={primaryError || undefined}
        onChange={(event) =>
          setDraft({ ...draft, certificateName: event.target.value })
        }
      />
      <Input
        label="등록번호"
        value={draft.registrationNumber}
        onChange={(event) =>
          setDraft({ ...draft, registrationNumber: event.target.value })
        }
      />
      <Input
        label="발급기관"
        value={draft.issuingOrganization}
        onChange={(event) =>
          setDraft({ ...draft, issuingOrganization: event.target.value })
        }
      />
      <DateInput
        label="취득일자"
        value={draft.acquisitionDate}
        onChange={(acquisitionDate) =>
          setDraft({ ...draft, acquisitionDate: acquisitionDate ?? '' })
        }
      />
    </FormShell>
  );
}

function AwardForm({
  item,
  onSubmit,
  onCancel,
}: FormProps<Award, CreateAwardInput>) {
  const [draft, setDraft] = React.useState({
    awardName: item?.awardName ?? '',
    awardingOrganization: item?.awardingOrganization ?? '',
    awardDate: item?.awardDate ?? '',
    description: item?.description ?? '',
  });
  const primaryError = draft.awardName.trim() ? '' : '상훈명을 입력해주세요.';
  const canSubmit = !primaryError;

  return (
    <FormShell canSubmit={canSubmit} onCancel={onCancel} onSubmit={() => onSubmit({
      awardName: draft.awardName.trim(),
      awardingOrganization: draft.awardingOrganization,
      awardDate: nullableValue(draft.awardDate),
      description: draft.description,
    })}>
      <Input
        label="상훈명"
        value={draft.awardName}
        error={primaryError || undefined}
        onChange={(event) => setDraft({ ...draft, awardName: event.target.value })}
      />
      <Input
        label="수여기관"
        value={draft.awardingOrganization}
        onChange={(event) =>
          setDraft({ ...draft, awardingOrganization: event.target.value })
        }
      />
      <DateInput
        label="발급일"
        value={draft.awardDate}
        onChange={(awardDate) => setDraft({ ...draft, awardDate: awardDate ?? '' })}
      />
      <Textarea
        label="내용"
        value={draft.description}
        className="min-h-32"
        onChange={(event) =>
          setDraft({ ...draft, description: event.target.value })
        }
      />
    </FormShell>
  );
}

function ActivityForm({
  item,
  onSubmit,
  onCancel,
}: FormProps<Activity, CreateActivityInput>) {
  const [draft, setDraft] = React.useState({
    activityType: item?.activityType ?? '팀프로젝트',
    organizationName: item?.organizationName ?? '',
    startMonth: item?.startMonth ?? '',
    endMonth: item?.endMonth ?? '',
    role: item?.role ?? '',
    description: item?.description ?? '',
  });
  const monthError =
    draft.startMonth && draft.endMonth && draft.endMonth < draft.startMonth
      ? '활동 종료월은 시작월보다 빠를 수 없습니다.'
      : '';
  const primaryError = draft.organizationName.trim()
    ? ''
    : '기관 및 조직명을 입력해주세요.';
  const canSubmit = !primaryError && !monthError;

  return (
    <FormShell canSubmit={canSubmit} onCancel={onCancel} onSubmit={() => onSubmit({
      activityType: draft.activityType as ActivityType,
      organizationName: draft.organizationName.trim(),
      startMonth: nullableValue(draft.startMonth),
      endMonth: nullableValue(draft.endMonth),
      role: draft.role,
      description: draft.description,
    })}>
      <Select
          label="활동구분"
          id="activity-type"
          value={draft.activityType}
          onChange={(event) =>
            setDraft({ ...draft, activityType: event.target.value as ActivityType })
          }
        >
          {ACTIVITY_TYPES.map((activityType) => (
            <option key={activityType} value={activityType}>
              {activityType}
            </option>
          ))}
      </Select>
      <Input
        label="기관 및 조직명"
        value={draft.organizationName}
        error={primaryError || undefined}
        onChange={(event) =>
          setDraft({ ...draft, organizationName: event.target.value })
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="시작 연월"
          type="month"
          value={draft.startMonth}
          onChange={(event) =>
            setDraft({ ...draft, startMonth: event.target.value })
          }
        />
        <Input
          label="종료 연월"
          type="month"
          value={draft.endMonth}
          error={monthError || undefined}
          onChange={(event) => setDraft({ ...draft, endMonth: event.target.value })}
        />
      </div>
      <Input
        label="역할"
        value={draft.role}
        onChange={(event) => setDraft({ ...draft, role: event.target.value })}
      />
      <Textarea
        label="내용"
        value={draft.description}
        className="min-h-32"
        onChange={(event) =>
          setDraft({ ...draft, description: event.target.value })
        }
      />
    </FormShell>
  );
}

function FormShell({
  children,
  canSubmit,
  onCancel,
  onSubmit,
}: {
  children: React.ReactNode;
  canSubmit: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-5">
      {children}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="button" disabled={!canSubmit} onClick={onSubmit}>
          저장
        </Button>
      </div>
    </div>
  );
}

function NumberGrid<TDraft extends Record<string, string>>({
  draft,
  setDraft,
  fields,
}: {
  draft: TDraft;
  setDraft: (draft: TDraft) => void;
  fields: Array<[keyof TDraft, string]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {fields.map(([key, label]) => (
        <Input
          key={String(key)}
          label={label}
          inputMode="decimal"
          value={draft[key]}
          onChange={(event) =>
            setDraft({
              ...draft,
              [key]: event.target.value,
            })
          }
        />
      ))}
    </div>
  );
}

function editorTitle(kind: EditorState['kind']) {
  switch (kind) {
    case 'highSchool':
      return '고등학교';
    case 'university':
      return '대학교';
    case 'career':
      return '경력';
    case 'language':
      return '어학';
    case 'certificate':
      return '자격증';
    case 'award':
      return '수상경력';
    case 'activity':
      return '학내외활동';
  }
}

function nullableValue(value: string) {
  return value.trim() ? value : null;
}

function numberToString(value: number | null) {
  return value === null ? '' : String(value);
}

function isNumericInput(value: string) {
  return value === '' || /^\d+(\.\d+)?$/.test(value);
}

function parseOptionalNumber(value: string) {
  return value.trim() ? Number(value) : null;
}

function validateNumericFields<TDraft extends object>(
  draft: TDraft,
  fields: Array<keyof TDraft>,
) {
  const invalid = fields.some((field) =>
    !isNumericInput(String(draft[field] ?? '')),
  );
  return invalid ? '숫자만 입력해주세요. 소수점은 허용됩니다.' : '';
}

function validateDateRange(startDate: string, endDate: string, message: string) {
  return {
    dateRange: startDate && endDate && endDate < startDate ? message : '',
  };
}

function joinSummary(values: Array<string | null | undefined>) {
  return values.filter(Boolean).join(' · ');
}

function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  endText = '종료일 미입력',
) {
  if (!startDate && !endDate) {
    return '';
  }

  return `${startDate ?? '시작일 미입력'} ~ ${endDate ?? endText}`;
}

function formatMonthRange(startMonth: string | null, endMonth: string | null) {
  if (!startMonth && !endMonth) {
    return '';
  }

  return `${startMonth ?? '시작월 미입력'} ~ ${endMonth ?? '종료월 미입력'}`;
}

function formatGpa(gpa: number | null, scale: number | null) {
  if (gpa === null && scale === null) {
    return '';
  }

  return `평점 ${gpa ?? '-'} / ${scale ?? '-'}`;
}

function formatScore(score: number | null, scale: number | null) {
  if (score === null && scale === null) {
    return '';
  }

  return `점수 ${score ?? '-'} / ${scale ?? '-'}`;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export { ProfilePage };
