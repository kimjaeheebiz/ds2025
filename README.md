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

### Figma API 통합 (선택사항)
```bash
# Figma API 환경 설정
npm run figma:setup

# 상태 확인
npm run figma:status
```

---

## ✨ 새 페이지 추가

### 1. 페이지 메타데이터 정의
`src/config/pages.ts`에서 페이지 설정 추가

### 2. 메뉴에 추가
`src/config/mainmenu.ts`에서 메뉴 항목 추가

### 3. 페이지 컴포넌트 생성
`src/pages/` 폴더에 페이지 컴포넌트 생성

자세한 내용은 [설정 구조 가이드](docs/CONFIG_STRUCTURE.md)와 [메뉴 구조 가이드](docs/MENU_STRUCTURE.md) 참조

---

## 📁 프로젝트 구조

```
src/
├── config/              # 설정 파일
├── pages/               # 페이지 컴포넌트
├── layouts/             # 레이아웃 컴포넌트
├── components/          # 공통 컴포넌트
├── api/                 # API 통합 (Figma API 포함)
├── hooks/               # 커스텀 훅
└── theme/               # 테마 설정

design-system/
├── tokens/              # 디자인 토큰 (Figma 동기화)
├── generators/          # 코드 생성기
└── validators/          # 유효성 검사

docs/                    # 프로젝트 문서
scripts/                 # 빌드 및 유틸리티 스크립트
```

---

## 🎨 디자인 시스템

### 기존 토큰 시스템
- **Tokens Studio**: Figma 디자인 토큰 자동 동기화
- **MUI 테마**: 디자인 토큰을 MUI 테마로 변환

```bash
# 메뉴 동기화
npm run build:menu

# 테마 빌드
npm run build:theme
```

### Figma API 통합
- **페이지 콘텐츠 생성**: 기존 레이아웃과 통합된 페이지 콘텐츠
- **컴포넌트 추출**: Figma 라이브러리 컴포넌트 추출
- **코드 검증**: 생성된 코드 품질 검증

```bash
# 페이지 콘텐츠 생성
npm run figma:content

# 라이브러리 컴포넌트 추출
npm run figma:extract

# 코드 검증
npm run figma:validate
```

**노드 ID 추출**: Figma URL에서 `?node-id=[NODE_ID]` 부분을 추출하여 설정 파일에 추가

자세한 내용은 [디자인 시스템 가이드](design-system/DESIGN_SYSTEM_GUIDE.md)와 [Figma 통합 가이드](docs/FIGMA_INTEGRATION.md) 참조

---

## 🔧 주요 기능

- **자동 라우팅**: 설정 기반 라우트 생성 + Lazy loading
- **스마트 네비게이션**: 계층적 메뉴 구조, 자동 활성화
- **Breadcrumb**: URL 기반 자동 생성
- **디자인 시스템**: Figma 토큰 동기화 + API 통합
- **코드 생성**: Figma 디자인을 React 컴포넌트로 자동 변환

---

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Material-UI (MUI)
- **라우팅**: React Router v6
- **상태 관리**: Recoil
- **데이터 페칭**: TanStack Query
- **디자인 시스템**: Design Tokens (Figma 연동)
- **CLI 도구**: Commander.js

---

## 📚 문서

- [설정 구조 가이드](docs/CONFIG_STRUCTURE.md) - 프로젝트 설정 방법
- [메뉴 구조 가이드](docs/MENU_STRUCTURE.md) - 네비게이션 구성
- [디자인 시스템 가이드](design-system/DESIGN_SYSTEM_GUIDE.md) - 디자인 토큰 관리
- [Figma 통합 가이드](docs/FIGMA_INTEGRATION.md) - Figma API 활용

---

**버전**: 1.0.0