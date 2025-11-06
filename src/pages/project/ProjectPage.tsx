import React from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { ProjectSubMenu } from './layout';
import { Agent, Credential, KnowledgeBase, ApiKey, Member, Settings } from './sections';
import { DEFAULT_PROJECT_TABS } from '@/config';
import type { ProjectSubMenuTab } from '@/config';
import type { Workflow } from '@/types';

interface ProjectPageProps {
    tabs?: ProjectSubMenuTab[];
    content?: Record<string, React.ReactNode>;
    agentWorkflowData?: Workflow[];
}

export const ProjectPage: React.FC<ProjectPageProps> = ({ tabs, content, agentWorkflowData }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab: string = searchParams.get('tab') || 'agent';

    const effectiveTabs = tabs ?? DEFAULT_PROJECT_TABS;
    const defaultContent: Record<string, React.ReactNode> = {
        credential: <Credential />,
        knowledgebase: <KnowledgeBase />,
        apikey: <ApiKey />,
        member: <Member />,
        settings: <Settings />,
    };
    const effectiveContent = { ...defaultContent, ...(content ?? {}) };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
            <ProjectSubMenu
                tabs={effectiveTabs}
                activeTab={activeTab}
                onTabChange={(tab) => setSearchParams({ tab })}
            />

            {activeTab === 'agent' ? <Agent workflowData={agentWorkflowData} /> : (effectiveContent[activeTab] ?? null)}
        </Box>
    );
};
