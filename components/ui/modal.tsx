'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  /** Danger Action은 빨간색 확인 버튼 (06_DesignSystem) */
  danger?: boolean;
  className?: string;
}

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  cancelLabel = '취소',
  confirmLabel = '확인',
  onConfirm,
  danger = false,
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div
      data-slot="modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-text-primary/40 transition-opacity duration-[var(--duration-normal)]"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        data-slot="modal"
        className={cn(
          'relative z-10 w-[90%] max-w-[var(--modal-width)]',
          'rounded-[var(--radius-modal)] border border-border bg-surface',
          'p-[var(--component-padding)] shadow-lg',
          'flex flex-col gap-6',
          'duration-[var(--duration-normal)]',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Typography id="modal-title" variant="section">
              {title}
            </Typography>
            {description ? (
              <Typography
                id="modal-description"
                variant="body"
                tone="secondary"
              >
                {description}
              </Typography>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
            className="rounded-[var(--radius-button)] p-2 text-text-secondary transition-colors hover:bg-muted hover:text-text-primary"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {children ? <div data-slot="modal-body">{children}</div> : null}

        <div
          data-slot="modal-footer"
          className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
        >
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Modal };
