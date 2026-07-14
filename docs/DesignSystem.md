# CareerBase
# Design System

Version: 1.0.0  
Status: Final

Related Documents

- 01_PRD.md
- 02_UserFlow.md
- 03_InformationArchitecture.md
- 04_Database.md
- 05_UIUX.md

---

# 1. Document Purpose

본 문서는 CareerBase에서 사용하는 모든 UI 컴포넌트의 디자인 기준을 정의한다.

모든 화면은 본 문서를 기준으로 구현한다.

Cursor는 새로운 스타일을 임의로 만들지 않는다.

---

# 2. Design Philosophy

CareerBase는

**Linear 70% + Apple 30%**

디자인 철학을 따른다.

키워드

- Premium
- Professional
- Minimal
- Calm
- Productivity

UI보다

정보 전달을 우선한다.

---

# 3. Design Tokens

Primary Color

```
#3B82F6
```

Background

```
#FAFAFA
```

Surface (Card)

```
#FFFFFF
```

Border

```
#E5E7EB
```

Text Primary

```
#111827
```

Text Secondary

```
#6B7280
```

Success

```
#22C55E
```

Warning

```
#F59E0B
```

Danger

```
#EF4444
```

---

# 4. Typography

Font Family

```
Pretendard
```

Fallback

```
system-ui
sans-serif
```

Font Weight

Regular

```
400
```

Medium

```
500
```

SemiBold

```
600
```

Bold

```
700
```

---

Font Size

Display

```
32
```

Page Title

```
28
```

Section Title

```
22
```

Card Title

```
18
```

Body

```
16
```

Small

```
14
```

Caption

```
12
```

---

# 5. Grid

Desktop

```
12 Columns
```

Tablet

```
8 Columns
```

Mobile

```
4 Columns
```

Container Max Width

```
1440px
```

---

# 6. Spacing

Base Unit

```
4px
```

Spacing Scale

```
4
8
12
16
20
24
32
40
48
64
```

기본 Component 간격

```
24px
```

---

# 7. Radius

Button

```
12px
```

Card

```
12px
```

Input

```
12px
```

Modal

```
16px
```

Badge

```
999px
```

---

# 8. Shadow

모든 Shadow는 매우 은은하게 사용한다.

Card

```
shadow-sm
```

Dropdown

```
shadow-md
```

Modal

```
shadow-lg
```

Hover 시 Shadow를 크게 증가시키지 않는다.

---

# 9. Border

Border Color

```
#E5E7EB
```

Border Width

```
1px
```

Divider도 동일한 Border Color를 사용한다.

---

# 10. Button

Height

```
48px
```

Radius

```
12px
```

Padding

```
24px
```

Button 종류

Primary

- 저장
- 등록
- 완료

Secondary

- 취소
- 뒤로가기

Danger

- 삭제
- 초기화

Ghost

- 아이콘 버튼
- Toolbar

Primary Button은

페이지당 하나를 권장한다.

---

# 11. Input

Height

```
48px
```

Radius

```
12px
```

모든 Input은 Label을 가진다.

Placeholder는 설명용으로만 사용한다.

---

# 12. Textarea

Radius

```
12px
```

기본 높이

```
160px
```

Resize는 Vertical만 허용한다.

---

# 13. Select

Select Height

```
48px
```

Radius

```
12px
```

Dropdown은 Shadow-md를 사용한다.

---

# 14. Card

배경

```
White
```

Border

```
Gray 200
```

Radius

```
12px
```

Padding

```
24px
```

Card 내부는

위→아래 순서로 정보를 배치한다.

제목

↓

본문

↓

Action

---

# 15. Badge

Radius

```
999px
```

Padding

```
8px 12px
```

Status Badge

지원전

Blue

지원중

Yellow

합격

Green

불합격

Red

Archive

Gray

---

# 16. Table

Desktop만 사용한다.

Header는 Sticky를 지원한다.

Row Hover를 제공한다.

Row Click으로 상세화면 이동한다.

Column은 사용자가 정렬할 수 있다.

---

# 17. Calendar

Apple Calendar와

Linear UI를 조합한다.

월간 보기만 지원한다.

오늘 날짜는

Primary Color로 강조한다.

일정은 Dot Indicator로 표시한다.

클릭 시 공고 상세로 이동한다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final
---

# 18. Kanban

지원현황은 Linear 스타일의 Kanban Board를 사용한다.

각 Column은 동일한 너비를 가진다.

Card는 세로로 정렬한다.

Card Hover 시

- Border 강조
- Shadow 소폭 증가

Drag & Drop을 지원한다.

Drop 가능한 위치를 시각적으로 표시한다.

Column

- 관심
- 준비 중
- 제출 완료
- 전형 진행
- 최종 결과

---

# 19. Accordion

Profile 화면은 Accordion 구조를 사용한다.

Section

- 개인정보
- 고등학교
- 대학교
- 경력
- 어학
- 자격증
- 수상
- 활동
- 기타

기본 상태

모두 펼침

Header 클릭 시

접기 / 펼치기

애니메이션은 200ms를 사용한다.

---

# 20. Modal

Modal은 중요한 작업에서만 사용한다.

사용 예

- Archive 이동
- 영구 삭제
- 데이터 초기화
- 백업 복원

Width

Desktop

```
560px
```

Mobile

```
90%
```

버튼 순서

취소

↓

확인

Danger Action은 빨간색 버튼을 사용한다.

---

# 21. Toast

Toast는 작업 결과를 간단히 안내한다.

위치

Desktop

우측 상단

Mobile

하단 중앙

노출 시간

```
2500ms
```

종류

Success

Info

Warning

Error

예시

```
저장되었습니다.

공고가 등록되었습니다.

Archive로 이동했습니다.
```

---

# 22. Empty State

모든 화면은 Empty State를 가진다.

구성

Illustration

↓

Title

↓

Description

↓

CTA Button

예시

```
아직 등록된 공고가 없습니다.

새 공고를 등록해보세요.

[ 공고 등록 ]
```

---

# 23. Icons

Icon Library

```
Lucide React
```

라인 아이콘을 기본으로 사용한다.

Filled Icon은 최소화한다.

Icon Size

Small

```
16px
```

Default

```
20px
```

Large

```
24px
```

---

# 24. Motion

모든 애니메이션은 자연스럽고 짧게 사용한다.

Duration

```
150~250ms
```

사용 위치

- Sidebar
- Accordion
- Modal
- Dropdown
- Toast
- Page Transition

Bounce Animation은 사용하지 않는다.

과한 Scale Animation도 사용하지 않는다.

---

# 25. Responsive

Desktop

```
1200px 이상
```

Sidebar 고정

3열 레이아웃

Tablet

```
768~1199px
```

Sidebar 축소

2열 레이아웃

Mobile

```
767px 이하
```

Bottom Navigation 사용

1열 레이아웃

---

# 26. Accessibility

최소 터치 영역

```
44px × 44px
```

색상만으로 정보를 전달하지 않는다.

항상

- Icon
- Badge
- Text

중 하나를 함께 사용한다.

모든 Input은 Label을 가진다.

키보드만으로 모든 기능을 사용할 수 있어야 한다.

Focus 상태를 명확하게 표시한다.

---

# 27. Component Rules

모든 컴포넌트는 동일한 디자인 규칙을 따른다.

Card

- Radius 12px
- Padding 24px

Button

- Height 48px
- Radius 12px

Input

- Height 48px

Spacing

- 기본 24px

Border

- Gray 200

Background

- White

Page Background

- Gray 50 (#FAFAFA)

---

# 28. Cursor UI Rules

Cursor는 UI 구현 시 아래 규칙을 반드시 따른다.

## General

- 항상 DesignSystem.md를 최우선으로 따른다.
- 새로운 색상을 임의로 만들지 않는다.
- 새로운 Radius를 만들지 않는다.
- 새로운 Shadow를 만들지 않는다.
- 새로운 Button 스타일을 만들지 않는다.
- 새로운 Card 스타일을 만들지 않는다.

---

## Layout

- Desktop First로 구현한다.
- Mobile Responsive를 반드시 지원한다.
- Sidebar는 Desktop에서 항상 고정한다.
- Dashboard에서는 달력이 가장 먼저 보여야 한다.

---

## Components

- Card를 기본 컨테이너로 사용한다.
- Form에는 항상 Label을 제공한다.
- Placeholder만으로 설명하지 않는다.
- Skeleton UI를 Spinner보다 우선 사용한다.
- Empty State에는 항상 CTA 버튼을 제공한다.

---

## Colors

Primary

```
#3B82F6
```

외의 강조색은 사용하지 않는다.

Danger는 삭제 계열 작업에서만 사용한다.

Success는 완료 상태에서만 사용한다.

---

## Buttons

Primary Button은 화면당 하나를 권장한다.

Secondary Button은 보조 기능에 사용한다.

Danger Button은

삭제

초기화

영구 삭제

에서만 사용한다.

---

## Forms

자동 저장되는 입력은

항상

```
저장 중...

저장 완료
```

상태를 표시한다.

---

## Consistency

모든 페이지는 동일한 Header 구조를 사용한다.

모든 Card는 동일한 Radius와 Padding을 사용한다.

모든 페이지는 동일한 Spacing 규칙을 사용한다.

UI의 일관성을 기능 추가보다 우선한다.

---

# 29. Design Checklist

□ Linear + Apple 디자인 철학을 유지한다.

□ White Space를 충분히 사용한다.

□ 정보 중심 레이아웃을 유지한다.

□ Primary Color는 Blue만 사용한다.

□ Card Radius는 12px로 통일한다.

□ Button Height는 48px로 통일한다.

□ Padding은 24px 기준을 유지한다.

□ Desktop 경험을 우선 설계한다.

□ Mobile에서는 일정 확인을 최우선으로 한다.

□ 모든 화면은 Empty State를 가진다.

□ 모든 입력은 Auto Save를 고려한다.

□ UI는 단순하고 오래 사용해도 피로하지 않아야 한다.

---

Last Updated: 2026-07-14

Version: 1.0.0

Status: Final