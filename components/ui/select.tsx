import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

export interface SelectProps extends React.ComponentProps<'select'> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, containerClassName, label, error, id, children, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div
        data-slot="select-field"
        className={cn('flex w-full flex-col gap-2', containerClassName)}
      >
        {label ? (
          <Typography
            as="label"
            variant="small"
            className="font-medium"
            htmlFor={selectId}
          >
            {label}
          </Typography>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            data-slot="select"
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              'h-[var(--input-height)] w-full appearance-none rounded-[var(--radius-input)]',
              'border border-border bg-surface px-4 pr-10',
              'text-body text-text-primary',
              'transition-colors duration-[var(--duration-fast)]',
              'outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-danger focus-visible:border-danger focus-visible:ring-danger/30',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-secondary"
          />
        </div>
        {error ? (
          <Typography variant="caption" className="text-danger">
            {error}
          </Typography>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
