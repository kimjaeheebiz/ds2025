# Agent Platform Design System 2025

React + TypeScript + Vite 기반 관리 시스템

## 🚀 시작하기

### 필수 설치

```bash
# 프로젝트 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### Figma API 통합

```bash
# 환경 설정 (.env 생성)
npm run figma:setup

# 상태 확인 (로컬) / 원격 API 확인
npm run figma:status
npm run figma:status -- --remote

# 특정 페이지 생성
npm run figma:page -- <PageName>

# 모든 페이지 생성
npm run figma:pages
```


## ✨ 새 페이지 추가

1) `npm run figma:page -- <PageName>` 실행으로 콘텐츠 생성
2) `src/config/pages.ts`, `src/config/mainmenu.ts` 연동으로 경로/브레드크럼 반영
3) 레이아웃/네비게이션과 자동 통합


## 📁 프로젝트 구조

```
src/
├── api/                 # API 통합 (Figma API 포함)
├── config/              # 설정 파일
├── pages/               # 페이지 컴포넌트
├── layouts/             # 레이아웃 컴포넌트
├── components/          # 공통 컴포넌트
├── hooks/               # 커스텀 훅
└── theme/               # 테마 설정

design-system/
├── tokens/              # 디자인 토큰 (Figma 동기화)
└── generators/          # 코드 생성기

docs/                    # 프로젝트 문서
scripts/                 # 빌드 및 유틸리티 스크립트
```


## 🎨 디자인 시스템

- **디자인 토큰 → MUI 테마 변환**: `npm run build:theme`
- **메뉴 구조 동기화(옵션)**: `npm run build:menu`

Figma 연동으로 페이지 콘텐츠 자동 생성, 레이아웃/메뉴/브레드크럼 연동 설계 통일


## 🔧 주요 기능

- **자동 라우팅**: 설정 기반 라우트 생성 + Lazy loading
- **스마트 네비게이션**: 계층적 메뉴 구조, 자동 활성화
- **Breadcrumb**: URL 기반 자동 생성
- **디자인 시스템**: Figma 토큰 동기화 + API 통합
- **코드 생성**: Figma 디자인을 React 컴포넌트로 자동 변환


## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Material-UI (MUI)
- **라우팅**: React Router v6
- **상태 관리**: Recoil
- **데이터 페칭**: TanStack Query
- **디자인 시스템**: Design Tokens (Figma 연동)
- **CLI 도구**: Commander.js


## 📚 문서

- [아키텍처 개요](./docs/ARCHITECTURE.md) - 프로젝트 구조, 레이아웃/라우팅 개요
- [레이아웃 시스템](./docs/LAYOUT_SYSTEM.md) - Header/Sidebar/PageHeader/Outlet 구성과 배치 규칙
- [설정 가이드](./docs/CONFIG.md) - pages.ts, mainmenu.ts, navigation.ts 연동 규칙
- [Figma 자동화](./docs/FIGMA_AUTOMATION.md) - 토큰/페이지 생성 흐름과 상태 점검
- [명령어 모음](./docs/COMMANDS.md) - 개발/빌드/토큰/메뉴/Figma 전체 명령
- [디자인 시스템](./docs/DESIGN_SYSTEM.md) - 토큰 → MUI 테마 반영 흐름
- [메뉴 토큰 연동](./docs/MENU_TOKENS.md) - Figma 변수/토큰 기반 메뉴 → mainmenu.ts 동기화
- [페이지 생성](./docs/PAGES.md) - 페이지 생성 절차, 파일 구조, 연동/유의사항
