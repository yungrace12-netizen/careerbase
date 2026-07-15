'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import {
  Container,
  ContentWrapper,
  PageWrapper,
} from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import {
  searchCategories,
  useSearchStore,
  type SearchFilter,
} from '@/stores/searchStore';
import type {
  SearchCategory,
  SearchResult,
} from '@/repositories/searchRepository';

interface SearchPageProps {
  initialQuery?: string;
  initialFilter?: SearchFilter;
}

const filters: SearchFilter[] = ['전체', ...searchCategories];
const maxVisibleResults = 5;

const categoryLabels: Record<SearchCategory, string> = {
  Jobs: 'Jobs',
  Experience: 'Experience',
  Essay: 'Essay',
  Interview: 'Interview',
  Profile: 'Profile',
  Archive: 'Archive',
};

const categoryOrder: SearchCategory[] = [
  'Jobs',
  'Experience',
  'Essay',
  'Interview',
  'Profile',
  'Archive',
];

function SearchPage({
  initialQuery = '',
  initialFilter = '전체',
}: SearchPageProps) {
  const router = useRouter();
  const results = useSearchStore((state) => state.results);
  const runSearch = useSearchStore((state) => state.search);
  const reset = useSearchStore((state) => state.reset);

  const [query, setQuery] = React.useState(initialQuery);
  const [filter, setFilter] = React.useState<SearchFilter>(initialFilter);
  const [expandedCategories, setExpandedCategories] = React.useState<
    Partial<Record<SearchCategory, boolean>>
  >({});
  const trimmedQuery = query.trim();
  const totalCount = categoryOrder.reduce(
    (sum, category) => sum + results[category].length,
    0,
  );

  React.useEffect(() => {
    if (!trimmedQuery) {
      reset();
      return;
    }

    runSearch(trimmedQuery, filter);
  }, [filter, reset, runSearch, trimmedQuery]);

  const updateUrl = React.useCallback(
    (nextQuery: string, nextFilter: SearchFilter) => {
      const params = new URLSearchParams();

      if (nextQuery.trim()) {
        params.set('q', nextQuery.trim());
      }

      if (nextFilter !== '전체') {
        params.set('filter', nextFilter);
      }

      router.replace(params.size ? `/search?${params.toString()}` : '/search', {
        scroll: false,
      });
    },
    [router],
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setExpandedCategories({});
    updateUrl(value, filter);
  };

  const handleFilterChange = (nextFilter: SearchFilter) => {
    setFilter(nextFilter);
    setExpandedCategories({});
    updateUrl(query, nextFilter);
  };

  return (
    <PageWrapper>
      <Container>
        <ContentWrapper>
          <Typography variant="body" tone="secondary">
            CareerBase 전체 데이터를 빠르게 검색하고 해당 페이지로 이동합니다.
          </Typography>

          <Card>
            <CardContent>
              <div className="grid gap-4">
                <Input
                  label="검색"
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="기업명, 자소서, 면접, Experience, Profile을 검색하세요."
                  autoFocus
                />
                <div className="flex flex-wrap gap-2" aria-label="Search filters">
                  {filters.map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant={filter === item ? 'primary' : 'secondary'}
                      onClick={() => handleFilterChange(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {!trimmedQuery ? (
            <EmptyState
              title="무엇을 찾고 계신가요?"
              description="CareerBase 전체 데이터를 검색해보세요."
              illustration={<Search className="size-8" aria-hidden />}
              className="rounded-[var(--radius-card)] border border-border bg-surface"
            />
          ) : totalCount === 0 ? (
            <EmptyState
              title="조건에 맞는 데이터가 없습니다."
              description="검색어를 바꾸거나 필터를 전체로 변경해보세요."
              illustration={<Search className="size-8" aria-hidden />}
              className="rounded-[var(--radius-card)] border border-border bg-surface"
            />
          ) : (
            <div className="grid gap-4">
              {categoryOrder.map((category) => {
                const categoryResults = results[category];

                if (categoryResults.length === 0) {
                  return null;
                }

                const isExpanded = Boolean(expandedCategories[category]);
                const visibleResults = isExpanded
                  ? categoryResults
                  : categoryResults.slice(0, maxVisibleResults);
                const hiddenCount = categoryResults.length - maxVisibleResults;

                return (
                  <SearchResultSection
                    key={category}
                    category={category}
                    results={visibleResults}
                    totalCount={categoryResults.length}
                    hiddenCount={hiddenCount}
                    isExpanded={isExpanded}
                    onShowMore={() =>
                      setExpandedCategories((state) => ({
                        ...state,
                        [category]: true,
                      }))
                    }
                  />
                );
              })}
            </div>
          )}
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
}

function SearchResultSection({
  category,
  results,
  totalCount,
  hiddenCount,
  isExpanded,
  onShowMore,
}: {
  category: SearchCategory;
  results: SearchResult[];
  totalCount: number;
  hiddenCount: number;
  isExpanded: boolean;
  onShowMore: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {categoryLabels[category]} ({totalCount})
        </CardTitle>
        <CardDescription>검색 결과를 클릭하면 관련 화면으로 이동합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.href}
              className={cn(
                'block rounded-[var(--radius-card)] border border-border bg-background p-4',
                'transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Typography variant="small" className="font-semibold">
                    {result.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    tone="secondary"
                    className="mt-1 block"
                  >
                    {result.subtitle || categoryLabels[result.category]}
                  </Typography>
                </div>
                <Badge variant={result.category === 'Archive' ? 'archive' : 'primary'}>
                  {categoryLabels[result.category]}
                </Badge>
              </div>
              <Typography variant="small" tone="secondary" className="mt-3">
                {result.snippet}
              </Typography>
            </Link>
          ))}
          {hiddenCount > 0 && !isExpanded ? (
            <Button type="button" variant="secondary" onClick={onShowMore}>
              +{hiddenCount}개 더보기
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export { SearchPage };
