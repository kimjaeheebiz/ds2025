export interface ProjectSubMenuTab {
    id: string;
    label: string;
    value: string;
}

// 공통 탭 메뉴
export const DEFAULT_PROJECT_TABS: ProjectSubMenuTab[] = [
    { id: 'agent', label: 'AGENT', value: 'agent' },
    { id: 'credential', label: 'CREDENTIAL', value: 'credential' },
    { id: 'knowledgebase', label: '지식베이스', value: 'knowledgebase' },
    { id: 'apikey', label: 'API KEY', value: 'apikey' },
    { id: 'member', label: '멤버', value: 'member' },
    { id: 'settings', label: '프로젝트 설정', value: 'settings' },
];
