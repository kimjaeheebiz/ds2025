# Figma 컴포넌트 연동 가이드

## 🎨 Figma → React 컴포넌트 연동 방법

이 가이드는 Figma에서 디자인한 컴포넌트를 React 프로젝트에 연동하는 방법을 설명합니다.

## 📋 전체 흐름

```
Figma Component (Variables + Properties)
  ↓ Tokens Studio Plugin
design-system/tokens/generated/
  ├── core.json                      ← 공통 스타일 토큰
  ├── brand/Mode 1.json              ← 브랜드 전용 토큰
  └── ...
  ↓ Adapter (to-mui-theme.ts)
src/theme/generated/theme.*.json     ← MUI Theme
  ↓ TypeScript 타입 확장 (theme.d.ts)
React Component (theme 참조)         ← 하드코딩 제거!
```

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
Figma Design Panel에서:
1. **Number Variables 생성**:
   - `logo/size/small` = 20
   - `logo/size/medium` = 24
   - `logo/size/large` = 28
   - `logo/size/extraLarge` = 50

2. **Component Variants에 Variables 연결**:
   - size=small → Height: `{logo/size/small}`
   - size=medium → Height: `{logo/size/medium}`
   - size=large → Height: `{logo/size/large}`
   - size=extraLarge → Height: `{logo/size/extraLarge}`

### 2. Tokens Studio로 동기화

#### Tokens Studio 설정
1. Figma 플러그인 열기: Plugins → Tokens Studio
2. Settings → Sync providers → GitHub 연결
3. Push to GitHub:
   - Branch: `design-studio`
   - Commit message: "Add brand logo size tokens"
4. Pull Request 생성 → `master` 브랜치에 머지

#### 생성된 토큰 파일
```json
// design-system/tokens/generated/brand/Mode 1.json
{
  "logo": {
    "size": {
      "small": { "$type": "number", "$value": 20 },
      "medium": { "$type": "number", "$value": 24 },
      "large": { "$type": "number", "$value": 28 },
      "extraLarge": { "$type": "number", "$value": 50 }
    }
  }
}
```

### 3. 어댑터에 토큰 매핑

#### design-system/adapters/to-mui-theme.ts
```typescript
/**
 * Brand 토큰 → custom theme 확장
 */
function buildBrandExtensions() {
    try {
        const brandPath = path.join(TOKENS_ROOT, 'brand', 'Mode 1.json');
        const brand = readJson(brandPath);
        
        return {
            brand: {
                logo: {
                    size: {
                        small: brand?.logo?.size?.small?.$value ?? 20,
                        medium: brand?.logo?.size?.medium?.$value ?? 24,
                        large: brand?.logo?.size?.large?.$value ?? 28,
                        extraLarge: brand?.logo?.size?.extraLarge?.$value ?? 50,
                    },
                },
            },
        };
    } catch {
        return {};
    }
}

// buildCoreThemeOptions에 추가
const brandExtensions = buildBrandExtensions();
return {
    ...core,
    ...brandExtensions, // ← theme.brand.*로 사용 가능
};
```

#### 테마 빌드
```bash
npm run tokens:build-theme
```

### 4. TypeScript 타입 정의

#### src/theme/theme.d.ts
```typescript
import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        brand: {
            logo: {
                size: {
                    small: number;
                    medium: number;
                    large: number;
                    extraLarge: number;
                };
            };
        };
    }

    interface ThemeOptions {
        brand?: {
            logo?: {
                size?: {
                    small?: number;
                    medium?: number;
                    large?: number;
                    extraLarge?: number;
                };
            };
        };
    }
}
```

### 5. React 컴포넌트 구현

#### src/layouts/Brand.tsx
```typescript
import { Box, Typography, useTheme } from '@mui/material';

export interface BrandProps {
    size?: 'small' | 'medium' | 'large' | 'extraLarge';
    showText?: boolean;
    variant?: 'logo' | 'mark';
}

export const Brand = ({ size = 'medium', showText = true, variant = 'logo' }: BrandProps) => {
    const theme = useTheme();
    
    // ✨ Figma 토큰 사용 (하드코딩 제거!)
    const logoHeight = theme.brand.logo.size[size];
    const imageSrc = variant === 'mark' ? markImage : logoImage;

    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Box 
                component="img" 
                src={imageSrc} 
                alt="Brand"
                sx={{ height: logoHeight, width: 'auto' }} 
            />
            {showText && (
                <Typography variant="h6">
                    Brand Name
                </Typography>
            )}
        </Box>
    );
};
```

#### 사용 예시
```tsx
// 다양한 크기와 옵션
<Brand size="small" />
<Brand size="medium" showText={false} />
<Brand size="large" variant="mark" />
<Brand size="extraLarge" />
```

## 🔄 디자인 변경 워크플로우

### Figma에서 크기 변경
1. Figma Variables 패널에서 `logo/size/medium` 값 변경 (24 → 26)
2. Tokens Studio 플러그인 열기
3. Push to GitHub (design-studio 브랜치)
4. master 브랜치에 머지

### 프로젝트 반영
```bash
git pull origin master
npm run tokens:build-theme  # 또는 npm run dev (자동 실행)
```

**React 컴포넌트 코드 수정 불필요!** 테마만 재빌드하면 자동 반영됩니다.

## 📚 다른 컴포넌트 추가 방법

### 1. Figma 작업
- Component 생성 (예: Button, Card, Avatar 등)
- Properties 정의 (size, variant, state 등)
- Variables 바인딩 (spacing, colors, typography 등)

### 2. Tokens Studio 동기화
- Push to GitHub
- master 브랜치에 머지

### 3. 어댑터 확장
```typescript
// design-system/adapters/to-mui-theme.ts

// 옵션 1: MUI 표준 컴포넌트는 buildComponentsOverrides에 추가
if (tokensGlobal?.avatar?.size) {
  components.MuiAvatar = {
    styleOverrides: {
      root: ({ ownerState }) => ({
        width: theme.spacing(ownerState.size === 'small' ? 4 : 6),
        height: theme.spacing(ownerState.size === 'small' ? 4 : 6),
      }),
    },
  };
}

// 옵션 2: 커스텀 컴포넌트는 buildBrandExtensions 패턴 참고
function buildCustomComponentTokens() {
  const tokens = readJson(path.join(TOKENS_ROOT, 'custom', 'Mode 1.json'));
  return {
    custom: {
      avatar: {
        size: {
          small: tokens?.avatar?.size?.small?.$value ?? 32,
          medium: tokens?.avatar?.size?.medium?.$value ?? 40,
          large: tokens?.avatar?.size?.large?.$value ?? 56,
        },
      },
    },
  };
}
```

### 4. TypeScript 타입 추가
```typescript
// src/theme/theme.d.ts
declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            avatar: {
                size: {
                    small: number;
                    medium: number;
                    large: number;
                };
            };
        };
    }
}
```

### 5. React 컴포넌트 구현
```typescript
export const CustomAvatar = ({ size = 'medium' }) => {
    const theme = useTheme();
    const avatarSize = theme.custom.avatar.size[size];
    
    return <Avatar sx={{ width: avatarSize, height: avatarSize }} />;
};
```

## 🎯 장점

### ✅ 단일 진실 소스 (Single Source of Truth)
- Figma Variables = 유일한 디자인 원천
- React 코드는 토큰만 참조

### ✅ 자동 동기화
- Figma 변경 → Tokens Studio 커밋 → 테마 빌드
- 코드 수정 없이 디자인 반영

### ✅ 타입 안전성
- TypeScript로 theme 확장
- 자동완성 및 타입 체크

### ✅ 일관성 보장
- 모든 컴포넌트가 동일한 토큰 사용
- 디자인 시스템 일관성 유지

## 🚨 주의사항

### 1. Props vs Tokens
- **Props**: 컴포넌트 동작 제어 (showText, onClick 등)
- **Tokens**: 시각적 스타일만 (size, color, spacing 등)

### 2. 토큰 네이밍 규칙
```
component/property/variant/state
예: button/size/large, chip/color/primary/hover
```

### 3. 빌드 타이밍
- 개발 중: `npm run dev` (prebuild에서 자동 빌드)
- 프로덕션: `npm run build` (prebuild에서 자동 빌드)
- 수동: `npm run tokens:build-theme`

## 📖 참고 자료

- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [Tokens Studio 문서](https://tokens.studio/)
- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/format/)

## 🔗 관련 문서

- [THEME_ARCHITECTURE.md](./THEME_ARCHITECTURE.md) - 테마 전체 구조
- [design-system/adapters/to-mui-theme.ts](./adapters/to-mui-theme.ts) - 어댑터 구현

