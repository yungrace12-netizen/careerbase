'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { DesktopSidebar } from '@/components/app-shell/desktop-sidebar';
import { MobileNavigation } from '@/components/app-shell/mobile-navigation';
import { TopBar } from '@/components/app-shell/top-bar';
import { getCurrentNavigationItem } from '@/components/app-shell/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = React.useState(false);
  const currentNavigationItem = getCurrentNavigationItem(pathname);

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        pathname={pathname}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={currentNavigationItem.label} />
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
    </div>
  );
}

export { AppShell };
