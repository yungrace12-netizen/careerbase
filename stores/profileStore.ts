import { create } from 'zustand';

import { profileRepository } from '@/repositories/profileRepository';
import type { EntityId } from '@/types/job';
import type {
  CreateActivityInput,
  CreateAwardInput,
  CreateCareerInput,
  CreateCertificateInput,
  CreateHighSchoolInput,
  CreateLanguageInput,
  CreateUniversityInput,
  Profile,
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

type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface ProfileSaveStatus {
  state: SaveState;
  savedAt: string | null;
}

interface ProfileStore {
  profile: Profile | null;
  saveStatuses: Record<string, ProfileSaveStatus>;
  loadProfile: () => void;
  updatePersonalInfoDraft: (input: UpdatePersonalInfoInput) => void;
  savePersonalInfo: () => void;
  updateOtherInfoDraft: (input: UpdateOtherInfoInput) => void;
  saveOtherInfo: () => void;
  addHighSchool: (input: CreateHighSchoolInput) => void;
  updateHighSchool: (id: EntityId, input: UpdateHighSchoolInput) => void;
  deleteHighSchool: (id: EntityId) => void;
  addUniversity: (input: CreateUniversityInput) => void;
  updateUniversity: (id: EntityId, input: UpdateUniversityInput) => void;
  deleteUniversity: (id: EntityId) => void;
  addCareer: (input: CreateCareerInput) => void;
  updateCareer: (id: EntityId, input: UpdateCareerInput) => void;
  deleteCareer: (id: EntityId) => void;
  saveCareerLongFields: (
    id: EntityId,
    input: Pick<UpdateCareerInput, 'responsibilities' | 'careerDescription'>,
  ) => void;
  addLanguage: (input: CreateLanguageInput) => void;
  updateLanguage: (id: EntityId, input: UpdateLanguageInput) => void;
  deleteLanguage: (id: EntityId) => void;
  addCertificate: (input: CreateCertificateInput) => void;
  updateCertificate: (id: EntityId, input: UpdateCertificateInput) => void;
  deleteCertificate: (id: EntityId) => void;
  addAward: (input: CreateAwardInput) => void;
  updateAward: (id: EntityId, input: UpdateAwardInput) => void;
  deleteAward: (id: EntityId) => void;
  addActivity: (input: CreateActivityInput) => void;
  updateActivity: (id: EntityId, input: UpdateActivityInput) => void;
  deleteActivity: (id: EntityId) => void;
}

const defaultSaveStatus: ProfileSaveStatus = {
  state: 'idle',
  savedAt: null,
};

let personalInfoTimer: ReturnType<typeof setTimeout> | null = null;
let otherInfoTimer: ReturnType<typeof setTimeout> | null = null;
const careerTimers = new Map<EntityId, ReturnType<typeof setTimeout>>();

function statusKey(section: string, id?: EntityId) {
  return id ? `${section}:${id}` : section;
}

function setStatus(
  set: (
    partial:
      | Partial<ProfileStore>
      | ((state: ProfileStore) => Partial<ProfileStore>),
  ) => void,
  key: string,
  status: ProfileSaveStatus,
) {
  set((state) => ({
    saveStatuses: {
      ...state.saveStatuses,
      [key]: status,
    },
  }));
}

function reloadProfile() {
  return {
    profile: profileRepository.getProfile(),
  };
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  saveStatuses: {},
  loadProfile: () => {
    set(reloadProfile());
  },
  updatePersonalInfoDraft: (input) => {
    set((state) => {
      if (!state.profile) {
        return {};
      }

      return {
        profile: {
          ...state.profile,
          personalInfo: {
            ...state.profile.personalInfo,
            ...input,
          },
        },
        saveStatuses: {
          ...state.saveStatuses,
          [statusKey('personalInfo')]: {
            ...defaultSaveStatus,
            ...state.saveStatuses[statusKey('personalInfo')],
            state: 'pending',
          },
        },
      };
    });

    if (personalInfoTimer) {
      clearTimeout(personalInfoTimer);
    }

    personalInfoTimer = setTimeout(() => get().savePersonalInfo(), 1000);
  },
  savePersonalInfo: () => {
    const key = statusKey('personalInfo');
    const profile = get().profile;

    if (!profile) {
      return;
    }

    setStatus(set, key, {
      ...defaultSaveStatus,
      ...get().saveStatuses[key],
      state: 'saving',
    });

    try {
      const updatedProfile = profileRepository.updatePersonalInfo(
        profile.personalInfo,
      );
      set((state) => ({
        profile: updatedProfile,
        saveStatuses: {
          ...state.saveStatuses,
          [key]: {
            state: 'saved',
            savedAt: updatedProfile.personalInfo.updatedAt,
          },
        },
      }));
    } catch {
      setStatus(set, key, {
        ...defaultSaveStatus,
        ...get().saveStatuses[key],
        state: 'error',
      });
    }
  },
  updateOtherInfoDraft: (input) => {
    set((state) => {
      if (!state.profile) {
        return {};
      }

      return {
        profile: {
          ...state.profile,
          otherInfo: {
            ...state.profile.otherInfo,
            ...input,
          },
        },
        saveStatuses: {
          ...state.saveStatuses,
          [statusKey('otherInfo')]: {
            ...defaultSaveStatus,
            ...state.saveStatuses[statusKey('otherInfo')],
            state: 'pending',
          },
        },
      };
    });

    if (otherInfoTimer) {
      clearTimeout(otherInfoTimer);
    }

    otherInfoTimer = setTimeout(() => get().saveOtherInfo(), 1000);
  },
  saveOtherInfo: () => {
    const key = statusKey('otherInfo');
    const profile = get().profile;

    if (!profile) {
      return;
    }

    setStatus(set, key, {
      ...defaultSaveStatus,
      ...get().saveStatuses[key],
      state: 'saving',
    });

    try {
      const updatedProfile = profileRepository.updateOtherInfo(profile.otherInfo);
      set((state) => ({
        profile: updatedProfile,
        saveStatuses: {
          ...state.saveStatuses,
          [key]: {
            state: 'saved',
            savedAt: updatedProfile.otherInfo.updatedAt,
          },
        },
      }));
    } catch {
      setStatus(set, key, {
        ...defaultSaveStatus,
        ...get().saveStatuses[key],
        state: 'error',
      });
    }
  },
  addHighSchool: (input) => {
    profileRepository.addHighSchool(input);
    set(reloadProfile());
  },
  updateHighSchool: (id, input) => {
    profileRepository.updateHighSchool(id, input);
    set(reloadProfile());
  },
  deleteHighSchool: (id) => {
    profileRepository.deleteHighSchool(id);
    set(reloadProfile());
  },
  addUniversity: (input) => {
    profileRepository.addUniversity(input);
    set(reloadProfile());
  },
  updateUniversity: (id, input) => {
    profileRepository.updateUniversity(id, input);
    set(reloadProfile());
  },
  deleteUniversity: (id) => {
    profileRepository.deleteUniversity(id);
    set(reloadProfile());
  },
  addCareer: (input) => {
    profileRepository.addCareer(input);
    set(reloadProfile());
  },
  updateCareer: (id, input) => {
    profileRepository.updateCareer(id, input);
    set(reloadProfile());
  },
  deleteCareer: (id) => {
    profileRepository.deleteCareer(id);
    set(reloadProfile());
  },
  saveCareerLongFields: (id, input) => {
    const key = statusKey('career', id);

    setStatus(set, key, {
      ...defaultSaveStatus,
      ...get().saveStatuses[key],
      state: 'saving',
    });

    try {
      const updatedCareer = profileRepository.updateCareer(id, input);
      const updatedProfile = profileRepository.getProfile();
      set((state) => ({
        profile: updatedProfile,
        saveStatuses: {
          ...state.saveStatuses,
          [key]: {
            state: 'saved',
            savedAt: updatedCareer?.updatedAt ?? new Date().toISOString(),
          },
        },
      }));
    } catch {
      setStatus(set, key, {
        ...defaultSaveStatus,
        ...get().saveStatuses[key],
        state: 'error',
      });
    }
  },
  addLanguage: (input) => {
    profileRepository.addLanguage(input);
    set(reloadProfile());
  },
  updateLanguage: (id, input) => {
    profileRepository.updateLanguage(id, input);
    set(reloadProfile());
  },
  deleteLanguage: (id) => {
    profileRepository.deleteLanguage(id);
    set(reloadProfile());
  },
  addCertificate: (input) => {
    profileRepository.addCertificate(input);
    set(reloadProfile());
  },
  updateCertificate: (id, input) => {
    profileRepository.updateCertificate(id, input);
    set(reloadProfile());
  },
  deleteCertificate: (id) => {
    profileRepository.deleteCertificate(id);
    set(reloadProfile());
  },
  addAward: (input) => {
    profileRepository.addAward(input);
    set(reloadProfile());
  },
  updateAward: (id, input) => {
    profileRepository.updateAward(id, input);
    set(reloadProfile());
  },
  deleteAward: (id) => {
    profileRepository.deleteAward(id);
    set(reloadProfile());
  },
  addActivity: (input) => {
    profileRepository.addActivity(input);
    set(reloadProfile());
  },
  updateActivity: (id, input) => {
    profileRepository.updateActivity(id, input);
    set(reloadProfile());
  },
  deleteActivity: (id) => {
    profileRepository.deleteActivity(id);
    set(reloadProfile());
  },
}));

export function scheduleCareerAutoSave(
  careerId: EntityId,
  save: () => void,
) {
  const existingTimer = careerTimers.get(careerId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  careerTimers.set(
    careerId,
    setTimeout(() => {
      save();
      careerTimers.delete(careerId);
    }, 1000),
  );
}

export { statusKey };
export type { ProfileSaveStatus, SaveState };
