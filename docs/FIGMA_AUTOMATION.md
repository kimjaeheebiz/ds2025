# Figma 자동화 개요


## 1. 범위

- 디자인 시스템(토큰) 변환
- 메뉴 토큰 동기화
- 페이지 콘텐츠 생성


## 2. 흐름 요약

- 디자인 시스템: Figma Variables → Tokens Studio → `npm run build:theme`
- 페이지 생성: Figma(MainContent) → `npm run figma:page -- <PageName>` 또는 `npm run figma:pages`
- 메뉴 동기화: Figma Variables → Tokens Studio → `npm run build:menu`


## 3. 피그마 디자인 구조

- 계층: 파일(File) → 페이지(Page) → 프레임(Frame)
- 페이지(Page): 화면 단위, 각 페이지에 메인 콘텐츠 프레임 존재
- 프레임(Frame: MainContent): 콘텐츠 추출 기준, 이름을 정확히 `MainContent`로 유지
- 컴포넌트(Component): MUI 매핑 대상, Properties/Variants로 상태·크기 정의
- 변수/스타일(Variables/Styles): Tokens Studio로 동기화되어 디자인 토큰으로 활용
- 네이밍 규칙: 페이지명은 메뉴명과 일치, 추출/생성 시 케밥(kebab-case) 디렉토리 + PascalCase 파일명 적용


## 4. MainContent 프레임 자동 추출

- 자동 추출 대상: 페이지 내 `MainContent` 프레임
- 지원 네이밍(매핑): `MainContent`, `Main`, `MainArea`
- 레이아웃 템플릿/인스턴스 인식: `defaultLayoutTemplate`(템플릿), `DefaultLayout`(인스턴스)
- 컴포넌트 인스턴스 인식: `<Header>`, `<Sidebar>`, `<PageHeader>`, `<Drawer>`, `<Submenu>`, `<Typography>` 등

### 예시 구조(기본 레이아웃)

```
defaultLayoutTemplate (Root Frame)
└── DefaultLayout (Layout Instance)
    ├── <Header>
    └── MainArea
        ├── <Sidebar>
        │   └── <Drawer>
        └── Main
            ├── <PageHeader>
            └── MainContent  ← 추출 대상(Outlet)
                ├── <Submenu>
                ├── Content
                └── <Typography>
```

### 자동 탐지 로직(요약)
- 페이지 트리 재귀 순회 → 지원 네이밍 매핑과 일치하는 프레임 선택
- 선택된 `MainContent` 하위의 컴포넌트만 추출하여 페이지 콘텐츠로 변환


## 5. 명령

- 디자인 시스템: `npm run build:theme`
- 메뉴 동기화: `npm run build:menu`
- 환경 설정: `npm run figma:setup`
- 로컬 상태 확인: `npm run figma:status`
- 원격 상태 확인 : `npm run figma:status -- --remote`
- 특정 페이지 생성: `npm run figma:page -- <PageName>`
- 전체 페이지 생성: `npm run figma:pages`


## 6. 컴포넌트 매핑(요약)

- 위치: `src/api/figma/component-mappings/*`
- 목적: Figma 컴포넌트/프로퍼티/스타일 → MUI 컴포넌트/props/sx 스타일 매핑
- 아이콘: 공통 추출/매핑 유틸 사용, 실제 아이콘명 기준으로 `@mui/icons-material` 임포트 최소화
- 예시 범주: `Typography.ts`, `Button.ts`, `Card.ts`, `Stack.ts` 등
- 주의
  - MUI Figma 디자인 키트 일부 컴포넌트 미포함, 커스터마이징 요소 다수
  - MUI 컴포넌트의 Figma 디자인과 React 소스 구조가 상이하여 모든 컴포넌트 매핑 파일 선개발 필요
  - MUI 버전 업그레이드 시 컴포넌트 매핑 구조 변경 필요


## 7. 라이브러리 변수 매핑(Variables → MUI 토큰)

- 목적: 페이지 변수명 조회 불가(Variables API 404) → 라이브러리 변수 ID와 페이지 변수 ID 매핑 → 변수명/테마 경로(예: `primary.main`) 복원 → 페이지 컴포넌트별 props/sx 스타일 적용
- 동작
  - 입력: Variable ID(필수), 변수명(선택)
  - 처리: 캐시 조회 → 라이브러리 사전 매핑 참조 → Variables API 조회 → 테마 경로 정규화
  - 출력: MUI 테마 경로 문자열(예: `primary.light`), 미해석 시 경고 및 안전 기본값 처리
  - 통합: 추출 단계 ID → 경로 치환, 생성 단계 경로 직접 적용
 - 효과: 변수 교체만으로 UI 일괄 반영


## 8. Figma 노드 ID 형식(변환 규칙 포함)

- URL 형식(피그마 웹/플러그인 복사): 하이픈(-) 사용
  - 페이지 노드: 0-1, 0-2
  - 프레임 노드: 166-6455, 598-3722
  - 컴포넌트 노드: 13761-1677
- API 형식(코드에서 사용): 콜론(:) 사용
  - 페이지 노드: 0:1, 0:2
  - 프레임 노드: 166:6455, 598:3722
  - 컴포넌트 노드: 13761:1677
- 변환 예시
  - URL: `?node-id=469-3583` → API: `469:3583`

### 설정 파일 반영 예시(`src/api/figma/config.ts`)

```
pageNodes: {
  // Layout Templates (원본)
  layoutTemplates: {
    default: '469:7679',
    auth: '0:3',
    error: '0:4',
  },

  // Layout Instances (페이지 실제 사용)
  layoutInstances: {
    default: '469:3583',
    auth: '0:5',
    error: '0:6',
  },

  // Pages (Frame)
  pages: {
    project: '166:6455',
    users: '598:3722',
    components: '286:6314',
  },

  // Library Components
  libraryComponents: '13761:1677'
}
```


## 9. 상세 문서

- [디자인 시스템](./DESIGN_SYSTEM.md)
- [메뉴 토큰 연동](./MENU_TOKENS.md)
- [페이지 생성 절차](./PAGES.md)
- [명령어](./COMMANDS.md)
