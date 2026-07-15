import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

export interface DateInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  label: string;
  value: string | null;
  error?: string;
  containerClassName?: string;
  disallowFuture?: boolean;
  onChange: (value: string | null) => void;
}

function DateInput({
  className,
  containerClassName,
  label,
  value,
  error,
  id,
  disallowFuture = false,
  onChange,
  onBlur,
  ...props
}: DateInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [displayValue, setDisplayValue] = React.useState(formatIsoDate(value));
  const [localError, setLocalError] = React.useState('');
  const resolvedError = error || localError;

  const commitDigits = (digits: string) => {
    const nextDisplayValue = formatDigits(digits);
    setDisplayValue(nextDisplayValue);

    if (digits.length === 0) {
      setLocalError('');
      onChange(null);
      return;
    }

    if (digits.length < 8) {
      setLocalError('');
      return;
    }

    const validation = validateDateDigits(digits, disallowFuture);
    setLocalError(validation.error);

    if (!validation.error && validation.isoDate) {
      onChange(validation.isoDate);
    }
  };

  return (
    <div
      data-slot="date-input-field"
      className={cn('flex w-full flex-col gap-2', containerClassName)}
    >
      <Typography as="label" variant="small" className="font-medium" htmlFor={inputId}>
        {label}
      </Typography>
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        placeholder="YYYY.MM.DD"
        value={displayValue}
        aria-invalid={Boolean(resolvedError) || undefined}
        aria-describedby={resolvedError ? `${inputId}-error` : undefined}
        maxLength={10}
        onChange={(event) => commitDigits(toDateDigits(event.target.value))}
        onBlur={onBlur}
        className={cn(
          'h-[var(--input-height)] w-full rounded-[var(--radius-input)]',
          'border border-border bg-surface px-4',
          'text-body text-text-primary placeholder:text-text-secondary',
          'transition-colors duration-[var(--duration-fast)]',
          'outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          resolvedError &&
            'border-danger focus-visible:border-danger focus-visible:ring-danger/30',
          className,
        )}
        {...props}
      />
      {resolvedError ? (
        <Typography id={`${inputId}-error`} variant="caption" className="text-danger">
          {resolvedError}
        </Typography>
      ) : null}
    </div>
  );
}

function toDateDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 8);
}

function formatDigits(digits: string) {
  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}

function formatIsoDate(value: string | null) {
  if (!value) {
    return '';
  }

  return formatDigits(toDateDigits(value));
}

function validateDateDigits(digits: string, disallowFuture: boolean) {
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!valid) {
    return { error: '유효한 날짜를 입력해주세요.', isoDate: null };
  }

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (disallowFuture && date > todayDate) {
    return { error: '미래 날짜는 입력할 수 없습니다.', isoDate: null };
  }

  const isoDate = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;

  return { error: '', isoDate };
}

export { DateInput };
