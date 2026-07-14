import * as React from 'react';

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-[var(--radius-card)] bg-muted',
        className,
      )}
      {...props}
    />
  );
}

function SkeletonCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn(
        'rounded-[var(--radius-card)] border border-border bg-surface',
        'p-[var(--component-padding)]',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function SkeletonText({
  lines = 3,
  className,
  ...props
}: React.ComponentProps<'div'> & { lines?: number }) {
  return (
    <div
      data-slot="skeleton-text"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', index === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonText };
