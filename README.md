# Agent Platform Design System 2025

React + TypeScript + Vite 기반 관리 시스템

## 🚀 시작하기

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
```

---

## ✨ 새 페이지 추가

### 1. 페이지 메타데이터 정의

```typescript
// src/config/pages.ts
export const PAGES: PageConfig[] = [
    {
        id: 'myNewPage',
        title: '새로운 페이지',
        showPageHeader: true,
    },
];
```

### 2. 메뉴에 추가

```typescript
// src/config/menus.ts
export const MENUS: MenuItem[] = [
    {
        id: 'myNewPage',
        type: 'item',
        url: '/my-new-page',
        icon: 'StarOutlined',
        pageId: 'myNewPage',
    },
];
```

### 3. 페이지 컴포넌트 생성

```tsx
// src/pages/my-new-page/MyNewPage.tsx
export const MyNewPage = () => {
    return <div>새로운 페이지</div>;
};
```

이제 다음이 자동으로 처리됩니다:
- ✅ React Router 라우팅
- ✅ 사이드바 메뉴 표시
- ✅ Breadcrumb 생성
- ✅ 페이지 타이틀 설정

---

## 📁 프로젝트 구조

```
src/
├── config/              # 설정
│   ├── pages.ts         # 페이지 메타데이터
│   ├── menus.ts         # 메뉴 + 라우팅
│   ├── navigation.ts    # 빌더
│   └── app.ts           # 앱 설정
├── pages/               # 페이지 컴포넌트
├── layouts/             # 레이아웃
├── components/          # 공통 컴포넌트
├── hooks/               # 커스텀 훅
└── theme/               # 테마

design-system/
├── tokens/              # 디자인 토큰 (Figma 동기화)
├── schemas/             # JSON Schema
└── validators/          # 유효성 검사

docs/
├── CONFIG_STRUCTURE.md  # 설정 파일 가이드
├── MENU_STRUCTURE.md    # 메뉴 구조 가이드
└── FIGMA_SYNC_GUIDE.md  # Figma 동기화 가이드
```

---

## 🎨 Figma 동기화

Tokens Studio로 Figma 디자인과 자동 동기화:

```bash
# Figma 토큰 → mainmenu.ts 동기화
npm run build:menu

# 테마 토큰 빌드
npm run build:theme
```

자세한 내용은 [Figma 동기화 가이드](docs/FIGMA_SYNC_GUIDE.md) 참조

---

## 🔧 주요 기능

- **자동 라우팅**: 설정 기반 라우트 생성 + Lazy loading
- **스마트 네비게이션**: 3-depth 계층, 액션 버튼, 자동 활성화
- **Breadcrumb**: URL 기반 자동 생성
- **Design System**: Figma 토큰 동기화

---

## 🛠️ 기술 스택

- React 18, TypeScript, Vite
- Material-UI (MUI)
- React Router v6
- Design Tokens (Figma 연동)

---

**버전**: 1.0.0
