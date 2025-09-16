import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Workflow {
    id: string;
    name: string;
    user_name: string;
    updated_at: string;
    description?: string;
    workspace_seq?: number;
    status?: 'Active' | 'Idle';
    created_at?: string;
    isFavorite?: boolean;
}

interface WorkspaceContextType {
    // 검색 및 필터 상태
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    selectedFilter: 'all' | 'mine';
    setSelectedFilter: (filter: 'all' | 'mine') => void;
    viewMode: 'all' | 'favorites';
    setViewMode: (mode: 'all' | 'favorites') => void;

    // 데이터
    workflows: Workflow[];
    setWorkflows: (workflows: Workflow[]) => void;
    userName: string;
    setUserName: (name: string) => void;

    // 즐겨찾기 기능
    toggleFavorite: (workflowId: string) => void;

    // 필터링된 데이터
    filteredWorkflows: Workflow[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
    children: ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'mine'>('all');
    const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [userName, setUserName] = useState('김재희');

    // 즐겨찾기 토글 함수
    const toggleFavorite = (workflowId: string) => {
        setWorkflows((prevWorkflows) =>
            prevWorkflows.map((workflow) =>
                workflow.id === workflowId ? { ...workflow, isFavorite: !workflow.isFavorite } : workflow,
            ),
        );
    };

    // 필터링된 워크플로우 계산
    const filteredWorkflows = workflows.filter((workflow) => {
        // 검색어 필터링
        if (searchKeyword) {
            const matchesSearch =
                workflow.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                workflow.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                (workflow.description?.toLowerCase().includes(searchKeyword.toLowerCase()) ?? false);

            if (!matchesSearch) return false;
        }

        // 내 워크플로우 필터링
        if (selectedFilter === 'mine') {
            return workflow.user_name === userName;
        }

        // 뷰 모드 필터링
        if (viewMode === 'favorites') {
            return workflow.isFavorite === true;
        }

        return true;
    });

    const value: WorkspaceContextType = {
        searchKeyword,
        setSearchKeyword,
        selectedFilter,
        setSelectedFilter,
        viewMode,
        setViewMode,
        workflows,
        setWorkflows,
        userName,
        setUserName,
        toggleFavorite,
        filteredWorkflows,
    };

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
};
