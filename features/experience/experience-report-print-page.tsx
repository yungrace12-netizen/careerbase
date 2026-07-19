'use client';

import * as React from 'react';
import Link from 'next/link';
import { Printer } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { experienceReportRepository } from '@/repositories/experienceReportRepository';
import type { ExperienceReport } from '@/types/experience-report';

function ExperienceReportPrintPage() {
  const [report, setReport] = React.useState<
    ExperienceReport | null | undefined
  >(undefined);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setReport(experienceReportRepository.getLatestExperienceReport());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  React.useEffect(() => {
    if (!report) {
      return;
    }

    const previousTitle = document.title;
    document.title = 'AI Experience Report';

    return () => {
      document.title = previousTitle;
    };
  }, [report]);

  if (report === undefined) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <EmptyState
          title="인쇄 내용을 불러오는 중입니다."
          description="잠시만 기다려주세요."
        />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <EmptyState
          title="저장된 AI Experience Report가 없습니다."
          description="Experience Library에서 AI 분석 결과를 가져와 저장한 뒤 PDF를 생성하세요."
        />
        <Link
          href="/experience"
          className={cn(buttonVariants({ variant: 'secondary' }))}
        >
          Experience Library로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/experience"
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          돌아가기
        </Link>
        <Button type="button" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden />
          인쇄 / PDF 저장
        </Button>
      </div>

      <header className="border-b border-border pb-4">
        <Typography as="h1" variant="heading">
          AI Experience Report
        </Typography>
        <Typography variant="small" tone="secondary" className="mt-2">
          CareerBase Experience AI · 업데이트{' '}
          {new Date(report.updatedAt).toLocaleString('ko-KR')}
        </Typography>
      </header>

      <PrintSection title="나를 한 줄로 표현하면?" value={report.oneLiner} />
      <PrintSection title="나의 강점" value={report.strengths} />
      <PrintSection title="나의 약점" value={report.weaknesses} />
      <PrintSection title="나의 성향" value={report.personality} />
      <PrintSection title="추천 직무" value={report.recommendedRoles} />
      <PrintSection
        title="추천 기업 유형"
        value={report.recommendedCompanyTypes}
      />
      <PrintSection title="추천 경험" value={report.recommendedExperiences} />
      <PrintSection title="추천 자소서" value={report.recommendedEssays} />
      <PrintListSection title="예상 질문" items={report.expectedQuestions} />
      <PrintListSection title="꼬리 질문" items={report.followUpQuestions} />
      <PrintListSection title="압박 질문" items={report.pressureQuestions} />
      <PrintSection
        title="답변 보완 사항"
        value={report.answerImprovements}
      />
      <PrintSection title="취업 전략" value={report.careerStrategy} />
      <PrintSection title="면접 준비도" value={report.interviewReadiness} />
      <PrintSection title="취업 준비도" value={report.careerReadiness} />
      <PrintSection title="AI 의견" value={report.aiOpinion} />
    </div>
  );
}

function PrintSection({ title, value }: { title: string; value: string }) {
  if (!value.trim()) {
    return null;
  }

  return (
    <section className="break-inside-avoid space-y-2">
      <Typography as="h2" variant="card-title">
        {title}
      </Typography>
      <Typography variant="body" className="whitespace-pre-wrap">
        {value}
      </Typography>
    </section>
  );
}

function PrintListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="break-inside-avoid space-y-2">
      <Typography as="h2" variant="card-title">
        {title}
      </Typography>
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>
            <Typography variant="body">{item}</Typography>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { ExperienceReportPrintPage };
