import type { CSSProperties } from 'react';
import type { Metadata } from 'next';

import { AppShell } from '@/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerBase',
  description: '지원할수록 완성되는 나만의 커리어 데이터베이스.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body
        className="min-h-full bg-background text-foreground"
        style={
          {
            '--font-pretendard':
              "'Pretendard', system-ui, -apple-system, sans-serif",
          } as CSSProperties
        }
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
