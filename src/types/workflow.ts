// Workflow 관련 전역 타입 정의 (시범 구축용 단순화)
export interface Workflow {
    seq?: number; // UI용 순번 (옵셔널)
    id: string;
    name: string;
    description: string | null;
    user_id: string; // 사용자 이메일 아이디
    user_name: string;
    created_at: string;
    updated_at: string;
    status: 'active' | 'inactive' | 'stop' | 'expired';
    isFavorite?: boolean; // 즐겨찾기 (UI용)
}

// Workflow 테이블 컬럼 정의
export interface WorkflowTableColumn {
    key: keyof Workflow | 'index'; // index는 테이블 순번용
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    type: 'text' | 'date' | 'status' | 'action' | 'boolean' | 'index' | 'project';
}

// Workflow 테이블 설정
export const WORKFLOW_TABLE_COLUMNS: WorkflowTableColumn[] = [
    { key: 'index', label: '번호', sortable: false, type: 'index' }, // 테이블 순번
    { key: 'id', label: 'ID', sortable: true, filterable: true, type: 'text' }, // 워크플로우 ID
    { key: 'name', label: '이름', sortable: true, filterable: true, type: 'text' },
    { key: 'description', label: '설명', sortable: false, filterable: true, type: 'text' },
    { key: 'user_name', label: '생성자', sortable: true, filterable: true, type: 'text' },
    { key: 'status', label: '상태', sortable: true, filterable: true, type: 'status' },
    { key: 'isFavorite', label: '즐겨찾기', sortable: true, filterable: true, type: 'boolean' },
    { key: 'created_at', label: '생성일', sortable: true, type: 'date' },
    { key: 'updated_at', label: '수정일', sortable: true, type: 'date' },
];

// Workflow API 관련 타입
export interface WorkflowsApiResponse {
    workflows: Workflow[];
    total: number;
    page: number;
    limit: number;
}

// 워크플로우 생성 요청
export interface CreateWorkflowRequest {
    name: string;
    description?: string;
    user_id: string; // 사용자 이메일 아이디
}

// 워크플로우 수정 요청
export interface UpdateWorkflowRequest {
    id: string;
    name?: string;
    description?: string;
    status?: 'active' | 'inactive' | 'stop' | 'expired';
}

// 워크플로우 삭제 요청
export interface DeleteWorkflowRequest {
    id: string;
}

// 즐겨찾기 토글 요청
export interface ToggleFavoriteRequest {
    id: string;
    isFavorite: boolean;
}

// 워크플로우 상태 업데이트 요청 (간단한 상태 변경용)
export interface UpdateWorkflowStatusRequest {
    id: string;
    status: 'active' | 'inactive' | 'stop' | 'expired';
}
