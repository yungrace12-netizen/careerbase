import { InterviewPrintPage } from '@/features/jobs/job-detail/interview-print-page';

interface InterviewPrintRoutePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterviewPrintRoutePage({
  params,
}: InterviewPrintRoutePageProps) {
  const { id } = await params;

  return <InterviewPrintPage jobId={id} />;
}
