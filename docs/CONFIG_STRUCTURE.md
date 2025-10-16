# 설정 파일 가이드

## 📋 개요

설정은 `pages.ts`, `menus.ts`, `navigation.ts`, `app.ts`로 분리되어 있습니다.

---

## 📄 pages.ts

**역할**: 페이지 메타데이터 관리

```typescript
export interface PageConfig {
    id: string;              // 페이지 ID (예: 'home', 'project.project1')
    title: string;           // 페이지 제목
    showPageHeader?: boolean; // 페이지 헤더 표시 (기본: true)
    layout?: 'default' | 'auth' | 'error'; // 레이아웃 타입
}

export const PAGES: PageConfig[] = [
    {
        id: 'home',
        title: 'Home',
        showPageHeader: false,
    },
];
```

**특징**:
- URL은 포함하지 않음 (menus.ts에서 관리)
- 페이지 표시 설정만 관리

---

## 📂 menus.ts

**역할**: 메뉴 구조 + URL 관리

```typescript
export type MenuType = 'group' | 'item';

export interface MenuItemLeaf {
    id: string;
    type: 'item';
    url: string;             // URL 경로
    icon?: string;           // MUI 아이콘 (1-depth만)
    pageId: string;          // pages.ts 참조
    title?: string;          // 선택적 (생략 시 pages.ts에서 로드)
}

export interface MenuGroup {
    id: string;
    type: 'group';
    icon?: string;
    children: MenuItem[];
    actions?: ActionButton[]; // 액션 버튼
    title?: string;
}

export const MENUS: MenuItem[] = [
    {
        id: 'home',
        type: 'item',
        url: '/',
        icon: 'HomeOutlined',
        pageId: 'home',
    },
];
```

**특징**:
- URL과 메뉴 계층 구조 정의
- `title` 생략 가능 (자동으로 pages.ts에서 로드)
- 배열 순서 = 메뉴 표시 순서
- 액션 버튼 지원 (New Project, 정렬 등)

---

## 🔗 navigation.ts

**역할**: pages.ts + menus.ts 결합 및 헬퍼 함수 제공

자동으로 생성되는 항목:
- `NAVIGATION_MENU`: 렌더링용 메뉴 구조
- `ALL_ROUTES`: 모든 라우트 정보
- `getBreadcrumbPath()`: Breadcrumb 경로 생성
- `getMenuActions()`: 메뉴 액션 가져오기
- `findRouteByUrl()`: URL로 라우트 찾기

**개발자가 직접 수정할 필요 없음** (자동 빌더)

---

## ⚙️ app.ts

**역할**: 앱 설정 및 재내보내기

```typescript
export const APP_INFO = {
    name: 'Agent Platform',
    description: 'Hecto Agent Platform',
    version: '1.0.0',
    // ...
};

export const PAGE_METADATA = /* 자동 생성 */;
export const getPageMetadata = (pageId: string) => /* ... */;
export const getBrowserTitle = (pageId: string) => /* ... */;

// 편의 함수 재내보내기
export { findRouteByUrl, getBreadcrumbPath, /* ... */ } from './navigation';
```

---

## 🎯 관심사의 분리

| 파일 | 관리 항목 | Figma 동기화 |
|------|-----------|--------------|
| `pages.ts` | 페이지 메타데이터 (ID, 제목, 레이아웃) | ❌ |
| `menus.ts` | 메뉴 구조, URL, 아이콘, 액션 | ✅ |
| `navigation.ts` | 자동 빌더 (수정 불필요) | ❌ |
| `app.ts` | 앱 설정, 재내보내기 | ❌ |

---

## 📝 작성 규칙

### ✅ 올바른 예시

```typescript
// pages.ts - 페이지 정보만
{
    id: 'users',
    title: 'Users',
    showPageHeader: true,
}

// menus.ts - 메뉴 + URL
{
    id: 'users',
    type: 'item',
    url: '/users',
    icon: 'PeopleOutlined',
    pageId: 'users',
}
```

### ❌ 잘못된 예시

```typescript
// ❌ pages.ts에 URL 포함 금지
{
    id: 'users',
    url: '/users',  // menus.ts에서 관리!
}

// ❌ menus.ts에 페이지 설정 포함 금지
{
    id: 'users',
    showPageHeader: true,  // pages.ts에서 관리!
}
```

---

## 🔄 데이터 흐름

```
pages.ts (메타데이터) + menus.ts (메뉴+URL)
                ↓
        navigation.ts (빌더)
                ↓
        NAVIGATION_MENU (렌더링용)
                ↓
        Navigation 컴포넌트
```

---

더 자세한 메뉴 구조는 [MENU_STRUCTURE.md](MENU_STRUCTURE.md) 참조
