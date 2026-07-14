import { CalendarDays } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';

interface DashboardEmptyStateProps {
  title: string;
  description: string;
}

function DashboardEmptyState({ title, description }: DashboardEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      illustration={<CalendarDays className="size-8" aria-hidden />}
      className="min-h-48 rounded-[var(--radius-card)] border border-border bg-background py-10"
    />
  );
}

export { DashboardEmptyState };
