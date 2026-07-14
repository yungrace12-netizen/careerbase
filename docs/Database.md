# CareerBase
# Database Design Document

Version: 1.0.0  
Status: Final  
Related Documents:

- PRD.md
- UserFlow.md
- InformationArchitecture.md

---

# 1. Document Purpose

본 문서는 CareerBase MVP에서 사용하는 데이터 구조, 데이터 간 관계, 저장 및 백업 정책을 정의한다.

CareerBase MVP는 별도의 서버 데이터베이스를 사용하지 않으며, 사용자의 브라우저 내부 저장소를 기반으로 동작한다.

초기 저장 방식은 다음을 원칙으로 한다.

- 구조화 데이터: localStorage
- 실제 첨부파일: 저장하지 않음
- 첨부파일 이름 및 보관 위치 정보: localStorage
- 전체 데이터 백업 및 복원: JSON 파일
- 로그인 및 사용자 계정: 사용하지 않음

향후 Supabase 등 외부 데이터베이스로 전환할 수 있도록 화면 컴포넌트와 데이터 저장 로직을 분리한다.

---

# 2. Core Data Principles

## 2.1 Job First

CareerBase의 지원 관련 데이터는 채용공고(Job)를 중심으로 연결한다.

하나의 기업이 여러 공고를 등록할 수 있으며, 각 공고는 독립적으로 관리한다.

예:

- KT IT기획
- KT AI기획
- KT DX기획

위 공고는 동일 기업의 공고지만 각각 별도의 Job 데이터이다.

---

## 2.2 Single Source of Truth

동일한 정보는 한 위치에서만 관리한다.

예:

- 지원 결과는 공고별로 한 번만 저장한다.
- 지원 결과를 자소서 문항마다 중복 저장하지 않는다.
- 채용 전형 일정은 Schedule 데이터에서 관리한다.
- 공통 이력 정보는 Profile 데이터에서 관리한다.

한 데이터를 수정하면 해당 데이터를 사용하는 모든 화면에 동일한 내용이 반영되어야 한다.

---

## 2.3 CRUD Support

사용자가 입력한 데이터는 다음 기능을 지원한다.

- Create: 추가
- Read: 조회
- Update: 수정
- Delete: 삭제

단, 공고는 일반 화면에서 즉시 영구 삭제하지 않는다.

공고 삭제 요청 시 기본적으로 Archive로 이동하며, 영구 삭제는 Archive에서만 가능하다.

---

## 2.4 Multiple Entries

다음 이력 항목은 여러 개 등록할 수 있다.

- 고등학교
- 대학교
- 경력
- 어학
- 자격증
- 수상경력
- 학내외활동

각 항목은 고유 ID를 가진 독립 데이터로 저장한다.

각 섹션에는 `+ 추가` 버튼을 제공한다.

취미와 특기는 다중 태그가 아닌 일반 텍스트 형식으로 저장한다.

---

## 2.5 Archive First

지원이 종료된 공고는 기본적으로 삭제하지 않고 Archive로 이동한다.

Archive 데이터는 다음 기능에서 계속 사용한다.

- 통합 검색
- 지원 통계
- 지원 이력 조회
- 향후 AI 분석

Archive에서 영구 삭제할 때는 강한 확인 절차를 제공한다.

---

## 2.6 Timestamps

주요 데이터는 다음 시간을 기록한다.

- `createdAt`: 최초 생성 시각
- `updatedAt`: 마지막 수정 시각
- `archivedAt`: Archive 이동 시각
- `completedAt`: 완료 시각

시간은 ISO 8601 문자열 형식으로 저장한다.

예:

`2026-07-14T18:30:00+09:00`

---

# 3. Storage Architecture

## 3.1 MVP Storage

MVP에서는 하나의 최상위 객체를 localStorage에 저장한다.

권장 저장 키:

`careerbase_data`

최상위 구조:

```ts
interface CareerBaseData {
  schemaVersion: string;
  initializedAt: string;
  lastUpdatedAt: string;

  onboarding: OnboardingData;
  jobs: Job[];
  schedules: Schedule[];
  essays: Essay[];
  interviews: InterviewStage[];
  profile: Profile;
  experiences: Experience[];
  todos: Todo[];
  notes: JobNote[];
  attachments: AttachmentMetadata[];
  settings: AppSettings;
}
```

---

## 3.2 Schema Version

데이터 구조 변경에 대비하여 `schemaVersion`을 반드시 저장한다.

초기 값:

```text
1.0.0
```

향후 데이터 구조가 변경되면 데이터 마이그레이션 로직을 적용한다.

예:

```text
1.0.0 → 1.1.0
```

기존 사용자의 데이터가 구조 변경으로 인해 삭제되지 않아야 한다.

---

## 3.3 Repository Pattern

화면 컴포넌트에서 localStorage에 직접 접근하지 않는다.

모든 저장, 조회, 수정, 삭제는 데이터 저장소 계층을 통해 처리한다.

```text
Components
    ↓
Hooks 또는 State
    ↓
Repository
    ↓
localStorage
```

향후 Supabase로 전환할 때 Repository의 내부 구현만 교체할 수 있어야 한다.

---

# 4. Entity Relationship

CareerBase 데이터의 핵심 관계는 다음과 같다.

```text
Job
├── Schedule[]
├── Essay[]
├── InterviewStage[]
├── Todo[]
├── JobNote[]
├── AttachmentMetadata[]
└── Experience[] 연결 정보
```

Profile은 특정 공고에 종속되지 않는 사용자의 공통 이력 정보이다.

```text
Profile
├── PersonalInfo
├── HighSchool[]
├── University[]
├── Career[]
├── LanguageQualification[]
├── Certificate[]
├── Award[]
├── Activity[]
└── OtherInfo
```

---

# 5. Common Types

## 5.1 Identifier

모든 주요 데이터는 고유 ID를 가진다.

```ts
type EntityId = string;
```

ID 생성에는 다음 방식을 권장한다.

```ts
crypto.randomUUID();
```

---

## 5.2 Schedule Precision

채용 일정은 정확한 날짜와 정확하지 않은 표현을 모두 지원해야 한다.

```ts
type SchedulePrecision =
  | "exact"
  | "approximate"
  | "unknown";
```

예:

- `exact`: 2026년 8월 5일
- `approximate`: 8월 중
- `unknown`: 추후 안내, 미정

---

## 5.3 Employment Type

```ts
type EmploymentType =
  | "정규직"
  | "계약직"
  | "인턴"
  | "전환형 인턴"
  | "파견직"
  | "프리랜서"
  | "기타";
```

---

## 5.4 Applicant Type

```ts
type ApplicantType =
  | "신입"
  | "경력"
  | "신입·경력"
  | "무관";
```

---

# 6. Job Entity

채용공고의 기본 정보, 지원 상태 및 지원 결과를 저장한다.

```ts
interface Job {
  id: EntityId;

  companyName: string;
  postingTitle: string;
  position: string;
  employmentType: EmploymentType | "";
  applicantType: ApplicantType | "";
  postingUrl: string;

  applicationStartDate: string | null;
  applicationStartTime: string | null;
  applicationEndDate: string | null;
  applicationEndTime: string | null;

  postingContent: string;
  qualifications: string;
  location: string;

  boardColumn: ApplicationBoardColumn;
  detailedStatus: ApplicationStatus;
  applicationResult: ApplicationResult;

  isArchived: boolean;
  archivedAt: string | null;
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

## 6.1 Job Input Fields

공고 등록 항목:

- 기업명
- 공고명
- 직무
- 고용형태
- 신입·경력 구분
- 공고 URL
- 지원 시작일
- 지원 마감일
- 공고 내용
- 자격요건
- 근무지

날짜나 일부 정보를 알 수 없는 경우 해당 항목은 비워둘 수 있다.

필수 정보가 비어 있으면 사용자에게 안내하되, 임시 저장은 가능하도록 설계할 수 있다.

---

## 6.2 Job Creation Rule

새 공고 등록 시 다음 값을 자동 설정한다.

```text
boardColumn = 관심
detailedStatus = 지원전
applicationResult = 미정
isArchived = false
createdAt = 현재 시각
updatedAt = 현재 시각
```

공고 등록 시 입력된 날짜를 기준으로 다음 데이터를 함께 생성한다.

- 지원 시작 일정
- 지원 마감 일정
- 지원 마감 D-3 자동 TODO

---

# 7. Application Status

## 7.1 Kanban Columns

지원 현황 칸반보드에서는 다음 컬럼을 사용한다.

```ts
type ApplicationBoardColumn =
  | "관심"
  | "준비 중"
  | "제출 완료"
  | "전형 진행"
  | "최종 결과";
```

---

## 7.2 Detailed Status

상세 지원 상태는 다음 값을 사용한다.

```ts
type ApplicationStatus =
  | "지원전"
  | "지원중"
  | "서류합격"
  | "서류불합격"
  | "인적성합격"
  | "인적성불합격"
  | "1차면접합격"
  | "1차면접불합격"
  | "2차면접합격"
  | "2차면접불합격"
  | "최종합격"
  | "최종불합격"
  | "지원포기";
```

모든 화면과 데이터에서 `인정성`이 아닌 `인적성`으로 표기한다.

---

## 7.3 Application Result

지원 결과는 공고당 한 번만 저장한다.

```ts
type ApplicationResult =
  | "미정"
  | "서류합격"
  | "서류불합격"
  | "인적성합격"
  | "인적성불합격"
  | "1차면접합격"
  | "1차면접불합격"
  | "2차면접합격"
  | "2차면접불합격"
  | "최종합격"
  | "최종불합격"
  | "지원포기";
```

지원 결과는 Essay 데이터에 저장하지 않는다.

---

## 7.4 Status Mapping

상세 상태는 다음 칸반 컬럼에 연결한다.

```text
관심
└── 지원전

준비 중
└── 지원중

제출 완료
└── 지원서를 제출했으나 전형 결과가 입력되지 않은 상태

전형 진행
├── 서류합격
├── 인적성합격
├── 1차면접합격
└── 2차면접합격

최종 결과
├── 서류불합격
├── 인적성불합격
├── 1차면접불합격
├── 2차면접불합격
├── 최종합격
├── 최종불합격
└── 지원포기
```

`제출 완료`는 칸반보드 표시용 단계로 관리하며, 상세 지원 결과와 별도로 저장할 수 있다.

사용자가 칸반 카드를 이동하면 필요한 경우 세부 상태를 선택할 수 있어야 한다.

---

# 8. Schedule Entity

공고별 채용 전형 일정을 저장한다.

```ts
interface Schedule {
  id: EntityId;
  jobId: EntityId;

  type: ScheduleType;
  title: string;

  precision: SchedulePrecision;

  exactDate: string | null;
  exactTime: string | null;

  approximateText: string;
  note: string;

  isConfirmed: boolean;
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

## 8.1 Schedule Types

```ts
type ScheduleType =
  | "지원 시작"
  | "지원 마감"
  | "서류 발표"
  | "인적성"
  | "1차 면접"
  | "2차 면접"
  | "최종 발표";
```

---

## 8.2 Time Input Rule

시간은 필수 항목이 아니다.

시간이 필요한 일정에만 선택적으로 입력한다.

예:

```text
지원 마감
2026-07-31
18:00
```

시간이 없는 일정은 날짜 단위 일정으로 표시한다.

---

## 8.3 Approximate Schedule Rule

정확한 날짜를 알 수 없는 일정은 다음과 같이 저장한다.

```ts
{
  precision: "approximate",
  exactDate: null,
  exactTime: null,
  approximateText: "8월 중"
}
```

입력 예:

- 7월 중
- 8월 말
- 하반기 예정
- 추후 안내

미정인 일정은 다음과 같이 저장한다.

```ts
{
  precision: "unknown",
  exactDate: null,
  exactTime: null,
  approximateText: "미정"
}
```

`8월 중`과 같은 문자열을 실제 날짜 필드에 저장하지 않는다.

정확한 날짜가 없는 일정은 월간 달력의 임의 날짜에 표시하지 않고, `예정·미정 일정` 목록에 표시한다.

---

# 9. Essay Entity

기업별, 공고별, 문항별 자소서 답변을 저장한다.

```ts
interface Essay {
  id: EntityId;
  jobId: EntityId;

  question: string;
  finalAnswer: string;

  attachmentIds: EntityId[];
  experienceIds: EntityId[];

  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

## 9.1 Essay Rules

- 하나의 공고에는 여러 자소서 문항을 등록할 수 있다.
- 각 문항은 독립적으로 추가, 수정, 삭제할 수 있다.
- MVP에서는 문항당 최종 제출 답변 한 개를 저장한다.
- 지원 결과는 자소서 문항에 저장하지 않는다.
- 지원 결과는 Job의 `applicationResult`에만 저장한다.
- 자소서 문항에는 Experience Library의 경험 카드를 연결할 수 있다.

---

## 9.2 Essay Auto Save

자소서 답변은 다음 방식으로 저장한다.

- 사용자가 입력을 멈춘 후 약 1초 뒤 자동 저장
- 별도의 저장 버튼 제공
- 저장 중 상태 표시
- 저장 완료 상태 표시
- 마지막 저장 시각 표시

예:

```text
저장 중...
저장됨 · 오후 6:30
```

---

# 10. Attachment Metadata Entity

MVP에서는 실제 파일을 웹사이트 또는 localStorage에 저장하지 않는다.

파일에 대한 정보만 저장한다.

```ts
interface AttachmentMetadata {
  id: EntityId;
  jobId: EntityId | null;
  essayId: EntityId | null;

  fileName: string;
  fileType: AttachmentType;
  versionDescription: string;
  localPathDescription: string;
  registeredDate: string;

  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

## 10.1 Attachment Types

```ts
type AttachmentType =
  | "이력서"
  | "자소서"
  | "경력기술서"
  | "포트폴리오"
  | "면접자료"
  | "증명사진"
  | "기타";
```

---

## 10.2 Attachment Example

```text
파일명: KT_IT기획_최종자소서.pdf
종류: 자소서
버전 또는 설명: 최종 제출본
보관 위치: 내 문서/취업/KT
등록일: 2026-07-20
```

`localPathDescription`은 실제 파일 경로를 자동으로 탐색하는 기능이 아니다.

사용자가 파일을 찾기 쉽도록 직접 입력하는 설명용 값이다.

---

# 11. Interview Entity

면접은 공고별, 면접 단계별로 관리한다.

```ts
interface InterviewStage {
  id: EntityId;
  jobId: EntityId;

  name: string;
  order: number;
  status: InterviewStatus;

  scheduleId: EntityId | null;

  expectedQuestions: InterviewQuestion[];
  actualQuestions: ActualInterviewQuestion[];
  retrospective: string;

  attachmentIds: EntityId[];
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

## 11.1 Interview Status

```ts
type InterviewStatus =
  | "준비 전"
  | "준비 중"
  | "예정"
  | "완료"
  | "취소";
```

---

## 11.2 Interview Stage Rule

기본 면접 단계:

- 1차 면접
- 2차 면접

사용자는 원하는 면접 단계를 추가할 수 있다.

예:

- 직무면접
- 인성면접
- 임원면접
- PT면접
- 화상면접
- 기타

면접 단계의 순서는 변경할 수 있다.

---

## 11.3 Expected Question

```ts
interface InterviewQuestion {
  id: EntityId;
  question: string;
  answer: string;
  experienceIds: EntityId[];

  createdAt: string;
  updatedAt: string;
}
```

---

## 11.4 Actual Question

```ts
interface ActualInterviewQuestion {
  id: EntityId;
  question: string;
  myAnswerMemo: string;
  improvementMemo: string;

  createdAt: string;
  updatedAt: string;
}
```

---

## 11.5 Interview Auto Save

면접 답변과 회고는 다음 방식으로 저장한다.

- 입력을 멈춘 후 약 1초 뒤 자동 저장
- 저장 버튼 제공
- 저장 상태 표시
- 면접 단계별 데이터 분리

---

# 12. Profile Entity

Profile은 특정 공고에 종속되지 않는 사용자의 공통 이력 정보이다.

```ts
interface Profile {
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
```

---

# 13. Personal Information

```ts
interface PersonalInfo {
  name: string;
  birthDate: string | null;
  address: string;
  englishAddress: string;

  profilePhotoFileName: string;
  profilePhotoLocation: string;

  desiredSalary: number | null;
  salaryCurrency: "KRW";

  updatedAt: string;
}
```

전화번호와 이메일은 MVP 저장 대상에서 제외한다.

증명사진의 실제 파일은 저장하지 않고 다음 정보만 기록한다.

- 파일명
- 보관 위치

---

# 14. High School Entity

```ts
interface HighSchool {
  id: EntityId;

  schoolName: string;
  admissionDate: string | null;
  graduationDate: string | null;
  location: string;
  academicTrack: string;

  createdAt: string;
  updatedAt: string;
}
```

고등학교 정보는 다중 입력을 지원한다.

---

# 15. University Entity

```ts
interface University {
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
```

대학교 정보는 다중 입력을 지원한다.

---

# 16. Career Entity

```ts
interface Career {
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
  salaryCurrency: "KRW";

  createdAt: string;
  updatedAt: string;
}
```

연봉 정책:

- PersonalInfo에는 희망연봉을 저장한다.
- Career에는 해당 직장의 연봉을 저장한다.
- 연봉 입력은 선택 사항이다.

---

# 17. Language Qualification Entity

```ts
interface LanguageQualification {
  id: EntityId;

  qualificationName: string;
  registrationNumber: string;

  score: number | null;
  scoreScale: number | null;

  testDate: string | null;

  createdAt: string;
  updatedAt: string;
}
```

예:

```text
TOEIC
등록번호: 000000
점수: 815
만점: 990
응시일: 2026-06-13
```

어학 정보는 다중 입력을 지원한다.

---

# 18. Certificate Entity

```ts
interface Certificate {
  id: EntityId;

  certificateName: string;
  registrationNumber: string;
  issuingOrganization: string;
  acquisitionDate: string | null;

  createdAt: string;
  updatedAt: string;
}
```

자격증은 다중 입력을 지원한다.

---

# 19. Award Entity

```ts
interface Award {
  id: EntityId;

  awardName: string;
  awardingOrganization: string;
  awardDate: string | null;
  description: string;

  createdAt: string;
  updatedAt: string;
}
```

수상경력은 다중 입력을 지원한다.

---

# 20. Activity Entity

```ts
type ActivityType =
  | "팀프로젝트"
  | "동아리활동"
  | "기타사회활동";

interface Activity {
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
```

활동 기간은 연·월 단위로 저장한다.

학내외활동은 다중 입력을 지원한다.

---

# 21. Other Information

```ts
interface OtherInfo {
  hobby: string;
  specialty: string;
  updatedAt: string;
}
```

취미와 특기는 태그 배열이 아닌 일반 텍스트 입력으로 저장한다.

---

# 22. Experience Entity

Experience Library의 경험 카드를 저장한다.

```ts
interface Experience {
  id: EntityId;

  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  measurableOutcome: string;

  competencyTags: string[];
  relatedJobIds: EntityId[];

  memo: string;
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

## 22.1 Experience Connection

Experience는 다음 데이터와 직접 연결할 수 있다.

- Essay
- InterviewQuestion
- Job

자소서 또는 면접 질문 작성 화면에서 경험 카드를 선택해 연결한다.

경험을 연결해도 경험 카드의 원본 내용이 답변에 자동 복사되지는 않는다.

연결 목적:

- 어떤 경험을 어느 지원에서 사용했는지 확인
- 다음 자소서 작성 시 재사용
- 향후 AI 경험 추천 데이터로 활용

---

# 23. Todo Entity

TODO는 자동 생성과 사용자 직접 생성을 모두 지원한다.

```ts
interface Todo {
  id: EntityId;

  jobId: EntityId | null;
  scheduleId: EntityId | null;

  title: string;
  description: string;

  source: TodoSource;
  dueDate: string | null;
  dueTime: string | null;

  isCompleted: boolean;
  completedAt: string | null;

  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

## 23.1 Todo Source

```ts
type TodoSource = "자동" | "직접";
```

---

## 23.2 Automatic TODO Rule

MVP 기본 규칙:

```text
지원 마감일 D-3
→ 해당 공고의 지원 준비 TODO 자동 생성
```

예:

```text
KT IT기획 지원 마감 D-3
```

향후 사용자가 TODO 생성 시점을 설정할 수 있도록 확장한다.

---

## 23.3 Completed TODO Rule

완료한 TODO는 삭제하지 않는다.

완료 시 다음 값을 기록한다.

```text
isCompleted = true
completedAt = 완료 시각
```

완료된 TODO는 완료 목록에서 다시 확인할 수 있어야 한다.

---

# 24. Job Note Entity

공고별 자유 메모를 저장한다.

```ts
interface JobNote {
  id: EntityId;
  jobId: EntityId;

  content: string;
  isSample: boolean;

  createdAt: string;
  updatedAt: string;
}
```

메모는 1초 지연 자동 저장과 저장 버튼을 모두 지원한다.

---

# 25. Onboarding Data

```ts
interface OnboardingData {
  isCompleted: boolean;
  selectedMode: "sample" | "empty" | null;
  completedAt: string | null;
}
```

최초 접속 시 사용자는 다음 중 하나를 선택한다.

- 예시 데이터로 둘러보기
- 빈 상태로 시작하기

---

# 26. Sample Data Policy

예시 데이터에는 반드시 다음 값을 저장한다.

```text
isSample = true
```

사용자는 Settings에서 `예시 데이터 전체 삭제` 버튼을 사용할 수 있다.

삭제 대상:

- 샘플 공고
- 샘플 일정
- 샘플 자소서
- 샘플 면접
- 샘플 경험 카드
- 샘플 TODO
- 샘플 메모
- 샘플 첨부파일 정보

사용자가 직접 입력한 실제 데이터는 삭제하지 않는다.

예시 데이터 전체 삭제 전 확인 모달을 표시한다.

---

# 27. App Settings

```ts
interface AppSettings {
  theme: "light";
  sidebarCollapsed: boolean;

  autoSaveDelayMs: number;
  automaticTodoDaysBeforeDeadline: number;

  lastBackupAt: string | null;
  updatedAt: string;
}
```

MVP 기본값:

```text
theme = light
autoSaveDelayMs = 1000
automaticTodoDaysBeforeDeadline = 3
```

---

# 28. Auto Save Policy

다음 데이터는 자동 저장을 지원한다.

- 자소서 답변
- 면접 답변
- 면접 회고
- 공고 메모
- 경력기술서
- 경험 카드의 장문 내용

저장 방식:

1. 사용자가 내용을 입력한다.
2. 마지막 입력 후 약 1초간 기다린다.
3. 변경 내용을 localStorage에 저장한다.
4. 저장 완료 상태를 표시한다.

저장 버튼도 함께 제공한다.

자동 저장과 수동 저장은 같은 저장 로직을 사용해야 한다.

---

# 29. Data Validation

## 29.1 Required Validation

필수 필드가 비어 있으면 저장 전 안내한다.

장문 작성 데이터는 작성 중인 상태로 빈 값 또는 미완성 내용을 저장할 수 있다.

---

## 29.2 Date Validation

- 종료일은 시작일보다 빠를 수 없다.
- 지원 마감일은 지원 시작일보다 빠를 수 없다.
- 정확한 날짜가 없는 일정은 `approximateText`를 사용한다.
- `8월 중` 같은 값을 ISO 날짜 필드에 저장하지 않는다.

---

## 29.3 Number Validation

다음 값은 숫자 형식으로 입력한다.

- 학점
- 이수학점
- 어학 점수
- 연봉

학점은 소수 입력을 허용한다.

---

## 29.4 URL Validation

공고 URL은 URL 형식을 검증한다.

형식이 올바르지 않으면 경고를 표시한다.

사용자가 URL을 알 수 없는 경우 빈 값 저장을 허용할 수 있다.

---

# 30. Delete and Archive Policy

## 30.1 Job Delete

일반 공고 화면에서 삭제를 요청하면 다음 절차를 따른다.

```text
삭제 요청
↓
Archive 이동 안내
↓
Archive 이동
```

---

## 30.2 Permanent Delete

Archive에서만 영구 삭제할 수 있다.

영구 삭제 시 해당 공고에 연결된 데이터를 함께 삭제한다.

삭제 대상:

- Job
- Schedule
- Essay
- InterviewStage
- Todo
- JobNote
- 해당 공고에 연결된 AttachmentMetadata
- Experience의 `relatedJobIds`에 저장된 연결값

Experience 원본 카드는 삭제하지 않고, 삭제된 Job ID 연결만 제거한다.

영구 삭제 전 다음 내용을 안내한다.

```text
이 작업은 되돌릴 수 없습니다.
공고와 연결된 자소서, 면접, 일정 및 메모가 함께 삭제됩니다.
```

---

# 31. Backup Export

Settings에서 전체 데이터를 JSON 파일로 내보낼 수 있다.

파일명 형식:

```text
careerbase_backup_YYYY-MM-DD_HHmm.json
```

예:

```text
careerbase_backup_2026-07-14_1830.json
```

백업 파일에는 다음을 포함한다.

- schemaVersion
- exportDate
- CareerBaseData 전체

실제 첨부파일은 포함하지 않는다.

첨부파일의 파일명과 보관 위치 정보만 포함한다.

---

# 32. Backup Import

MVP의 복원 방식은 `전체 교체`만 지원한다.

복원 절차:

```text
JSON 파일 선택
↓
파일 형식 검증
↓
schemaVersion 확인
↓
현재 데이터 전체 교체 경고
↓
사용자 확인
↓
기존 데이터 삭제
↓
백업 데이터 복원
↓
앱 새로고침
```

기존 데이터와 병합하는 기능은 MVP에서 지원하지 않는다.

---

## 32.1 Import Safety

복원 전에 다음 안내를 표시한다.

```text
백업을 불러오면 현재 데이터가 모두 교체됩니다.
현재 데이터를 먼저 백업하는 것을 권장합니다.
```

가능한 경우 복원 전에 현재 데이터를 별도로 백업할 수 있는 버튼을 제공한다.

---

# 33. Data Reset

전체 데이터 초기화 기능은 Settings에 제공한다.

초기화 전 다음 절차를 수행한다.

1. 백업 권장 안내
2. 확인 모달 표시
3. 확인 문구 직접 입력
4. 최종 초기화 실행

예:

```text
초기화
```

라는 문구를 사용자가 직접 입력해야 실행할 수 있다.

초기화가 완료되면 Onboarding 화면으로 이동한다.

---

# 34. Search Index

통합 검색 대상:

- `Job.companyName`
- `Job.postingTitle`
- `Job.position`
- `Job.postingContent`
- `Job.qualifications`
- `Job.location`
- `Essay.question`
- `Essay.finalAnswer`
- `InterviewQuestion.question`
- `InterviewQuestion.answer`
- `ActualInterviewQuestion.question`
- `ActualInterviewQuestion.myAnswerMemo`
- `InterviewStage.retrospective`
- `Career.companyName`
- `Career.department`
- `Career.responsibilities`
- `Career.careerDescription`
- `Experience.title`
- `Experience.situation`
- `Experience.task`
- `Experience.action`
- `Experience.result`
- `Experience.competencyTags`
- `JobNote.content`

검색은 대소문자를 구분하지 않는 부분 일치 방식으로 동작한다.

한글 검색을 지원한다.

Archive 데이터도 검색 결과에 포함한다.

---

# 35. Statistics Rules

지원 통계는 Job 데이터를 기준으로 계산한다.

통계 항목:

- 전체 공고 수
- 지원전
- 지원중
- 서류합격
- 서류불합격
- 인적성합격
- 인적성불합격
- 1차면접합격
- 1차면접불합격
- 2차면접합격
- 2차면접불합격
- 최종합격
- 최종불합격
- 지원포기
- Archive 공고 수

기본 통계에서는 샘플 데이터를 제외한다.

샘플 데이터 포함 여부는 사용자가 구분할 수 있어야 한다.

---

# 36. Privacy and Security

CareerBase MVP는 브라우저 localStorage를 사용한다.

따라서 사용자에게 다음 내용을 안내한다.

- 같은 브라우저를 사용하는 사람은 저장된 데이터에 접근할 수 있다.
- 공용 PC에서는 민감한 정보를 입력하지 않는 것이 좋다.
- 브라우저 데이터를 삭제하면 CareerBase 데이터도 삭제될 수 있다.
- 정기적으로 JSON 백업을 해야 한다.
- 다른 기기와 자동으로 동기화되지 않는다.
- Vercel 링크를 공유해도 사용자별 브라우저 데이터는 서로 섞이지 않는다.

저장을 금지하거나 권장하지 않는 정보:

- 주민등록번호
- 계좌번호
- 카드번호
- 각종 사이트 비밀번호
- 인증서 비밀번호
- 불필요한 고유식별정보

다음 정보는 민감한 정보임을 사용자에게 안내한다.

- 주소
- 자격증 등록번호
- 어학 등록번호
- 연봉
- 생년월일

---

# 37. Future Supabase Migration

MVP 이후 로그인과 클라우드 동기화를 추가할 때 Supabase로 전환할 수 있어야 한다.

```text
LocalStorage Repository
        ↓
Repository Interface 유지
        ↓
Supabase Repository로 교체
```

향후 각 사용자 데이터를 분리하기 위해 다음 공통 필드를 추가할 수 있다.

```ts
userId: string;
```

예상 Supabase 테이블:

- users
- jobs
- schedules
- essays
- attachments
- interview_stages
- interview_questions
- actual_interview_questions
- profiles
- high_schools
- universities
- careers
- languages
- certificates
- awards
- activities
- experiences
- todos
- job_notes
- user_settings

MVP에서는 `userId`를 저장하지 않는다.

이 섹션은 현재 MVP 구현 항목이 아니라 향후 데이터 이전을 위한 확장 기준이다.

---

# 38. Data Integrity Rules

다음 데이터 무결성 규칙을 지켜야 한다.

1. 존재하지 않는 Job ID를 참조하는 일정은 생성할 수 없다.
2. 존재하지 않는 Job ID를 참조하는 자소서는 생성할 수 없다.
3. 존재하지 않는 Job ID를 참조하는 면접은 생성할 수 없다.
4. Job을 영구 삭제하면 연결된 종속 데이터를 함께 정리한다.
5. Experience를 삭제하면 Essay와 Interview에 저장된 해당 Experience ID를 제거한다.
6. 일정이 삭제되면 연결된 자동 TODO의 `scheduleId`를 정리한다.
7. 동일한 ID가 중복 생성되지 않아야 한다.
8. 백업 복원 시 필수 최상위 데이터 구조를 검증한다.
9. 공고별 자소서·면접·일정 데이터가 다른 공고와 섞이지 않아야 한다.
10. 모든 종속 데이터는 `jobId`를 기준으로 연결한다.

---

# 39. Done Definition

Database 설계는 다음 조건을 모두 만족하면 완료된 것으로 본다.

- Job 중심 데이터 관계가 정의되어 있다.
- 지원 상태와 지원 결과가 분리되어 있다.
- 지원 결과는 공고당 한 번만 저장된다.
- 일정에 정확한 날짜와 `8월 중` 같은 예정 문구를 모두 저장할 수 있다.
- 시간은 필요한 일정에만 선택적으로 입력할 수 있다.
- 하나의 공고에 여러 자소서 문항을 저장할 수 있다.
- 면접 단계를 기본 및 사용자 지정 방식으로 추가할 수 있다.
- 모든 이력 항목의 CRUD가 가능하다.
- 학력, 경력, 어학, 자격증, 수상 및 활동의 다중 입력이 가능하다.
- 취미와 특기는 일반 텍스트로 저장된다.
- Experience와 자소서·면접 답변을 연결할 수 있다.
- 자동 TODO와 직접 TODO를 모두 지원한다.
- 완료한 TODO가 삭제되지 않고 기록으로 남는다.
- 예시 데이터를 일괄 삭제할 수 있다.
- 1초 지연 자동 저장과 저장 버튼을 모두 지원한다.
- JSON 전체 백업 및 전체 교체 복원을 지원한다.
- Archive와 영구 삭제 정책이 정의되어 있다.
- 개인정보 및 localStorage의 한계가 정의되어 있다.
- 향후 Supabase 전환이 가능한 구조로 설계되어 있다.