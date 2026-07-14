# CareerBase
## Product Requirements Document (PRD)

Version: 1.0.0  
Status: Draft  
Owner: 윤아희  
Project: CareerBase

---

# 📌 Document Statement

This document is the single source of truth for CareerBase.

If implementation conflicts with this document,
this document always takes precedence.

---

# 1. Product Overview

## Product Name

CareerBase

## Tagline

> 지원할수록 완성되는 나만의 커리어 데이터베이스.

## Mission

CareerBase는 취업 준비 과정에서 발생하는 모든 데이터를 하나의 공간에 모아 관리하고,
반복되는 입력과 기록을 줄여 사용자가 취업 준비에 집중할 수 있도록 돕는다.

## Vision

CareerBase는 단순한 일정 관리 서비스가 아니다.

CareerBase는

채용공고

↓

지원

↓

자소서

↓

면접

↓

결과

↓

Archive

↓

다음 지원

이라는 하나의 Workflow를 중심으로
취업 준비의 모든 데이터를 축적하는 Personal Career Workspace를 목표로 한다.

장기적으로는 축적된 데이터를 기반으로 AI가 사용자의 커리어를 분석하고,
다음 지원을 더 효율적으로 준비할 수 있도록 돕는다.

---

# 2. Problem Statement

현재 취업 준비 과정에는 다음과 같은 문제가 존재한다.

## 2.1 일정 관리

- 여러 기업의 채용 일정이 흩어져 있다.
- 지원 마감일을 놓치는 경우가 발생한다.
- 면접 일정 관리가 어렵다.

---

## 2.2 자소서 관리

- 제출했던 자소서를 찾기 어렵다.
- 비슷한 문항을 다시 작성한다.
- 어떤 기업에 어떤 내용을 제출했는지 기억하기 어렵다.

---

## 2.3 면접 관리

- 예상 질문과 실제 질문이 따로 관리된다.
- 면접 회고가 축적되지 않는다.

---

## 2.4 이력 관리

지원할 때마다

- 학교
- 학점
- 경력
- 자격증
- 어학

등을 반복 입력해야 한다.

---

## 2.5 데이터 축적

지원 경험이 쌓여도

- 지원 이력
- 자소서
- 면접
- 결과

가 연결되지 않는다.

---

# 3. Product Goal

CareerBase의 목표는

취업 준비 과정에서 생성되는 모든 데이터를
하나의 Workflow 안에서 관리하는 것이다.

사용자는

- 지원 이력을 관리하고
- 반복 입력을 줄이며
- 자신의 커리어 데이터를 축적하고
- 다음 지원을 더 효율적으로 준비할 수 있어야 한다.

---

# 4. Target User

## Primary User

- 취업 준비생
- 신입 지원자

## Secondary User

- 이직 준비자
- 경력직 지원자

---

# 5. Core Philosophy

CareerBase는

**기능(Function)** 을 관리하는 서비스가 아니라

**Workflow** 를 관리하는 서비스이다.

모든 기능은 아래 Workflow를 기준으로 설계한다.

공고 발견

↓

공고 등록

↓

지원 준비

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

다음 지원

---

# 6. Product Principles

## Principle 1

한 번 입력한 정보는

언제든지

- 추가(Create)
- 조회(Read)
- 수정(Update)
- 삭제(Delete)

할 수 있어야 한다.

---

## Principle 2

모든 데이터는

공고(Job) 중심으로 관리한다.

기업 중심이 아니다.

예)

KT IT기획

KT AI기획

KT DX기획

은 각각 독립적인 데이터이다.

---

## Principle 3

취업 준비의 흐름을 따라간다.

공고

↓

자소서

↓

면접

↓

결과

를 하나로 연결한다.

---

## Principle 4

데이터는 삭제보다 Archive를 우선한다.

Archive 데이터는

- 검색 가능
- 통계 포함
- 향후 AI 분석 대상

이다.

---

## Principle 5

AI는 서비스를 보조한다.

MVP에서는

AI 없이도 서비스가 완전하게 동작해야 한다.

---

# 7. MVP Scope

## Calendar Home

Priority : P0

### 기능

- 월간 달력 전체 화면
- 오늘 날짜 강조
- 일정 유형별 표시
- 일정 상세 조회
- 날짜별 추가 일정 Modal

---

## Calendar

Priority : P0

서비스의 메인 화면이다.

관리 일정

- 지원 시작
- 지원 마감
- 서류 발표
- 인적성
- 1차 면접
- 2차 면접
- 최종 발표

---

## Job

Priority : P0

등록 항목

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

공고 등록 시

자동으로

지원현황 "관심"

상태를 생성한다.

---

## Support Board

Priority : P0

칸반보드

컬럼

- 관심
- 준비 중
- 제출 완료
- 전형 진행
- 최종 결과

세부 상태는 내부적으로 관리한다.

---

## Job Detail

공고 상세 페이지

탭

- 공고정보
- 자소서
- 면접
- 일정
- 지원현황

---

## Resume Repository

Priority : P0

구조

기업

↓

공고

↓

문항

저장

- 문항
- 최종 제출 답변
- 첨부파일
- 지원 결과

---

## Interview

Priority : P0

### 면접 준비

- 예상 질문
- 답변

### 면접 완료

- 실제 받은 질문
- 회고

---

## Profile

Priority : P0

모든 항목은 CRUD를 지원한다.

또한 아래 항목은 다중 입력을 지원한다.

- 학력
- 경력
- 자격증
- 어학
- 수상
- 학내외활동

각 섹션은

"+ 추가"

버튼을 제공한다.

### 학력(고등학교)

- 학교명
- 재학기간
- 소재지
- 계열

### 학력(대학교)

- 대학명
- 재학기간
- 주전공
- 이수학점
- 평점
- 만점
- 전공 이수학점
- 전공 평점
- 전공 만점

### 경력

- 회사명
- 재직기간
- 부서
- 직급
- 담당업무
- 경력기술서

### 어학

- 자격명
- 등록번호
- 점수
- 응시일

### 자격증

- 자격증명
- 등록번호
- 발급기관
- 취득일

### 수상

- 상훈명
- 수여기관
- 발급일
- 내용

### 학내외활동

- 활동구분
- 기관명
- 활동기간
- 역할
- 내용

### 기타

- 취미
- 특기

---

## Experience Library

Priority : P1

사용자의 경험을 카드 형태로 저장한다.

향후

- 자소서
- 면접
- AI

에서 재사용한다.

---

## Search

Priority : P1

LIKE 검색 지원

검색 대상

- 공고
- 자소서
- 면접
- 이력
- 메모
- Experience Library

---

## Archive

Priority : P1

지원 종료된 공고를 보관한다.

Archive는 삭제가 아니다.

---

## Backup

Priority : P1

지원

- JSON Export
- JSON Import

새 PC에서도 데이터를 복원할 수 있어야 한다.

---

# 8. Out of Scope

MVP에서는 아래 기능을 개발하지 않는다.

- 로그인
- 회원가입
- Supabase
- AI 분석
- OpenAI API
- 공고 자동 수집
- 클라우드 파일 저장
- 알림
- 모바일 앱

---

# 9. Future Roadmap

## v2

- AI 공고 분석
- AI 자소서 추천
- AI 경험 추천

## v3

- 로그인
- 사용자별 데이터
- Supabase

## v4

- AI 면접 코치
- AI 커리어 분석
- AI 성장 리포트