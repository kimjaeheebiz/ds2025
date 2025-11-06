# 디자인 시스템 개요


## 1. 개요

- 토큰 소스: Figma Variables → Tokens Studio → `design-system/tokens/generated`
- 어댑터: `design-system/generators/to-mui-theme.ts`가 MUI ThemeOptions로 변환
- 적용 대상: 컬러, 타이포그래피, 간격, 브레이크포인트, 쉐이프, 컴포넌트 오버라이드 전역 반영


## 2. 구조

```
Figma (Variables + Styles)
  ↓ Tokens Studio
design-system/tokens/generated/
  ├── core.json
  ├── palette/Light.json, palette/Dark.json
  ├── typography/Mode 1.json, spacing/Mode 1.json, ...
  ↓ 어댑터 (to-mui-theme.ts)
src/theme/generated/
  ├── theme.light.json
  └── theme.dark.json
  ↓ 런타임 확장 (src/theme/index.ts)
App 적용
```

## 3. 토큰 체계

- Core 우선 적용 후 Palette로 오버레이
- 컴포넌트 스타일은 tokens → MUI 컴포넌트 오버라이드로 반영


## 4. 워크플로우

1) Figma Variables 수정 → Tokens Studio 동기화
2) 저장소 반영 후 `npm run build:theme` 실행
3) 앱 전역 테마 자동 반영


## 5. 확장 원칙

- 토큰 네이밍: `component/property/variant/state` 규칙 유지
- 참조 우선순위: `core.json` → 영역별 토큰 → 기본값
- Props는 동작/자식 요소 제어, 시각 스타일은 토큰으로 일원화


## 6. 주의 사항

- 디자인 값 하드코딩 금지, 변환 규칙 일관성 유지
- 토큰 그룹/네이밍 변경 시 어댑터 매핑 점검 필요


## 7. 참고

- [MUI Theming](https://mui.com/material-ui/customization/theming/)
- [Tokens Studio](https://tokens.studio/)
- [Figma Variables 가이드](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [W3C Design Tokens 포맷](https://design-tokens.github.io/community-group/format/)
