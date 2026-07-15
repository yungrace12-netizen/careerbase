import { JobDetailPage as JobDetailFeaturePage } from '@/features/jobs/job-detail';

interface JobDetailRoutePageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function JobDetailRoutePage({
  params,
  searchParams,
}: JobDetailRoutePageProps) {
  const { id } = await params;
  const { tab } = await searchParams;

  return (
    <JobDetailFeaturePage
      jobId={id}
      initialTab={isJobDetailTab(tab) ? tab : 'info'}
    />
  );
}

function isJobDetailTab(
  value: string | undefined,
): value is 'info' | 'essay' | 'interview' | 'schedule' | 'application' {
  return (
    value === 'info' ||
    value === 'essay' ||
    value === 'interview' ||
    value === 'schedule' ||
    value === 'application'
  );
}
