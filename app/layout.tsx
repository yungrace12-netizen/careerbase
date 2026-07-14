import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
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
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        style={
          {
            '--font-pretendard':
              "'Pretendard', system-ui, -apple-system, sans-serif",
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
