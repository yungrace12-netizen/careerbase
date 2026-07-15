'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { DesktopSidebar } from '@/components/app-shell/desktop-sidebar';
import { MobileNavigation } from '@/components/app-shell/mobile-navigation';
import { TopBar } from '@/components/app-shell/top-bar';
import { getCurrentNavigationItem } from '@/components/app-shell/navigation';
import { Toast, ToastViewport } from '@/components/ui/toast';
import { JobFormModal } from '@/features/jobs/job-form-modal';
import { useJobStore } from '@/stores/jobStore';
import type { CreateJobInput } from '@/types/job';

interface AppShellProps {
  children: React.ReactNode;
}

function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const createJob = useJobStore((state) => state.createJob);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = React.useState(false);
  const [jobFormOpen, setJobFormOpen] = React.useState(false);
  const [createToastOpen, setCreateToastOpen] = React.useState(false);
  const currentNavigationItem = getCurrentNavigationItem(pathname);

  const handleCreateJob = (input: CreateJobInput) => {
    createJob(input);
    setCreateToastOpen(true);
  };

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        pathname={pathname}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={currentNavigationItem.label}
          onCreateJob={() => setJobFormOpen(true)}
        />
        <div className="min-h-0 flex-1 overflow-y-auto pb-24 md:pb-0">
          {children}
        </div>
      </div>

      <MobileNavigation
        moreOpen={mobileMoreOpen}
        onNavigate={() => setMobileMoreOpen(false)}
        onToggleMore={() => setMobileMoreOpen((open) => !open)}
        pathname={pathname}
      />

      <JobFormModal
        open={jobFormOpen}
        job={null}
        onOpenChange={setJobFormOpen}
        onSubmit={handleCreateJob}
      />

      {createToastOpen ? (
        <ToastViewport>
          <Toast
            variant="success"
            title="공고를 등록했습니다."
            description="Jobs 목록에 새 공고가 추가되었습니다."
            onClose={() => setCreateToastOpen(false)}
          />
        </ToastViewport>
      ) : null}
    </div>
  );
}

export { AppShell };
