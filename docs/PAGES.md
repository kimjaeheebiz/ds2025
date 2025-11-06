# 페이지 생성


## 1. 개념

- 메인 컨텐츠 자동 생성: Figma 페이지 → React 컴포넌트 변환
- 레이아웃 통합: 기본 레이아웃/네비게이션과 자동 결합
- 파일 구조: kebab-case 디렉토리 + PascalCase 파일명 규칙


## 2. 신규 페이지 생성 절차

- Figma에서 신규 페이지 생성: "MainContent" 프레임 포함, 페이지 이름은 메뉴명과 일치
- 생성: `npm run figma:page -- <PageName>` 실행 ("MainContent" 프레임에서 콘텐츠 추출)
- 설정 연동: `pages.ts` 메타데이터 등록, `mainmenu.ts` 메뉴 항목 추가
- 확인: 브레드크럼/라우팅 자동 반영


## 3. 명령

- 특정 페이지: `npm run figma:page -- <PageName>`
- 전체 페이지: `npm run figma:pages`


## 4. 연동

- 경로/브레드크럼: `src/config/pages.ts`, `src/config/mainmenu.ts`와 연동
- 디자인 시스템: 토큰 기반 테마가 생성물에 일괄 적용


## 5. 유의 사항

- 사용되지 않는 아이콘/컴포넌트 불필요 임포트 방지
- 하드 코딩된 계산식 제거, 토큰/설정 값 직접 반영
- 생성물 경로는 `OUTPUT_PATH`로 통일, 기본 `src/pages/generated`
