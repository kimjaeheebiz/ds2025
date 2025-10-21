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
    email: string;
    department: string;
    permission: 'generalUser' | 'systemAdmin';
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
    selectedFilter: 'all' | 'generalUser' | 'systemAdmin';
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