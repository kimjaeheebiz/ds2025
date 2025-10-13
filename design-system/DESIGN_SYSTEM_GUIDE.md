# 디자인 시스템 가이드

## 📐 전체 구조

```
Figma (Variables + Styles)
  ↓ Tokens Studio
design-system/tokens/generated/
  ├── core.json                      ← 핵심 UI 스타일 (typography, elevation, components 등)
  ├── brand/Mode 1.json              ← 브랜드 색상/사이즈 (colors/sizes 구조)
  ├── palette/Light.json             ← 라이트 모드 테마
  ├── palette/Dark.json              ← 다크 모드 테마
  ├── material/colors/Mode 1.json    ← Material 색상 팔레트
  ├── typography/Mode 1.json         ← 폰트 사이즈/굵기/줄간격 등 참조값
├── spacing/Mode 1.json            ← 간격
  ├── breakpoints/Mode 1.json        ← 반응형 브레이크포인트 (xs, sm, md, lg, xl)
  └── shape/Mode 1.json              ← 모서리, 테두리 (borderRadius, borderWidth 등)
  ↓ 어댑터 (design-system/adapters/to-mui-theme.ts)
src/theme/generated/
  ├── theme.light.json               ← MUI ThemeOptions (Light)
  └── theme.dark.json                ← MUI ThemeOptions (Dark)
  ↓ 런타임 확장 (src/theme/index.ts)
App (브랜드 색상을 palette에 추가하여 sx prop 지원)
```

## 🎯 Core 선반영 + Palette 오버레이

### 1. Core 테마 (core.json)
디자인 시스템의 핵심 UI 정의(Figma Design Styles)

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

### 2. Palette 오버레이 (Light/Dark)
컬러 테마 선택적 적용

- `palette/Light.json` → `theme.palette` (mode: 'light')
- `palette/Dark.json` → `theme.palette` (mode: 'dark')

## 🔧 사용 방법

### 명령어 가이드
```bash
# 🎯 권장: npm 스크립트 사용 (자동화된 방식)
npm run tokens:build-theme

# 🔧 직접 실행 (개발/디버깅용)
npx tsx design-system/adapters/to-mui-theme.ts

# 🚀 개발 서버 (자동으로 predev 훅에서 토큰 빌드 실행)
npm run dev

# 📦 프로덕션 빌드 (자동으로 prebuild 훅에서 토큰 빌드 실행)
npm run build
```

### 테마 적용
- **위치**: `src/theme/index.ts`
- **기능**: 생성된 테마 JSON을 MUI Theme으로 변환
- **확장**: 브랜드 색상을 palette에 추가하여 sx prop에서 사용 가능

## 🎨 브랜드 토큰 사용법

### 색상 사용 (sx prop)
- **브랜드 색상**: `bgcolor: 'colorGroup.colorName.shade'` (예: `'hecto.orange.500'`)
- **MUI 색상**: `bgcolor: 'primary.main'`, `color: 'text.primary'`

### 크기 사용 (theme 함수)
- **브랜드 크기**: `theme.brand.sizes.sizeGroup.sizeName` (예: `theme.brand.sizes.logo.medium`)
- **폴백 지원**: 하위 호환성을 위한 다중 경로 체크

## 🌟 실전 예시: Brand 컴포넌트

### 1. Figma에서 컴포넌트 설계

#### Component Properties 정의
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

#### Variables 바인딩
Figma에서 Number Variables 생성 후 Component Variants에 연결:
- `logo/small` → Height: `{logo/small}`
- `logo/medium` → Height: `{logo/medium}`
- `logo/large` → Height: `{logo/large}`
- `logo/extraLarge` → Height: `{logo/extraLarge}`

### 2. Tokens Studio 동기화
1. Plugins → Tokens Studio → GitHub 연결
2. Push to GitHub (`design-tokens` 브랜치)
3. Pull Request → `master` 머지

### 3. 어댑터 매핑
- **위치**: `design-system/adapters/to-mui-theme.ts`
- **변환**: Brand 토큰을 MUI 테마 구조로 변환
  - `brandData.colors` → `theme.brand.colors`
  - `brandData.sizes` → `theme.brand.sizes`

### 4. TypeScript 타입 정의
- **위치**: `src/theme/theme.d.ts`
- **기능**: MUI 테마에 브랜드 토큰 타입 확장
- **타입 안전성**: 자동완성 및 컴파일 시 타입 체크

### 5. React 컴포넌트 구현
- **위치**: `src/components/Brand.tsx`
- **사용**: `useTheme()` 훅으로 브랜드 토큰 접근
- **예시**: `theme.brand.sizes.logo[size]`로 동적 크기 적용

## 🔄 디자인 변경 워크플로우
1. Figma Variables 수정 → Tokens Studio → GitHub (`design-tokens` 브랜치)
2. `master` 머지 → `npm run tokens:build-theme` → 자동 반영

**React 컴포넌트 코드 수정 불필요!**

## 📚 다른 컴포넌트 추가 방법
1. **Figma**: Component 생성 → Properties 정의 → Variables 바인딩
2. **Tokens Studio**: Push to GitHub → `master` 머지
3. **어댑터**: `to-mui-theme.ts`에서 토큰 매핑 추가
4. **타입**: `theme.d.ts`에서 Theme 인터페이스 확장
5. **컴포넌트**: `useTheme()`로 토큰 사용

## 🔄 동적 색상 그룹 처리
- **확장성**: Figma에서 색상 그룹명 자유롭게 변경/추가 가능
- **중립성**: 하드코딩 없이 모든 그룹 자동 인식
- **유연성**: 그룹명 변경 시 코드 수정 불필요
- **예시**: 런타임에 `brandColorGroupNames`에서 동적으로 그룹 목록 추출

## 🎨 컴포넌트 스타일 확장
1. **토큰 추가**: `core.json`에 새 컴포넌트 토큰 정의
2. **어댑터 매핑**: `to-mui-theme.ts`의 `buildComponentsOverrides` 함수에 매핑 로직 추가
3. **타입 정의**: 필요시 `theme.d.ts`에 타입 확장
4. **테마 빌드**: `npm run tokens:build-theme` 실행

## 🎯 장점
- ✅ **단일 진실 소스**: Figma Variables = 유일한 디자인 원천
- ✅ **자동 동기화**: Figma 변경 → Tokens Studio → 테마 빌드
- ✅ **타입 안전성**: TypeScript로 theme 확장
- ✅ **일관성 보장**: 모든 컴포넌트가 동일한 토큰 사용

## ✅ 체크리스트
**디자인 변경**: Figma 수정 → Tokens Studio → `design-tokens` 브랜치 → `master` 머지 → `npm run tokens:build-theme`
**신규 컴포넌트**: `core.json` 토큰 추가 → `to-mui-theme.ts` 매핑 → `npm run tokens:build-theme`

## 🚨 주의사항
1. **하드코딩 금지**: 모든 디자인 값은 토큰 파일에서 참조
2. **참조 우선순위**: `core.json` → `typography/Mode 1.json` → 기본값
3. **Core → Palette 순서**: Core 먼저 반영 후 Palette 덮어쓰기
4. **Props vs Tokens**: Props는 동작 제어, Tokens는 시각적 스타일
5. **토큰 네이밍**: `component/property/variant/state` (예: `button/size/large`)
6. **빌드 타이밍**: 자동(`npm run dev`), 수동(`npm run tokens:build-theme`), 직접(`npx tsx`)

## 📚 참고 자료

- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [Default theme viewer](https://mui.com/material-ui/customization/default-theme/)
- [Typography](https://mui.com/material-ui/customization/typography/)
- [Theme components](https://mui.com/material-ui/customization/theme-components/)
- [Creating themed components](https://mui.com/material-ui/customization/creating-themed-components/)
- [Tokens Studio 문서](https://tokens.studio/)
- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/format/)

## 🔗 관련 파일

- [design-system/adapters/to-mui-theme.ts](./adapters/to-mui-theme.ts) - 어댑터 구현
- [design-system/adapters/types.ts](./adapters/types.ts) - 타입 정의
