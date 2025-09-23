import React from 'react';
import { Box } from '@mui/material';
export { AgentContent } from './AgentContent';
export { CredentialContent } from './CredentialContent';
export { KnowledgeBaseContent } from './KnowledgeBaseContent';
export { ApiKeyContent } from './ApiKeyContent';
export { MemberContent } from './MemberContent';
export { SettingsContent } from './SettingsContent';

interface ProjectSubMenuContentProps {
    activeTab: string;
    children: React.ReactNode;
}

export const ProjectSubMenuContent: React.FC<ProjectSubMenuContentProps> = ({ activeTab, children }) => {
    return (
        <Box>
            {children}
        </Box>
    );
};
