// 모든 타입을 한 곳에서 export
export * from './user';
export * from './workflow';
export * from './project';

// 공통 타입 정의
export interface ApiResponse<T> {
    data: T;
    total: number;
    page: number;
    limit: number;
    success: boolean;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, unknown>;
}

export interface TableColumn<T = unknown> {
    key: keyof T | 'index'; // index는 테이블 순번용
    label: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    type:
        | 'text'
        | 'email'
        | 'date'
        | 'status'
        | 'action'
        | 'boolean'
        | 'number'
        | 'index'
        | 'phone'
        | 'permission'
        | 'project';
    render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

export interface TableConfig<T = unknown> {
    columns: TableColumn<T>[];
    pagination?: boolean;
    sorting?: boolean;
    filtering?: boolean;
    selection?: boolean;
}
