'use client';

import * as React from 'react';

import {
  Container,
  ContentWrapper,
  PageWrapper,
} from '@/components/layout';
import { Modal } from '@/components/ui/modal';
import { Toast, ToastViewport } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
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
          <JobsList
            jobs={jobs}
            onEdit={openEditModal}
            onArchive={setArchiveTarget}
          />
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
