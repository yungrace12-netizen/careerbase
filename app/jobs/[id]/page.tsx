import { JobDetailPage as JobDetailFeaturePage } from '@/features/jobs/job-detail';

interface JobDetailRoutePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailRoutePage({
  params,
}: JobDetailRoutePageProps) {
  const { id } = await params;

  return <JobDetailFeaturePage jobId={id} />;
}
