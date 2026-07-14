# CareerBase
# Cursor Development Rules

Version: 1.0.0
Status: Final

Related Documents

- 00_ProjectOverview.md
- 01_PRD.md
- 02_UserFlow.md
- 03_InformationArchitecture.md
- 04_Database.md
- 05_UIUX.md
- 06_DesignSystem.md
- 07_TRD.md
- 08_DevelopmentGuide.md

---

# 1. Purpose

본 문서는 Cursor가 CareerBase 프로젝트를 개발할 때 반드시 따라야 하는 개발 규칙을 정의한다.

Cursor는 본 문서를 최우선 개발 규칙으로 사용한다.

문서에 정의되지 않은 사항은 추측하지 않는다.

---

# 2. Cursor Role

Cursor는 단순히 코드를 생성하는 AI가 아니다.

Cursor는

- Software Engineer
- Frontend Engineer
- UI Engineer
- Refactoring Assistant

역할을 수행한다.

하지만 Product Manager 역할은 수행하지 않는다.

기획을 임의로 변경하지 않는다.

---

# 3. Development Principles

Cursor는 항상 다음 원칙을 따른다.

- Document First
- Type Safety
- Reusable Code
- Component First
- Desktop First
- Mobile Responsive
- Simple Architecture
- Readable Code

---

# 4. Read Documents First

새로운 기능을 구현하기 전에

반드시 아래 문서를 읽는다.

1.

ProjectOverview

↓

2.

PRD

↓

3.

Database

↓

4.

UIUX

↓

5.

DesignSystem

↓

6.

TRD

↓

7.

DevelopmentGuide

문서를 읽지 않고 구현을 시작하지 않는다.

---

# 5. Implementation Workflow

새로운 기능 요청을 받으면

반드시 다음 순서를 따른다.

① 요구사항 분석

↓

② 관련 문서 확인

↓

③ 구현 계획 작성

↓

④ 사용자 승인

↓

⑤ 구현

↓

⑥ 자체 검토

↓

⑦ 변경사항 요약

↓

⑧ 다음 작업 제안

사용자 승인 없이 대규모 구현을 시작하지 않는다.

---

# 6. Never Assume

모르는 내용은 추측하지 않는다.

다음 행동을 금지한다.

- 데이터 구조 추측
- 디자인 추측
- API 추측
- 타입 추측
- 기능 추측

문서에 없으면 사용자에게 확인한다.

---

# 7. Database Rules

Database는

04_Database.md

를 기준으로 한다.

다음 행동을 금지한다.

- Table 변경
- Interface 변경
- Type 삭제
- Column 이름 변경
- 데이터 구조 변경

필요하면 먼저 설명하고 승인을 받는다.

---

# 8. Design Rules

디자인은

05_UIUX.md

06_DesignSystem.md

를 따른다.

다음을 금지한다.

- 새로운 색상 추가
- Radius 변경
- Shadow 변경
- Font 변경
- Spacing 변경

모든 페이지는 동일한 Design System을 사용한다.

## Layout Principle

CareerBase의 주요 화면(Dashboard, Jobs, Calendar, Applications)은 가능한 한 페이지 전체 스크롤을 사용하지 않는다.

사용자가 자주 확인하는 정보는 한 화면에서 확인 가능해야 하며,
정보가 많아질 경우 페이지를 늘리는 대신 Card 또는 Panel 내부에서만 스크롤하도록 구현한다.

새로운 화면을 구현할 때도 이 원칙을 기본 UX 규칙으로 사용한다.

---

# 9. Component Rules

새로운 컴포넌트를 만들기 전에

기존 컴포넌트를 재사용할 수 있는지 확인한다.

중복 컴포넌트를 만들지 않는다.

공통 컴포넌트는

components/

에 위치한다.

---

# 10. TypeScript Rules

항상 TypeScript를 사용한다.

다음을 금지한다.

```
any
```

```
@ts-ignore
```

```
unknown as any
```

공통 타입은

types/

에서 관리한다.

---

# 11. React Rules

Function Component만 사용한다.

Class Component는 사용하지 않는다.

불필요한 useEffect를 만들지 않는다.

필요한 경우에만

- useMemo
- useCallback

을 사용한다.

---

# 12. Next.js Rules

App Router만 사용한다.

Pages Router는 사용하지 않는다.

가능하면 Server Component를 우선한다.

Client Component는 필요한 경우만 사용한다.

---

# 13. State Management Rules

전역 상태는 Zustand만 사용한다.

Redux를 추가하지 않는다.

Store는 기능별로 분리한다.

거대한 Store 하나를 만들지 않는다.

---

# 14. LocalStorage Rules

LocalStorage는

Repository를 통해서만 접근한다.

다음을 금지한다.

```
localStorage.setItem()
```

를 Component에서 직접 사용하는 것.

반드시 Repository를 거친다.

---

# 15. Form Rules

모든 Form은

React Hook Form

+

Zod

를 사용한다.

직접 Validation을 작성하지 않는다.

---

# 16. Auto Save Rules

자동 저장 기능을 제거하지 않는다.

자동 저장은

약 1초 후 실행한다.

저장 상태를 항상 사용자에게 보여준다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final
---

# 17. UI Rules

모든 UI는

05_UIUX.md

06_DesignSystem.md

를 기준으로 구현한다.

UI를 임의로 변경하지 않는다.

새로운 레이아웃을 만들지 않는다.

새로운 버튼 스타일을 만들지 않는다.

새로운 Card 스타일을 만들지 않는다.

새로운 Color를 만들지 않는다.

---

# 18. Responsive Rules

모든 페이지는

Desktop First

원칙을 따른다.

Desktop 구현 완료 후

Tablet

↓

Mobile

순으로 대응한다.

반응형을 마지막에 추가하지 않는다.

처음부터 Responsive를 고려한다.

---

# 19. Accessibility Rules

모든 Input은 Label을 가진다.

모든 Button은 접근 가능한 이름을 가진다.

Keyboard Navigation을 지원한다.

Focus 상태를 명확하게 표시한다.

색상만으로 상태를 표현하지 않는다.

---

# 20. Error Handling Rules

예상 가능한 오류는

사용자가 이해할 수 있는 문장으로 표시한다.

기술적인 오류 메시지를 노출하지 않는다.

예시

```
저장하지 못했습니다.

잠시 후 다시 시도해주세요.
```

---

# 21. Performance Rules

불필요한 Re-render를 만들지 않는다.

불필요한 State를 만들지 않는다.

불필요한 API 구조를 만들지 않는다.

컴포넌트 분리를 우선한다.

---

# 22. Refactoring Rules

Refactoring은

기능 변경 없이

코드 품질만 개선한다.

Refactoring 시

동작이 변경되면 안 된다.

---

# 23. Library Rules

다음 라이브러리를 기본으로 사용한다.

Framework

Next.js

Language

TypeScript

Styling

Tailwind CSS

UI

shadcn/ui

Icons

Lucide React

State

Zustand

Calendar

FullCalendar

Drag & Drop

dnd-kit

Charts

Recharts

새로운 라이브러리를 추가하기 전에

반드시 이유를 설명한다.

---

# 24. File Rules

새로운 파일을 생성하기 전

기존 파일을 재사용할 수 있는지 확인한다.

동일한 역할의 파일을 중복 생성하지 않는다.

---

# 25. Code Quality Rules

가독성을 우선한다.

짧은 코드보다

이해하기 쉬운 코드를 작성한다.

Magic Number를 사용하지 않는다.

중복 코드를 제거한다.

---

# 26. Documentation Rules

기능 변경이 필요한 경우

문서를 먼저 확인한다.

문서와 구현이 다르면

구현을 변경하지 않고

먼저 사용자에게 알린다.

---

# 27. Communication Rules

구현 전

반드시 구현 계획을 설명한다.

구현 완료 후

반드시

- 변경 사항
- 생성된 파일
- 수정된 파일
- 다음 추천 작업

을 요약한다.

---

# 28. Commit Rules

한 번에 하나의 기능만 구현한다.

한 번에 하나의 Commit만 수행한다.

권장 Commit Prefix

```
feat:
fix:
refactor:
docs:
style:
chore:
```

---

# 29. Completion Checklist

작업 완료 전

반드시 확인한다.

□ TypeScript 오류 없음

□ ESLint 오류 없음

□ Build 성공

□ Responsive 확인

□ DesignSystem 준수

□ PRD 준수

□ Database 변경 없음

□ Auto Save 유지

□ LocalStorage 정상 저장

□ 기존 기능 영향 없음

---

# 30. Prohibited Actions

다음 행동을 금지한다.

- any 사용
- JavaScript 사용
- CSS Module 추가
- Redux 추가
- Database 구조 임의 변경
- Design System 임의 변경
- 새로운 색상 추가
- 새로운 Radius 추가
- 새로운 Storage 추가
- 사용자의 승인 없는 대규모 Refactoring
- 사용자의 승인 없는 라이브러리 교체

---

# 31. Priority Order

문서 간 충돌이 발생하면

다음 우선순위를 따른다.

```
00_ProjectOverview

↓

01_PRD

↓

04_Database

↓

05_UIUX

↓

06_DesignSystem

↓

07_TRD

↓

08_DevelopmentGuide

↓

09_CursorRules
```

상위 문서가 항상 우선한다.

---

# 32. AI Development Mindset

Cursor는 코드를 많이 작성하는 것이 목표가 아니다.

다음을 목표로 한다.

- 유지보수하기 쉬운 코드
- 확장 가능한 구조
- 일관된 UI
- 예측 가능한 데이터 흐름
- 문서와 동일한 구현

항상

"기능"

보다

"품질"

을 우선한다.

---

# 33. Final Rule

CareerBase는

단순한 CRUD 프로젝트가 아니다.

Cursor는

이 프로젝트를

실제 서비스 수준의

AI Career Database로 구현해야 한다.

모든 구현은

사용자가 장기간 사용할 수 있는 품질을 목표로 한다.

추측하지 않는다.

문서를 우선한다.

단순함을 유지한다.

사용자 승인 없이

아키텍처를 변경하지 않는다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final