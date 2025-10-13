# Agent Platform Design System 2025

## 프로젝트 개요

Agent Platform Frontend 디자인 시스템 연동 테스트 프로젝트 (2025.09 ~)

## 주요 기술 스택
- **프론트엔드**: React 18.3, TypeScript
- **상태 관리**: Recoil
- **스타일링**: Material-UI(MUI)
- **라우팅**: React Router v7
- **서버 데이터 관리**: TanStack React Query (v5)
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

### 아키텍처
Figma 디자인 토큰을 자동으로 MUI 테마로 변환하는 구조
```
Figma → Tokens Studio → 토큰 파일 → 어댑터 → MUI 테마 → React App
```

### 폴더 구조
```
src/
├── assets/                       # 정적 자원 (폰트, 이미지)
├── components/                   # 재사용 가능한 공통 컴포넌트
├── config/                       # 앱 설정 및 상수
│   ├── app.ts                    # 페이지/라우팅/메타데이터 통합 설정
│   ├── layout.ts                 # 레이아웃 설정 값
│   ├── projectMenu.ts            # 프로젝트 서브 메뉴 설정
│   └── index.ts
├── contexts/                     # React Context (전역 상태)
│   ├── ColorModeContext.tsx      # 테마 모드 관리
│   ├── ProjectContext.tsx        # 프로젝트 상태 관리
│   └── index.ts
├── data/                         # 데이터
│   ├── workflows.ts              # 샘플 워크플로우 데이터
│   └── index.ts
├── hooks/                        # 전역 커스텀 훅
│   ├── usePageMetadata.ts
│   ├── useRouterPageTitle.ts
│   ├── useProject.ts             # 프로젝트 컨텍스트 훅
│   └── index.ts
├── layouts/                      # 레이아웃 컴포넌트
│   ├── DefaultLayout.tsx         # 기본 레이아웃
│   ├── AuthLayout.tsx            # 인증 레이아웃
│   ├── ErrorLayout.tsx           # 오류 레이아웃
│   ├── Header.tsx, Sidebar.tsx, Footer.tsx
│   ├── PageHeader.tsx, Breadcrumb.tsx, Navigation.tsx
│   └── index.ts
├── pages/                        # 페이지 컴포넌트 (라우팅 단위)
│   ├── Home.tsx                  # 홈 페이지
│   ├── Login.tsx, Signup.tsx     # 인증 페이지
│   ├── Users.tsx                 # 회원 관리
│   ├── Components.tsx            # UI 컴포넌트 데모
│   ├── project/                  # 프로젝트 페이지 그룹
│   │   ├── components/           # 재사용 컴포넌트 (StatusChip)
│   │   ├── layout/               # 레이아웃 (ProjectSubMenu)
│   │   ├── sections/             # 탭 섹션 (Agent, Credential 등)
│   │   ├── project1/, project2/  # 개별 프로젝트 페이지
│   │   └── ProjectPage.tsx       # 공통 프로젝트 페이지 템플릿
│   └── index.ts
├── router/                       # 라우팅 설정
├── styles/                       # 전역 스타일
├── theme/                        # MUI 테마 설정
│   ├── generated/                # 자동 생성된 테마 파일
│   ├── index.ts                  # 테마 생성 및 확장
│   └── theme.d.ts                # TypeScript 타입 확장
├── utils/                        # 유틸리티 함수
└── App.tsx                       # 메인 앱 컴포넌트

design-system/
├── adapters/                     # 토큰 → MUI 테마 변환기
│   ├── to-mui-theme.ts           # 핵심 어댑터
│   └── types.ts                  # 타입 정의
└── tokens/                       # Figma 토큰 파일들
    └── generated/                # Figma Tokens Studio 생성 파일들
```

## 라우팅
파일 기반 자동 라우팅 시스템
- **설정**: `src/config/app.ts`의 `PAGES`
- **규칙**: 폴더 kebab-case, 파일 PascalCase
- **예시**: `project.project1` → `src/pages/project/project1/Project1.tsx`
- **자동 생성**: `src/utils/route-generator.ts`가 페이지 설정에서 라우트 자동 생성

## 상태 관리
- **React Context**: 기능별 상태 관리 (ColorMode, Project)
- **React Query**: 서버 데이터 관리 및 캐싱
- **로컬 상태**: 컴포넌트별 useState 및 커스텀 훅

## 환경 설정
- **경로 별칭**: `@/*` → `./src/*` (TypeScript + Vite)
- **개발 서버**: 포트 3000
- **빌드 출력**: `build/` 디렉토리

## 개발 가이드라인
- **코드 품질**: ESLint + Prettier 자동 포맷팅
- **타입 안전성**: TypeScript strict 모드
- **디자인 일관성**: Figma 토큰에서만 스타일 값 참조

## 관련 문서
- **디자인 시스템 가이드**: [DESIGN_SYSTEM_GUIDE.md](./design-system/DESIGN_SYSTEM_GUIDE.md)
