import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export interface EmptyStateProps extends React.ComponentProps<'div'> {
  title: string;
  description?: string;
  illustration?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

function EmptyState({
  className,
  title,
  description,
  illustration,
  actionLabel,
  onAction,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 px-6 py-16 text-center',
        className,
      )}
      {...props}
    >
      {illustration ? (
        <div data-slot="empty-state-illustration" className="text-text-secondary">
          {illustration}
        </div>
      ) : null}

      <div className="flex max-w-md flex-col gap-2">
        <Typography variant="section">{title}</Typography>
        {description ? (
          <Typography variant="body" tone="secondary">
            {description}
          </Typography>
        ) : null}
      </div>

      {action
        ? action
        : actionLabel
          ? (
              <Button variant="primary" onClick={onAction}>
                {actionLabel}
              </Button>
            )
          : null}
    </div>
  );
}

export { EmptyState };
