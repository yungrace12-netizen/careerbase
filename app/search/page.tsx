import { SearchPage as SearchFeaturePage } from '@/features/search';
import type { SearchFilter } from '@/stores/searchStore';

interface SearchRoutePageProps {
  searchParams: Promise<{
    q?: string;
    filter?: string;
  }>;
}

const validFilters: SearchFilter[] = [
  '전체',
  'Jobs',
  'Experience',
  'Essay',
  'Interview',
  'Profile',
  'Archive',
];

export default async function SearchRoutePage({
  searchParams,
}: SearchRoutePageProps) {
  const params = await searchParams;

  return (
    <SearchFeaturePage
      initialQuery={params.q ?? ''}
      initialFilter={isSearchFilter(params.filter) ? params.filter : '전체'}
    />
  );
}

function isSearchFilter(value: string | undefined): value is SearchFilter {
  return Boolean(value && validFilters.includes(value as SearchFilter));
}
