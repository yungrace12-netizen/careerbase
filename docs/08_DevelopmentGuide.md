# CareerBase
# Development Guide

Version: 1.0.0
Status: Final

Related Documents

- 01_PRD.md
- 02_UserFlow.md
- 03_InformationArchitecture.md
- 04_Database.md
- 05_UIUX.md
- 06_DesignSystem.md
- 07_TRD.md

---

# 1. Document Purpose

본 문서는 CareerBase MVP를 개발하는 표준 절차를 정의한다.

모든 개발은 본 문서를 기준으로 진행한다.

Cursor는 기능 구현보다 문서 준수를 우선해야 한다.

---

# 2. Development Goal

CareerBase MVP의 목표는 다음과 같다.

- 취업 준비 데이터를 한 곳에서 관리할 수 있다.
- 반복 입력을 최소화한다.
- 빠른 일정 확인이 가능하다.
- LocalStorage 기반으로 안정적으로 동작한다.
- 향후 Supabase와 AI 기능을 쉽게 추가할 수 있는 구조를 만든다.

---

# 3. Development Principles

모든 개발은 다음 원칙을 따른다.

- Document First
- Desktop First
- Mobile Responsive
- Component First
- Reusable Code
- Readable Code
- Simple Architecture
- Type Safety

---

# 4. MVP Scope

이번 MVP에서는 다음 기능만 구현한다.

Calendar Home

Applications

Experience Library

Profile

Archive

Settings

JSON Backup / Restore

LocalStorage

Auto Save

반드시 MVP 범위 내에서만 개발한다.

추가 기능은 구현하지 않는다.

---

# 5. Development Order

개발은 반드시 아래 순서를 따른다.

Step 1

프로젝트 생성

↓

Step 2

Design System 구축

↓

Step 3

공통 Layout

↓

Step 4

Sidebar

↓

Step 5

Calendar Home

↓

Step 6

Job Detail

↓

Step 7

Applications

↓

Step 8

Essay

↓

Step 9

Interview

↓

Step 10

Experience Library

↓

Step 11

Profile

↓

Step 12

Archive

↓

Step 13

Search

↓

Step 14

Final QA

---

## 5.1 Calendar Home Layout Rule

Calendar Home 구현 시 다음 규칙을 따른다.

- Calendar Home은 height: 100vh 기준으로 구현한다.
- body와 html에는 Calendar Home에서 세로 스크롤이 생기지 않아야 한다.
- Calendar는 Top Bar 아래 남은 화면 전체를 사용한다.
- 전체 월간 달력 6주가 한 화면 안에 보여야 한다.
- Calendar 내부에는 세로 스크롤바가 생기지 않아야 한다.
- Top Navigation의 새 공고 등록 버튼만 사용한다.
- 지원 마감은 Danger 계열로 표시하고, 그 외 일정은 Primary 계열로 표시한다.
- 일정은 색상만으로 구분하지 않고 일정 유형 전체명을 함께 표시한다.
- 한 날짜의 일정이 셀 높이를 초과하면 `+N개 더보기`를 표시한다.
- `+N개 더보기` 클릭 시 해당 날짜의 전체 일정을 Modal로 표시한다.
- Calendar Home 구현 시 페이지 자체 스크롤을 만들지 않는다.

---

## 5.2 Sprint5 이후 개발 원칙

Sprint5부터는 문서를 새로 수정하지 않는다.

기존 문서를 기준으로 아래 순서대로 기능만 구현한다.

- Sprint5: Job Detail
- Sprint6: Applications
- Sprint7: Essay
- Sprint8: Interview
- Sprint9: Experience
- Sprint10: Profile
- Sprint11: Archive
- Sprint12: Search
- Sprint13: Final QA

---

# 6. Milestones

Milestone 1

기본 프로젝트 생성

Milestone 2

공통 UI 구축

Milestone 3

Calendar Home 완성

Milestone 4

공고 관리 완성

Milestone 5

Profile 완성

Milestone 6

Experience 완성

Milestone 7

JSON Backup

Milestone 8

MVP Release

---

# 7. AI Development Workflow

Cursor는 항상 다음 순서를 따른다.

① 관련 문서를 읽는다.

↓

② 구현 계획을 작성한다.

↓

③ 사용자 승인을 기다린다.

↓

④ 구현한다.

↓

⑤ 변경 사항을 요약한다.

↓

⑥ 다음 작업을 제안한다.

절대로 바로 코드를 작성하지 않는다.

---

# 8. Prompt Workflow

모든 작업은 작은 단위로 진행한다.

좋은 예

"Calendar Home 화면만 구현"

"Calendar 컴포넌트만 구현"

"Application Table만 구현"

나쁜 예

"CareerBase 전체 만들어줘"

---

# 9. Feature Development Rules

새로운 기능을 만들기 전 반드시 확인한다.

- PRD
- Database
- UIUX
- DesignSystem

문서와 충돌하면 구현하지 않는다.

---

# 10. Code Review Rules

기능 구현 후 반드시 확인한다.

□ TypeScript 오류

□ ESLint 오류

□ Build 성공

□ Responsive 확인

□ DesignSystem 준수

□ Auto Save 확인

□ LocalStorage 저장 확인

---

# 11. Git Commit Rules

Commit Prefix

```
feat:
fix:
refactor:
style:
docs:
chore:
```

예시

```
feat: add dashboard calendar

fix: application status bug

docs: update database document
```

작은 기능 단위로 Commit 한다.

---

# 12. Testing Checklist

모든 기능은 아래 항목을 확인한다.

Calendar Home

□ 정상 표시

□ 100vh 적용 여부

□ 페이지 스크롤 없음

□ 월간 달력 6주가 한 화면에 모두 표시되는지

□ 달력 내부 스크롤 없음

□ 지원 마감 Danger 계열 표시

□ 그 외 일정 Primary 계열 표시

□ 일정 유형 전체명 표시

□ `+N개 더보기` Modal 확인

□ Top Navigation 버튼만 존재

□ `/calendar`에서 `/`로 redirect

Calendar

□ 일정 표시

Applications

□ CRUD

Job Detail

□ 탭 이동

Essay

□ 자동 저장

Interview

□ 자동 저장

Experience

□ CRUD

Profile

□ CRUD

Archive

□ 복원

Settings

□ Backup

□ Restore

---

# 13. Bug Fix Rules

버그 수정 시

새로운 기능을 추가하지 않는다.

버그 원인 분석

↓

수정

↓

기존 기능 영향 확인

↓

Commit

순서로 진행한다.

---

# 14. Refactoring Rules

Refactoring은

기능 변경 없이

코드 구조만 개선한다.

다음 경우만 진행한다.

- 중복 제거

- 가독성 향상

- Component 분리

- Type 정리

---

# 15. Feature Addition Rules

새 기능을 추가하기 전

다음을 확인한다.

PRD 수정 필요?

Database 수정 필요?

UIUX 수정 필요?

DesignSystem 수정 필요?

필요하면 문서를 먼저 수정한다.

---

# 16. Documentation Rules

문서가 코드보다 우선한다.

문서를 수정하지 않고

기능을 변경하지 않는다.

새로운 기능은

관련 문서를 먼저 업데이트한다.

---

# 17. Release Checklist

Release 전 확인

□ Build 성공

□ TypeScript 오류 없음

□ ESLint 오류 없음

□ LocalStorage 저장 확인

□ JSON Backup 확인

□ JSON Restore 확인

□ Mobile 확인

□ Desktop 확인

□ 빈 화면 확인

□ Error 처리 확인

---

# 18. Deployment

배포는 Vercel을 사용한다.

main 브랜치만 배포한다.

환경 변수는

.env.local

을 사용한다.

---

# 19. Success Criteria

CareerBase MVP는 다음 조건을 만족해야 한다.

- 모든 CRUD 정상 동작

- Auto Save 정상 동작

- Calendar Home 정상 동작

- Calendar 정상 동작

- Responsive 지원

- JSON Backup 지원

- JSON Restore 지원

- LocalStorage 안정성 확보

- TypeScript 오류 없음

- Build 성공

- Vercel 배포 성공

---

# 20. Development Mindset

CareerBase는 단순한 취업 관리 웹사이트가 아니다.

사용자의 모든 커리어 데이터가 축적되는

AI Career Database이다.

모든 개발은

"사용자가 매일 사용하는 서비스"

라는 관점에서 진행한다.

기능보다 사용성을 우선하고,

복잡함보다 단순함을 우선한다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final