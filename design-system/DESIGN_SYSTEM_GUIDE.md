# 디자인 시스템 가이드

## 📐 전체 구조

```
Figma (Variables + Styles)
  ↓ Tokens Studio
design-system/tokens/generated/
  ├── core.json                      # 핵심 UI 스타일 (typography, elevation, components 등)
  ├── brand/Mode 1.json              # 브랜드 색상/사이즈 (colors/sizes 구조)
  ├── palette/Light.json             # 라이트 모드 테마
  ├── palette/Dark.json              # 다크 모드 테마
  ├── material/colors/Mode 1.json    # Material 색상 팔레트
  ├── typography/Mode 1.json         # 폰트 사이즈/굵기/줄간격 등 참조값
  ├── spacing/Mode 1.json            # 간격
  ├── breakpoints/Mode 1.json        # 반응형 브레이크포인트 (xs, sm, md, lg, xl)
  └── shape/Mode 1.json              # 모서리, 테두리 (borderRadius, borderWidth 등)
  ↓ 어댑터 (design-system/adapters/to-mui-theme.ts)
src/theme/generated/
  ├── theme.light.json               # MUI ThemeOptions (Light)
  └── theme.dark.json                # MUI ThemeOptions (Dark)
  ↓ 런타임 확장 (src/theme/index.ts)
App (브랜드 색상을 palette에 추가하여 sx prop 지원)
```

## Core + Palette 구조

### Core 테마 (core.json)
디자인 시스템의 핵심 UI 정의 (Figma Design Styles)
- **typography**: `core.typography.*`
  - h1~h6, body1, body2, subtitle1, subtitle2, caption, overline, button
- **spacing**: `spacing/Mode 1.json` → `theme.spacing`
- **breakpoints**: `breakpoints/Mode 1.json` → `theme.breakpoints.values`
- **shape**: `shape/Mode 1.json` → `theme.shape.borderRadius`
- **shadows**: `core.elevation` → `theme.shadows[0~24]`
- **components**: MUI 컴포넌트 스타일 오버라이드
  - `MuiButton`: `core.button.large/medium/small`
  - `MuiChip`: `core.chip.label`
  - `MuiTooltip`: `core.tooltip.label`
  - `MuiBadge`: `core.badge.label`
  - `MuiAlert`: `core.alert.title`
  - `MuiTextField`: `core.input.label/value/helper`

### Palette 오버레이 (Light/Dark)
컬러 테마 선택적 적용
- `palette/Light.json` → `theme.palette` (mode: 'light')
- `palette/Dark.json` → `theme.palette` (mode: 'dark')

## 명령어

### 토큰 빌드
```bash
# 권장: npm 스크립트
npm run tokens:build-theme

# 직접 실행 (디버깅용)
npx tsx design-system/adapters/to-mui-theme.ts
```

### 개발 및 빌드
```bash
# 개발 서버 (자동으로 토큰 빌드 포함)
npm run dev

# 프로덕션 빌드 (자동으로 토큰 빌드 포함)
npm run build
```

## 브랜드 토큰 사용

### 색상 (sx prop)
```jsx
// 브랜드 색상
<Box sx={{ bgcolor: 'hecto.orange.500' }} />

// MUI 색상
<Box sx={{ bgcolor: 'primary.main', color: 'text.primary' }} />
```

### 크기 (theme 함수)
```jsx
const theme = useTheme();
const logoSize = theme.brand.sizes.logo.medium;
```

## 실전 예시: Brand 컴포넌트

### Figma 설계
**Component Properties**
```
Component: Brand
├── Variant: size
│   ├── small
│   ├── medium (default)
│   ├── large
│   └── extraLarge
├── Boolean: showText (default: true)
└── Variant: variant
    ├── logo (default)
    └── mark
```

**Variables 바인딩**
- `logo/small` → Height: `{logo/small}`
- `logo/medium` → Height: `{logo/medium}`
- `logo/large` → Height: `{logo/large}`
- `logo/extraLarge` → Height: `{logo/extraLarge}`

### Tokens Studio 동기화
1. Plugins → Tokens Studio → GitHub 연결
2. Push to GitHub (`design-tokens` 브랜치)
3. Pull Request → `master` 머지

### 어댑터 매핑
- **위치**: `design-system/adapters/to-mui-theme.ts`
- **변환**: Brand 토큰을 MUI 테마 구조로 변환
  - `brandData.colors` → `theme.brand.colors`
  - `brandData.sizes` → `theme.brand.sizes`

### TypeScript 타입
- **위치**: `src/theme/theme.d.ts`
- **기능**: MUI 테마에 브랜드 토큰 타입 확장

### React 컴포넌트
- **위치**: `src/components/Brand.tsx`
- **사용**: `useTheme()` 훅으로 브랜드 토큰 접근

## 워크플로우

### 디자인 변경
1. Figma Variables 수정
2. Tokens Studio → Push to GitHub (`design-tokens` 브랜치)
3. Pull Request → `master` 머지
4. `npm run tokens:build-theme` 실행 → 자동 반영
**React 컴포넌트 코드 수정 불필요!**

### 컴포넌트 추가
1. **Figma**: Component 생성 → Properties 정의 → Variables 바인딩
2. **Tokens Studio**: Push to GitHub → `master` 머지
3. **어댑터**: `to-mui-theme.ts`에서 토큰 매핑 추가
4. **타입**: `theme.d.ts`에서 Theme 인터페이스 확장
5. **컴포넌트**: `useTheme()`로 토큰 사용

## 핵심 개념

### 동적 색상 그룹
- Figma에서 색상 그룹명 자유롭게 변경/추가 가능
- 하드코딩 없이 모든 그룹 자동 인식
- 그룹명 변경 시 코드 수정 불필요

### 컴포넌트 스타일 확장
1. `core.json`에 새 컴포넌트 토큰 정의
2. `to-mui-theme.ts`의 `buildComponentsOverrides` 함수에 매핑 추가
3. 필요시 `theme.d.ts`에 타입 확장
4. `npm run tokens:build-theme` 실행

## 장점
- **단일 진실 소스**: Figma Variables = 유일한 디자인 원천
- **자동 동기화**: Figma 변경 → Tokens Studio → 테마 빌드
- **타입 안전성**: TypeScript로 theme 확장
- **일관성 보장**: 모든 컴포넌트가 동일한 토큰 사용

## 주의사항
- **하드코딩 금지**: 모든 디자인 값은 토큰 파일에서 참조
- **참조 우선순위**: `core.json` → `typography/Mode 1.json` → 기본값
- **Core → Palette 순서**: Core 먼저 반영 후 Palette 덮어쓰기
- **Props vs Tokens**: Props는 동작 제어, Tokens는 시각적 스타일
- **토큰 네이밍**: `component/property/variant/state` (예: `button/size/large`)
- **빌드 타이밍**: 자동(`npm run dev/build`), 수동(`npm run tokens:build-theme`)

## 참고 자료
- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [Default theme viewer](https://mui.com/material-ui/customization/default-theme/)
- [Typography](https://mui.com/material-ui/customization/typography/)
- [Theme components](https://mui.com/material-ui/customization/theme-components/)
- [Creating themed components](https://mui.com/material-ui/customization/creating-themed-components/)
- [Tokens Studio 문서](https://tokens.studio/)
- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/format/)

