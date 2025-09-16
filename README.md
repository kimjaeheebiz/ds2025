# Agent Platform Frontend

## 프로젝트 개요

Agent Platform Frontend는 AI 에이전트 워크플로우를 시각적으로 구축하고 관리할 수 있는 React 기반 웹 애플리케이션입니다. 이 플랫폼은 드래그 앤 드롭으로 AI 에이전트 워크플로우를 생성하고, 지식베이스를 관리하며, 배포까지 할 수 있는 통합 환경을 제공합니다.

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
├── assets/              # 정적 자원 (CSS, 폰트, 아이콘, 이미지)
├── components/          # 재사용 가능한 공통 컴포넌트
├── constants/           # 앱 설정 및 상수
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

1. **layouts/**: 레이아웃 컴포넌트
   - `DefaultLayout`: 기본 레이아웃 (헤더, 사이드바, 푸터 포함)
   - `AuthLayout`: 인증 관련 페이지 레이아웃
   - `ErrorLayout`: 에러 페이지 레이아웃

2. **pages/**: 페이지 컴포넌트
   - `Home`: 홈페이지
   - `Workspace`: 워크스페이스 관리
   - `Login/Signup`: 인증 페이지
   - `Components`: UI 컴포넌트 데모
   - `depth1/`: 다단계 메뉴 구조 예시

3. **constants/**: 앱 설정
   - `app-config.ts`: 페이지 설정, 라우팅, 메타데이터 통합 관리
   - `layout.ts`: 레이아웃 관련 상수

### 상태 관리 패턴

- **Recoil**: 전역 상태 관리
- **React Query**: 서버 상태 관리 및 캐싱
- **로컬 상태**: 컴포넌트별 useState 및 커스텀 훅 활용

### 컴포넌트 설계 패턴

각 주요 기능은 다음과 같은 구조를 따릅니다:

```
feature/
├── FeatureName.tsx         # 메인 컴포넌트
├── components/             # 기능별 하위 컴포넌트
├── hooks/                  # 커스텀 훅
├── recoil/                # Recoil 상태
├── types/                 # 타입 정의
└── utils/                 # 유틸리티 함수
```

## 라우팅 구조

주요 라우트:

- `/`: 홈페이지
- `/workspace`: 워크스페이스 관리
- `/depth1/depth1_1/depth1_1_1`: 다단계 메뉴 예시 (3단계)
- `/depth1/depth1_1/depth1_1_2`: 다단계 메뉴 예시 (3단계)
- `/depth1/depth1_2`: 다단계 메뉴 예시 (2단계)
- `/components`: UI 컴포넌트 데모
- `/login`: 로그인 페이지
- `/signup`: 회원가입 페이지
- `/404`: 404 에러 페이지
- `/500`: 500 에러 페이지

## 환경 설정

### TypeScript 경로 매핑

프로젝트는 TypeScript 경로 별칭을 사용합니다:

```typescript
{
  "@": "./src",
  "@src": "./src",
  "@layouts": "./src/layouts",
  "@pages": "./src/pages",
  "@components": "./src/components",
  "@constants": "./src/constants",
  "@styles": "./src/styles",
  "@recoil": "./src/recoil",
  "@utils": "./src/utils",
  "@router": "./src/router"
}
```

### Vite 설정

- **개발 서버**: 포트 3000, 자동 브라우저 열기
- **빌드 출력**: `build/` 디렉토리
- **소스맵**: 환경변수에 따라 제어
- **콘솔 제거**: 프로덕션 빌드 시 자동 제거

## 개발 가이드라인

### 코드 스타일

- 작업 완료 후 반드시 `npx eslint 경로/파일명 --fix` 실행
- TypeScript strict 모드 사용 (단, `noImplicitAny: false` 설정)
- Prettier + ESLint 조합으로 코드 포맷팅

### 컴포넌트 개발

- 각 기능별로 독립적인 모듈 구조 유지
- hooks/, recoil/, types/, utils/ 서브 디렉터리 활용
- 커스텀 스타일링은 Emotion 또는 TailwindCSS 활용
- MUI와 TailwindCSS 혼용 사용

### 상태 관리

- 전역 상태는 Recoil atoms 사용
- 서버 상태는 React Query 사용
- 각 기능별로 상태를 분리하여 관리

### API 통신

- Axios 기반 HTTP 클라이언트 사용
- React Query를 통한 캐싱 및 상태 관리
- 에러 핸들링은 전역 스낵바 시스템 활용

## 빌드 및 배포 설정

- **Vite**: 빠른 빌드 및 HMR 지원
- **TypeScript**: 엄격한 타입 체크
- **소스맵**: 운영 환경에서는 소스맵 생성 비활성화
- **콘솔 제거**: 프로덕션 빌드 시 console, debugger 자동 제거

## 주요 특징

1. **계층적 메뉴 구조**: 3단계까지 지원하는 동적 메뉴 시스템
2. **통합 설정 관리**: `app-config.ts`에서 라우팅, 메타데이터, 네비게이션 통합 관리
3. **타입 안전성**: TypeScript를 활용한 강력한 타입 시스템
4. **반응형 디자인**: Material-UI와 TailwindCSS를 활용한 모던한 UI
5. **개발자 경험**: Vite, ESLint, Prettier를 통한 우수한 개발 환경

## 라이선스

© 2025 Hecto. All Rights Reserved.