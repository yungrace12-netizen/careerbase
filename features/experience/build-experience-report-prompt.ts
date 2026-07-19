import { readData } from '@/repositories/careerbaseStorage';

function buildExperienceReportPrompt(): string {
  const data = readData();
  const sections: string[] = [
    '당신은 취업 Career Data Analyst입니다.',
    '아래 CareerBase에 쌓인 모든 취업 데이터를 기반으로, "나라는 사람"을 분석해주세요.',
    '면접 AI는 "이번 지원"을 분석하고, 당신은 "나의 취업 인생"을 분석합니다.',
    '',
    '## 생성 규칙 (반드시 준수)',
    '- 존재하지 않는 사실을 생성하지 마세요.',
    '- 존재하지 않는 성과를 생성하지 마세요.',
    '- 존재하지 않는 수치를 생성하지 마세요.',
    '- 사용자의 답변을 수정하지 마세요.',
    '- 없는 경험을 생성하지 마세요.',
    '- 부족한 부분은 부족하다고 답변하세요.',
    '- 추측하지 마세요.',
    '- 반드시 아래에 입력된 데이터만 분석하세요.',
    '- 자소서·면접 답변을 대신 작성하지 마세요. 분석만 수행하세요.',
    '',
  ];

  appendProfile(sections, data.profile);
  appendJobs(sections, data.jobs);
  appendEssays(sections, data.essays, data.jobs);
  appendInterviews(sections, data.interviews, data.jobs);
  appendCompanyResearch(sections, data.companyResearch, data.jobs);
  appendExperiences(sections, data.experiences);
  appendInterviewCoachImports(sections, data.interviewCoachImports, data.jobs);
  appendAttachments(sections, data.attachments);
  appendArchiveSummary(sections, data.jobs);

  sections.push('## 요청 분석 (반드시 모두 답변)');
  sections.push('1. 이 사람을 한 줄로 표현해주세요.');
  sections.push('2. 가장 큰 강점은 무엇입니까?');
  sections.push('3. 가장 큰 약점은 무엇입니까?');
  sections.push('4. 가장 자주 등장하는 경험은 무엇입니까?');
  sections.push('5. 가장 강조해야 하는 경험은 무엇입니까?');
  sections.push('6. 가장 잘 어울리는 직무는 무엇입니까?');
  sections.push(
    '7. 가장 잘 어울리는 기업 유형은 무엇입니까? (예: IT 기획, PM, 서비스 기획, DX, 데이터 분석, 의료 IT, 플랫폼 기획, 전략 기획)',
  );
  sections.push('8. 답변에서 가장 많이 등장하는 키워드는 무엇입니까?');
  sections.push(
    '9. 답변에서 나타나는 나의 성향은 무엇입니까? (예: 문제 해결형, 협업형, 사용자 중심형, 리더십형, 분석형, 기획형)',
  );
  sections.push('10. 가장 많이 받게 될 면접 질문은 무엇입니까?');
  sections.push('11. 가장 많이 받게 될 꼬리 질문은 무엇입니까?');
  sections.push('12. 가장 많이 받게 될 압박 질문은 무엇입니까?');
  sections.push('13. 답변에서 부족한 부분은 무엇입니까?');
  sections.push('14. STAR 기법이 부족한 부분은 무엇입니까?');
  sections.push('15. 정량적인 성과가 부족한 부분은 무엇입니까?');
  sections.push('16. 지원동기에서 부족한 부분은 무엇입니까?');
  sections.push('17. 직무 연결성이 부족한 부분은 무엇입니까?');
  sections.push('18. AI가 생각하는 나만의 차별점은 무엇입니까?');
  sections.push('19. 가장 강조해야 하는 경험을 추천해주세요.');
  sections.push('20. 가장 추천하는 자소서 답변을 추천해주세요. (기존 답변을 수정하지 말고, 어떤 기존 답변이 좋은지 추천)');
  sections.push('21. AI가 생각하는 나만의 취업 전략을 제안해주세요.');
  sections.push('22. AI가 생각하는 면접 준비도를 평가해주세요.');
  sections.push('23. AI가 생각하는 취업 준비도를 평가해주세요.');
  sections.push('24. 현재 데이터만으로 분석했을 때 가장 부족한 부분은 무엇입니까?');
  sections.push(
    '25. 추가로 작성하면 좋을 데이터는 무엇입니까? (예: 프로젝트 규모, 정량적 성과, 리더십 경험, 갈등 해결 경험)',
  );
  sections.push('');
  sections.push('## 응답 형식 가이드');
  sections.push('가능하면 아래 제목을 사용해 답변해주세요.');
  sections.push('- 나를 한 줄로 표현하면?');
  sections.push('- 나의 강점');
  sections.push('- 나의 약점');
  sections.push('- 나의 성향');
  sections.push('- 추천 직무');
  sections.push('- 추천 기업 유형');
  sections.push('- 추천 경험');
  sections.push('- 추천 자소서');
  sections.push('- 예상 질문');
  sections.push('- 꼬리 질문');
  sections.push('- 압박 질문');
  sections.push('- 답변 보완 사항');
  sections.push('- 취업 전략');
  sections.push('- 면접 준비도');
  sections.push('- 취업 준비도');
  sections.push('- AI 의견');
  sections.push('- 추가하면 좋은 경험');

  return sections.join('\n');
}

function appendProfile(
  sections: string[],
  profile: ReturnType<typeof readData>['profile'],
) {
  sections.push('## Profile');
  sections.push(
    `이름: ${valueOrEmpty(profile.personalInfo.name)}`,
  );
  sections.push(
    `희망 연봉: ${profile.personalInfo.desiredSalary ?? '(미입력)'} ${profile.personalInfo.salaryCurrency}`,
  );
  sections.push('');
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
  sections.push('### 어학');
  if (profile.languages.length === 0) {
    sections.push('(입력된 어학 없음)');
  } else {
    profile.languages.forEach((language) => {
      sections.push(
        `- ${valueOrEmpty(language.qualificationName)} / 점수: ${language.score ?? '(미입력)'}`,
      );
    });
  }

  sections.push('');
  sections.push('### 취미/특기');
  sections.push(`취미: ${valueOrEmpty(profile.otherInfo.hobby)}`);
  sections.push(`특기: ${valueOrEmpty(profile.otherInfo.specialty)}`);
  sections.push('');
}

function appendJobs(
  sections: string[],
  jobs: ReturnType<typeof readData>['jobs'],
) {
  sections.push('## 모든 공고');
  if (jobs.length === 0) {
    sections.push('(등록된 공고 없음)');
    sections.push('');
    return;
  }

  jobs.forEach((job, index) => {
    sections.push(`### 공고 ${index + 1}${job.isArchived ? ' [Archive]' : ''}`);
    sections.push(`기업명: ${valueOrEmpty(job.companyName)}`);
    sections.push(`공고명: ${valueOrEmpty(job.postingTitle)}`);
    sections.push(`직무: ${valueOrEmpty(job.position)}`);
    sections.push(
      `상태: ${valueOrEmpty(job.detailedStatus)} / ${valueOrEmpty(job.boardColumn)}`,
    );
    sections.push(`결과: ${valueOrEmpty(job.applicationResult)}`);
    sections.push('공고 내용:');
    sections.push(valueOrEmpty(job.postingContent));
    sections.push('자격요건:');
    sections.push(valueOrEmpty(job.qualifications));
    sections.push('');
  });
}

function appendEssays(
  sections: string[],
  essays: ReturnType<typeof readData>['essays'],
  jobs: ReturnType<typeof readData>['jobs'],
) {
  sections.push('## 모든 자소서');
  if (essays.length === 0) {
    sections.push('(입력된 자소서 없음)');
    sections.push('');
    return;
  }

  essays.forEach((essay, index) => {
    const job = jobs.find((item) => item.id === essay.jobId);
    sections.push(`### 자소서 ${index + 1}`);
    sections.push(
      `공고: ${job ? `${valueOrEmpty(job.companyName)} / ${valueOrEmpty(job.position)}` : '(연결된 공고 없음)'}`,
    );
    sections.push(`문항: ${valueOrEmpty(essay.question)}`);
    sections.push('최종 답변:');
    sections.push(valueOrEmpty(essay.finalAnswer));
    sections.push('');
  });
}

function appendInterviews(
  sections: string[],
  interviews: ReturnType<typeof readData>['interviews'],
  jobs: ReturnType<typeof readData>['jobs'],
) {
  sections.push('## 모든 면접 준비 / 완료');
  if (interviews.length === 0) {
    sections.push('(등록된 면접 단계 없음)');
    sections.push('');
    return;
  }

  interviews.forEach((stage) => {
    const job = jobs.find((item) => item.id === stage.jobId);
    sections.push(
      `### ${stage.name} (${stage.status}) — ${job ? `${valueOrEmpty(job.companyName)} / ${valueOrEmpty(job.position)}` : '(공고 없음)'}`,
    );
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

function appendCompanyResearch(
  sections: string[],
  researches: ReturnType<typeof readData>['companyResearch'],
  jobs: ReturnType<typeof readData>['jobs'],
) {
  sections.push('## 모든 회사정보');
  if (researches.length === 0) {
    sections.push('(입력된 회사정보 없음)');
    sections.push('');
    return;
  }

  researches.forEach((research, index) => {
    const job = jobs.find((item) => item.id === research.jobId);
    sections.push(
      `### 회사정보 ${index + 1} — ${job ? valueOrEmpty(job.companyName) : '(공고 없음)'}`,
    );
    if (research.content?.trim()) {
      sections.push(research.content.trim());
    } else {
      sections.push(`Mission: ${valueOrEmpty(research.mission)}`);
      sections.push(`Vision: ${valueOrEmpty(research.vision)}`);
      sections.push(`핵심가치: ${valueOrEmpty(research.coreValues)}`);
      sections.push(`인재상: ${valueOrEmpty(research.talentProfile)}`);
      sections.push(`주요 사업: ${valueOrEmpty(research.mainBusiness)}`);
      sections.push(
        `회사 및 조직 이해: ${valueOrEmpty(research.companyOverview)}`,
      );
      sections.push(`최근 주요 이슈: ${valueOrEmpty(research.recentIssues)}`);
      sections.push(
        `지원 직무와 회사의 연결점: ${valueOrEmpty(research.jobConnection)}`,
      );
      sections.push(
        `내가 기여할 수 있는 부분: ${valueOrEmpty(research.expectedContribution)}`,
      );
      sections.push(`메모: ${valueOrEmpty(research.memo)}`);
    }
    sections.push('');
  });
}

function appendExperiences(
  sections: string[],
  experiences: ReturnType<typeof readData>['experiences'],
) {
  sections.push('## 기존 취업 경험 데이터 (Experience)');
  if (experiences.length === 0) {
    sections.push('(저장된 경험 카드 없음)');
    sections.push('');
    return;
  }

  experiences.forEach((experience, index) => {
    sections.push(`### 경험 ${index + 1}: ${valueOrEmpty(experience.title)}`);
    sections.push(`Situation: ${valueOrEmpty(experience.situation)}`);
    sections.push(`Task: ${valueOrEmpty(experience.task)}`);
    sections.push(`Action: ${valueOrEmpty(experience.action)}`);
    sections.push(`Result: ${valueOrEmpty(experience.result)}`);
    sections.push(
      `정량 성과: ${valueOrEmpty(experience.measurableOutcome)}`,
    );
    if (experience.competencyTags.length > 0) {
      sections.push(`태그: ${experience.competencyTags.join(', ')}`);
    }
    sections.push(`메모: ${valueOrEmpty(experience.memo)}`);
    sections.push('');
  });
}

function appendInterviewCoachImports(
  sections: string[],
  imports: ReturnType<typeof readData>['interviewCoachImports'],
  jobs: ReturnType<typeof readData>['jobs'],
) {
  sections.push('## 기존 AI 분석 결과 (면접 코치)');
  if (imports.length === 0) {
    sections.push('(저장된 AI 면접 분석 없음)');
    sections.push('');
    return;
  }

  imports.forEach((item, index) => {
    const job = jobs.find((jobItem) => jobItem.id === item.jobId);
    sections.push(
      `### AI 분석 ${index + 1} — ${job ? `${valueOrEmpty(job.companyName)} / ${valueOrEmpty(job.position)}` : '(공고 없음)'}`,
    );
    sections.push(`회사 이해도: ${valueOrEmpty(item.companyUnderstandingScore)}`);
    sections.push(`직무 이해도: ${valueOrEmpty(item.jobUnderstandingScore)}`);
    sections.push(`면접 점수: ${valueOrEmpty(item.interviewScore)}`);
    sections.push(`AI 의견: ${valueOrEmpty(item.opinion)}`);
    sections.push(`부족한 부분: ${valueOrEmpty(item.gaps)}`);
    sections.push(
      `추천 경험: ${valueOrEmpty(item.recommendedExperiences)}`,
    );
    sections.push(
      `추천 자소서: ${valueOrEmpty(item.recommendedEssayContent)}`,
    );
    if (item.expectedQuestions.length > 0) {
      sections.push(`예상질문: ${item.expectedQuestions.join(' / ')}`);
    }
    if (item.followUpQuestions.length > 0) {
      sections.push(`꼬리질문: ${item.followUpQuestions.join(' / ')}`);
    }
    sections.push('');
  });
}

function appendAttachments(
  sections: string[],
  attachments: ReturnType<typeof readData>['attachments'],
) {
  sections.push('## 첨부 메타데이터');
  if (attachments.length === 0) {
    sections.push('(등록된 첨부 없음)');
    sections.push('');
    return;
  }

  attachments.forEach((attachment) => {
    sections.push(
      `- [${attachment.fileType}] ${valueOrEmpty(attachment.fileName)} / ${valueOrEmpty(attachment.versionDescription)}`,
    );
  });
  sections.push('');
}

function appendArchiveSummary(
  sections: string[],
  jobs: ReturnType<typeof readData>['jobs'],
) {
  const archived = jobs.filter((job) => job.isArchived);
  sections.push('## Archive 요약');
  sections.push(`Archive 공고 수: ${archived.length}`);
  if (archived.length === 0) {
    sections.push('(Archive 데이터 없음)');
    sections.push('');
    return;
  }

  archived.forEach((job) => {
    sections.push(
      `- ${valueOrEmpty(job.companyName)} / ${valueOrEmpty(job.position)} / 결과: ${valueOrEmpty(job.applicationResult)}`,
    );
  });
  sections.push('');
}

function valueOrEmpty(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return String(value);
  }

  const trimmed = value?.trim();
  return trimmed ? trimmed : '(미입력)';
}

export { buildExperienceReportPrompt };
