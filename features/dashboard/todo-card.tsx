import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { DashboardEmptyState } from './dashboard-empty-state';
import type { DashboardTodo } from './dashboard-data';

interface TodoCardProps {
  todos: DashboardTodo[];
  className?: string;
}

function TodoCard({ todos, className }: TodoCardProps) {
  return (
    <Card className={cn('min-h-0 overflow-hidden gap-2 p-3', className)}>
      <CardHeader className="shrink-0 gap-0.5">
        <CardTitle className="text-[length:var(--text-body)]">
          TODO
        </CardTitle>
        <CardDescription className="truncate text-[length:var(--text-caption)]">
          자동 TODO와 직접 TODO
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto pr-1">
        {todos.length > 0 ? (
          <div className="flex flex-col gap-2">
            {todos.map((todo) => (
              <label
                key={todo.id}
                className="flex items-start gap-2 rounded-[var(--radius-card)] border border-border bg-background p-2"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  readOnly
                  className="mt-1 size-4 accent-primary"
                  aria-label={todo.title}
                />
                <span className="min-w-0 flex-1">
                  <span className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant={todo.source === '자동' ? 'primary' : 'default'}>
                      {todo.source}
                    </Badge>
                    {todo.completed ? (
                      <Typography variant="caption" tone="secondary">
                        완료됨
                      </Typography>
                    ) : null}
                  </span>
                  <Typography
                    as="span"
                    variant="small"
                    className={cn(
                      'block font-medium',
                      todo.completed && 'text-text-secondary line-through',
                    )}
                  >
                    {todo.title}
                  </Typography>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            title="TODO가 없습니다."
            description="마감 임박, 면접 준비, 제출 필요 항목이 이곳에 표시됩니다."
          />
        )}
      </CardContent>
    </Card>
  );
}

export { TodoCard };
