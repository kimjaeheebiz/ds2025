import { useContext } from 'react';
import { ProjectContext } from '@/contexts';

export const useProject = () => {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error('useProject must be used within a ProjectProvider');
    return ctx;
};
