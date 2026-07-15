import { readData } from '@/repositories/careerbaseStorage';
import type { Job } from '@/types/job';

export type SearchCategory =
  | 'Jobs'
  | 'Experience'
  | 'Essay'
  | 'Interview'
  | 'Profile'
  | 'Archive';

export type SearchFilter = '전체' | SearchCategory;

export interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  snippet: string;
  href: string;
  updatedAt: string;
}

export type SearchResultsByCategory = Record<SearchCategory, SearchResult[]>;

export const searchCategories: SearchCategory[] = [
  'Jobs',
  'Experience',
  'Essay',
  'Interview',
  'Profile',
  'Archive',
];

const emptyResults: SearchResultsByCategory = {
  Jobs: [],
  Experience: [],
  Essay: [],
  Interview: [],
  Profile: [],
  Archive: [],
};

function search(query: string, filter: SearchFilter = '전체') {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return emptyResults;
  }

  const data = readData();
  const jobsById = new Map(data.jobs.map((job) => [job.id, job]));
  const results: SearchResultsByCategory = {
    Jobs: data.jobs
      .filter((job) => !job.isArchived)
      .map((job) => jobToSearchResult(job, normalizedQuery))
      .filter(isSearchResult),
    Experience: data.experiences
      .map((experience): SearchResult | null => {
        const snippet = firstMatch(
          [
            experience.title,
            experience.situation,
            experience.task,
            experience.action,
            experience.result,
            experience.memo,
          ],
          normalizedQuery,
        );

        if (!snippet) {
          return null;
        }

        return {
          id: `experience-${experience.id}`,
          category: 'Experience',
          title: experience.title || '제목 없는 Experience',
          subtitle: experience.competencyTags.join(', ') || '핵심 역량 태그 없음',
          snippet,
          href: `/experience?experienceId=${encodeURIComponent(experience.id)}`,
          updatedAt: experience.updatedAt,
        };
      })
      .filter(isSearchResult),
    Essay: data.essays
      .map((essay): SearchResult | null => {
        const job = jobsById.get(essay.jobId);

        if (!job) {
          return null;
        }

        const snippet = firstMatch(
          [essay.question, essay.finalAnswer],
          normalizedQuery,
        );

        if (!snippet) {
          return null;
        }

        return {
          id: `essay-${essay.id}`,
          category: 'Essay',
          title: essay.question || `${job.companyName} 자소서`,
          subtitle: `${job.companyName} · ${job.postingTitle}`,
          snippet,
          href: `/jobs/${job.id}?tab=essay`,
          updatedAt: essay.updatedAt,
        };
      })
      .filter(isSearchResult),
    Interview: data.interviews
      .map((stage): SearchResult | null => {
        const job = jobsById.get(stage.jobId);

        if (!job) {
          return null;
        }

        const snippet = firstMatch(
          [
            stage.name,
            stage.retrospective,
            ...stage.expectedQuestions.flatMap((question) => [
              question.question,
              question.answer,
            ]),
            ...stage.actualQuestions.flatMap((question) => [
              question.question,
              question.myAnswerMemo,
              question.improvementMemo,
            ]),
          ],
          normalizedQuery,
        );

        if (!snippet) {
          return null;
        }

        return {
          id: `interview-${stage.id}`,
          category: 'Interview',
          title: `${stage.name} · ${job.companyName}`,
          subtitle: job.postingTitle,
          snippet,
          href: `/jobs/${job.id}?tab=interview`,
          updatedAt: stage.updatedAt,
        };
      })
      .filter(isSearchResult),
    Profile: profileToSearchResults(data.profile, normalizedQuery),
    Archive: data.jobs
      .filter((job) => job.isArchived)
      .map((job) => archiveJobToSearchResult(job, normalizedQuery))
      .filter(isSearchResult),
  };

  if (filter === '전체') {
    return sortResults(results);
  }

  return {
    ...emptyResults,
    [filter]: sortCategoryResults(results[filter]),
  };
}

function jobToSearchResult(
  job: Job,
  normalizedQuery: string,
): SearchResult | null {
  const snippet = firstMatch(
    [
      job.companyName,
      job.postingTitle,
      job.position,
      job.postingContent,
      job.qualifications,
      job.boardColumn,
      job.detailedStatus,
      job.applicationResult,
    ],
    normalizedQuery,
  );

  if (!snippet) {
    return null;
  }

  return {
    id: `job-${job.id}`,
    category: 'Jobs',
    title: job.companyName,
    subtitle: [job.postingTitle, job.position].filter(Boolean).join(' · '),
    snippet,
    href: `/jobs/${job.id}`,
    updatedAt: job.updatedAt,
  };
}

function archiveJobToSearchResult(
  job: Job,
  normalizedQuery: string,
): SearchResult | null {
  const snippet = firstMatch(
    [job.companyName, job.postingTitle, job.position],
    normalizedQuery,
  );

  if (!snippet) {
    return null;
  }

  return {
    id: `archive-${job.id}`,
    category: 'Archive',
    title: job.companyName,
    subtitle: [job.postingTitle, job.applicationResult].filter(Boolean).join(' · '),
    snippet,
    href: `/jobs/${job.id}`,
    updatedAt: job.archivedAt ?? job.updatedAt,
  };
}

function profileToSearchResults(
  profile: ReturnType<typeof readData>['profile'],
  normalizedQuery: string,
): SearchResult[] {
  const results: SearchResult[] = [];
  const addResult = (
    id: string,
    title: string,
    subtitle: string,
    values: Array<string | number | null | undefined>,
    updatedAt: string,
  ) => {
    const snippet = firstMatch(values, normalizedQuery);

    if (!snippet) {
      return;
    }

    results.push({
      id: `profile-${id}`,
      category: 'Profile',
      title,
      subtitle,
      snippet,
      href: '/profile',
      updatedAt,
    });
  };

  profile.highSchools.forEach((school) =>
    addResult(
      `high-school-${school.id}`,
      school.schoolName || '고등학교',
      '고등학교',
      [school.schoolName, school.location, school.academicTrack],
      school.updatedAt,
    ),
  );
  profile.universities.forEach((university) =>
    addResult(
      `university-${university.id}`,
      university.universityName || '대학교',
      '대학교',
      [university.universityName, university.major],
      university.updatedAt,
    ),
  );
  profile.careers.forEach((career) =>
    addResult(
      `career-${career.id}`,
      career.companyName || '경력',
      '경력',
      [
        career.companyName,
        career.department,
        career.position,
        career.responsibilities,
        career.careerDescription,
      ],
      career.updatedAt,
    ),
  );
  profile.certificates.forEach((certificate) =>
    addResult(
      `certificate-${certificate.id}`,
      certificate.certificateName || '자격증',
      '자격증',
      [
        certificate.certificateName,
        certificate.registrationNumber,
        certificate.issuingOrganization,
      ],
      certificate.updatedAt,
    ),
  );
  profile.languages.forEach((language) =>
    addResult(
      `language-${language.id}`,
      language.qualificationName || '어학',
      '어학',
      [
        language.qualificationName,
        language.registrationNumber,
        language.score,
        language.scoreScale,
      ],
      language.updatedAt,
    ),
  );
  profile.awards.forEach((award) =>
    addResult(
      `award-${award.id}`,
      award.awardName || '수상경력',
      '수상경력',
      [award.awardName, award.awardingOrganization, award.description],
      award.updatedAt,
    ),
  );
  profile.activities.forEach((activity) =>
    addResult(
      `activity-${activity.id}`,
      activity.organizationName || activity.activityType,
      '학내외활동',
      [
        activity.activityType,
        activity.organizationName,
        activity.role,
        activity.description,
      ],
      activity.updatedAt,
    ),
  );
  addResult(
    'other-info',
    '기타 정보',
    'Profile',
    [profile.otherInfo.hobby, profile.otherInfo.specialty],
    profile.otherInfo.updatedAt,
  );

  return sortCategoryResults(results);
}

function sortResults(results: SearchResultsByCategory): SearchResultsByCategory {
  return {
    Jobs: sortCategoryResults(results.Jobs),
    Experience: sortCategoryResults(results.Experience),
    Essay: sortCategoryResults(results.Essay),
    Interview: sortCategoryResults(results.Interview),
    Profile: sortCategoryResults(results.Profile),
    Archive: sortCategoryResults(results.Archive),
  };
}

function sortCategoryResults(results: SearchResult[]) {
  return [...results].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function firstMatch(
  values: Array<string | number | null | undefined>,
  normalizedQuery: string,
) {
  return (
    values
      .map((value) => String(value ?? '').trim())
      .find((value) => normalize(value).includes(normalizedQuery)) ?? null
  );
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

function isSearchResult(result: SearchResult | null): result is SearchResult {
  return result !== null;
}

export const searchRepository = {
  search,
};
