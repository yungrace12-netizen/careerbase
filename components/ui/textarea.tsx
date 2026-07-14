import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, containerClassName, label, hint, error, id, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const describedBy = error
      ? `${textareaId}-error`
      : hint
        ? `${textareaId}-hint`
        : undefined;

    return (
      <div
        data-slot="textarea-field"
        className={cn('flex w-full flex-col gap-2', containerClassName)}
      >
        <Typography
          as="label"
          variant="small"
          className="font-medium"
          htmlFor={textareaId}
        >
          {label}
        </Typography>
        <textarea
          ref={ref}
          id={textareaId}
          data-slot="textarea"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            'min-h-[var(--textarea-min-height)] w-full rounded-[var(--radius-input)]',
            'resize-y border border-border bg-surface px-4 py-3',
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
            id={`${textareaId}-error`}
            variant="caption"
            className="text-danger"
          >
            {error}
          </Typography>
        ) : hint ? (
          <Typography
            id={`${textareaId}-hint`}
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

Textarea.displayName = 'Textarea';

export { Textarea };
