import { readData, writeData } from '@/repositories/careerbaseStorage';
import type { EntityId } from '@/types/job';
import type {
  Activity,
  Award,
  Career,
  Certificate,
  CreateActivityInput,
  CreateAwardInput,
  CreateCareerInput,
  CreateCertificateInput,
  CreateHighSchoolInput,
  CreateLanguageInput,
  CreateUniversityInput,
  HighSchool,
  LanguageQualification,
  Profile,
  University,
  UpdateActivityInput,
  UpdateAwardInput,
  UpdateCareerInput,
  UpdateCertificateInput,
  UpdateHighSchoolInput,
  UpdateLanguageInput,
  UpdateOtherInfoInput,
  UpdatePersonalInfoInput,
  UpdateUniversityInput,
} from '@/types/profile';

type ProfileListKey =
  | 'highSchools'
  | 'universities'
  | 'careers'
  | 'languages'
  | 'certificates'
  | 'awards'
  | 'activities';

type ProfileListItem =
  | HighSchool
  | University
  | Career
  | LanguageQualification
  | Certificate
  | Award
  | Activity;

const listDefaults: Pick<
  Profile,
  | 'highSchools'
  | 'universities'
  | 'careers'
  | 'languages'
  | 'certificates'
  | 'awards'
  | 'activities'
> = {
  highSchools: [],
  universities: [],
  careers: [],
  languages: [],
  certificates: [],
  awards: [],
  activities: [],
};

function normalizeProfile(profile: Profile): Profile {
  const now = new Date().toISOString();

  return {
    personalInfo: {
      name: profile.personalInfo?.name ?? '',
      birthDate: profile.personalInfo?.birthDate ?? null,
      address: profile.personalInfo?.address ?? '',
      englishAddress: profile.personalInfo?.englishAddress ?? '',
      profilePhotoFileName: profile.personalInfo?.profilePhotoFileName ?? '',
      profilePhotoLocation: profile.personalInfo?.profilePhotoLocation ?? '',
      profilePhotoDataUrl: profile.personalInfo?.profilePhotoDataUrl ?? '',
      profilePhotoMimeType: profile.personalInfo?.profilePhotoMimeType ?? '',
      desiredSalary: profile.personalInfo?.desiredSalary ?? null,
      salaryCurrency: 'KRW',
      updatedAt: profile.personalInfo?.updatedAt ?? now,
    },
    highSchools: Array.isArray(profile.highSchools)
      ? profile.highSchools
      : listDefaults.highSchools,
    universities: Array.isArray(profile.universities)
      ? profile.universities
      : listDefaults.universities,
    careers: Array.isArray(profile.careers) ? profile.careers : listDefaults.careers,
    languages: Array.isArray(profile.languages)
      ? profile.languages
      : listDefaults.languages,
    certificates: Array.isArray(profile.certificates)
      ? profile.certificates
      : listDefaults.certificates,
    awards: Array.isArray(profile.awards) ? profile.awards : listDefaults.awards,
    activities: Array.isArray(profile.activities)
      ? profile.activities
      : listDefaults.activities,
    otherInfo: {
      hobby: profile.otherInfo?.hobby ?? '',
      specialty: profile.otherInfo?.specialty ?? '',
      updatedAt: profile.otherInfo?.updatedAt ?? now,
    },
    updatedAt: profile.updatedAt ?? now,
  };
}

function getProfile(): Profile {
  return normalizeProfile(readData().profile);
}

function writeProfile(profile: Profile): Profile {
  const data = readData();
  const normalizedProfile = normalizeProfile(profile);

  writeData({
    ...data,
    profile: normalizedProfile,
    lastUpdatedAt: normalizedProfile.updatedAt,
  });

  return normalizedProfile;
}

function updatePersonalInfo(input: UpdatePersonalInfoInput): Profile {
  const profile = getProfile();
  const now = new Date().toISOString();

  return writeProfile({
    ...profile,
    personalInfo: {
      ...profile.personalInfo,
      ...input,
      salaryCurrency: 'KRW',
      updatedAt: now,
    },
    updatedAt: now,
  });
}

function updateOtherInfo(input: UpdateOtherInfoInput): Profile {
  const profile = getProfile();
  const now = new Date().toISOString();

  return writeProfile({
    ...profile,
    otherInfo: {
      ...profile.otherInfo,
      ...input,
      updatedAt: now,
    },
    updatedAt: now,
  });
}

function addListItem<TInput extends object, TItem extends ProfileListItem>(
  key: ProfileListKey,
  input: TInput,
): TItem {
  const profile = getProfile();
  const now = new Date().toISOString();
  const item = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  } as unknown as TItem;

  writeProfile({
    ...profile,
    [key]: [...(profile[key] as ProfileListItem[]), item],
    updatedAt: now,
  });

  return item;
}

function updateListItem<TInput extends object, TItem extends ProfileListItem>(
  key: ProfileListKey,
  id: EntityId,
  input: TInput,
): TItem | null {
  const profile = getProfile();
  const now = new Date().toISOString();
  let updatedItem: TItem | null = null;

  const items = (profile[key] as ProfileListItem[]).map((item) => {
    if (item.id !== id) {
      return item;
    }

    updatedItem = {
      ...item,
      ...input,
      updatedAt: now,
    } as unknown as TItem;

    return updatedItem;
  });

  if (!updatedItem) {
    return null;
  }

  writeProfile({
    ...profile,
    [key]: items,
    updatedAt: now,
  });

  return updatedItem;
}

function deleteListItem(key: ProfileListKey, id: EntityId): void {
  const profile = getProfile();
  const now = new Date().toISOString();

  writeProfile({
    ...profile,
    [key]: (profile[key] as ProfileListItem[]).filter((item) => item.id !== id),
    updatedAt: now,
  });
}

function addHighSchool(input: CreateHighSchoolInput): HighSchool {
  return addListItem<CreateHighSchoolInput, HighSchool>('highSchools', input);
}

function updateHighSchool(
  id: EntityId,
  input: UpdateHighSchoolInput,
): HighSchool | null {
  return updateListItem<UpdateHighSchoolInput, HighSchool>(
    'highSchools',
    id,
    input,
  );
}

function deleteHighSchool(id: EntityId): void {
  deleteListItem('highSchools', id);
}

function addUniversity(input: CreateUniversityInput): University {
  return addListItem<CreateUniversityInput, University>('universities', input);
}

function updateUniversity(
  id: EntityId,
  input: UpdateUniversityInput,
): University | null {
  return updateListItem<UpdateUniversityInput, University>(
    'universities',
    id,
    input,
  );
}

function deleteUniversity(id: EntityId): void {
  deleteListItem('universities', id);
}

function addCareer(input: CreateCareerInput): Career {
  return addListItem<CreateCareerInput, Career>('careers', input);
}

function updateCareer(id: EntityId, input: UpdateCareerInput): Career | null {
  return updateListItem<UpdateCareerInput, Career>('careers', id, input);
}

function deleteCareer(id: EntityId): void {
  deleteListItem('careers', id);
}

function addLanguage(input: CreateLanguageInput): LanguageQualification {
  return addListItem<CreateLanguageInput, LanguageQualification>(
    'languages',
    input,
  );
}

function updateLanguage(
  id: EntityId,
  input: UpdateLanguageInput,
): LanguageQualification | null {
  return updateListItem<UpdateLanguageInput, LanguageQualification>(
    'languages',
    id,
    input,
  );
}

function deleteLanguage(id: EntityId): void {
  deleteListItem('languages', id);
}

function addCertificate(input: CreateCertificateInput): Certificate {
  return addListItem<CreateCertificateInput, Certificate>(
    'certificates',
    input,
  );
}

function updateCertificate(
  id: EntityId,
  input: UpdateCertificateInput,
): Certificate | null {
  return updateListItem<UpdateCertificateInput, Certificate>(
    'certificates',
    id,
    input,
  );
}

function deleteCertificate(id: EntityId): void {
  deleteListItem('certificates', id);
}

function addAward(input: CreateAwardInput): Award {
  return addListItem<CreateAwardInput, Award>('awards', input);
}

function updateAward(id: EntityId, input: UpdateAwardInput): Award | null {
  return updateListItem<UpdateAwardInput, Award>('awards', id, input);
}

function deleteAward(id: EntityId): void {
  deleteListItem('awards', id);
}

function addActivity(input: CreateActivityInput): Activity {
  return addListItem<CreateActivityInput, Activity>('activities', input);
}

function updateActivity(
  id: EntityId,
  input: UpdateActivityInput,
): Activity | null {
  return updateListItem<UpdateActivityInput, Activity>('activities', id, input);
}

function deleteActivity(id: EntityId): void {
  deleteListItem('activities', id);
}

export const profileRepository = {
  getProfile,
  updatePersonalInfo,
  updateOtherInfo,
  addHighSchool,
  updateHighSchool,
  deleteHighSchool,
  addUniversity,
  updateUniversity,
  deleteUniversity,
  addCareer,
  updateCareer,
  deleteCareer,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  addAward,
  updateAward,
  deleteAward,
  addActivity,
  updateActivity,
  deleteActivity,
};
