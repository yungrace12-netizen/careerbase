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
}

function TodoCard({ todos }: TodoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TODO</CardTitle>
        <CardDescription>자동 생성 TODO와 직접 TODO를 구분합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {todos.length > 0 ? (
          <div className="flex flex-col gap-3">
            {todos.map((todo) => (
              <label
                key={todo.id}
                className="flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-background p-3"
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
