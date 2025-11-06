// Project 관련 전역 타입 정의
export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive' | 'completed' | 'archived';
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    ownerName: string;
}

// Project 테이블 컬럼 정의
export interface ProjectTableColumn {
    key: keyof Project | 'index';
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    type: 'text' | 'email' | 'date' | 'status' | 'action' | 'index' | 'phone' | 'permission' | 'boolean';
}

// Project 테이블 설정
export const PROJECT_TABLE_COLUMNS: ProjectTableColumn[] = [
    { key: 'index', label: '번호', sortable: false, type: 'index' },
    { key: 'id', label: '프로젝트 ID', sortable: true, filterable: true, type: 'text' },
    { key: 'name', label: '프로젝트명', sortable: true, filterable: true, type: 'text' },
    { key: 'description', label: '설명', sortable: false, filterable: true, type: 'text' },
    { key: 'status', label: '상태', sortable: true, filterable: true, type: 'status' },
    { key: 'ownerName', label: '소유자', sortable: true, filterable: true, type: 'text' },
    { key: 'createdAt', label: '생성일', sortable: true, filterable: true, type: 'date' },
    { key: 'updatedAt', label: '수정일', sortable: true, filterable: true, type: 'date' },
];

// API 요청/응답 타입
export interface CreateProjectRequest {
    name: string;
    description?: string;
    ownerId: string;
}

export interface UpdateProjectRequest {
    id: string;
    name?: string;
    description?: string;
    status?: Project['status'];
}

export interface ProjectStatusUpdateRequest {
    id: string;
    status: Project['status'];
}

export interface DeleteProjectRequest {
    id: string;
}
