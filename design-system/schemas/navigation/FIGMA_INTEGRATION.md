# Figma 통합 가이드

## 📋 개요

네비게이션 메뉴 구조를 Figma와 동기화하여, 디자이너가 메뉴 구조를 직접 관리할 수 있습니다.

---

## 🔄 동기화 대상

### Figma에서 관리

```typescript
{
    id: string;           // 메뉴 ID
    title: string;        // 메뉴 제목
    type: 'group' | 'item';
    url: string;          // URL 경로
    icon?: string;        // MUI 아이콘 이름
    children?: MenuItem[]; // 하위 메뉴
    actions?: ActionButton[]; // 액션 버튼
}
```

### 코드에서만 관리

```typescript
{
    pageId: string;       // pages.ts 참조 (코드에서 매핑)
}
```

---

## 🎨 Figma 설정

### Component Properties

```
NavItem Component:
├── id (Text) *필수
│   예: "users", "project1"
│
├── title (Text) *선택적
│   예: "Users" (비워두면 pages.ts에서 로드)
│
├── type (Variant) *필수
│   예: "item" | "group"
│
├── url (Text) *필수
│   예: "/users", "/project/project1"
│
└── icon (Text) *선택적
    예: "PeopleOutlined" (1-depth만)
```

---

## 🔗 URL 관리 전략

### 권장: 하이브리드 방식

| 전략 | 설명 | 사용 시기 |
|------|------|----------|
| **자동 생성** | id → URL 변환 | 일반 케이스 |
| **직접 입력** | Figma에서 명시 | 특수 케이스 |

### 자동 생성 규칙

```typescript
// Figma에서 url을 비워두면 자동 생성
id: "users"          → url: "/users"
id: "project.item1"  → url: "/project/item1"
id: "myNewPage"      → url: "/my-new-page"

// 특수 케이스는 Figma에서 직접 지정
id: "home", url: "/"
id: "dashboard", url: "/app/dashboard"
```

---

## 📦 동기화 흐름

```
1. Figma Design
   ↓ (Export JSON via Plugin)
2. design-system/schemas/navigation/navigation.example.json
   ↓ (Validation)
3. design-system/validators/navigation-validator.ts
   ↓ (Sync Script)
4. src/config/menus.ts (자동 업데이트)
   ↓ (Manual)
5. pageId 매핑 추가
```

---

## ✅ 유효성 검사

### 스키마 검증

```bash
npm run validate:navigation
```

검증 항목:
- ✅ 필수 필드 (`id`, `type`, `url`)
- ✅ 타입 정합성 (`type: 'item'`은 `children` 없음)
- ✅ URL 형식 (`/`로 시작)
- ✅ 아이콘 이름 (MUI 아이콘 존재 여부)
- ✅ 3-depth 제한

---

## 📝 예시

### Figma 설정 예시

```json
{
  "id": "projects",
  "type": "group",
  "icon": "FolderOutlined",
  "children": [
    {
      "id": "project1",
      "type": "item",
      "url": "/project/project1"
    }
  ]
}
```

### 동기화 후 코드 (수동 매핑 필요)

```typescript
export const MENUS: MenuItem[] = [
    {
        id: 'projects',
        type: 'group',
        icon: 'FolderOutlined',
        children: [
            {
                id: 'project1',
                type: 'item',
                url: '/project/project1',
                pageId: 'project.project1', // ← 수동 추가
            },
        ],
    },
];
```

---

## 🚀 Sync Script (예정)

```bash
# Figma 동기화 (미구현)
npm run sync:figma
```

동기화 시 자동 처리:
1. Figma JSON 읽기
2. 스키마 검증
3. `menus.ts` 업데이트 (pageId 제외)
4. 개발자가 pageId 수동 매핑

---

## 📐 스키마

JSON Schema: `navigation.schema.json`
- 메뉴 구조 정의
- 타입 검증 규칙
- 필드 제약사항

---

## 💡 Best Practices

1. **id 일관성**: 소문자 + 케밥 케이스 권장
2. **url 명확성**: RESTful 규칙 따르기
3. **title 선택적 사용**: 자주 변경되는 경우 pages.ts에서 관리
4. **icon은 1-depth만**: 하위 메뉴는 아이콘 없음
5. **3-depth 제한**: 더 깊은 구조는 피하기

---

더 자세한 내용은 `navigation.schema.json` 참조
