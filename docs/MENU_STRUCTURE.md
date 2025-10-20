# 메뉴 구조 가이드

## 📋 개요

사이드바 메뉴는 최대 **3-depth** 계층을 지원합니다.

---

## 🏗️ 메뉴 타입

### 1. Item (단일 페이지)

```typescript
{
    id: 'home',
    type: 'item',
    path: '/',
    icon: 'HomeOutlined',  // 1-depth만 아이콘 표시
    pageId: 'home',
}
```

### 2. Group (폴더형 메뉴)

```typescript
{
    id: 'project',
    type: 'group',
    icon: 'FolderOutlined',
    children: [
        {
            id: 'project1',
            type: 'item',
            path: '/project/project1',
            pageId: 'project.project1',
        },
    ],
    actions: [  // 선택적
        {
            key: 'add',
            label: '+ New',
            type: 'button',
            onClick: () => { /* ... */ },
        },
    ],
}
```

---

## 📐 계층 구조

```
1-depth (메인 메뉴)
├─ Item: 아이콘 + 라벨
└─ Group: 아이콘 + 라벨 + 펼침/접힘

2-depth (하위 메뉴)
├─ Item: 라벨만
└─ Group: 라벨 + 펼침/접힘

3-depth (최하위 메뉴)
└─ Item: 라벨만
```

**아이콘 표시**: 1-depth만  
**최대 깊이**: 3-depth

---

## 🎯 액션 버튼

Group 메뉴에 액션 버튼 추가 가능:

### 일반 버튼

```typescript
{
    key: 'add',
    label: '+ New Project',
    type: 'button',
    onClick: () => {
        // 모달 열기 등
    },
    textColor: 'text.secondary',
}
```

### 정렬 버튼

```typescript
{
    key: 'sort',
    type: 'sort-group',
    sortOptions: [
        { key: 'name', label: '이름순' },
        { key: 'date', label: '날짜순' },
    ],
    onSort: (key, direction) => {
        // 정렬 로직
    },
}
```

---

## 📝 Title 로딩 규칙

`menus.ts`의 `title` 필드는 선택적입니다.

### 자동 로딩 (권장)

```typescript
// pages.ts
{
    id: 'project.project1',
    title: 'Project Name 1',
}

// menus.ts - title 생략
{
    id: 'project1',
    type: 'item',
    path: '/project/project1',
    pageId: 'project.project1',  // ← pages.ts에서 title 자동 로드
}
```

### 명시적 지정

```typescript
{
    id: 'project1',
    title: 'Custom Title',  // ← 명시하면 이 값 사용
    type: 'item',
    path: '/project/project1',
    pageId: 'project.project1',
}
```

---

## 🎨 예시

### 단순 구조

```typescript
export const MENUS: MenuItem[] = [
    {
        id: 'home',
        type: 'item',
        path: '/',
        icon: 'HomeOutlined',
        pageId: 'home',
    },
    {
        id: 'users',
        type: 'item',
        path: '/users',
        icon: 'PeopleOutlined',
        pageId: 'users',
    },
];
```

### 복잡한 구조 (3-depth)

```typescript
export const MENUS: MenuItem[] = [
    {
        id: 'projects',
        type: 'group',
        icon: 'FolderOutlined',
        actions: [
            {
                key: 'add',
                label: '+ New',
                type: 'button',
                onClick: () => console.log('New project'),
            },
        ],
        children: [
            // 2-depth item
            {
                id: 'project1',
                type: 'item',
                path: '/project/project1',
                pageId: 'project.project1',
            },
            // 2-depth group
            {
                id: 'team',
                type: 'group',
                children: [
                    // 3-depth item
                    {
                        id: 'members',
                        type: 'item',
                        path: '/project/team/members',
                        pageId: 'project.team.members',
                    },
                ],
            },
        ],
    },
];
```

---

## 🔗 관련 문서

- [설정 파일 가이드](CONFIG_STRUCTURE.md)
- [Figma 통합 가이드](FIGMA_SYNC_GUIDE.md)
