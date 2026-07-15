import type { EntityId } from '@/types/job';

export interface PersonalInfo {
  name: string;
  birthDate: string | null;
  address: string;
  englishAddress: string;
  profilePhotoFileName: string;
  profilePhotoLocation: string;
  profilePhotoDataUrl?: string;
  profilePhotoMimeType?: string;
  desiredSalary: number | null;
  salaryCurrency: 'KRW';
  updatedAt: string;
}

export interface HighSchool {
  id: EntityId;
  schoolName: string;
  admissionDate: string | null;
  graduationDate: string | null;
  location: string;
  academicTrack: string;
  createdAt: string;
  updatedAt: string;
}

export interface University {
  id: EntityId;
  universityName: string;
  admissionDate: string | null;
  graduationDate: string | null;
  major: string;
  totalCredits: number | null;
  overallGpa: number | null;
  overallGpaScale: number | null;
  majorCredits: number | null;
  majorGpa: number | null;
  majorGpaScale: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  id: EntityId;
  companyName: string;
  employmentStartDate: string | null;
  employmentEndDate: string | null;
  isCurrentlyEmployed: boolean;
  department: string;
  position: string;
  responsibilities: string;
  careerDescription: string;
  annualSalary: number | null;
  salaryCurrency: 'KRW';
  createdAt: string;
  updatedAt: string;
}

export interface LanguageQualification {
  id: EntityId;
  qualificationName: string;
  registrationNumber: string;
  score: number | null;
  scoreScale: number | null;
  testDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: EntityId;
  certificateName: string;
  registrationNumber: string;
  issuingOrganization: string;
  acquisitionDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Award {
  id: EntityId;
  awardName: string;
  awardingOrganization: string;
  awardDate: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = '팀프로젝트' | '동아리활동' | '기타사회활동';

export interface Activity {
  id: EntityId;
  activityType: ActivityType;
  organizationName: string;
  startMonth: string | null;
  endMonth: string | null;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface OtherInfo {
  hobby: string;
  specialty: string;
  updatedAt: string;
}

export interface Profile {
  personalInfo: PersonalInfo;
  highSchools: HighSchool[];
  universities: University[];
  careers: Career[];
  languages: LanguageQualification[];
  certificates: Certificate[];
  awards: Award[];
  activities: Activity[];
  otherInfo: OtherInfo;
  updatedAt: string;
}

export type UpdatePersonalInfoInput = Partial<
  Omit<PersonalInfo, 'updatedAt' | 'salaryCurrency'>
>;

export type UpdateOtherInfoInput = Partial<Omit<OtherInfo, 'updatedAt'>>;

export type CreateHighSchoolInput = Omit<
  HighSchool,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateHighSchoolInput = Partial<CreateHighSchoolInput>;

export type CreateUniversityInput = Omit<
  University,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateUniversityInput = Partial<CreateUniversityInput>;

export type CreateCareerInput = Omit<Career, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCareerInput = Partial<CreateCareerInput>;

export type CreateLanguageInput = Omit<
  LanguageQualification,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateLanguageInput = Partial<CreateLanguageInput>;

export type CreateCertificateInput = Omit<
  Certificate,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateCertificateInput = Partial<CreateCertificateInput>;

export type CreateAwardInput = Omit<Award, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAwardInput = Partial<CreateAwardInput>;

export type CreateActivityInput = Omit<
  Activity,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateActivityInput = Partial<CreateActivityInput>;

export const ACTIVITY_TYPES: ActivityType[] = [
  '팀프로젝트',
  '동아리활동',
  '기타사회활동',
];
