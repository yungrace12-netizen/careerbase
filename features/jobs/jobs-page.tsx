'use client';

import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Toast, ToastViewport } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import {
  Container,
  ContentWrapper,
  PageWrapper,
} from '@/components/layout';
import { useJobStore } from '@/stores/jobStore';
import type { CreateJobInput, Job } from '@/types/job';
import { JobFormModal } from './job-form-modal';
import { JobsList } from './jobs-list';

function JobsPage() {
  const jobs = useJobStore((state) => state.jobs);
  const loadJobs = useJobStore((state) => state.loadJobs);
  const updateJob = useJobStore((state) => state.updateJob);
  const archiveJob = useJobStore((state) => state.archiveJob);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<Job | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Job | null>(null);
  const [archiveToastOpen, setArchiveToastOpen] = React.useState(false);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  React.useEffect(() => {
    if (window.location.hash !== '#archived') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setArchiveToastOpen(true);
    }, 0);
    window.history.replaceState(null, '', '/jobs');

    return () => window.clearTimeout(timeoutId);
  }, []);

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleSubmit = (input: CreateJobInput) => {
    if (editingJob) {
      updateJob(editingJob.id, input);
    }
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
            <JobsList
              jobs={jobs}
              onEdit={openEditModal}
              onArchive={setArchiveTarget}
            />

            <Card className="hidden lg:flex">
              <CardHeader>
                <CardTitle>공고 상세</CardTitle>
                <CardDescription>목록에서 공고를 선택하면 상세 화면으로 이동합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-80 items-center justify-center rounded-[var(--radius-card)] border border-border bg-background p-6 text-center">
                  <Typography variant="body" tone="secondary">
                    왼쪽 목록에서 공고를 선택해주세요.
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

      {archiveToastOpen ? (
        <ToastViewport>
          <Toast
            variant="success"
            title="Archive로 이동했습니다."
            description="공고 목록에서 제외되었습니다."
            onClose={() => setArchiveToastOpen(false)}
          />
        </ToastViewport>
      ) : null}
    </PageWrapper>
  );
}

export { JobsPage };
