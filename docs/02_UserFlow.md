# CareerBase
# User Flow Document

Version: 1.0.0
Status: Draft
Related Document: 01_PRD.md

---

# 1. Document Purpose

본 문서는 CareerBase 사용자가 서비스를 이용하는 전체 흐름(User Journey)과
각 기능 간 이동 관계를 정의한다.

CareerBase는 기능 중심이 아닌
취업 준비 Workflow 중심으로 설계한다.

사용자는 필요한 기능을 자유롭게 이동할 수 있지만,
모든 데이터는 하나의 채용공고(Job)를 기준으로 연결된다.

---

# 2. Core Workflow

CareerBase의 기본 Workflow는 아래와 같다.

공고 발견

↓

공고 등록

↓

지원 일정 등록

↓

지원현황 생성

↓

자소서 작성

↓

지원 완료

↓

면접 준비

↓

면접 완료

↓

최종 결과

↓

Archive

↓

다음 공고

※ 사용자는 어느 단계에서도 이전 단계로 자유롭게 이동할 수 있다.

---

# 3. Global Navigation

모든 화면에서는 아래 메뉴로 이동할 수 있다.

Dashboard

Calendar

Jobs

Resume

Interview

Profile

Archive

Settings

Navigation은 항상 동일한 위치에 유지한다.

Desktop

- 좌측 Sidebar

Mobile

- Bottom Navigation
- Hamburger Menu

---

# 4. First User Flow

최초 접속

↓

Welcome

↓

예시 데이터 둘러보기

또는

빈 프로젝트 시작

↓

Dashboard

↓

공고 등록

↓

첫 Workflow 시작

---

# 5. Dashboard Flow

앱 실행

↓

Dashboard

↓

이번 달 달력 확인

↓

오늘 일정 확인

↓

이번 주 일정 확인

↓

TODO 확인

↓

지원 통계 확인

↓

최근 등록 공고 확인

↓

원하는 메뉴 이동

Dashboard는 항상 서비스의 시작점이다.

---

# 6. Calendar Flow

Dashboard

↓

Calendar

↓

날짜 선택

↓

등록된 일정 확인

↓

공고 상세 이동

↓

지원현황 확인

↓

필요 시 일정 수정

↓

저장

---

# 7. Job Flow

Jobs

↓

공고 목록

↓

새 공고 등록

↓

공고 저장

↓

자동 처리

- Calendar 일정 생성

- 지원현황 "관심" 생성

↓

공고 상세 이동

↓

공고정보

↓

자소서

↓

면접

↓

일정

↓

지원현황

---

# 8. Job Detail Flow

공고 상세 화면은 아래 탭으로 구성한다.

공고정보

↓

자소서

↓

면접

↓

일정

↓

지원현황

사용자는 자유롭게 탭을 이동할 수 있다.

탭 이동 시 데이터는 유지되어야 한다.

---

# 9. Resume Flow

공고 상세

↓

자소서

↓

문항 추가

↓

답변 입력

↓

자동 저장

↓

최종 제출 답변 저장

↓

첨부파일 정보 등록

↓

지원 결과 기록

↓

종료

---

# 10. Interview Flow

공고 상세

↓

면접 준비

↓

예상 질문 등록

↓

답변 작성

↓

저장

↓

면접 완료

↓

실제 받은 질문 입력

↓

회고 작성

↓

저장

---

# 11. Profile Flow

Profile

↓

카테고리 선택

↓

새 정보 추가

↓

저장

↓

수정

↓

삭제

↓

다음 지원 시 재사용

모든 항목은 CRUD를 지원한다.

---

# 12. Multi Entry Flow

다음 항목은 다중 입력을 지원한다.

- 학력

- 경력

- 자격증

- 어학

- 수상

- 학내외활동

사용자는

"+ 추가"

버튼을 통해 여러 데이터를 등록할 수 있다.

---

# 13. Support Status Flow

공고 등록

↓

자동으로

관심

상태 생성

↓

사용자는 자유롭게 상태를 변경한다.

예시

관심

↓

준비 중

↓

제출 완료

↓

전형 진행

↓

최종 결과

상태 변경은 언제든 가능하다.

---

# 14. Non-linear Workflow

CareerBase는 선형 서비스가 아니다.

사용자는 아래처럼 자유롭게 이동한다.

예)

공고 등록

↓

자소서 작성

↓

달력 확인

↓

지원현황 변경

↓

자소서 수정

↓

면접 준비

↓

지원현황 변경

↓

달력 확인

↓

면접 회고

↓

Archive

즉,

사용자는 하나의 Workflow를 반복적으로 오가며 데이터를 수정한다.

---

# 15. Multi Job Workflow

사용자는 여러 공고를 동시에 관리한다.

예시

KT

자소서 작성 중

LG CNS

서류 결과 대기

현대오토에버

1차 면접 준비

삼성SDS

최종 결과 대기

각 공고는 서로 독립적으로 관리된다.

데이터가 서로 섞이면 안 된다.

---

# 16. Search Flow

검색창

↓

검색어 입력

↓

통합 검색

↓

공고

자소서

면접

이력

메모

Experience Library

↓

검색 결과

↓

상세 이동

LIKE 검색을 지원한다.

---

# 17. Experience Library Flow

Experience Library

↓

새 경험 등록

↓

상황

↓

문제

↓

행동

↓

결과

↓

핵심 역량 태그

↓

저장

향후

- 자소서

- 면접

- AI

에서 재사용한다.

---

# 18. Archive Flow

최종 결과 완료

↓

Archive 이동

↓

삭제하지 않음

↓

검색 가능

↓

통계 포함

↓

향후 AI 분석 포함

Archive는 삭제 기능이 아니다.

---

# 19. Backup Flow

Settings

↓

JSON Export

↓

백업 파일 저장

↓

새 브라우저

↓

JSON Import

↓

전체 데이터 복원

---

# 20. Mobile User Flow

앱 실행

↓

오늘 일정

↓

이번 주 일정

↓

달력

↓

공고 선택

↓

지원상태 변경

↓

저장

모바일에서는

조회와 간단한 수정에 최적화한다.

긴 자소서 작성과 상세 입력은 PC 사용을 권장한다.

---

# 21. Error Flow

공고 저장 실패

↓

오류 메시지 표시

↓

재시도

또는

취소

--------------------

삭제

↓

확인 모달

↓

삭제

또는

취소

--------------------

복원 실패

↓

백업 파일 확인

↓

다시 업로드

---

# 22. UX Rules

Dashboard는 항상 서비스의 시작 화면이다.

달력은 가장 먼저 보여야 한다.

공고 등록 시

지원현황과 일정을 자동 생성한다.

사용자는 언제든 이전 화면으로 이동할 수 있다.

데이터 입력 중 페이지를 이동해도
자동 저장된 내용은 유지되어야 한다.

모든 화면은

3번 이하의 클릭으로

원하는 기능에 접근할 수 있어야 한다.

---

# 23. Navigation Rules

Desktop

좌측 Sidebar Navigation 사용

Sidebar는 접기/펼치기를 지원한다.

Mobile

Bottom Navigation을 기본으로 한다.

공통적으로

Dashboard

Calendar

Jobs

Resume

Interview

Profile

Archive

Settings

어느 화면에서도 접근 가능해야 한다.

---

# 24. Done Definition

UserFlow는 아래 조건을 만족해야 한다.

- 사용자의 전체 Workflow가 정의되어 있다.
- 화면 이동이 모두 정의되어 있다.
- 반복 Workflow가 정의되어 있다.
- 다중 공고 관리가 정의되어 있다.
- 예외 상황이 정의되어 있다.
- 모바일 사용 흐름이 정의되어 있다.
- Navigation 규칙이 정의되어 있다.