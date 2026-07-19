'use client';

import * as React from 'react';
import Link from 'next/link';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Typography } from '@/components/ui/typography';
import { companyResearchRepository } from '@/repositories/companyResearchRepository';
import { experienceRepository } from '@/repositories/experienceRepository';
import { interviewCoachImportRepository } from '@/repositories/interviewCoachImportRepository';
import { interviewRepository } from '@/repositories/interviewRepository';
import { jobRepository } from '@/repositories/jobRepository';
import type { CompanyResearch } from '@/types/company-research';
import { getCompanyResearchDisplayContent } from '@/types/company-research';
import type { Experience } from '@/types/essay';
import type { InterviewCoachImport } from '@/types/interview-coach';
import type { InterviewStage } from '@/types/interview';
import type { Job } from '@/types/job';

interface InterviewPrintPageProps {
  jobId: string;
}

interface PrintPageData {
  job: Job | null;
  research: CompanyResearch | null;
  stages: InterviewStage[];
  experiences: Experience[];
  coachImport: InterviewCoachImport | null;
}

function readPrintPageData(jobId: string): PrintPageData {
  return {
    job: jobRepository.getJob(jobId),
    research: companyResearchRepository.getCompanyResearchByJobId(jobId),
    stages: interviewRepository.getInterviewStagesByJobId(jobId),
    experiences: experienceRepository.getExperiences(),
    coachImport:
      interviewCoachImportRepository.getInterviewCoachImportByJobId(jobId),
  };
}

function InterviewPrintPage({ jobId }: InterviewPrintPageProps) {
  const [data, setData] = React.useState<PrintPageData | null>(null);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setData(readPrintPageData(jobId));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [jobId]);

  React.useEffect(() => {
    if (!data?.job) {
      return;
    }

    const fileName = buildPrintFileName(data.job);
    const previousTitle = document.title;
    document.title = fileName;

    return () => {
      document.title = previousTitle;
    };
  }, [data?.job]);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <EmptyState
          title="인쇄 내용을 불러오는 중입니다."
          description="잠시만 기다려주세요."
        />
      </div>
    );
  }

  const { job, research, stages, experiences, coachImport } = data;

  if (!job) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <EmptyState
          title="공고를 찾을 수 없습니다."
          description="인쇄할 공고가 존재하지 않습니다."
          action={
            <Link href="/jobs">
              <Button type="button">Jobs로 돌아가기</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const experienceMap = new Map(
    experiences.map((experience) => [experience.id, experience]),
  );
  const generatedAt = new Date();

  return (
    <div className="interview-print-page bg-white text-black">
      <div className="print:hidden mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href={`/jobs/${job.id}?tab=interview`}>
          <Button type="button" variant="secondary">
            돌아가기
          </Button>
        </Link>
        <Button type="button" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden />
          인쇄 / PDF 저장
        </Button>
      </div>

      <article className="interview-print-document mx-auto max-w-4xl px-6 pb-16 pt-4">
        <section className="interview-print-section break-inside-avoid">
          <Typography as="h1" variant="heading" className="text-black">
            {job.companyName}
          </Typography>
          <Typography variant="section" className="mt-2 text-black">
            {job.postingTitle}
          </Typography>
          <Typography variant="body" className="mt-4 text-black">
            직무: {job.position || '미입력'}
          </Typography>
          <Typography variant="body" className="mt-1 text-black">
            생성일: {formatDisplayDate(generatedAt)}
          </Typography>
        </section>

        <CompanyResearchPrintSection research={research} />
        <PreparePrintSection stages={stages} experienceMap={experienceMap} />
        <CompletedPrintSection stages={stages} />
        <AiCoachPrintSection coachImport={coachImport} />
      </article>
    </div>
  );
}

function CompanyResearchPrintSection({
  research,
}: {
  research: CompanyResearch | null;
}) {
  const content = getCompanyResearchDisplayContent(research).trim();

  if (!content) {
    return null;
  }

  return (
    <section className="interview-print-section mt-10">
      <Typography as="h2" variant="section" className="text-black">
        회사정보
      </Typography>
      <Typography
        variant="small"
        className="mt-4 whitespace-pre-wrap text-black"
      >
        {content}
      </Typography>
    </section>
  );
}

function PreparePrintSection({
  stages,
  experienceMap,
}: {
  stages: InterviewStage[];
  experienceMap: Map<string, Experience>;
}) {
  const stagesWithQuestions = stages.filter(
    (stage) => stage.expectedQuestions.length > 0,
  );

  if (stagesWithQuestions.length === 0) {
    return null;
  }

  return (
    <section className="interview-print-section mt-10">
      <Typography as="h2" variant="section" className="text-black">
        면접준비
      </Typography>
      <div className="mt-4 grid gap-8">
        {stagesWithQuestions.map((stage) => (
          <div key={stage.id} className="grid gap-4">
            <Typography as="h3" variant="card-title" className="text-black">
              {stage.name}
            </Typography>
            {stage.expectedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="interview-print-card break-inside-avoid rounded-md border border-black/20 p-4"
              >
                <Typography variant="small" className="font-semibold text-black">
                  Q{index + 1}. {question.question}
                </Typography>
                {question.answer.trim() ? (
                  <PrintBlock label="작성한 답변" value={question.answer} />
                ) : null}
                {question.followUpQuestions &&
                question.followUpQuestions.length > 0 ? (
                  <div className="mt-3">
                    <Typography variant="caption" className="text-black">
                      AI 꼬리 질문
                    </Typography>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {question.followUpQuestions.map((item) => (
                        <li key={item}>
                          <Typography variant="small" className="text-black">
                            {item}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {question.experienceIds.length > 0 ? (
                  <div className="mt-3">
                    <Typography variant="caption" className="text-black">
                      연결 Experience
                    </Typography>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {question.experienceIds.map((experienceId) => {
                        const experience = experienceMap.get(experienceId);
                        return (
                          <li key={experienceId}>
                            <Typography variant="small" className="text-black">
                              {experience?.title || experienceId}
                            </Typography>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
                {question.sourceReason?.trim() ? (
                  <PrintBlock label="생성 근거" value={question.sourceReason} />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CompletedPrintSection({ stages }: { stages: InterviewStage[] }) {
  const stagesWithContent = stages.filter(
    (stage) =>
      stage.actualQuestions.length > 0 || Boolean(stage.retrospective.trim()),
  );

  if (stagesWithContent.length === 0) {
    return null;
  }

  return (
    <section className="interview-print-section mt-10">
      <Typography as="h2" variant="section" className="text-black">
        면접완료
      </Typography>
      <div className="mt-4 grid gap-8">
        {stagesWithContent.map((stage) => (
          <div key={stage.id} className="grid gap-4">
            <Typography as="h3" variant="card-title" className="text-black">
              {stage.name}
            </Typography>
            {stage.retrospective.trim() ? (
              <PrintBlock label="단계별 회고" value={stage.retrospective} />
            ) : null}
            {stage.actualQuestions.map((question, index) => (
              <div
                key={question.id}
                className="interview-print-card break-inside-avoid rounded-md border border-black/20 p-4"
              >
                <Typography variant="small" className="font-semibold text-black">
                  Q{index + 1}. {question.question}
                </Typography>
                {question.myAnswerMemo.trim() ? (
                  <PrintBlock label="내 답변 메모" value={question.myAnswerMemo} />
                ) : null}
                {question.improvementMemo.trim() ? (
                  <PrintBlock label="개선점" value={question.improvementMemo} />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function AiCoachPrintSection({
  coachImport,
}: {
  coachImport: InterviewCoachImport | null;
}) {
  if (!coachImport?.includeInPdf) {
    return null;
  }

  const hasContent =
    coachImport.expectedQuestions.length > 0 ||
    coachImport.followUpQuestions.length > 0 ||
    Boolean(coachImport.opinion.trim()) ||
    Boolean(coachImport.gaps.trim()) ||
    Boolean(coachImport.recommendedExperiences.trim()) ||
    Boolean(coachImport.recommendedEssayContent.trim()) ||
    Boolean(coachImport.interviewScore.trim()) ||
    Boolean(coachImport.companyUnderstandingScore.trim()) ||
    Boolean(coachImport.jobUnderstandingScore.trim());

  if (!hasContent) {
    return null;
  }

  return (
    <section className="interview-print-section mt-10">
      <Typography as="h2" variant="section" className="text-black">
        AI 면접 코치 결과
      </Typography>
      <div className="mt-4 grid gap-4">
        {coachImport.companyUnderstandingScore.trim() ? (
          <PrintBlock
            label="회사 이해도 점수"
            value={coachImport.companyUnderstandingScore}
          />
        ) : null}
        {coachImport.jobUnderstandingScore.trim() ? (
          <PrintBlock
            label="직무 이해도 점수"
            value={coachImport.jobUnderstandingScore}
          />
        ) : null}
        {coachImport.interviewScore.trim() ? (
          <PrintBlock label="AI 면접 점수" value={coachImport.interviewScore} />
        ) : null}
        {coachImport.expectedQuestions.length > 0 ? (
          <div className="break-inside-avoid">
            <Typography variant="caption" className="text-black">
              AI 예상질문
            </Typography>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {coachImport.expectedQuestions.map((item) => (
                <li key={item}>
                  <Typography variant="small" className="text-black">
                    {item}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {coachImport.followUpQuestions.length > 0 ? (
          <div className="break-inside-avoid">
            <Typography variant="caption" className="text-black">
              AI 꼬리질문
            </Typography>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {coachImport.followUpQuestions.map((item) => (
                <li key={item}>
                  <Typography variant="small" className="text-black">
                    {item}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {coachImport.opinion.trim() ? (
          <PrintBlock label="AI 의견" value={coachImport.opinion} />
        ) : null}
        {coachImport.gaps.trim() ? (
          <PrintBlock label="AI 보완사항" value={coachImport.gaps} />
        ) : null}
        {coachImport.recommendedExperiences.trim() ? (
          <PrintBlock
            label="추천 경험"
            value={coachImport.recommendedExperiences}
          />
        ) : null}
        {coachImport.recommendedEssayContent.trim() ? (
          <PrintBlock
            label="추천 자소서"
            value={coachImport.recommendedEssayContent}
          />
        ) : null}
      </div>
    </section>
  );
}

function PrintBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 break-inside-avoid">
      <Typography variant="caption" className="text-black">
        {label}
      </Typography>
      <Typography
        variant="small"
        className="mt-1 whitespace-pre-wrap text-black"
      >
        {value}
      </Typography>
    </div>
  );
}

function formatDisplayDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function buildPrintFileName(job: Job) {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const company = sanitizeFileName(job.companyName || '기업');
  const posting = sanitizeFileName(job.postingTitle || '공고');
  return `${company}_${posting}_면접준비_${stamp}`;
}

function sanitizeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '_').trim() || 'untitled';
}

export { InterviewPrintPage };
