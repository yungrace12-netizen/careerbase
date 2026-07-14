import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-badge)] px-3 py-2',
    'text-[length:var(--text-caption)] font-medium',
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-muted text-text-primary',
        primary: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/15 text-warning',
        danger: 'bg-danger/10 text-danger',
        archive: 'bg-muted text-text-secondary',
        /** 지원전 */
        pending: 'bg-primary/10 text-primary',
        /** 지원중 */
        inProgress: 'bg-warning/15 text-warning',
        /** 합격 */
        passed: 'bg-success/10 text-success',
        /** 불합격 */
        failed: 'bg-danger/10 text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
