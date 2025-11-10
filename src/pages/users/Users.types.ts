// Generated types for Users
// Note: Basic data types (User, etc.) are defined in @/data

// Import global User type
import { User } from '@/types';

// Page-specific types for Users
export interface UsersPageState {
    selectedFilter: 'all' | 'user' | 'admin';
    searchKeyword: string;
    isLoading: boolean;
    error: string | null;
}

export interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: number) => void;
    isLoading: boolean;
}

export interface UsersFilterProps {
    selectedFilter: 'all' | 'user' | 'admin';
    onFilterChange: (filter: 'all' | 'user' | 'admin') => void;
}

export interface UsersSearchProps {
    searchKeyword: string;
    onSearchChange: (keyword: string) => void;
}

// API 관련 타입
export interface UsersApiResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateUserRequest {
    name: string;
    id: string;
    department: string;
    permission: 'user' | 'admin';
}

export type BoxProps = object;

export type UsersProps = object;
