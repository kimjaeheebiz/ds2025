import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Workflow } from '@/types';

interface ProjectContextType {
    // 프로젝트 공통
    userName: string;
    setUserName: (name: string) => void;

    // 워크플로우(AgentContent 전용) 상태
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    selectedFilter: 'all' | 'mine';
    setSelectedFilter: (filter: 'all' | 'mine') => void;
    viewMode: 'all' | 'favorites';
    setViewMode: (mode: 'all' | 'favorites') => void;
    workflows: Workflow[];
    setWorkflows: (workflows: Workflow[]) => void;
    toggleFavorite: (workflowId: string) => void;
    filteredWorkflows: Workflow[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
    children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
    // 공통
    const [userName, setUserName] = useState('홍길동');

    // AgentContent 전용 상태
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'mine'>('all');
    const [viewMode, setViewMode] = useState<'all' | 'favorites'>('all');
    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    const toggleFavorite = (workflowId: string) => {
        setWorkflows((prev) => prev.map((w) => (w.id === workflowId ? { ...w, isFavorite: !w.isFavorite } : w)));
    };

    const filteredWorkflows = workflows.filter((w) => {
        if (searchKeyword) {
            const matches =
                w.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                w.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                w.user_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                (w.description?.toLowerCase().includes(searchKeyword.toLowerCase()) ?? false);
            if (!matches) return false;
        }
        if (selectedFilter === 'mine') return w.user_name === userName;
        if (viewMode === 'favorites') return w.isFavorite === true;
        return true;
    });

    const value: ProjectContextType = {
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

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export { ProjectContext };

export const useProject = () => {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error('useProject must be used within a ProjectProvider');
    return ctx;
};
