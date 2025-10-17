# Figma 메인 메뉴 생성 가이드

## 📋 개요

Tokens Studio를 사용하여 Figma의 메인 메뉴 디자인을 자동으로 코드에 생성합니다.

---

## 🎨 Figma 설정

### 1. Tokens Studio 플러그인 설치

Figma에서 Tokens Studio for Figma 플러그인 설치

### 2. 토큰 구조 생성

```json
{
  "id": {
    "home": { "value": "home", "type": "text" },
    "project": { "value": "project", "type": "text" },
    "project1": { "value": "project1", "type": "text" }
  },
  "label": {
    "home": { "value": "Home", "type": "text" },
    "project": { "value": "Project", "type": "text" },
    "project1": { "value": "Project 1", "type": "text" }
  },
  "path": {
    "home": { "value": "/", "type": "text" },
    "project": { "value": "", "type": "text", "description": "그룹 메뉴" },
    "project1": { "value": "/project/project1", "type": "text" }
  }
}
```

### 3. ListItem에 토큰 연결

각 메뉴 ListItem에 대응하는 `id` 토큰을 연결합니다.

예시:
- Home ListItem → `menu.id.home` 토큰
- Project ListItem → `menu.id.project` 토큰

---

## 🔄 동기화 프로세스

### 1단계: Figma에서 토큰 내보내기

1. Tokens Studio 플러그인 열기
2. Export → JSON 선택
3. 파일 저장

### 2단계: 토큰 파일 저장

내보낸 JSON을 다음 위치에 저장:

```
design-system/tokens/pages/navigation/Mode 1.json
```

### 3단계: 동기화 스크립트 실행

```bash
npm run build:menu
```

### 4단계: 결과 확인

```
✅ 자동 생성된 파일:
- src/config/mainmenu.ts (기존 파일은 mainmenu.backup.ts로 백업)

📝 확인 사항:
1. pageId 매핑이 올바른지 검토
2. 필요시 액션 버튼 수동 추가
3. npm run dev로 앱에서 확인
```

---

## 📐 토큰 작성 규칙

### id (필수)

메뉴 아이템의 고유 식별자

```json
{
  "id": {
    "home": { "value": "home", "type": "text" },
    "users": { "value": "users", "type": "text" }
  }
}
```

### label (필수)

메뉴에 표시될 텍스트

```json
{
  "label": {
    "home": { "value": "Home", "type": "text" },
    "users": { "value": "Users", "type": "text" }
  }
}
```

### path (필수)

URL 경로
- **group 메뉴**: 빈 문자열 `""`
- **item 메뉴**: URL 경로 (예: `/users`, `/project/project1`)

```json
{
  "path": {
    "home": { "value": "/", "type": "text" },
    "project": { "value": "", "type": "text", "description": "그룹 메뉴" },
    "project1": { "value": "/project/project1", "type": "text" }
  }
}
```

---

## 🎯 자동 처리 항목

동기화 스크립트가 자동으로 처리하는 항목:

### ✅ 메뉴 타입 결정

```typescript
path === "" → type: 'group'
path !== "" → type: 'item'
```

### ✅ 계층 구조 생성

```typescript
/project/project1 → project 그룹의 자식으로 자동 배치
/users → 1-depth item으로 배치
```

### ✅ pageId 자동 생성

```typescript
home → pageId: "home"
project1 (parent: project) → pageId: "project.project1"
users → pageId: "users"
```

### ✅ 아이콘 자동 매핑

```typescript
home → icon: 'HomeOutlined'
project → icon: 'FolderOutlined'
users → icon: 'PeopleOutlineOutlined'
components → icon: 'WidgetsOutlined'
```

---

## ⚠️ 수동 작업 필요

### 1. 액션 버튼

액션 버튼(+ New Project, 정렬)은 수동으로 추가해야 합니다.

```typescript
{
    id: 'project',
    type: 'group',
    actions: [
        {
            key: 'add',
            label: '+ New Project',
            type: 'button',
            onClick: () => { /* ... */ },
        },
    ],
    children: [...]
}
```

### 2. pageId 검토

자동 생성된 pageId가 `pages.ts`의 정의와 일치하는지 확인:

```typescript
// src/config/pages.ts
export const PAGES: PageConfig[] = [
    { id: 'home', title: 'Home' },
    { id: 'project.project1', title: 'Project Name 1' },
    { id: 'project.project2', title: 'Project Name 2' },
];
```

---

## 🔧 커스터마이징

### 아이콘 매핑 수정

```typescript
// design-system/generators/figma-menu-sync.ts
const ICON_MAP: Record<string, string> = {
    home: 'HomeOutlined',
    project: 'FolderOutlined',
    users: 'PeopleOutlineOutlined',
    components: 'WidgetsOutlined',
    // 새 메뉴 추가
    dashboard: 'DashboardOutlined',
};
```

### pageId 생성 규칙 수정

```typescript
// design-system/generators/figma-menu-sync.ts
function generatePageId(id: string, parentId?: string): string {
    if (parentId) {
        return `${parentId}.${id}`;
    }
    return id;
}
```

---

## 📝 워크플로우 예시

### 시나리오: 새 메뉴 추가

1. **Figma에서 작업**
   - 새 ListItem 디자인
   - Tokens Studio에 id, label, path 추가
   - ListItem에 토큰 연결

2. **토큰 내보내기**
   ```bash
   Tokens Studio → Export → JSON
   ```

3. **토큰 파일 저장**
   ```bash
   design-system/tokens/foundation/menu/menu.json
   ```

4. **동기화 실행**
   ```bash
   npm run build:menu
   ```

5. **pages.ts 업데이트**
   ```typescript
   // src/config/pages.ts
   export const PAGES: PageConfig[] = [
       // ...
       { id: 'newMenu', title: 'New Menu', showPageHeader: true },
   ];
   ```

6. **페이지 컴포넌트 생성**
   ```bash
   src/pages/new-menu/NewMenu.tsx
   ```

7. **확인**
   ```bash
   npm run dev
   ```

---

## 🚨 주의사항

1. **동기화 전 백업**: 기존 `mainmenu.ts`는 자동으로 `mainmenu.backup.ts`로 백업됩니다

2. **수동 수정 보존**: 동기화 후 수동으로 추가한 내용(액션 버튼 등)은 다시 추가해야 합니다

3. **토큰 키 일관성**: id, label, path의 키 이름이 동일해야 합니다
   ```json
   {
     "id": { "home": {...} },
     "label": { "home": {...} },  // ← 같은 키 "home"
     "path": { "home": {...} }
   }
   ```

---

## 🔗 관련 문서

- [메뉴 구조 가이드](MENU_STRUCTURE.md)
- [설정 파일 가이드](CONFIG_STRUCTURE.md)
- [Figma 통합 상세](../design-system/schemas/navigation/FIGMA_INTEGRATION.md)

