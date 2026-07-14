'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import {
  APPLICANT_TYPES,
  EMPLOYMENT_TYPES,
  type CreateJobInput,
  type Job,
} from '@/types/job';

const jobFormSchema = z
  .object({
    companyName: z.string().trim().min(1, '기업명을 입력해주세요.'),
    postingTitle: z.string().trim().min(1, '공고명을 입력해주세요.'),
    position: z.string().trim().min(1, '직무를 입력해주세요.'),
    employmentType: z.union([
      z.literal(''),
      z.enum([
        '정규직',
        '계약직',
        '인턴',
        '전환형 인턴',
        '파견직',
        '프리랜서',
        '기타',
      ]),
    ]),
    applicantType: z.union([
      z.literal(''),
      z.enum(['신입', '경력', '신입·경력', '무관']),
    ]),
    postingUrl: z
      .string()
      .trim()
      .refine((value) => isOptionalUrl(value), '올바른 URL을 입력해주세요.'),
    applicationStartDate: z.string(),
    applicationStartTime: z.string(),
    applicationEndDate: z.string(),
    applicationEndTime: z.string(),
    postingContent: z.string(),
    qualifications: z.string(),
    location: z.string(),
  })
  .refine(
    (value) =>
      !value.applicationStartDate ||
      !value.applicationEndDate ||
      value.applicationStartDate <= value.applicationEndDate,
    {
      path: ['applicationEndDate'],
      message: '지원 마감일은 지원 시작일보다 빠를 수 없습니다.',
    },
  );

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormModalProps {
  open: boolean;
  job: Job | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateJobInput) => void;
}

const emptyValues: JobFormValues = {
  companyName: '',
  postingTitle: '',
  position: '',
  employmentType: '',
  applicantType: '',
  postingUrl: '',
  applicationStartDate: '',
  applicationStartTime: '',
  applicationEndDate: '',
  applicationEndTime: '',
  postingContent: '',
  qualifications: '',
  location: '',
};

function JobFormModal({ open, job, onOpenChange, onSubmit }: JobFormModalProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: emptyValues,
  });

  React.useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(job ? jobToFormValues(job) : emptyValues);
  }, [form, job, open]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(formValuesToJobInput(values));
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={job ? '공고 수정' : '새 공고 등록'}
      description="Job 데이터 구조에 맞춰 공고 정보를 입력합니다."
      className="max-h-[90dvh] overflow-y-auto"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="submit" form="job-form">
            {job ? '수정' : '등록'}
          </Button>
        </>
      }
    >
      <form id="job-form" className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="기업명"
            {...form.register('companyName')}
            error={form.formState.errors.companyName?.message}
          />
          <Input
            label="공고명"
            {...form.register('postingTitle')}
            error={form.formState.errors.postingTitle?.message}
          />
          <Input
            label="직무"
            {...form.register('position')}
            error={form.formState.errors.position?.message}
          />
          <FormSelect
            label="고용형태"
            {...form.register('employmentType')}
            error={form.formState.errors.employmentType?.message}
          >
            <option value="">선택 안 함</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </FormSelect>
          <FormSelect
            label="신입/경력"
            {...form.register('applicantType')}
            error={form.formState.errors.applicantType?.message}
          >
            <option value="">선택 안 함</option>
            {APPLICANT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </FormSelect>
          <Input
            label="공고 URL"
            {...form.register('postingUrl')}
            error={form.formState.errors.postingUrl?.message}
          />
          <Input
            label="지원 시작일"
            type="date"
            {...form.register('applicationStartDate')}
            error={form.formState.errors.applicationStartDate?.message}
          />
          <Input
            label="지원 시작 시간"
            type="time"
            {...form.register('applicationStartTime')}
            error={form.formState.errors.applicationStartTime?.message}
          />
          <Input
            label="지원 마감일"
            type="date"
            {...form.register('applicationEndDate')}
            error={form.formState.errors.applicationEndDate?.message}
          />
          <Input
            label="지원 마감 시간"
            type="time"
            {...form.register('applicationEndTime')}
            error={form.formState.errors.applicationEndTime?.message}
          />
          <Input
            label="근무지"
            {...form.register('location')}
            error={form.formState.errors.location?.message}
          />
        </div>

        <Textarea
          label="공고 내용"
          {...form.register('postingContent')}
          error={form.formState.errors.postingContent?.message}
        />
        <Textarea
          label="자격요건"
          {...form.register('qualifications')}
          error={form.formState.errors.qualifications?.message}
        />
      </form>
    </Modal>
  );
}

interface FormSelectProps extends React.ComponentProps<'select'> {
  label: string;
  error?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-2">
        <Typography
          as="label"
          variant="small"
          className="font-medium"
          htmlFor={selectId}
        >
          {label}
        </Typography>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            'h-[var(--input-height)] w-full rounded-[var(--radius-input)] border border-border bg-surface px-4 text-body text-text-primary outline-none transition-colors duration-[var(--duration-fast)] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30',
            error &&
              'border-danger focus-visible:border-danger focus-visible:ring-danger/30',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <Typography variant="caption" className="text-danger">
            {error}
          </Typography>
        ) : null}
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';

function jobToFormValues(job: Job): JobFormValues {
  return {
    companyName: job.companyName,
    postingTitle: job.postingTitle,
    position: job.position,
    employmentType: job.employmentType,
    applicantType: job.applicantType,
    postingUrl: job.postingUrl,
    applicationStartDate: job.applicationStartDate ?? '',
    applicationStartTime: job.applicationStartTime ?? '',
    applicationEndDate: job.applicationEndDate ?? '',
    applicationEndTime: job.applicationEndTime ?? '',
    postingContent: job.postingContent,
    qualifications: job.qualifications,
    location: job.location,
  };
}

function formValuesToJobInput(values: JobFormValues): CreateJobInput {
  return {
    companyName: values.companyName.trim(),
    postingTitle: values.postingTitle.trim(),
    position: values.position.trim(),
    employmentType: values.employmentType,
    applicantType: values.applicantType,
    postingUrl: values.postingUrl.trim(),
    applicationStartDate: emptyStringToNull(values.applicationStartDate),
    applicationStartTime: emptyStringToNull(values.applicationStartTime),
    applicationEndDate: emptyStringToNull(values.applicationEndDate),
    applicationEndTime: emptyStringToNull(values.applicationEndTime),
    postingContent: values.postingContent,
    qualifications: values.qualifications,
    location: values.location.trim(),
  };
}

function emptyStringToNull(value: string) {
  return value.trim() === '' ? null : value;
}

function isOptionalUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export { JobFormModal };
