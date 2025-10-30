# 메뉴 토큰 연동


## 1. 개념

- 단일 소스: Figma Variables 기반 메뉴 토큰(Tokens Studio 동기화) 연동하여 사이드바 메인 메뉴 관리
- 자동 생성: 토큰 → `src/config/mainmenu.ts` 자동 갱신


## 2. 동기화 흐름

- Figma Variables 설정
- Tokens Studio 동기화 반영
- 저장 경로: `design-system/tokens/pages/navigation/Mode 1.json`
- 명령 실행: `npm run build:menu`
- 결과물: `src/config/mainmenu.ts` 생성/갱신 (토큰 → 메뉴 트리 변환)


## 3. 매핑 원칙

- 필수: id, label(=title), type, path(item에 한함)
- 파생: pageId(경로 기반 규칙으로 생성), icon(아이콘 매핑 테이블 적용)
- 그룹/하위 메뉴: 계층 구조는 토큰 트리로 표현
- 비표시 항목: visible=false 등 플래그는 토큰에 명시

### 세부 규칙
- 타입(type): `group` | `item` 구분, group은 children 보유, item은 path/pageId 보유
- 경로(path): 절대 경로(`/parent/child`) 사용, 소문자-kebab-case 권장
- 계층 생성: 디자인 변수는 트리 구조 생성 불가. item의 path 첫 세그먼트를 parentId로 간주해 group 하위로 배치
- pageId: `parent.child` 형식(PascalCase 컴포넌트와 매핑되는 논리 ID는 설정에서 관리)
- 정렬: 별도 order 필드 미사용, 토큰 선언 순서 반영
- 아이콘(icon): UI 라이브러리 네이밍과 일치, 매핑 테이블 존재 시 우선 적용
- 표시(visible): 불리언, false인 항목은 메뉴 렌더링 제외(라우팅은 별개 정책)


## 4. 가이드라인

- 경로/이름 하드코딩 최소화, 토큰을 단일 진실 소스로 유지 권장
- 페이지 ID/경로는 `pages.ts`와 일치
- 아이콘 네이밍은 UI 라이브러리 규칙에 부합하도록 관리

### 명명/구조 가이드
- ID: 소문자, 중복 금지
- Label: 사용자 노출명
- Group: path 없이 트리 구조만 형성
- Item: path/pageId 필수, label이 없을 시 pages 설정에서 대체 가능
