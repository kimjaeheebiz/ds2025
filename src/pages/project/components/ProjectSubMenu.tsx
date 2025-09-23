import React from 'react';
import { Tabs, Tab } from '@mui/material';

export interface ProjectSubMenuTab {
    id: string;
    label: string;
    value: string;
}

interface ProjectSubMenuProps {
    tabs: ProjectSubMenuTab[];
    activeTab: string;
    onTabChange: (tabValue: string) => void;
}

export const ProjectSubMenu: React.FC<ProjectSubMenuProps> = ({
    tabs,
    activeTab,
    onTabChange,
}) => {
    return (
        <Tabs
            value={activeTab}
            onChange={(_, newValue) => onTabChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="project sub menu tabs"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: 'background.default',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            {tabs.map((tab) => (
                <Tab key={tab.id} value={tab.value} label={tab.label} />
            ))}
        </Tabs>
    );
};

// 공통 탭 메뉴
export const DEFAULT_PROJECT_TABS: ProjectSubMenuTab[] = [
    { id: 'agent', label: 'AGENT', value: 'agent' },
    { id: 'credential', label: 'CREDENTIAL', value: 'credential' },
    { id: 'knowledgebase', label: '지식베이스', value: 'knowledgebase' },
    { id: 'apikey', label: 'API KEY', value: 'apikey' },
    { id: 'member', label: '멤버', value: 'member' },
    { id: 'settings', label: '프로젝트 설정', value: 'settings' },
];

