// User 관련 전역 타입 정의 (실제 프로젝트 구조 반영)
export interface User {
    seq: number;
    id: string; // 이메일 아이디 (예: user@company.com)
    name: string;
    department: string | null; // 소속
    permission: 'admin' | 'user';
    status: 'active' | 'stop';
    regdate: string; // 가입일
    moddate: string; // 수정일
    last_login: string | null; // 최근 로그인
}

// User 테이블 컬럼 정의
export interface UserTableColumn {
    key: keyof User | 'index'; // index는 테이블 순번용
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    type: 'text' | 'email' | 'date' | 'status' | 'action' | 'index' | 'phone' | 'permission' | 'boolean';
}

// User 테이블 설정
export const USER_TABLE_COLUMNS: UserTableColumn[] = [
    { key: 'index', label: '번호', sortable: false, type: 'index' }, // 테이블 순번
    { key: 'id', label: '이메일', sortable: true, filterable: true, type: 'email' },
    { key: 'name', label: '이름', sortable: true, filterable: true, type: 'text' },
    { key: 'department', label: '소속', sortable: true, filterable: true, type: 'text' },
    { key: 'permission', label: '권한', sortable: true, filterable: true, type: 'permission' },
    { key: 'status', label: '상태', sortable: true, filterable: true, type: 'status' },
    { key: 'regdate', label: '가입일', sortable: true, type: 'date' },
    { key: 'last_login', label: '최근 로그인', sortable: true, type: 'date' },
];

// User API 관련 타입
export interface UsersApiResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateUserRequest {
    id: string;
    name: string;
    department?: string;
    permission: 'admin' | 'user';
    status: 'active' | 'stop';
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
    seq: number;
}

export interface UpdateUserStatusRequest {
    seq: number;
    status: 'active' | 'stop';
}
