# CareerBase
# UI / UX Design Specification

Version: 1.0.0
Status: Final

Related Documents

- 01_PRD.md
- 02_UserFlow.md
- 03_InformationArchitecture.md
- 04_Database.md

---

# 1. Document Purpose

본 문서는 CareerBase의 사용자 경험(UX)과 화면(UI)의 기준을 정의한다.

Cursor는 본 문서를 기준으로 모든 화면을 구현한다.

목표는 "기능이 많은 서비스"가 아니라

**사용자가 매일 사용하고 싶은 AI 커리어 관리 서비스**를 만드는 것이다.

---

# 2. UX Philosophy

CareerBase는 단순한 취업 관리 서비스가 아니다.

사용자의 모든 커리어 데이터가 축적되는

**AI Career Database**이다.

따라서 UX는 다음 원칙을 따른다.

---

## 2.1 Simple

사용자는 고민하지 않아야 한다.

버튼의 의미가 명확해야 한다.

입력 순서가 자연스러워야 한다.

---

## 2.2 Fast

자주 사용하는 기능은

최소 클릭으로 접근 가능해야 한다.

목표

- 새 공고 등록 : 30초 이내
- 오늘 일정 확인 : 3초 이내
- 자소서 작성 화면 진입 : 2클릭 이내

---

## 2.3 Calm

취업 준비는 스트레스가 많다.

따라서 화면은 화려하지 않고

편안해야 한다.

과한 애니메이션을 사용하지 않는다.

---

## 2.4 Data First

CareerBase는 데이터가 가장 중요하다.

장식보다 정보 전달을 우선한다.

---

## 2.5 Desktop First

사용자는

- 자소서 작성
- 면접 준비
- 이력 관리

등을 대부분 PC에서 진행한다.

따라서 PC 경험을 우선 설계한다.

---

## 2.6 Mobile Companion

모바일은

빠른 확인과 간단한 입력이 목적이다.

모바일에서 가장 많이 사용하는 기능

- 일정 확인
- 지원현황 변경
- 새 공고 등록

---

# 3. Design Direction

CareerBase의 디자인 컨셉은

**Linear 70% + Apple 30%**

이다.

키워드

- Premium
- Professional
- Minimal
- Calm
- Productivity

사용자는

"취업 준비 서비스"

보다

"고급 생산성 툴"

이라는 느낌을 받아야 한다.

---

# 4. Design Principles

## 4.1 White Space

여백을 적극적으로 사용한다.

답답한 화면을 만들지 않는다.

---

## 4.2 Card UI

모든 주요 정보는 Card 형태로 표현한다.

예

- 일정
- 자소서
- 면접
- 경험
- TODO

---

## 4.3 Rounded Corner

카드는 너무 둥글지도,

너무 각지지도 않는다.

적당한 Radius를 사용한다.

---

## 4.4 Soft Shadow

그림자는 최소한만 사용한다.

입체감보다 정돈된 느낌을 우선한다.

---

## 4.5 Neutral Color

채도 높은 색은 최소화한다.

강조는 파란색 하나만 사용한다.

---

# 5. Navigation Structure

메인 메뉴

```
Calendar

Applications

Experience Library

Profile

Archive

Settings
```

Calendar가 항상 첫 화면이다.

---

# 6. Global Layout

Desktop

```
──────────────────────────
Sidebar

Main Content

Right Utility Area
──────────────────────────
```

Sidebar는 고정된다.

Main Content만 스크롤된다.

단, Calendar Home은 예외로 Desktop에서 페이지 자체 스크롤을 사용하지 않는다.

---

Mobile

```
──────────────

Top Bar

Content

Bottom Navigation

──────────────
```

Bottom Navigation을 사용한다.

---

# 7. Sidebar

항상 표시

메뉴

- Calendar
- Applications
- Experience
- Profile
- Archive
- Settings

현재 화면은 파란색 Indicator로 표시한다.

Sidebar는 접기/펼치기를 지원한다.

---

# 8. Top Navigation

상단에는

왼쪽

- 현재 페이지 제목

오른쪽

- 검색
- 새 공고 등록
- 설정

을 표시한다.

---

# 9. Calendar Home Screen

Calendar는 사용자가 가장 먼저 보는 메인 화면이다.

## 9.1 Desktop Calendar Home Layout Rules

Calendar Home은 항상 브라우저 한 화면(100vh) 안에서 모두 보여야 한다.

페이지 자체에는 세로 스크롤이 발생하지 않는다.

첫 화면은

월간 달력이 전체 화면으로 보여야 한다.

레이아웃

```
┌──────────────────────────────────────────┐
│ 월간 달력 전체 화면                      │
└──────────────────────────────────────────┘
```

Calendar는 Top Bar 아래 남은 화면 전체를 사용한다.

월간 달력 전체 6주가 한 화면 안에 모두 보이도록 한다.

달력 내부에는 세로 스크롤이 생기지 않는다.

월 제목, 이전/다음/오늘 버튼은 한 줄 헤더로 정리한다.

불필요한 설명 문구와 여백은 축소한다.

Calendar가 좌우 전체 너비를 사용하도록 한다.

새 공고 등록은 Top Navigation 버튼만 사용한다.

---

Calendar에서 보여주는 정보

- 월간 달력
- 일정 유형 전체명
- 기업명
- `+N개 더보기`

---

일정 유형 표시 규칙

- 지원 마감은 Danger 계열 텍스트와 연한 Danger 배경을 사용한다.
- 그 외 일정은 Primary 계열 텍스트와 연한 Primary 배경을 사용한다.
- 색상만으로 구분하지 않고 일정 유형 전체명을 함께 표시한다.

---

일정 표시 형식

- 지원 시작 - 기업명
- 지원 마감 - 기업명
- 서류 발표 - 기업명
- 인적성 - 기업명
- 1차 면접 - 기업명
- 2차 면접 - 기업명
- 최종 발표 - 기업명

일정명은 축약하지 않는다.

기업명이 길 경우 말줄임표를 사용한다.

`+N개 더보기` 클릭 시 해당 날짜의 전체 일정을 Modal로 표시한다.

---

# 10. Calendar

Calendar는 CareerBase의 핵심 기능이다.

월간 보기만 제공한다.

(주간보기는 MVP 제외)

표시되는 일정

- 지원 시작
- 지원 마감
- 서류 발표
- 인적성
- 1차 면접
- 2차 면접
- 최종 발표

각 일정은 색상으로 구분한다.

클릭하면

조회 전용 일정 상세 Modal을 표시한다.

---

# 11. Responsive Rule

Desktop

Calendar Home은 Top Bar 아래 남은 화면 전체를 사용한다.

Calendar는 좌우 전체 너비를 사용한다.

월간 달력 전체 6주가 한 화면 안에 보여야 한다.

달력 내부에는 세로 스크롤이 생기지 않아야 한다.

Mobile

Calendar를 가장 위에 배치한다.

오늘 일정은 그 아래에 배치한다.

Tablet과 Mobile에서는 자연스러운 세로 스크롤을 허용할 수 있다.

---

# 12. Empty State

데이터가 없을 경우

빈 화면을 보여주지 않는다.

예시

```
아직 등록한 공고가 없습니다.

새 공고를 등록해보세요.

[ 공고 등록 ]
```

모든 화면은 Empty State를 가진다.

---

# 13. Loading

Loading은 Skeleton UI를 사용한다.

Spinner만 사용하는 화면은 만들지 않는다.

---

# 14. Save Feedback

자동 저장 시

상단 우측에

```
저장 중...

저장 완료
```

를 표시한다.

사용자는 저장 여부를 항상 확인할 수 있어야 한다.

---

# 15. UX Goals

CareerBase의 UX 목표

- 일정 확인 3초 이내
- 새 공고 등록 30초 이내
- 자소서 화면 진입 2클릭 이내
- 모바일 한 손 사용 가능
- 반복 입력 최소화
- 사용자가 "어디서 무엇을 해야 하는지" 고민하지 않는 UI

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final
---

# 16. Applications

지원현황은 CareerBase의 두 번째 핵심 화면이다.

PC에서는 표(Table) 형태를 기본으로 제공한다.

Mobile에서는 카드(Card) 형태를 사용한다.

---

## 16.1 Desktop Layout

표 컬럼

- 기업명
- 공고명
- 직무
- 지원상태
- D-Day
- 지원마감일
- 최근 수정일

상단에는

- 검색
- 상태 필터
- 정렬
- 새 공고 등록 버튼

을 제공한다.

---

## 16.2 Mobile Layout

모바일에서는 카드 형태를 사용한다.

카드에는

- 기업명
- 공고명
- 현재 상태
- D-Day

만 표시한다.

카드를 터치하면 상세 화면으로 이동한다.

---

## 16.3 Quick Actions

공고 카드에서 바로 가능한 기능

- 상태 변경
- 상세보기
- Archive 이동

삭제는 제공하지 않는다.

---

# 17. Job Registration

새 공고 등록은

오른쪽 Slide Panel에서 진행한다.

전체 페이지 이동은 하지 않는다.

사용자는 현재 화면을 유지한 채 공고를 등록할 수 있어야 한다.

입력 항목

- 기업명
- 공고명
- 직무
- 고용형태
- 신입/경력
- 공고 URL
- 지원 시작일
- 지원 마감일
- 공고 내용
- 자격요건
- 근무지

등록 완료 시

자동으로

- Calendar
- Applications

에 즉시 반영한다.

---

# 18. Job Detail

공고 상세는 하나의 공고를 중심으로 모든 정보를 관리하는 화면이다.

상단에는 항상

- 기업명
- 공고명
- 현재 지원상태
- D-Day

를 표시한다.

---

## 18.1 Tabs

공고 상세 탭

- 공고정보
- 자소서
- 면접
- 일정
- 지원현황

탭 이동 시 화면 전체가 변경된다.

---

# 19. Job Information

공고정보 탭에는

등록했던 공고 정보를 보여준다.

항목

- 기업명
- 공고명
- 직무
- 공고 URL
- 자격요건
- 공고내용
- 근무지
- 지원 시작일
- 지원 마감일

상단 우측

[ 수정 ]

버튼 제공

---

# 20. Application Status

지원현황 탭에서는

현재 진행 상태를 변경한다.

지원상태 변경 방식

① Drag & Drop

② Dropdown

둘 다 지원한다.

사용자는 원하는 방식을 사용할 수 있다.

---

지원 상태 변경 시

Calendar

통계

가 즉시 업데이트되어야 한다.

---

# 21. Essay

자소서는

문항(Card) 단위로 관리한다.

레이아웃

```
────────────────────

문항

답변

첨부파일

────────────────────

문항

답변

첨부파일

────────────────────
```

문항은 원하는 만큼 추가 가능하다.

---

## 21.1 Essay Card

하나의 카드

- 문항
- 최종 제출 답변
- 첨부파일
- Experience 연결

---

## 21.2 Auto Save

답변 입력 후

약 1초 뒤 자동 저장한다.

상단에

저장중...

저장완료

상태를 표시한다.

---

# 22. Interview

면접은

상단 탭으로 구분한다.

```
면접 준비

면접 완료
```

---

## 22.1 Interview Preparation

표시 내용

- 예상 질문
- 답변
- Experience 연결

AI 추천 질문은

상단에서 생성할 수 있다.

---

## 22.2 Completed Interview

면접 종료 후

실제 받은 질문을 기록한다.

항목

- 질문
- 내 답변 메모
- 다음 개선점

---

# 23. Experience Library

Experience는

모든 경험을 관리하는 공간이다.

카드 형태를 사용한다.

카드에는

- 제목
- 핵심 역량
- 결과

를 표시한다.

---

Experience 클릭 시

STAR 구조를 보여준다.

- Situation

- Task

- Action

- Result

---

Experience는

자소서

면접

모두 연결 가능하다.

---

# 24. Profile

Profile은

Accordion 구조를 사용한다.

섹션

- 개인정보
- 고등학교
- 대학교
- 경력
- 어학
- 자격증
- 수상
- 활동
- 기타

---

각 섹션은

접기

펼치기

가능하다.

---

다중 입력 가능한 항목은

우측 상단

+ 추가

버튼을 제공한다.

---

수정은

항목 우측

수정

삭제

버튼으로 진행한다.

---

# 25. Archive

Archive는

종료된 지원을 보관하는 공간이다.

기본 화면은

표 형태를 사용한다.

Archive에서는

- 조회
- 검색
- 복원
- 영구삭제

를 제공한다.

영구 삭제는

2단계 확인 후 진행한다.

---

# 26. Search

검색은

상단 Global Search를 사용한다.

검색 대상

- 기업명
- 공고명
- 자소서
- 면접
- Experience
- 메모

검색 결과는

카드 형태로 보여준다.

---

# 27. Statistics

지원 통계는 별도 화면 또는 지원현황 맥락에서 표시한다.

항목

- 전체 지원
- 진행중
- 최종합격
- 최종불합격
- 지원포기

차트보다

숫자 중심으로 표현한다.

---

# 28. Notifications

MVP에서는

푸시 알림을 제공하지 않는다.

대신

Calendar에서

오늘 일정

이번 주 일정

D-Day

를 항상 보여준다.

---

# 29. Mobile UX

모바일에서는

입력보다 확인을 우선한다.

가장 중요한 기능

① 일정 확인

② 지원상태 변경

③ 새 공고 등록

---

자소서 작성

Experience 작성

Profile 입력

등은

PC 사용을 권장한다.

---

# 30. Interaction Rules

버튼 클릭 시

즉각적인 피드백을 제공한다.

Hover

Focus

Pressed

Disabled

상태를 모두 제공한다.

---

삭제 버튼은

Danger Color를 사용한다.

---

저장은

Primary Color를 사용한다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final
---

# 31. Empty State

모든 화면은 데이터가 없을 경우에도 사용자가 다음 행동을 할 수 있도록 안내해야 한다.

Empty State는 단순히 "데이터가 없습니다."가 아니라
다음 행동을 유도하는 구조를 사용한다.

예시

Applications

```
아직 등록된 공고가 없습니다.

취업 준비를 시작하려면
첫 번째 공고를 등록해보세요.

[ 새 공고 등록 ]
```

Experience Library

```
아직 저장된 경험이 없습니다.

프로젝트, 대외활동, 인턴 경험 등을
기록해두면 자소서와 면접에서 재사용할 수 있습니다.

[ 경험 추가 ]
```

Archive

```
보관된 공고가 없습니다.
```

---

# 32. Loading

모든 화면은 Skeleton UI를 기본으로 사용한다.

Spinner만 사용하는 화면은 만들지 않는다.

예시

Calendar Home

- Calendar Skeleton
- Event Skeleton

Applications

- Table Skeleton

Profile

- Accordion Skeleton

---

# 33. Error State

사용자가 이해할 수 있는 문장을 사용한다.

좋은 예

```
공고를 저장하지 못했습니다.

잠시 후 다시 시도해주세요.
```

나쁜 예

```
500 Internal Server Error
```

기술적인 오류 메시지는 사용자에게 직접 노출하지 않는다.

---

# 34. Toast Message

짧은 작업 결과는 Toast로 안내한다.

예시

```
저장되었습니다.

공고가 등록되었습니다.

삭제되었습니다.

Archive로 이동했습니다.
```

Toast 위치

Desktop

우측 상단

Mobile

하단 중앙

노출 시간

약 2~3초

---

# 35. Modal

Modal은 중요한 작업에만 사용한다.

사용 대상

- Archive 이동
- 영구 삭제
- 데이터 초기화
- 백업 불러오기

취소 버튼을 항상 제공한다.

Danger Action은 우측에 배치한다.

---

# 36. Responsive Rules

Desktop

1200px 이상

Sidebar 고정

3열 레이아웃 사용 가능

Tablet

768~1199px

Sidebar 축소

2열 레이아웃

Mobile

767px 이하

Bottom Navigation 사용

1열 레이아웃

Card UI 사용

---

# 37. Mobile Rules

모바일에서는

입력보다 조회를 우선한다.

우선순위

① 일정 확인

② 지원상태 변경

③ 공고 등록

④ TODO 확인

긴 자소서 작성은 권장하지 않는다.

---

# 38. Accessibility

모든 버튼은 충분한 크기를 가진다.

최소 터치 영역

44px × 44px

색상만으로 상태를 구분하지 않는다.

예

색상 + Badge

색상 + Icon

색상 + Text

키보드만으로도 모든 기능을 사용할 수 있어야 한다.

---

# 39. Animation

애니메이션은 최소화한다.

사용 위치

- 페이지 전환
- Accordion
- Modal
- Toast
- Dropdown

Duration

약 150~250ms

Bounce Animation은 사용하지 않는다.

---

# 40. Icon Style

아이콘은 하나의 스타일을 유지한다.

권장

Lucide Icons

라인 아이콘을 기본으로 사용한다.

Filled Icon은 최소화한다.

---

# 41. Card Design

모든 카드 디자인은 동일한 규칙을 따른다.

- 흰색 배경
- 연한 Border
- 약한 Shadow
- 적당한 Radius

카드 내부 여백은 충분히 확보한다.

---

# 42. Button Rules

Primary

파란색

주요 액션

예

- 저장
- 등록
- 완료

Secondary

회색

보조 액션

예

- 취소
- 뒤로가기

Danger

빨간색

삭제

초기화

영구삭제

---

# 43. Input Rules

Input은 항상 Label을 가진다.

Placeholder는 설명용으로만 사용한다.

긴 입력은 Textarea를 사용한다.

자동 저장되는 입력은

상단에

```
저장 중...

저장 완료
```

를 표시한다.

---

# 44. UX Checklist

CareerBase는 다음 조건을 만족해야 한다.

□ Calendar에서 일정을 3초 안에 확인 가능

□ 새 공고 등록 30초 이내 완료

□ 지원 상태 변경이 쉬움

□ 자소서 작성이 편안함

□ Experience 재사용이 쉬움

□ 반복 입력 최소화

□ PC에서 장시간 사용해도 피로하지 않음

□ 모바일에서 빠른 확인 가능

□ 데이터 구조가 직관적임

□ 어디서 무엇을 해야 하는지 항상 알 수 있음

---

# 45. Final Design Goal

CareerBase의 최종 목표는

"가장 깔끔하고 오래 사용해도 피로하지 않은
AI 커리어 데이터베이스"

를 만드는 것이다.

사용자는 CareerBase를 사용할 때

"취업 사이트"

가 아니라

"나만의 커리어 운영 시스템"

이라는 느낌을 받아야 한다.

Linear의 미니멀함과

Apple의 정돈된 사용성을 결합하여

정보 중심의 프리미엄 UX를 제공한다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final