# Agent Platform Design System 2025

## 프로젝트 개요

Agent Platform Frontend 디자인 시스템 테스트 프로젝트(2025.09 ~)

## 주요 기술 스택

- **프론트엔드**: React 18.3, TypeScript
- **상태 관리**: Recoil
- **스타일링**: Material-UI (MUI), TailwindCSS, Emotion
- **라우팅**: React Router v7
- **데이터 페칭**: TanStack React Query (v5)
- **빌드 도구**: Vite
- **코드 품질**: ESLint, Prettier

## 개발 환경 설정 및 명령어

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
# 개발 서버 실행 (포트 3000)
npm run dev
```

### 코드 품질 관리

```bash
# ESLint 실행
npm run lint

# 특정 파일 ESLint 자동 수정
npx eslint 경로/파일명 --fix
```

### 빌드 및 미리보기

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 프로젝트 아키텍처

### 폴더 구조

```
src/
├── assets/             # 정적 자원 (폰트, 이미지)
├── components/         # 재사용 가능한 공통 컴포넌트
├── constants/          # 앱 설정 및 상수
├── hooks/              # 전역 커스텀 훅
├── layouts/            # 레이아웃 컴포넌트
├── pages/              # 페이지 컴포넌트 (라우팅 단위)
├── router/             # 라우팅 설정
├── styles/             # 전역 스타일
├── theme/              # MUI 테마 설정
├── utils/              # 유틸리티 함수
└── App.tsx             # 메인 앱 컴포넌트
```

### 주요 기능 모듈

1. **layouts/**: 레이아웃 구성 요소
   - `DefaultLayout`: 기본 레이아웃 (헤더/사이드바/푸터)
   - `AuthLayout`: 인증 레이아웃
   - `ErrorLayout`: 오류 레이아웃

2. **pages/**: 페이지 구성
   - `home/Home.tsx`: 홈페이지
   - `project/project1/Project1.tsx`, `project/project2/Project2.tsx`: 프로젝트 페이지(공통 `ProjectPage` 사용)
   - `project/components/*`: 프로젝트 공통 컴포넌트(`ProjectPage`, `ProjectSubMenu`, `StatusChip` 등)
   - `users/Users.tsx`: 회원 관리
   - `components/Components.tsx`: UI 컴포넌트 데모
   - `login/Login.tsx`, `signup/Signup.tsx`: 인증

3. **constants/**: 앱 설정 모듈
   - `app-config.ts`: 페이지/라우팅/메타데이터 통합 설정
   - `layout.ts`: 레이아웃 상수

### 상태 관리 패턴

- **Recoil**: 전역 상태 관리
- **React Query**: 서버 상태 관리 및 캐싱
- **로컬 상태**: 컴포넌트별 useState 및 커스텀 훅 활용

### 컴포넌트 설계 패턴

기능 디렉터리 구조

```
feature/
├── FeatureName.tsx        # 메인 컴포넌트
├── components/            # 기능별 하위 컴포넌트
├── hooks/                 # 커스텀 훅
├── recoil/                # Recoil 상태
├── types/                 # 타입 정의
└── utils/                 # 유틸리티 함수
```

## 라우팅 구조

주요 라우트

- `/`: 홈
- `/project/project1`, `/project/project2`: 프로젝트 상세(공통 페이지 사용)
- `/users`: 회원 관리
- `/components`: UI 컴포넌트
- `/login`: 로그인
- `/signup`: 계정 등록

### 라우팅 자동화 규칙 (파일 기반)

- 기준 파일: `src/utils/route-generator.ts`
- 설정 소스: `app-config.ts`의 `PAGES`
- 규칙 요약(2뎁스까지 지원)
  - 키 계층: 점(`.`) 구분(예: `project.project1`)
  - 폴더 경로: 소문자 kebab-case 변환
  - 파일명: PascalCase, 언더스코어(`_`) 유지
- 매핑 예시
  - `home` → `src/pages/home/Home.tsx`
  - `project.project1` → `src/pages/project/project1/Project1.tsx`
  - `project.project2` → `src/pages/project/project2/Project2.tsx`
- 로딩 방식: `import.meta.glob('/src/pages/**/*.{tsx,jsx}')` 지연 로딩
- 레이아웃 규칙: `login`/`signup` → `AuthLayout`, 404/500 → `ErrorLayout`
- 네이밍 주의: 폴더 소문자 시작, 파일 PascalCase

## 환경 설정

### TypeScript 경로 매핑

프로젝트는 TypeScript 경로 별칭 사용

```typescript
{
  "@": "./src",
  "@src": "./src",
  "@layouts": "./src/layouts",
  "@pages": "./src/pages",
  "@components": "./src/components",
  "@constants": "./src/constants",
  "@styles": "./src/styles",
  "@utils": "./src/utils",
  "@router": "./src/router"
}
```

### Vite 설정

- **개발 서버**: 포트 3000, 자동 브라우저 열기
- **빌드 출력**: `build/` 디렉토리
- **소스맵**: 환경변수에 따라 제어
- **콘솔 제거**: 프로덕션 빌드 시 자동 제거 (빌드 설정에 따름)

## 개발 가이드라인

### 코드 스타일

- ESLint 자동 수정(필요 시): `npx eslint 경로/파일명 --fix`
- TypeScript strict 모드 사용 (단, `noImplicitAny: false` 설정)
- Prettier + ESLint 조합으로 코드 포맷팅

## 라이선스

© 2025 Hecto. All Rights Reserved.