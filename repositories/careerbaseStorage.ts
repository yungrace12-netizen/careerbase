import type { CareerBaseData } from '@/types/careerbase-data';

const STORAGE_KEY = 'careerbase_data';
const SCHEMA_VERSION = '1.0.0';

function createInitialData(now = new Date().toISOString()): CareerBaseData {
  return {
    schemaVersion: SCHEMA_VERSION,
    initializedAt: now,
    lastUpdatedAt: now,
    onboarding: {
      isCompleted: false,
      selectedMode: null,
      completedAt: null,
    },
    jobs: [],
    schedules: [],
    essays: [],
    interviews: [],
    companyResearch: [],
    interviewCoachImports: [],
    experienceReports: [],
    profile: {
      personalInfo: {
        name: '',
        birthDate: null,
        address: '',
        englishAddress: '',
        profilePhotoFileName: '',
        profilePhotoLocation: '',
        desiredSalary: null,
        salaryCurrency: 'KRW',
        updatedAt: now,
      },
      highSchools: [],
      universities: [],
      careers: [],
      languages: [],
      certificates: [],
      awards: [],
      activities: [],
      otherInfo: {
        hobby: '',
        specialty: '',
        updatedAt: now,
      },
      updatedAt: now,
    },
    experiences: [],
    todos: [],
    notes: [],
    attachments: [],
    settings: {
      theme: 'light',
      sidebarCollapsed: false,
      autoSaveDelayMs: 1000,
      automaticTodoDaysBeforeDeadline: 3,
      lastBackupAt: null,
      updatedAt: now,
    },
  };
}

function readData(): CareerBaseData {
  if (typeof window === 'undefined') {
    return createInitialData();
  }

  const rawData = window.localStorage.getItem(STORAGE_KEY);

  if (!rawData) {
    const initialData = createInitialData();
    writeData(initialData);
    return initialData;
  }

  try {
    const parsedData = JSON.parse(rawData) as CareerBaseData;

    if (!Array.isArray(parsedData.jobs)) {
      const initialData = createInitialData();
      writeData(initialData);
      return initialData;
    }

    return {
      ...parsedData,
      schedules: Array.isArray(parsedData.schedules) ? parsedData.schedules : [],
      essays: Array.isArray(parsedData.essays) ? parsedData.essays : [],
      interviews: Array.isArray(parsedData.interviews)
        ? parsedData.interviews
        : [],
      companyResearch: Array.isArray(parsedData.companyResearch)
        ? parsedData.companyResearch
        : [],
      interviewCoachImports: Array.isArray(parsedData.interviewCoachImports)
        ? parsedData.interviewCoachImports
        : [],
      experienceReports: Array.isArray(parsedData.experienceReports)
        ? parsedData.experienceReports
        : [],
      experiences: Array.isArray(parsedData.experiences)
        ? parsedData.experiences
        : [],
      todos: Array.isArray(parsedData.todos) ? parsedData.todos : [],
      notes: Array.isArray(parsedData.notes) ? parsedData.notes : [],
      attachments: Array.isArray(parsedData.attachments)
        ? parsedData.attachments
        : [],
    };
  } catch {
    const initialData = createInitialData();
    writeData(initialData);
    return initialData;
  }
}

function writeData(data: CareerBaseData) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export { STORAGE_KEY, createInitialData, readData, writeData };
