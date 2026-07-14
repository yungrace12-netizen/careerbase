'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';
import {
  isNavigationItemActive,
  mobileMoreNavigationItems,
  mobilePrimaryNavigationItems,
} from '@/components/app-shell/navigation';

interface MobileNavigationProps {
  moreOpen: boolean;
  onNavigate: () => void;
  onToggleMore: () => void;
  pathname: string;
}

function MobileNavigation({
  moreOpen,
  onNavigate,
  onToggleMore,
  pathname,
}: MobileNavigationProps) {
  const moreActive = mobileMoreNavigationItems.some((item) =>
    isNavigationItemActive(pathname, item.href),
  );

  return (
    <div className="md:hidden">
      {moreOpen ? (
        <div className="fixed inset-x-4 bottom-24 z-40 rounded-[var(--radius-card)] border border-border bg-surface p-3 shadow-md">
          <Typography variant="caption" tone="secondary" className="px-2 pb-2">
            More
          </Typography>
          <div className="grid grid-cols-2 gap-2">
            {mobileMoreNavigationItems.map((item) => {
              const active = isNavigationItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[var(--touch-target)] items-center gap-2 rounded-[var(--radius-button)] px-3 text-[length:var(--text-small)] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-muted hover:text-text-primary',
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-2 pb-2 pt-2"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {mobilePrimaryNavigationItems.map((item) => {
            const active = isNavigationItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[var(--touch-target)] flex-col items-center justify-center gap-1 rounded-[var(--radius-button)] px-1 text-[length:var(--text-caption)] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  active
                    ? 'text-primary'
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary',
                )}
              >
                <Icon className="size-5" aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={onToggleMore}
            aria-expanded={moreOpen}
            aria-label="더보기 메뉴"
            className={cn(
              'flex min-h-[var(--touch-target)] flex-col items-center justify-center gap-1 rounded-[var(--radius-button)] px-1 text-[length:var(--text-caption)] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              moreActive || moreOpen
                ? 'text-primary'
                : 'text-text-secondary hover:bg-muted hover:text-text-primary',
            )}
          >
            <MoreHorizontal className="size-5" aria-hidden />
            <span>More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export { MobileNavigation };
