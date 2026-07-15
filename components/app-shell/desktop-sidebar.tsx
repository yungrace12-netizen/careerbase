'use client';

import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import {
  desktopNavigationItems,
  isNavigationItemActive,
} from '@/components/app-shell/navigation';

interface DesktopSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  pathname: string;
}

function DesktopSidebar({
  collapsed,
  onToggleCollapsed,
  pathname,
}: DesktopSidebarProps) {
  return (
    <aside
      className={cn(
        'hidden shrink-0 border-r border-border bg-surface transition-[width] duration-[var(--duration-normal)] md:flex',
        collapsed ? 'w-16' : 'w-[200px]',
      )}
      aria-label="Primary navigation"
    >
      <div className="flex h-dvh w-full flex-col">
        <div
          className={cn(
            'flex h-14 items-center border-b border-border px-2',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {!collapsed ? (
            <Link
              href="/"
              className="flex min-w-0 items-center gap-1.5 rounded-[var(--radius-button)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label="CareerBase Dashboard"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-primary text-primary-foreground">
                C
              </span>
              <Typography variant="card-title" className="truncate">
                Grace
              </Typography>
            </Link>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
            className="hidden md:inline-flex"
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden className="size-5" />
            ) : (
              <PanelLeftClose aria-hidden className="size-5" />
            )}
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-1.5 py-4">
          {desktopNavigationItems.map((item) => {
            const active = isNavigationItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex min-h-10 items-center gap-2 rounded-[var(--radius-button)] px-2.5 text-[length:var(--text-small)] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary',
                  collapsed && 'justify-center px-2',
                )}
              >
                <span
                  className={cn(
                    'absolute left-0 h-6 w-1 rounded-[var(--radius-badge)] bg-primary transition-opacity',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <Icon className="size-5 shrink-0" aria-hidden />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export { DesktopSidebar };
