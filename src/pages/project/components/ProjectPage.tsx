import React from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { ProjectSubMenu } from '../layout';
import { ProjectSubMenuTab, DEFAULT_PROJECT_TABS } from '@/config';
import { AgentContent } from './AgentContent';
import { CredentialContent, KnowledgeBaseContent, ApiKeyContent, MemberContent, SettingsContent } from './index';
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
        credential: <CredentialContent />,
        knowledgebase: <KnowledgeBaseContent />,
        apikey: <ApiKeyContent />,
        member: <MemberContent />,
        settings: <SettingsContent />,
    };
    const effectiveContent = { ...defaultContent, ...(content ?? {}) };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
            {/* 탭 메뉴(서브 메뉴) */}
            <ProjectSubMenu
                tabs={effectiveTabs}
                activeTab={activeTab}
                onTabChange={(tab) => setSearchParams({ tab })}
            />

            {/* 탭 컨텐츠(서브 페이지 메인 콘텐츠) */}
            {activeTab === 'agent' ? (
                <AgentContent workflowData={agentWorkflowData} />
            ) : (
                effectiveContent[activeTab] ?? null
            )}
        </Box>
    );
};


