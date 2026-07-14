'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Typography } from '@/components/ui/typography';
import {
  Container,
  ContentWrapper,
  PageHeader,
  PageWrapper,
} from '@/components/layout';
import { useJobStore } from '@/stores/jobStore';
import type { CreateJobInput, Job } from '@/types/job';
import { JobFormModal } from './job-form-modal';
import { JobsList } from './jobs-list';

function JobsPage() {
  const jobs = useJobStore((state) => state.jobs);
  const loadJobs = useJobStore((state) => state.loadJobs);
  const createJob = useJobStore((state) => state.createJob);
  const updateJob = useJobStore((state) => state.updateJob);
  const archiveJob = useJobStore((state) => state.archiveJob);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<Job | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Job | null>(null);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleSubmit = (input: CreateJobInput) => {
    if (editingJob) {
      updateJob(editingJob.id, input);
      return;
    }

    createJob(input);
  };

  const handleArchive = () => {
    if (!archiveTarget) {
      return;
    }

    archiveJob(archiveTarget.id);
    setArchiveTarget(null);
  };

  return (
    <PageWrapper>
      <Container>
        <ContentWrapper>
          <PageHeader
            title="Jobs"
            description="채용공고를 등록하고 지원 준비를 시작합니다."
          >
            <Button type="button" onClick={openCreateModal}>
              <Plus className="size-5" aria-hidden />
              새 공고 등록
            </Button>
          </PageHeader>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
            <JobsList
              jobs={jobs}
              onCreate={openCreateModal}
              onEdit={openEditModal}
              onArchive={setArchiveTarget}
            />

            <Card className="hidden lg:flex">
              <CardHeader>
                <CardTitle>공고 상세</CardTitle>
                <CardDescription>상세 화면은 다음 Sprint에서 구현합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-80 items-center justify-center rounded-[var(--radius-card)] border border-border bg-background p-6 text-center">
                  <Typography variant="body" tone="secondary">
                    왼쪽 목록에서 공고를 관리할 수 있습니다.
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </ContentWrapper>
      </Container>

      <JobFormModal
        open={formOpen}
        job={editingJob}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <Modal
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setArchiveTarget(null);
          }
        }}
        title="Archive 이동"
        confirmLabel="Archive 이동"
        onConfirm={handleArchive}
      >
        <Typography variant="body">이 공고를 Archive로 이동할까요?</Typography>
      </Modal>
    </PageWrapper>
  );
}

export { JobsPage };
