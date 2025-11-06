/**
 * Navigation 컴포넌트 타입 정의
 */

export interface NavigationProps {
    open: boolean;
}

export interface NavigationState {
    expandedFolders: Set<string>;
    sortStates: Record<string, 'asc' | 'desc' | null>;
}
