# CareerBase
# Information Architecture

Version: 1.0.0

Related Documents
- PRD.md
- UserFlow.md

---

# 1. Purpose

본 문서는 CareerBase의 전체 정보 구조(Information Architecture)를 정의한다.

CareerBase는 "공고(Job) 중심 Workflow"를 기반으로 설계하며,
모든 화면과 데이터는 본 문서를 기준으로 구성한다.

---

# 2. Global Navigation

Desktop

Sidebar Navigation

- Calendar
- Jobs
- Applications
- Interview
- Profile
- Archive
- Settings

Sidebar는 접기/펼치기를 지원한다.

---

Mobile

Bottom Navigation

- Calendar
- Jobs
- Profile
- More

More

- Applications
- Interview
- Archive
- Settings

---

# 3. Calendar Home

서비스의 시작 화면

Route: `/`

## Sections

### Monthly Calendar

- 월간 달력
- 오늘 날짜 강조
- 일정 색상 표시

---

### Event Display

- 지원 마감은 Danger 계열로 표시
- 그 외 일정은 Primary 계열로 표시
- 일정 유형 전체명과 기업명을 함께 표시

---

### More Events

한 날짜에 표시 가능한 일정을 초과하면 `+N개 더보기`를 표시한다.

`+N개 더보기` 클릭 시 해당 날짜의 전체 일정을 Modal로 표시한다.

---

# 4. Calendar

`/calendar`는 `/`로 redirect한다.

## Header

- 오늘
- 이전 달
- 다음 달
- 월 선택

---

## Calendar Body

월간 달력

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

날짜 선택

↓

해당 일정 목록

↓

공고 상세

---

# 5. Jobs

## Header

검색

필터

정렬

새 공고 등록

---

## Filters

- 전체
- 관심
- 준비 중
- 제출 완료
- 전형 진행
- 최종 결과

---

## Job Card

기업명

공고명

직무

D-Day

현재 상태

클릭

↓

Job Detail

---

# 6. Job Detail

상단

기업명

공고명

현재 상태

지원 마감 D-Day

Breadcrumb

예)

Calendar

>

Jobs

>

KT IT기획

---

## Tabs

- 공고정보
- 자소서
- 면접
- 일정
- 지원현황
- 메모

모든 탭은 자유롭게 이동 가능하다.

탭 이동 시 데이터는 유지된다.

---

# 7. 공고정보

- 기업명
- 공고명
- 직무
- 고용형태
- 신입/경력
- 근무지
- 공고 URL
- 공고 내용
- 자격요건

---

# 8. 자소서

구조

기업

↓

공고

↓

문항

↓

답변

↓

제출본

↓

지원 결과

---

기능

- 문항 추가
- 문항 수정
- 답변 저장
- 첨부파일 등록
- 제출본 확인

---

# 9. 면접

## 면접 준비

- 예상 질문
- 답변

---

## 면접 완료

- 실제 받은 질문
- 회고

---

# 10. 일정

공고 관련 일정

- 지원 시작
- 지원 마감
- 서류 발표
- 인적성
- 면접
- 최종 발표

일정 수정 가능

---

# 11. 지원현황

Kanban Board

Columns

관심

↓

준비 중

↓

제출 완료

↓

전형 진행

↓

최종 결과

드래그 앤 드롭 지원

---

# 12. 메모

공고 관련 자유 메모

Markdown 지원 (향후)

자동 저장

---

# 13. Applications

지원한 공고 관리 공간

## Sections

- 진행 중
- 제출 완료
- 결과 대기
- 종료

검색

필터

정렬

지원 결과 확인

---

# 14. Interview

면접 목록

검색

필터

예정

완료

기업별 조회

공고별 조회

---

# 15. Profile

## Sections

### 학력

- 고등학교
- 대학교
- 대학원(향후 확장)

---

### 경력

다중 입력 지원

---

### 자격증

다중 입력 지원

---

### 어학

다중 입력 지원

---

### 수상

다중 입력 지원

---

### 학내외활동

다중 입력 지원

---

### 기타

취미

특기

---

모든 섹션

CRUD 지원

"+ 추가" 버튼 제공

---

# 16. Experience Library

경험 카드 관리

카드 구조

- 제목
- 상황(Situation)
- 문제(Task)
- 행동(Action)
- 결과(Result)
- 핵심 역량
- 태그

향후

- AI
- 자소서
- 면접

에서 재사용

---

# 17. Archive

지원 종료 공고 보관

Archive는 삭제가 아니다.

기능

- 검색
- 조회
- 복원

수정은 불가

복원 후 수정 가능

---

# 18. Search

Global Search

검색 대상

- 공고
- 자소서
- 면접
- 메모
- Experience Library
- Profile

LIKE 검색 지원

---

# 19. Settings

- JSON Export
- JSON Import
- 데이터 백업
- 데이터 복원
- 데이터 초기화
- 서비스 정보

데이터 초기화 전

반드시

백업 안내 모달 표시

---

# 20. Navigation Rules

Desktop

Sidebar Navigation

Collapse 지원

Breadcrumb 제공

---

Mobile

Bottom Navigation

조회 중심 UX

빠른 기능

- 공고 등록
- 지원 상태 변경

---

# 21. Responsive Layout

Desktop

3 Column Layout

---

Tablet

2 Column Layout

---

Mobile

1 Column Layout

---

# 22. Information Principles

CareerBase는 아래 원칙을 따른다.

## Job First

모든 데이터는 공고(Job)를 기준으로 연결한다.

---

## Single Source of Truth

동일 데이터는 한 곳에서만 관리한다.

---

## Workflow First

기능보다 취업 준비 흐름을 우선한다.

---

## Reusable Data

한 번 입력한 데이터는 반복 재사용할 수 있어야 한다.

---

## Minimal UI

복잡함보다 직관성을 우선한다.

---

## Auto Save

모든 입력은 자동 저장을 기본으로 한다.

---

# 23. Future Expansion

v2

- AI 공고 분석
- AI 경험 추천
- AI 자소서 추천

v3

- 로그인
- Supabase
- 다중 사용자

v4

- AI 면접 코치
- AI 커리어 분석
- AI 성장 리포트

---

# 24. Done Definition

Information Architecture는 아래 조건을 만족해야 한다.

- 전체 메뉴 구조 정의 완료
- 모든 화면 구조 정의 완료
- 모든 상세 화면 구조 정의 완료
- Navigation 정의 완료
- Responsive 구조 정의 완료
- Information Principle 정의 완료