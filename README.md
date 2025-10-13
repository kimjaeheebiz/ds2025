# Agent Platform Design System 2025

## 프로젝트 개요

Agent Platform Frontend 디자인 시스템 연동 테스트 프로젝트 (2025.09 ~)

**Figma Tokens Studio와 MUI 연동으로 자동화된 디자인 시스템**


## 주요 기술 스택

- **프론트엔드**: React 18.3, TypeScript
- **상태 관리**: Recoil
- **스타일링**: Material-UI(MUI)
- **라우팅**: React Router v7
- **데이터 페칭**: TanStack React Query (v5)
- **빌드 도구**: Vite
- **디자인 시스템**: Figma Tokens Studio + MUI Theme
- **코드 품질**: ESLint, Prettier


## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 코드 품질 체크
npm run lint
```


## 프로젝트 구조

Figma 디자인 토큰이 자동으로 MUI 테마로 변환되는 구조입니다.

```
Figma → Tokens Studio → 토큰 파일 → 어댑터 → MUI 테마 → React App
```

**상세 구조는 [DESIGN_SYSTEM_GUIDE.md](./design-system/DESIGN_SYSTEM_GUIDE.md) 참조**

### 폴더 구조

```
src/
├── assets/             # 정적 자원 (폰트, 이미지)
├── components/         # 재사용 가능한 공통 컴포넌트
├── config/             # 앱 설정 및 상수
│   ├── app.ts          # 페이지/라우팅/메타데이터 통합 설정
│   ├── layout.ts       # 레이아웃 설정 값
│   ├── projectMenu.ts  # 프로젝트 메뉴 설정
│   └── index.ts
├── contexts/           # React Context (전역 상태)
│   ├── ColorModeContext.tsx  # 테마 모드 관리
│   ├── ProjectContext.tsx    # 프로젝트 상태 관리
│   └── index.ts
├── data/               # Mock 데이터 및 샘플 데이터
│   ├── workflows.ts    # 샘플 워크플로우 데이터
│   └── index.ts
├── hooks/              # 전역 커스텀 훅
│   ├── usePageMetadata.ts
│   ├── useRouterPageTitle.ts
│   ├── useProject.ts   # 프로젝트 컨텍스트 훅
│   └── index.ts
├── layouts/            # 레이아웃 컴포넌트
├── pages/              # 페이지 컴포넌트 (라우팅 단위)
│   └── project/        # 프로젝트 페이지 예시
│       ├── components/ # 재사용 컴포넌트 (StatusChip)
│       ├── layout/     # 레이아웃 관련 (ProjectSubMenu)
│       ├── sections/   # 탭별 섹션 (Agent, Credential 등)
│       ├── project1/, project2/  # 개별 프로젝트 페이지
│       └── ProjectPage.tsx       # 공통 프로젝트 페이지
├── router/             # 라우팅 설정
├── styles/             # 전역 스타일
├── theme/              # MUI 테마 설정
│   ├── generated/      # 자동 생성된 테마 파일
│   ├── index.ts        # 테마 생성 및 확장
│   └── theme.d.ts      # TypeScript 타입 확장
├── utils/              # 유틸리티 함수
└── App.tsx             # 메인 앱 컴포넌트

design-system/
├── adapters/           # 토큰 → MUI 테마 변환기
│   ├── to-mui-theme.ts # 핵심 어댑터
│   └── types.ts        # 타입 정의
└── tokens/             # Figma 토큰 파일들
    └── generated/      # Tokens Studio 생성 파일들
```

### 주요 기능 모듈

1. **layouts/**: 레이아웃 구성 요소
   - `DefaultLayout`: 기본 레이아웃 (헤더/사이드바/푸터)
   - `AuthLayout`: 인증 레이아웃
   - `ErrorLayout`: 오류 레이아웃

2. **pages/**: 페이지 구성
   - `Home.tsx`: 홈 페이지
   - `project/`: 프로젝트 페이지
     - `ProjectPage.tsx`: 공통 프로젝트 페이지 컴포넌트
     - `project1/`, `project2/`: 개별 프로젝트 페이지
     - `components/`: 재사용 컴포넌트 (`StatusChip` 등)
     - `layout/`: 레이아웃 컴포넌트 (`ProjectSubMenu` 등)
     - `sections/`: 탭별 섹션 (`Agent`, `Credential`, `KnowledgeBase` 등)
   - `Users.tsx`: 회원 관리
   - `Components.tsx`: UI 컴포넌트 데모
   - `Login.tsx`, `Signup.tsx`: 인증

3. **theme/**: 디자인 시스템 테마
   - `generated/theme.light.json`, `theme.dark.json`: 자동 생성된 MUI 테마
   - `index.ts`: 테마 생성 및 브랜드 색상 확장
   - `theme.d.ts`: TypeScript 타입 확장

4. **config/**: 앱 설정 모듈
   - `app.ts`: 페이지/라우팅/메타데이터 통합 설정
   - `layout.ts`: 공통 레이아웃 설정 값
   - `projectMenu.ts`: 프로젝트 메뉴 설정

5. **contexts/**: 전역 상태 관리
   - `ColorModeContext.tsx`: 라이트/다크 모드 관리
   - `ProjectContext.tsx`: 프로젝트 상태 관리

6. **hooks/**: 커스텀 훅
   - `usePageMetadata.ts`: 페이지 메타데이터 관리
   - `useRouterPageTitle.ts`: 라우터 기반 페이지 제목
   - `useProject.ts`: 프로젝트 컨텍스트 접근

7. **data/**: Mock/샘플 데이터
   - `workflows.ts`: 샘플 워크플로우 데이터

### 상태 관리 패턴

- **React Context**: 기능별 상태 관리 (예: ProjectContext)
- **React Query**: 서버 상태 관리 및 캐싱
- **로컬 상태**: 컴포넌트별 useState 및 커스텀 훅 활용

### 컴포넌트 설계 패턴

**기능별 페이지 구조** (예: `pages/project/`)

```
pages/
└── project/
    ├── ProjectPage.tsx       # 메인 페이지 컴포넌트
    ├── project1/             # 개별 프로젝트 페이지
    │   └── Project1.tsx
    ├── components/           # 재사용 가능한 컴포넌트
    │   ├── StatusChip.tsx
    │   └── index.ts
    ├── layout/               # 레이아웃 관련 컴포넌트
    │   ├── ProjectSubMenu.tsx
    │   └── index.ts
    └── sections/             # 탭별 페이지 섹션
        ├── Agent.tsx
        ├── Credential.tsx
        └── index.ts
```

**전역 상태 및 데이터 관리**

```
contexts/                  # Context API (전역 상태)
├── ProjectContext.tsx     # 프로젝트 관련 상태
└── index.ts

data/                      # Mock/샘플 데이터
├── workflows.ts
└── index.ts

hooks/                     # 커스텀 훅
├── useProject.ts          # Context 접근 훅
└── index.ts
```

## 라우팅

파일 기반 자동 라우팅 시스템

- **설정**: `src/config/app.ts`의 `PAGES`
- **규칙**: 폴더 kebab-case, 파일 PascalCase
- **예시**: `project.project1` → `src/pages/project/project1/Project1.tsx`
- **자동 생성**: `src/utils/route-generator.ts`가 페이지 설정에서 라우트 자동 생성

## 환경 설정

- **경로 별칭**: `@/*` → `./src/*` (TypeScript + Vite)
- **개발 서버**: 포트 3000
- **빌드 출력**: `build/` 디렉토리

## 디자인 시스템

### 핵심 개념

- **Figma Variables/Styles**: 모든 디자인 값의 단일 진실 소스
- **자동 동기화**: Figma 변경 → 자동으로 React 테마에 반영
- **타입 안전성**: TypeScript로 완전한 타입 체크
- **하드코딩 제거**: 모든 스타일 값은 테마 토큰에서 참조

### 빠른 시작

```bash
# 디자인 토큰 빌드(테마 업데이트)
npm run tokens:build-theme

# 개발 서버 실행 (자동으로 토큰 빌드 포함)
npm run dev

# 프로덕션 빌드 (자동으로 토큰 빌드 포함)
npm run build
```

## 개발 가이드라인

- **코드 품질**: ESLint + Prettier 자동 포맷팅
- **타입 안전성**: TypeScript strict 모드
- **디자인 일관성**: Figma 토큰에서만 스타일 값 참조

## 관련 문서

- [DESIGN_SYSTEM_GUIDE.md](./design-system/DESIGN_SYSTEM_GUIDE.md) - 디자인 시스템 통합 가이드
