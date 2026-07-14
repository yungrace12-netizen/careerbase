# CareerBase
# Technical Requirements Document (TRD)

Version: 1.0.0
Status: Final

Related Documents

- 01_PRD.md
- 02_UserFlow.md
- 03_InformationArchitecture.md
- 04_Database.md
- 05_UIUX.md
- 06_DesignSystem.md

---

# 1. Document Purpose

본 문서는 CareerBase MVP의 기술적 구현 기준을 정의한다.

모든 개발은 본 문서를 기준으로 진행한다.

Cursor는 구현 시 본 문서의 기술 스택과 개발 규칙을 반드시 따른다.

---

# 2. Technical Stack

## Framework

Next.js (Latest Stable)

- App Router 사용
- React 최신 안정 버전

---

## Language

TypeScript

모든 코드는 TypeScript로 작성한다.

JavaScript는 사용하지 않는다.

---

## Styling

Tailwind CSS v4

CSS Module은 사용하지 않는다.

---

## UI Components

shadcn/ui

모든 공통 컴포넌트는 shadcn/ui를 기반으로 작성한다.

---

## Icons

Lucide React

아이콘 라이브러리는 하나만 사용한다.

---

## State Management

Zustand

Redux는 사용하지 않는다.

---

## Form

React Hook Form

+

Zod

---

## Calendar

FullCalendar

월간 캘린더만 MVP에서 사용한다.

---

## Drag & Drop

dnd-kit

지원현황 Kanban Board에서 사용한다.

---

## Chart

Recharts

Dashboard 통계에서 사용한다.

---

## Storage

Browser LocalStorage

MVP에서는 서버 DB를 사용하지 않는다.

---

## Deploy

Vercel

---

## Future

Supabase

OpenAI API

---

# 3. Project Architecture

Architecture Pattern

```
Presentation

↓

Application

↓

Repository

↓

Storage
```

UI는 Storage를 직접 접근하지 않는다.

모든 저장은 Repository를 통해 수행한다.

---

# 4. Folder Structure

```
app/

components/

features/

hooks/

lib/

repositories/

stores/

types/

utils/

docs/

public/

styles/
```

---

## app

App Router

페이지

레이아웃

---

## components

공통 UI

Button

Input

Modal

Card

Badge

Table

---

## features

기능별 컴포넌트

Dashboard

Applications

Calendar

Essay

Interview

Profile

Experience

Archive

---

## hooks

Custom Hooks

---

## lib

공통 라이브러리

Formatter

Date

Storage

---

## repositories

Repository Pattern

LocalStorage 접근

JSON Import

JSON Export

---

## stores

Zustand Store

---

## types

공통 TypeScript Type

---

## utils

Helper Function

---

# 5. Naming Convention

Component

```
PascalCase
```

Example

```
DashboardCard.tsx
```

---

Hook

```
useCamelCase
```

Example

```
useDashboard.ts
```

---

Store

```
camelCaseStore
```

Example

```
applicationStore.ts
```

---

Type

```
PascalCase
```

Example

```
Job.ts
```

---

Constant

```
UPPER_SNAKE_CASE
```

---

Folder

```
kebab-case
```

---

# 6. Coding Convention

Indent

```
2 Spaces
```

Semicolon

```
Always
```

Quote

```
Single Quote
```

Trailing Comma

```
Always
```

---

# 7. Routing

App Router를 사용한다.

예시

```
/

/calendar

/applications

/applications/[id]

/experience

/profile

/archive

/settings
```

---

# 8. State Management

전역 상태는 Zustand를 사용한다.

Store 분리

```
applicationStore

calendarStore

profileStore

experienceStore

settingsStore
```

Store는 필요한 데이터만 가진다.

거대한 Store 하나를 만들지 않는다.

---

# 9. Repository Pattern

LocalStorage 접근은

Repository에서만 수행한다.

예시

```
ApplicationRepository

ProfileRepository

EssayRepository

InterviewRepository
```

Component는 localStorage를 직접 사용하지 않는다.

---

# 10. Local Storage

Storage Key

```
careerbase_data
```

모든 데이터는 하나의 Root Object에 저장한다.

Schema Version을 반드시 포함한다.

---

# 11. Data Flow

```
UI

↓

Component

↓

Store

↓

Repository

↓

LocalStorage
```

반대로

```
LocalStorage

↓

Repository

↓

Store

↓

UI
```

---

# 12. Component Structure

모든 화면은

```
Page

↓

Section

↓

Card

↓

Component
```

구조를 사용한다.

예시

Dashboard

↓

Calendar Section

↓

Calendar Card

↓

Calendar Component

---

# 13. TypeScript Rules

모든 데이터는 Interface 또는 Type으로 정의한다.

```
any
```

사용을 금지한다.

Type 중복 선언을 금지한다.

공통 타입은

```
types/
```

에서 관리한다.

---

# 14. Dependency Rules

Component 간 직접 의존을 최소화한다.

Feature는 다른 Feature를 직접 참조하지 않는다.

공통 기능은

```
lib/

utils/

components/
```

로 이동한다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final
---

# 15. Form Management

모든 Form은 React Hook Form을 사용한다.

Validation은 Zod를 사용한다.

각 Form은 독립적으로 관리한다.

예시

- 공고 등록
- 공고 수정
- Profile
- Experience
- 자소서
- 면접

---

## 15.1 Validation Rules

필수 입력값은 저장 전에 검증한다.

실시간 Validation을 지원한다.

오류 메시지는 사용자가 이해하기 쉬운 문장으로 작성한다.

예시

```
기업명을 입력해주세요.

지원 마감일을 입력해주세요.
```

기술적인 오류 메시지는 표시하지 않는다.

---

# 16. Auto Save

자동 저장은 MVP 핵심 기능이다.

적용 화면

- 자소서
- 면접
- Experience
- 공고 메모

동작

```
사용자 입력

↓

1초 대기

↓

Repository 저장

↓

Toast 표시
```

저장 중

```
저장 중...
```

완료

```
저장 완료
```

---

# 17. Calendar Rules

Calendar는 FullCalendar를 사용한다.

지원 View

- Month

MVP에서는

Week View

Day View

를 제공하지 않는다.

일정 클릭 시

공고 상세 화면으로 이동한다.

---

## Event Types

- 지원 시작
- 지원 마감
- 서류 발표
- 인적성
- 1차 면접
- 2차 면접
- 최종 발표

---

# 18. Kanban Rules

Kanban은 dnd-kit으로 구현한다.

지원 기능

- Drag
- Drop
- Keyboard 접근성

Column

- 관심
- 준비 중
- 제출 완료
- 전형 진행
- 최종 결과

Drop 후

Store

↓

Repository

↓

LocalStorage

순으로 저장한다.

---

# 19. Chart Rules

Dashboard 통계는 Recharts를 사용한다.

MVP 차트

- 지원 현황
- 합격률
- 진행 상태

차트는 정보를 보조하는 역할만 한다.

숫자를 우선 표시한다.

---

# 20. Error Handling

Error Boundary를 사용한다.

예상 가능한 오류는

사용자 친화적인 문장으로 표시한다.

예시

```
데이터를 저장하지 못했습니다.

잠시 후 다시 시도해주세요.
```

---

# 21. Performance

목표

초기 로딩

```
2초 이하
```

페이지 이동

```
300ms 이하
```

자동 저장

```
1초 이내
```

불필요한 Re-render를 최소화한다.

React.memo

useMemo

useCallback

은 필요한 경우만 사용한다.

---

# 22. Security

MVP에서는 로그인 기능이 없다.

LocalStorage를 사용한다.

사용자에게 안내한다.

- 공용 PC 사용 주의
- 정기적인 백업 권장

저장 금지

- 주민등록번호
- 계좌번호
- 카드번호
- 비밀번호

---

# 23. Backup

JSON Export

지원

JSON Import

지원

복원 시

기존 데이터를 전체 교체한다.

Schema Version을 검증한다.

---

# 24. Logging

개발 환경

console.error

console.warn

허용

배포 환경

불필요한 console.log를 제거한다.

---

# 25. Code Quality

ESLint 사용

Prettier 사용

자동 Format 적용

TypeScript Strict Mode 사용

---

# 26. Future Supabase

Repository Pattern을 유지한다.

Storage Layer만 교체하여

Supabase를 연결할 수 있어야 한다.

예상 구조

```
UI

↓

Store

↓

Repository

↓

Supabase
```

UI 수정 없이

Repository만 변경하는 것을 목표로 한다.

---

# 27. Future AI

AI 기능은 OpenAI API를 사용한다.

예상 기능

- 자소서 분석
- 경험 추천
- 면접 질문 추천
- 지원 전략 분석
- 커리어 분석

AI 호출은 Service Layer로 분리한다.

Repository와 직접 연결하지 않는다.

---

# 28. Deployment

배포 플랫폼

Vercel

브랜치 전략

main

배포 브랜치

main

환경 변수는

```
.env.local
```

을 사용한다.

---

# 29. Development Rules

항상 TypeScript를 사용한다.

App Router를 사용한다.

Tailwind CSS를 사용한다.

shadcn/ui를 사용한다.

Lucide React를 사용한다.

Zustand를 사용한다.

Repository Pattern을 유지한다.

LocalStorage 직접 접근을 금지한다.

---

# 30. Cursor Development Rules

Cursor는 다음 규칙을 반드시 따른다.

- PRD를 우선한다.
- UIUX를 따른다.
- DesignSystem을 따른다.
- Database 구조를 변경하지 않는다.
- 새로운 Type을 임의로 만들지 않는다.
- any를 사용하지 않는다.
- JavaScript를 사용하지 않는다.
- CSS Module을 사용하지 않는다.
- 새로운 디자인 스타일을 만들지 않는다.
- Repository를 거치지 않고 데이터를 저장하지 않는다.
- 모든 페이지는 반응형으로 구현한다.
- Desktop First 원칙을 따른다.
- 자동 저장 기능을 유지한다.
- 코드보다 가독성을 우선한다.

문서 간 충돌이 발생하면 우선순위는 다음과 같다.

```
PRD

↓

Database

↓

UIUX

↓

DesignSystem

↓

TRD
```

---

# 31. Definition of Done

CareerBase MVP는 다음 조건을 만족하면 완료된 것으로 본다.

- 모든 화면이 정상 동작한다.
- LocalStorage 저장 및 복원이 가능하다.
- JSON 백업 및 복원을 지원한다.
- Dashboard가 정상 표시된다.
- Calendar가 정상 동작한다.
- Kanban Drag & Drop이 정상 동작한다.
- 공고 CRUD가 가능하다.
- Profile CRUD가 가능하다.
- Experience CRUD가 가능하다.
- 자소서 CRUD가 가능하다.
- 면접 CRUD가 가능하다.
- Archive 기능이 동작한다.
- 자동 저장이 동작한다.
- 반응형 UI가 적용된다.
- TypeScript 오류가 없다.
- ESLint 오류가 없다.
- Build가 성공한다.
- Vercel 배포가 가능하다.

---

# 32. Technical Goals

CareerBase의 기술 목표는 다음과 같다.

- 유지보수가 쉬운 구조
- 확장 가능한 아키텍처
- 일관된 컴포넌트 설계
- Repository Pattern 기반 데이터 관리
- Cursor가 이해하기 쉬운 코드
- 향후 Supabase 및 AI 기능을 쉽게 추가할 수 있는 구조

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final