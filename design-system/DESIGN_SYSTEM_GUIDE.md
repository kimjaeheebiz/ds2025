# 디자인 시스템 가이드

## 📐 전체 구조

```
Figma (Variables + Styles)
  ↓ Tokens Studio
design-system/tokens/foundation/
  ├── core.json                      # 핵심 UI 스타일
  ├── brand/Mode 1.json              # 브랜드 색상/사이즈
  ├── palette/Light.json             # 라이트 모드 테마
  ├── palette/Dark.json              # 다크 모드 테마
  ├── material/colors/Mode 1.json    # Material 색상 팔레트
  ├── typography/Mode 1.json         # 폰트 설정
  ├── spacing/Mode 1.json            # 간격 설정
  ├── breakpoints/Mode 1.json        # 반응형 브레이크포인트
  └── shape/Mode 1.json              # 모서리, 테두리
  ↓ 어댑터 (design-system/generators/to-mui-theme.ts)
src/theme/generated/
  ├── theme.light.json               # MUI ThemeOptions (Light)
  └── theme.dark.json                # MUI ThemeOptions (Dark)
  ↓ 런타임 확장 (src/theme/index.ts)
App (브랜드 색상을 palette에 추가하여 sx prop 지원)
```

## 🎨 토큰 시스템

### Core 테마 (core.json)
디자인 시스템의 핵심 UI 정의
- **typography**: 제목, 본문, 버튼 텍스트 스타일
- **spacing**: 컴포넌트 간격 설정
- **breakpoints**: 반응형 브레이크포인트
- **shape**: 모서리 둥글기, 테두리 두께
- **shadows**: 엘리베이션 그림자
- **components**: MUI 컴포넌트 스타일 오버라이드

### Palette 오버레이 (Light/Dark)
컬러 테마 선택적 적용
- 라이트/다크 모드별 색상 팔레트
- 브랜드 색상 자동 통합

## 🚀 명령어

### 토큰 빌드
```bash
# 테마 토큰 빌드
npm run build:theme

# 메뉴 동기화
npm run build:menu
```

### 개발 및 빌드
```bash
# 개발 서버 (자동으로 토큰 빌드 포함)
npm run dev

# 프로덕션 빌드 (자동으로 토큰 빌드 포함)
npm run build
```

## 💡 브랜드 토큰 사용

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

## 🔄 워크플로우

### 디자인 변경
1. Figma Variables 수정
2. Tokens Studio → Push to GitHub
3. Pull Request → master 머지
4. `npm run build:theme` 실행 → 자동 반영

### 컴포넌트 추가
1. **Figma**: Component 생성 → Properties 정의 → Variables 바인딩
2. **Tokens Studio**: Push to GitHub → master 머지
3. **어댑터**: 토큰 매핑 추가
4. **타입**: Theme 인터페이스 확장
5. **컴포넌트**: `useTheme()`로 토큰 사용

## ✨ 핵심 개념

### 동적 색상 그룹
- Figma에서 색상 그룹명 자유롭게 변경/추가 가능
- 하드코딩 없이 모든 그룹 자동 인식
- 그룹명 변경 시 코드 수정 불필요

### 컴포넌트 스타일 확장
1. `core.json`에 새 컴포넌트 토큰 정의
2. MUI 테마 변환기에 매핑 추가
3. 필요시 타입 확장
4. `npm run build:theme` 실행

## 🎯 장점
- **단일 진실 소스**: Figma Variables = 유일한 디자인 원천
- **자동 동기화**: Figma 변경 → Tokens Studio → 테마 빌드
- **타입 안전성**: TypeScript로 theme 확장
- **일관성 보장**: 모든 컴포넌트가 동일한 토큰 사용

## ⚠️ 주의사항
- **하드코딩 금지**: 모든 디자인 값은 토큰 파일에서 참조
- **참조 우선순위**: `core.json` → `typography/Mode 1.json` → 기본값
- **Core → Palette 순서**: Core 먼저 반영 후 Palette 덮어쓰기
- **Props vs Tokens**: Props는 동작 제어, Tokens는 시각적 스타일
- **토큰 네이밍**: `component/property/variant/state` 형식
- **빌드 타이밍**: 자동(`npm run dev/build`), 수동(`npm run build:theme`)

## 📚 참고 자료
- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [Tokens Studio 문서](https://tokens.studio/)
- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/format/)