import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

interface TopBarProps {
  title: string;
}

function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="flex min-h-16 items-center gap-4 px-4 md:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <Typography variant="section" className="truncate">
            {title}
          </Typography>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div
            className="flex h-[var(--input-height)] min-w-64 items-center gap-3 rounded-[var(--radius-input)] border border-border bg-background px-4 text-text-secondary"
            role="search"
            aria-label="Global search placeholder"
          >
            <Search className="size-5 shrink-0" aria-hidden />
            <span className="text-[length:var(--text-small)]">
              Global Search
            </span>
          </div>

          <Button type="button" aria-label="새 공고 등록">
            <Plus aria-hidden className="size-5" />
            새 공고 등록
          </Button>
        </div>
      </div>
    </header>
  );
}

export { TopBar };
