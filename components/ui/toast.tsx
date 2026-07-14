import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

const toastVariants = cva(
  [
    'pointer-events-auto flex w-full max-w-sm items-start gap-3',
    'rounded-[var(--radius-card)] border border-border bg-surface p-4 shadow-md',
    'transition-all duration-[var(--duration-normal)]',
  ].join(' '),
  {
    variants: {
      variant: {
        success: 'border-success/30',
        info: 'border-primary/30',
        warning: 'border-warning/40',
        error: 'border-danger/30',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const toastIcons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

const toastIconClass = {
  success: 'text-success',
  info: 'text-primary',
  warning: 'text-warning',
  error: 'text-danger',
} as const;

export interface ToastProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
}

function Toast({
  className,
  variant = 'info',
  title,
  description,
  onClose,
  ...props
}: ToastProps) {
  const resolvedVariant = variant ?? 'info';
  const Icon = toastIcons[resolvedVariant];

  return (
    <div
      data-slot="toast"
      role="status"
      aria-live="polite"
      className={cn(toastVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <Icon
        className={cn('mt-0.5 size-5 shrink-0', toastIconClass[resolvedVariant])}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography variant="small" className="font-medium">
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" tone="secondary">
            {description}
          </Typography>
        ) : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="rounded-[var(--radius-button)] p-1 text-text-secondary transition-colors hover:bg-muted hover:text-text-primary"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

/** Desktop: 우측 상단 / Mobile: 하단 중앙 (05_UIUX / 06_DesignSystem) */
function ToastViewport({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="toast-viewport"
      className={cn(
        'pointer-events-none fixed z-50 flex w-full flex-col gap-2 p-4',
        'bottom-4 left-1/2 max-w-sm -translate-x-1/2',
        'md:top-4 md:right-4 md:bottom-auto md:left-auto md:translate-x-0',
        className,
      )}
      {...props}
    />
  );
}

export { Toast, ToastViewport, toastVariants };
