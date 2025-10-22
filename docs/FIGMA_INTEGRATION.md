# Figma API 통합 가이드

## 🚀 시작하기

### 환경 설정
```bash
# Figma API 환경 설정
npm run figma:setup

# 상태 확인
npm run figma:status
```

### 필수 설정
`.env` 파일에 다음 환경 변수를 추가하세요:

```bash
# Figma Personal Access Token
FIGMA_TOKEN=your_figma_personal_access_token

# Figma 파일 키들
FIGMA_FILE_LIBRARY=your_library_file_key
FIGMA_FILE_PLATFORM=your_platform_file_key
```

## 🔑 Figma Personal Access Token 발급

1. [Figma Settings](https://www.figma.com/settings) 페이지로 이동
2. "Personal access tokens" 섹션에서 "Create new token" 클릭
3. 토큰 이름 입력 (예: "Agent Platform Integration")
4. 생성된 토큰을 복사하여 `FIGMA_TOKEN` 환경 변수에 설정

## 📁 Figma 파일 키 확인

Figma 파일 URL에서 파일 키를 추출할 수 있습니다:

```
https://www.figma.com/design/[FILE_KEY]/[FILE_NAME]
```

## 🎯 Figma 노드 ID 확인

Figma에서 특정 페이지나 컴포넌트의 노드 ID를 추출할 수 있습니다:

### 노드 ID 추출 방법

#### **페이지 노드 ID**
1. **페이지 탭 우클릭** → "Copy link"
2. **URL에서 노드 ID 확인**:
   ```
   https://www.figma.com/design/[FILE_KEY]/[FILE_NAME]?node-id=[NODE_ID]
   ```

#### **프레임/컴포넌트 노드 ID**
1. **프레임/컴포넌트 선택** → 우클릭 → "Copy link"
2. **URL에서 노드 ID 확인**:
   ```
   https://www.figma.com/design/[FILE_KEY]/[FILE_NAME]?node-id=[NODE_ID]
   ```

#### **개발자 도구 사용 (고급)**
1. **프레임 선택** → `F12` (개발자 도구 열기)
2. **Console 탭**에서 다음 명령어 실행:
   ```javascript
   console.log(figma.currentPage.selection[0].id);
   ```

### 노드 ID 형식

#### **URL 형식 (피그마 웹에서 복사하거나 플러그인으로 추축)**
- **페이지 노드**: `0-1`, `0-2` (페이지 번호)
- **프레임 노드**: `166-6455`, `598-3722` (프레임 ID)
- **컴포넌트 노드**: `13761-1677` (컴포넌트 ID)

#### **API 형식 (코드에서 사용)**
- **페이지 노드**: `0:1`, `0:2` (콜론 사용)
- **프레임 노드**: `166:6455`, `598:3722` (콜론 사용)
- **컴포넌트 노드**: `13761:1677` (콜론 사용)

#### **⚠️ 중요: 형식 변환 필요**
피그마 URL에서 복사한 노드 ID는 하이픈(`-`)을 사용하지만, API에서는 콜론(`:`)을 사용해야 합니다.

```
URL에서 복사: ?node-id=469-3583
API에서 사용: 469:3583
```

### 설정 파일에 추가

추출한 노드 ID를 `src/api/figma/config.ts`의 `pageNodes`에 추가:
```typescript
pageNodes: {
    // Layout Templates (원본)
    layoutTemplates: {
        default: '469:7679',
        auth: '0:3',
        error: '0:4',
    },

    // Layout Instances (페이지 실제 사용)
    layoutInstances: {
        default: '469:3583',
        auth: '0:5',
        error: '0:6',
    },

    // Pages (Frame)
    pages: {
        project: '166:6455',
        users: '598:3722',
        components: '286:6314',
    },

    // Library Components
    libraryComponents: '13761:1677'
}
```

## 🎯 피그마 디자인 구조 이해

### 레이아웃과 페이지 콘텐츠 분리

피그마 API는 기존 레이아웃 시스템(`DefaultLayout`, `AuthLayout`, `ErrorLayout`)과 완벽하게 통합됩니다:

#### **1. 레이아웃 구조**
```
DefaultLayout.tsx
├── Header (고정)
├── Sidebar (고정)  
└── <Outlet /> ← 여기에 페이지 콘텐츠 삽입
```

#### **2. 피그마 디자인 구조**
```
페이지 프레임
├── Header 영역 (레이아웃에서 처리)
├── Sidebar 영역 (레이아웃에서 처리)
└── Main Content 프레임 ← 이 영역만 추출하여 <Outlet />에 삽입
```

### Main Content 프레임 자동 추출

피그마에서 **"Main Content"** 프레임을 자동으로 찾아서 페이지 콘텐츠로 추출합니다:

#### **지원하는 프레임 이름 (피그마 구조 기반)**

##### **레이아웃 템플릿/인스턴스**
```
layoutTemplate: defaultLayoutTemplate
layoutInstance: DefaultLayout
```

##### **시멘틱 영역 (피그마 구조 반영)**
```
mainArea: MainArea
main: Main
mainContent: MainContent
```

##### **컴포넌트 인스턴스 (피그마 구조 반영)**
```
header: <Header>
sidebar: <Sidebar>
pageHeader: <PageHeader>
drawer: <Drawer>
```

##### **기타 영역 (피그마 구조 반영)**
```
content: Content
submenu: <Submenu>
typography: <Typography>
```

#### **실제 피그마 구조 예시**

##### **A. 기본 레이아웃 구조**
```
defaultLayoutTemplate (Root Frame)
└── DefaultLayout (Layout Instance)
    ├── <Header> (Component Instance)
    └── MainArea (Semantic Frame)
        ├── <Sidebar> (Component Instance)
        │   └── <Drawer> (Component Instance)
        └── Main (Semantic Frame)
            ├── <PageHeader> (Component Instance)
            └── MainContent (Outlet Frame)
                ├── <Submenu> (Component Instance)
                ├── Content (Content Frame)
                └── <Typography> (Component Instance)
```

##### **B. 페이지별 구조**
```
Users 페이지
├── <Header>              ← 앱 헤더
├── <Sidebar>             ← 메인 네비게이션
├── <PageHeader>          ← 페이지 제목 + 브레드크럼
└── MainContent           ← <Outlet /> 영역
    ├── <Button>          ← 새 사용자 추가 버튼
    ├── <TextField>       ← 검색 입력
    └── <Table>           ← 사용자 목록 테이블
```

##### **C. 컴포넌트 인스턴스 구조**
```
<Header> Component Instance
├── 로고 영역
├── 사용자 메뉴
└── 액션 버튼들

<Sidebar> Component Instance
├── <Drawer> Component Instance
├── 네비게이션 메뉴
└── 하위 메뉴들

<PageHeader> Component Instance
├── 페이지 제목
├── 브레드크럼
└── 액션 버튼들
```

#### **피그마 컴포넌트 인스턴스 지원 (피그마 구조 반영)**

##### **레이아웃 컴포넌트**
```
✅ 지원하는 레이아웃 컴포넌트:
- <Header> → Header 컴포넌트
- <Sidebar> → Sidebar 컴포넌트  
- <PageHeader> → PageHeader 컴포넌트
- <Drawer> → Drawer 컴포넌트
- <Submenu> → Submenu 컴포넌트
```

##### **MUI 컴포넌트 인스턴스**
```
✅ 지원하는 MUI 컴포넌트:
- <Button> → Button 컴포넌트
- <TextField> → TextField 컴포넌트  
- <Table> → Table 컴포넌트
- <Card> → Card 컴포넌트
- <Typography> → Typography 컴포넌트
- <Chip> → Chip 컴포넌트
- <Dialog> → Dialog 컴포넌트
```

#### **명명 규칙 가이드 (피그마 구조 기반)**

##### **레이아웃 템플릿/인스턴스**
```
✅ 권장 명명:
- defaultLayoutTemplate (템플릿)
- DefaultLayout (인스턴스)
```

##### **시멘틱 영역**
```
✅ 권장 명명:
- MainArea (메인 영역)
- Main (메인 콘텐츠)
- MainContent (<Outlet /> 영역)
```

##### **컴포넌트 인스턴스**
```
✅ 권장 명명:
- <Header> (헤더 컴포넌트)
- <Sidebar> (사이드바 컴포넌트)
- <PageHeader> (페이지 헤더 컴포넌트)
- <Drawer> (드로어 컴포넌트)
```

##### **MUI 컴포넌트 인스턴스**
```
✅ 권장 명명:
- <Button> (버튼 컴포넌트)
- <TextField> (텍스트 필드 컴포넌트)
- <Table> (테이블 컴포넌트)
- <Card> (카드 컴포넌트)
```

#### **자동 탐지 로직**
1. 페이지 내에서 "Main Content" 프레임을 재귀적으로 검색
2. 프레임 이름이 매핑된 이름과 일치하면 해당 프레임 선택
3. 선택된 프레임의 하위 컴포넌트들만 추출하여 페이지 콘텐츠로 변환

#### **피그마에서 프레임 명명 규칙**
```
페이지 프레임
├── Header (무시)
├── Sidebar (무시)
└── Main Content ← 이 이름으로 프레임 생성
    ├── Control Area
    ├── Table
    └── 기타 페이지 콘텐츠
```

## 🔄 레이아웃 컴포넌트 동기화

### 기존 컴포넌트와 피그마 연동

나중에 기존에 개발된 레이아웃 컴포넌트들(`<Sidebar>`, `<PageHeader>`, `<Header>` 등)도 피그마와 연동할 수 있습니다.

#### **피그마에서 프레임명 지정**
```
페이지 프레임 (예: Users)
├── header         ← 헤더 프레임 (기존 <Header> 컴포넌트와 연동)
├── sidebar        ← 사이드바 프레임 (기존 <Sidebar> 컴포넌트와 연동)
├── pageHeader     ← 페이지 헤더 프레임 (기존 <PageHeader> 컴포넌트와 연동)
└── mainContent    ← 메인 콘텐츠 프레임 (페이지 콘텐츠)
    ├── searchForm
    ├── dataTable
    └── actionButtons
```

#### **지원하는 레이아웃 프레임**
- `header` - 헤더 컴포넌트 연동
- `sidebar` - 사이드바 컴포넌트 연동  
- `pageHeader` - 페이지 헤더 컴포넌트 연동
- `footer` - 푸터 컴포넌트 연동

#### **동기화 명령어**
```bash
# 모든 레이아웃 컴포넌트 동기화
npm run figma:sync-layout

# 특정 페이지의 레이아웃 컴포넌트 동기화
npm run figma:sync-layout -- --page users

# 특정 컴포넌트만 동기화
npm run figma:sync-layout -- --component sidebar

# 미리보기 모드 (실제 파일 수정 없음)
npm run figma:sync-layout -- --dry-run
```

#### **동기화 방식**
1. **기존 컴포넌트 감지**: `src/layouts/` 폴더의 기존 컴포넌트 확인
2. **스타일 업데이트**: 피그마 디자인에서 스타일 정보 추출하여 기존 컴포넌트에 적용
3. **구조 보존**: 기존 컴포넌트의 로직과 구조는 유지하고 스타일만 업데이트

## 🛠️ 사용 가능한 명령어

### 기본 명령어
```bash
# 환경 설정
npm run figma:setup

# 상태 확인
npm run figma:status

# 페이지 콘텐츠 생성
npm run figma:content

# 라이브러리 컴포넌트 추출
npm run figma:extract

# 코드 검증
npm run figma:validate

# 생성된 파일 정리
npm run figma:clean
```

### 고급 옵션
```bash
# 특정 페이지 생성
npm run figma:content -- --page dashboard --layout default

# 특정 디렉토리 검증
npm run figma:validate -- --directory src/pages/generated

# 모든 생성된 파일 정리
npm run figma:clean -- --all
```

## 🎯 주요 기능

### 1. 페이지 콘텐츠 생성
- 기존 레이아웃 시스템과 통합된 페이지 콘텐츠 생성
- DefaultLayout, AuthLayout, ErrorLayout 지원
- 페이지별 스타일 토큰 자동 생성

### 2. 라이브러리 컴포넌트 추출
- Figma 라이브러리에서 컴포넌트 자동 추출
- MUI 컴포넌트로 자동 변환
- TypeScript 타입 정의 자동 생성

### 3. 코드 검증
- 생성된 코드의 문법 검사
- MUI 컴포넌트 사용법 검증
- 접근성 및 성능 최적화 제안

### 4. 파일 관리
- 생성된 파일 자동 정리
- 디렉토리별 선택적 정리
- 백업 및 복원 기능

## 📂 생성되는 파일 구조

### 실제 프로젝트 구조 (권장)
```
src/
├── types/                     # 전역 공통 타입
│   ├── index.ts               # 모든 타입 export
│   ├── user.ts                # User 관련 타입
│   └── project.ts             # Project 관련 타입
├── api/                       # API 호출 함수
│   ├── users.ts               # User API
│   └── projects.ts            # Project API
├── pages/
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   └── Dashboard.types.ts # 페이지별 특수 타입
│   ├── project/
│   │   ├── Project.tsx
│   │   └── Project.types.ts   # 페이지별 특수 타입
│   └── users/
│       ├── Users.tsx
│       └── Users.types.ts     # 페이지별 특수 타입
```

### 시범구축 구조 (현재)
```
src/
├── data/                      # 샘플 데이터 (나중에 제거)
│   └── users.ts
├── pages/
│   └── users/
│       ├── Users.tsx
│       └── Users.types.ts
```

### 라이브러리 컴포넌트
```
src/components/generated/
├── button-primary.tsx
├── card-project.tsx
└── table-users.tsx
```

## 🔄 시범구축 → 실제 프로젝트 마이그레이션

### 1단계: 전역 타입 생성
```typescript
// src/types/user.ts
export interface User {
    id: string;
    name: string;
    department: string;
    permission: 'user' | 'admin';
    status: 'active' | 'inactive';
    lastLogin?: string;
}

// src/types/index.ts
export * from './user';
export * from './project';
```

### 2단계: API 함수 생성
```typescript
// src/api/users.ts
import { User, UsersApiResponse } from '@/types';

export const fetchUsers = async (): Promise<UsersApiResponse> => {
    // API 호출 로직
};

export const createUser = async (user: CreateUserRequest): Promise<User> => {
    // API 호출 로직
};
```

### 3단계: 페이지 타입 업데이트
```typescript
// src/pages/users/Users.types.ts
import { User } from '@/types';

export interface UsersPageState {
    selectedFilter: 'all' | 'user' | 'admin';
    searchKeyword: string;
    isLoading: boolean;
    error: string | null;
}

export interface UsersApiResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}
```

### 4단계: 컴포넌트 업데이트
```typescript
// src/pages/users/Users.tsx
import { fetchUsers } from '@/api/users';
import { UsersPageState, UsersApiResponse } from './Users.types';

export const Users: React.FC = () => {
    const [state, setState] = useState<UsersPageState>({
        selectedFilter: 'all',
        searchKeyword: '',
        isLoading: false,
        error: null,
    });

    // API 호출 로직
};
```

### 마이그레이션 체크리스트
- [ ] `src/data/` 폴더 제거
- [ ] `src/types/` 폴더 생성 및 전역 타입 이동
- [ ] `src/api/` 폴더 생성 및 API 함수 구현
- [ ] 페이지별 타입에서 전역 타입 import로 변경
- [ ] 샘플 데이터를 API 호출로 변경
- [ ] 로딩 상태 및 에러 처리 추가

## 🔧 컴포넌트 매핑

### 지원되는 컴포넌트 타입
- `button` → MUI `Button`
- `input` → MUI `TextField`
- `table` → MUI `Table`
- `card` → MUI `Card`
- `navigation` → MUI `Navigation`
- `layout` → MUI `Box`
- `chip` → MUI `Chip`
- `dialog` → MUI `Dialog`
- `tabs` → MUI `Tabs`

## ⚠️ 문제 해결

### 일반적인 오류

1. **토큰 오류**: `FIGMA_TOKEN`이 올바르게 설정되었는지 확인
2. **파일 접근 오류**: 파일 키가 올바른지 확인
3. **권한 오류**: 토큰에 필요한 권한이 있는지 확인

### 디버깅
```bash
# 상세 로그와 함께 실행
DEBUG=figma:* npm run figma:content
```

## 🎨 디자인 시스템과의 관계

### 기존 토큰 시스템
- **Tokens Studio**: Figma 디자인 토큰 자동 동기화
- **MUI 테마**: 디자인 토큰을 MUI 테마로 변환
- **브랜드 토큰**: 브랜드 색상 및 크기 관리

### Figma API 통합
- **페이지 디자인**: 실제 페이지 콘텐츠 생성
- **컴포넌트 추출**: 라이브러리 컴포넌트 자동 변환
- **코드 품질**: 생성된 코드 검증 및 최적화

두 시스템은 **상호 보완적**으로 작동하며, 기존 디자인 토큰 시스템과 충돌하지 않습니다.

## 📚 참고 자료
- [Figma API 문서](https://www.figma.com/developers/api)
- [Figma Personal Access Tokens](https://www.figma.com/developers/api#authentication)
- [Material-UI 컴포넌트](https://mui.com/material-ui/getting-started/overview/)