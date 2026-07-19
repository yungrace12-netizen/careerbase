import { companyResearchRepository } from '@/repositories/companyResearchRepository';
import { essayRepository } from '@/repositories/essayRepository';
import { interviewRepository } from '@/repositories/interviewRepository';
import { jobRepository } from '@/repositories/jobRepository';
import { profileRepository } from '@/repositories/profileRepository';
import type { EntityId } from '@/types/job';

function buildInterviewCoachPrompt(jobId: EntityId): string | null {
  const job = jobRepository.getJob(jobId);

  if (!job) {
    return null;
  }

  const essays = essayRepository.getEssaysByJobId(jobId);
  const profile = profileRepository.getProfile();
  const companyResearch =
    companyResearchRepository.getCompanyResearchByJobId(jobId);
  const stages = interviewRepository.getInterviewStagesByJobId(jobId);

  const sections: string[] = [
    '당신은 취업 면접 코치입니다. 아래 CareerBase 데이터를 기반으로만 분석해주세요.',
    '',
    '## 생성 규칙',
    '- 입력되지 않은 사실을 생성하지 마세요.',
    '- 수치와 성과를 임의로 생성하지 마세요.',
    '- 부족한 부분은 부족하다고 답변해주세요.',
    '- 추측하지 마세요.',
    '- 보완이 필요한 부분은 따로 작성해주세요.',
    '- STAR가 부족하면 부족하다고 답변해주세요.',
    '- 직무 연결성이 부족하면 부족하다고 답변해주세요.',
    '',
    '## 공고 정보',
    `기업명: ${valueOrEmpty(job.companyName)}`,
    `공고명: ${valueOrEmpty(job.postingTitle)}`,
    `직무: ${valueOrEmpty(job.position)}`,
    `지원 상태: ${valueOrEmpty(job.detailedStatus)} / ${valueOrEmpty(job.boardColumn)}`,
    '',
    '공고 내용:',
    valueOrEmpty(job.postingContent),
    '',
    '자격요건:',
    valueOrEmpty(job.qualifications),
    '',
    '## 자소서',
  ];

  if (essays.length === 0) {
    sections.push('(입력된 자소서 없음)');
  } else {
    essays.forEach((essay, index) => {
      sections.push(`### 문항 ${index + 1}`);
      sections.push(valueOrEmpty(essay.question));
      sections.push('');
      sections.push('최종 답변:');
      sections.push(valueOrEmpty(essay.finalAnswer));
      sections.push('');
    });
  }

  sections.push('## Profile');
  sections.push('### 학력');
  if (profile.universities.length === 0 && profile.highSchools.length === 0) {
    sections.push('(입력된 학력 없음)');
  } else {
    profile.highSchools.forEach((school) => {
      sections.push(
        `- 고등학교: ${valueOrEmpty(school.schoolName)} / ${valueOrEmpty(school.academicTrack)}`,
      );
    });
    profile.universities.forEach((university) => {
      sections.push(
        `- 대학교: ${valueOrEmpty(university.universityName)} / ${valueOrEmpty(university.major)}`,
      );
    });
  }

  sections.push('');
  sections.push('### 경력');
  if (profile.careers.length === 0) {
    sections.push('(입력된 경력 없음)');
  } else {
    profile.careers.forEach((career) => {
      sections.push(
        `- ${valueOrEmpty(career.companyName)} / ${valueOrEmpty(career.department)} / ${valueOrEmpty(career.position)}`,
      );
      sections.push(`  담당업무: ${valueOrEmpty(career.responsibilities)}`);
      sections.push(`  설명: ${valueOrEmpty(career.careerDescription)}`);
    });
  }

  sections.push('');
  sections.push('### 활동');
  if (profile.activities.length === 0) {
    sections.push('(입력된 활동 없음)');
  } else {
    profile.activities.forEach((activity) => {
      sections.push(
        `- [${activity.activityType}] ${valueOrEmpty(activity.organizationName)} / ${valueOrEmpty(activity.role)}`,
      );
      sections.push(`  ${valueOrEmpty(activity.description)}`);
    });
  }

  sections.push('');
  sections.push('### 자격증');
  if (profile.certificates.length === 0) {
    sections.push('(입력된 자격증 없음)');
  } else {
    profile.certificates.forEach((certificate) => {
      sections.push(
        `- ${valueOrEmpty(certificate.certificateName)} / ${valueOrEmpty(certificate.issuingOrganization)}`,
      );
    });
  }

  sections.push('');
  sections.push('### 수상경력');
  if (profile.awards.length === 0) {
    sections.push('(입력된 수상경력 없음)');
  } else {
    profile.awards.forEach((award) => {
      sections.push(
        `- ${valueOrEmpty(award.awardName)} / ${valueOrEmpty(award.awardingOrganization)}`,
      );
      sections.push(`  ${valueOrEmpty(award.description)}`);
    });
  }

  sections.push('');
  sections.push('### 취미/특기');
  sections.push(`취미: ${valueOrEmpty(profile.otherInfo.hobby)}`);
  sections.push(`특기: ${valueOrEmpty(profile.otherInfo.specialty)}`);

  sections.push('');
  sections.push('## 회사정보');
  if (!companyResearch) {
    sections.push('(입력된 회사정보 없음)');
  } else {
    sections.push(`Mission: ${valueOrEmpty(companyResearch.mission)}`);
    sections.push(`Vision: ${valueOrEmpty(companyResearch.vision)}`);
    sections.push(`핵심가치: ${valueOrEmpty(companyResearch.coreValues)}`);
    sections.push(`인재상: ${valueOrEmpty(companyResearch.talentProfile)}`);
    sections.push(`주요 사업: ${valueOrEmpty(companyResearch.mainBusiness)}`);
    sections.push(
      `회사 및 조직 이해: ${valueOrEmpty(companyResearch.companyOverview)}`,
    );
    sections.push(`최근 주요 이슈: ${valueOrEmpty(companyResearch.recentIssues)}`);
    sections.push(
      `지원 직무와 회사의 연결점: ${valueOrEmpty(companyResearch.jobConnection)}`,
    );
    sections.push(
      `내가 기여할 수 있는 부분: ${valueOrEmpty(companyResearch.expectedContribution)}`,
    );
    sections.push(`메모: ${valueOrEmpty(companyResearch.memo)}`);
  }

  sections.push('');
  sections.push('## 면접 준비 내용');
  if (stages.length === 0) {
    sections.push('(등록된 면접 단계 없음)');
  } else {
    stages.forEach((stage) => {
      sections.push(`### ${stage.name} (${stage.status})`);
      if (stage.expectedQuestions.length === 0) {
        sections.push('(예상 질문 없음)');
      } else {
        stage.expectedQuestions.forEach((question, index) => {
          sections.push(`Q${index + 1}. ${valueOrEmpty(question.question)}`);
          sections.push(`답변: ${valueOrEmpty(question.answer)}`);
          if (question.followUpQuestions?.length) {
            sections.push(
              `꼬리질문: ${question.followUpQuestions.join(' / ')}`,
            );
          }
        });
      }
      sections.push('');
    });
  }

  sections.push('## 요청 분석');
  sections.push('1. 회사 이해도를 100점 만점으로 평가해주세요.');
  sections.push('2. 직무 이해도를 평가해주세요.');
  sections.push('3. 지원동기의 논리성을 평가해주세요.');
  sections.push('4. STAR 기법이 부족한 부분이 있는지 평가해주세요.');
  sections.push('5. 자소서와 직무 연결성이 충분한지 평가해주세요.');
  sections.push('6. 예상질문을 생성해주세요.');
  sections.push('7. 꼬리질문을 생성해주세요.');
  sections.push('8. 답변에서 부족한 부분을 찾아주세요.');
  sections.push('9. 정량적인 성과가 부족한 부분을 알려주세요.');
  sections.push('10. 추천하면 좋은 경험을 알려주세요.');
  sections.push('11. 추천하면 좋은 자소서 내용을 알려주세요.');
  sections.push('12. 면접관이라면 가장 먼저 물어볼 질문을 알려주세요.');
  sections.push('13. 압박질문을 생성해주세요.');
  sections.push('14. 면접 준비도를 평가해주세요.');
  sections.push('15. 최종 면접 점수를 100점 만점으로 평가해주세요.');
  sections.push('');
  sections.push('## 응답 형식 가이드');
  sections.push('가능하면 아래 제목을 사용해 답변해주세요.');
  sections.push('- 회사 이해도 점수');
  sections.push('- 직무 이해도 점수');
  sections.push('- 최종 면접 점수');
  sections.push('- 예상질문');
  sections.push('- 꼬리질문');
  sections.push('- AI 의견');
  sections.push('- 부족한 부분');
  sections.push('- 추천 경험');
  sections.push('- 추천 자소서');

  return sections.join('\n');
}

function valueOrEmpty(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '(미입력)';
}

export { buildInterviewCoachPrompt };
