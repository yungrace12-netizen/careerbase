import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

export interface InputProps extends React.ComponentProps<'input'> {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      hint,
      error,
      id,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div
        data-slot="input-field"
        className={cn('flex w-full flex-col gap-2', containerClassName)}
      >
        <Typography as="label" variant="small" className="font-medium" htmlFor={inputId}>
          {label}
        </Typography>
        <input
          ref={ref}
          id={inputId}
          type={type}
          data-slot="input"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-[var(--input-height)] w-full rounded-[var(--radius-input)]',
            'border border-border bg-surface px-4',
            'text-body text-text-primary placeholder:text-text-secondary',
            'transition-colors duration-[var(--duration-fast)]',
            'outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error &&
              'border-danger focus-visible:border-danger focus-visible:ring-danger/30',
            className,
          )}
          {...props}
        />
        {error ? (
          <Typography
            id={`${inputId}-error`}
            variant="caption"
            className="text-danger"
          >
            {error}
          </Typography>
        ) : hint ? (
          <Typography
            id={`${inputId}-hint`}
            variant="caption"
            tone="secondary"
          >
            {hint}
          </Typography>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
