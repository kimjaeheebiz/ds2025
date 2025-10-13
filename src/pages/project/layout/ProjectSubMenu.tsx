import React from 'react';
import { Tabs, Tab } from '@mui/material';
import type { ProjectSubMenuTab } from '@/config';

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
            aria-label="서브 메뉴"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                bgcolor: 'background.default',
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

