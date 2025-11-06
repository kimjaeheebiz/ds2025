# 레이아웃 시스템


## 1. 구성 요소

- 기본 레이아웃 구성 요소: `Header`, `Sidebar`, `PageHeader`, `MainContent`, `Outlet`
- 공통 UI: 브랜드/네비게이션/색상 체계 일관성 유지


## 2. 적용 원칙

- 페이지는 레이아웃의 `Outlet`에 콘텐츠만 주입
- `MainContent` 영역에 섹션/컴포넌트 배치
- 브레드크럼/페이지 타이틀은 자동 반영


## 3. 페이지 생성 시 배치 규칙

- 레이아웃 변경 없이 메인 콘텐츠만 생성/갱신
- 공통 레이아웃 컴포넌트 직접 수정 지양, 설정/토큰으로 제어


## 4. 레이아웃 타입과 연결 파일

- `defaultLayout`: 일반 페이지용 기본 레이아웃
  - 파일: `src/layouts/DefaultLayout.tsx`
  - 구성: `Header.tsx`, `Sidebar.tsx`, `PageHeader.tsx`, `Breadcrumb.tsx`, `Footer.tsx`, `Navigation/*`
  - 용도: 대부분의 서브 페이지에 적용

- `authLayout`: 인증 관련 화면(로그인, 회원 가입, 계정 생성)
  - 파일: `src/layouts/AuthLayout.tsx`
  - 구성: 중앙 정렬 영역(사이드바 미포함)
  - 용도: 접근 제어/폼 중심 화면에 적용

- `errorLayout`: 에러/예외 화면(404, 500 등)
  - 파일: `src/layouts/ErrorLayout.tsx`
  - 구성: 상태 메시지/재시도 액션 중심의 단일 영역
  - 용도: 라우팅 실패, 서버 오류, 접근 권한 오류 표시


## 5. 네비게이션 구성 요소

- 사이드바: `src/layouts/Sidebar.tsx`
- 페이지 상단 헤더: `src/layouts/Header.tsx`
- 브레드크럼: `src/layouts/Breadcrumb.tsx`
- 페이지 헤더(타이틀/액션): `src/layouts/PageHeader.tsx`
- 내비게이션 트리: `src/layouts/Navigation/Navigation.tsx` 및 하위 컴포넌트
- 내비게이션 상태 훅: `src/layouts/Navigation/hooks/useNavigationState.ts`
