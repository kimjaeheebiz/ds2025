# 테마 아키텍처 가이드

## 📐 전체 구조

```
Figma (Variables + Styles)
  ↓ Tokens Studio
design-system/tokens/generated/
  ├── core.json                      ← 핵심 UI 토큰 (typography, elevation, components)
  ├── palette/Light.json             ← 라이트 모드 컬러
  ├── palette/Dark.json              ← 다크 모드 컬러
  ├── typography/Mode 1.json         ← 폰트 사이즈/웨이트 참조값
  ├── spacing/Mode 1.json
  ├── breakpoints/Mode 1.json
  └── shape/Mode 1.json
  ↓ 어댑터 (design-system/adapters/to-mui-theme.ts)
src/theme/generated/
  ├── theme.light.json               ← MUI ThemeOptions (Light)
  └── theme.dark.json                ← MUI ThemeOptions (Dark)
  ↓ 런타임
App (src/theme/index.ts)
```

## 🎯 Core 선반영 + Palette 오버레이

### 1. Core 테마 (core.json)
디자인 시스템의 핵심 UI를 정의합니다.

- **typography**: `core.typography.*`
  - h1~h6, body1, body2, subtitle1, subtitle2, caption, overline, button
  - 참조: `{_fontSize.6rem}`, `{lineHeights.0}`, `{fontWeights.pretendard-variable-0}`
- **spacing**: `spacing/Mode 1.json` → `theme.spacing` (기본 8px)
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
컬러 테마만 선택적으로 적용합니다.

- `palette/Light.json` → `theme.palette` (mode: 'light')
- `palette/Dark.json` → `theme.palette` (mode: 'dark')

## 🔧 사용 방법

### 토큰 변경 후 빌드
```bash
npm run tokens:build-theme
```

### 개발 서버 시작 (자동 빌드)
```bash
npm run dev  # predev에서 자동으로 tokens:build-theme 실행
```

### 테마 적용 (src/theme/index.ts)
```typescript
import { createTheme } from '@mui/material/styles';
import lightThemeOptions from './generated/theme.light.json';
import darkThemeOptions from './generated/theme.dark.json';

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);
```

## 📝 토큰 참조 규칙

### fontSize 참조
```json
// core.json
{
  "typography": {
    "h1": {
      "$value": {
        "fontSize": "{_fontSize.6rem}"  // → typography/Mode 1.json._fontSize['6rem'] = 96 → "6rem"
      }
    }
  }
}
```

### lineHeight 참조
```json
{
  "lineHeight": "{lineHeights.0}"  // → core.lineHeights['0'] = "120%" → 1.2
}
```

### fontWeight 참조
```json
{
  "fontWeight": "{fontWeights.pretendard-variable-0}"  // → "Regular" → 400
}
```

### textCase 참조
```json
{
  "textCase": "{textCase.uppercase}"  // → textTransform: "uppercase"
}
```

## 🎨 컴포넌트 스타일 확장

새 컴포넌트 추가 예시 (design-system/adapters/to-mui-theme.ts):

```typescript
// core.json에 추가
{
  "newComponent": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontSize": "{_fontSize.1rem}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.6}"
      }
    }
  }
}

// 어댑터에 매핑 추가
if (tokensCore?.newComponent?.label?.$value) {
  components.MuiNewComponent = {
    styleOverrides: {
      label: parseTypoToken(tokensCore.newComponent.label.$value),
    },
  };
}
```

## 📚 MUI 공식 문서 참조

- [Theming](https://mui.com/material-ui/customization/theming/)
- [Default theme viewer](https://mui.com/material-ui/customization/default-theme/)
- [Typography](https://mui.com/material-ui/customization/typography/)
- [Theme components](https://mui.com/material-ui/customization/theme-components/)
- [Creating themed components](https://mui.com/material-ui/customization/creating-themed-components/)

## ✅ 체크리스트

### 디자인 변경 시
- [ ] Figma에서 Variables/Styles 수정
- [ ] Tokens Studio로 design-studio 브랜치에 커밋
- [ ] master 브랜치에 머지
- [ ] `npm run tokens:build-theme` 실행
- [ ] `src/theme/generated/*.json` 확인
- [ ] 개발 서버에서 시각 검증

### 새 컴포넌트 추가 시
- [ ] `core.json`에 토큰 추가
- [ ] `design-system/adapters/to-mui-theme.ts`의 `buildComponentsOverrides`에 매핑 추가
- [ ] 테마 빌드 실행
- [ ] 컴포넌트에서 테마 적용 확인

## 🚨 주의사항

1. **하드코딩 금지**: 모든 디자인 값은 `core.json` 또는 토큰 파일에서 참조
2. **참조 우선순위**: `core.json` → `typography/Mode 1.json` → 기본값
3. **Core → Palette 순서**: Core가 먼저 반영되고, Palette가 덮어씁니다
4. **MUI 구조 준수**: `theme.typography`, `theme.components` 등 MUI 공식 구조 유지



