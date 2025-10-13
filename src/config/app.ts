// =========================================================================
// 앱 전체 설정을 중앙에서 관리
// 1. 앱 기본 정보
// 2. 타입 정의 및 타입 가드
// 3. 라우트 정의 및 페이지 설정 통합
// 4. 자동 생성되는 타입들
// 5. 헬퍼 함수들
// 6. 아이콘 자동 감지 및 매핑
// =========================================================================

import React from 'react';
import * as MuiIcons from '@mui/icons-material';

// =========================================================================
// 1. 앱 기본 정보
// =========================================================================
export const APP_INFO = {
    name: 'Agent Platform',
    description: 'Hecto Agent Platform',
    version: '1.0.0',
    author: 'Hecto',
    company: 'Hecto',
    copyright: '© 2025 Hecto. All Rights Reserved.',
    website: 'https://hsuda-stage.hecto.co.kr',
} as const;

// =========================================================================
// 2. 타입 정의 및 타입 가드
// =========================================================================

// 액션 버튼 타입
export type ActionButtonType = 'button' | 'sort-group';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortOption {
    key: string;
    label: string;
}

export interface ActionButton {
    key: string;
    label?: string;
    type: ActionButtonType;
    onClick?: () => void;
    textColor?: string;  // 텍스트 색상 커스터마이징
    
    // sort-group 타입용
    sortOptions?: SortOption[];
    onSort?: (key: string, direction: SortDirection) => void;
}

// 페이지 노드 기본 인터페이스
interface BasePageNode {
    key: string;
    title: string;
    icon: string;
    showInSidebar: boolean;
    showPageHeader: boolean;
}

// Leaf 페이지 (경로가 있는 페이지)
export interface LeafPageNode extends BasePageNode {
    path: string;
}

// Folder 페이지 (자식이 있는 페이지)
export interface FolderPageNode extends BasePageNode {
    children: Record<string, PageNode>;
    actions?: ActionButton[];
}

// 통합 페이지 노드 타입
export type PageNode = LeafPageNode | FolderPageNode;

// 타입 가드 함수들
export function isLeafNode(node: unknown): node is LeafPageNode {
    if (!node || typeof node !== 'object') return false;
    const obj = node as Record<string, unknown>;
    return (
        typeof obj.key === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.path === 'string' &&
        !('children' in obj)
    );
}

export function isFolderNode(node: unknown): node is FolderPageNode {
    if (!node || typeof node !== 'object') return false;
    const obj = node as Record<string, unknown>;
    return (
        typeof obj.key === 'string' &&
        typeof obj.title === 'string' &&
        'children' in obj &&
        typeof obj.children === 'object' &&
        obj.children !== null
    );
}

export function isPageNode(node: unknown): node is PageNode {
    return isLeafNode(node) || isFolderNode(node);
}

// =========================================================================
// 3. 라우트 정의 및 페이지 설정 통합
// =========================================================================

// 페이지별 설정 통합 (라우트 + 메타데이터 + 네비게이션)
export const PAGES: Record<string, PageNode> = {
    home: {
        key: 'home',
        path: '/',
        title: 'Home',
        icon: 'HomeOutlined',
        showInSidebar: true,
        showPageHeader: false,
    },
    project: {
        key: 'project',
        title: 'Project',
        icon: 'FolderOutlined',
        showInSidebar: true,
        showPageHeader: false,
        actions: [
            {
                key: 'new-project',
                label: '+ New Project',
                type: 'button',
                onClick: () => {
                    // TODO: 새 프로젝트 생성 모달 열기
                    console.log('Create new project');
                },
                textColor: 'primary.main',
            },
            {
                key: 'sort-projects',
                type: 'sort-group',
                sortOptions: [
                    { key: 'name', label: '이름순' },
                    { key: 'date', label: '참여일순' },
                ],
                onSort: (key: string, direction) => {
                    // TODO: 정렬 로직 구현
                    console.log('Sort by:', key, direction);
                },
            },
        ],
        children: {
            project1: {
                key: 'project.project1',
                path: '/project/project1',
                title: 'Project Name 1',
                icon: 'FolderOutlined',
                showInSidebar: true,
                showPageHeader: true,
            },
            project2: {
                key: 'project.project2',
                path: '/project/project2',
                title: 'Project Name 2',
                icon: 'FolderOutlined',
                showInSidebar: true,
                showPageHeader: true,
            },
        },
    },
    users: {
        key: 'users',
        path: '/users',
        title: 'Users',
        icon: 'PeopleOutlineOutlined',
        showInSidebar: true,
        showPageHeader: true,
    },
    components: {
        key: 'components',
        path: '/components',
        title: 'Components',
        icon: 'WidgetsOutlined',
        showInSidebar: true,
        showPageHeader: true,
    },
    login: {
        key: 'login',
        path: '/login',
        title: '로그인',
        icon: 'Login',
        showInSidebar: false,
        showPageHeader: false,
    },
    signup: {
        key: 'signup',
        path: '/signup',
        title: '계정 등록',
        icon: 'PersonAdd',
        showInSidebar: false,
        showPageHeader: false,
    },
    notFound: {
        key: 'notFound',
        path: '/404',
        title: '페이지 없음',
        icon: 'Error',
        showInSidebar: false,
        showPageHeader: false,
    },
    serverError: {
        key: 'serverError',
        path: '/500',
        title: '서버 오류',
        icon: 'Error',
        showInSidebar: false,
        showPageHeader: false,
    },
};

// =========================================================================
// 4. 자동 생성되는 타입들
// =========================================================================

// 페이지 키 타입 (PAGES 객체의 모든 키와 중첩된 키)
export type PageKey = keyof typeof PAGES | string;

// 네비게이션 메뉴 아이템 타입
export interface NavigationMenuGrandChild {
    label: string;
    path: string;
    parent?: string;
}

export interface NavigationMenuChild {
    label: string;
    path?: string;
    parent?: string;
    children?: NavigationMenuGrandChild[];
}

export interface NavigationMenuItem {
    label: string;
    path?: string; // 폴더형 메뉴는 path가 없을 수 있음
    icon: string | React.ReactElement; // 설정에서는 string, 렌더링에서는 ReactElement
    showInSidebar: boolean;
    isActive?: boolean; // UI 상태 (선택적)
    children?: NavigationMenuChild[];
}

// 페이지 메타데이터만 추출 (하위 페이지 포함)
export const PAGE_METADATA = (() => {
    const metadata: Record<string, { title: string; description: string }> = {};

    const addMetadata = (node: PageNode) => {
        metadata[node.key] = { title: node.title, description: APP_INFO.description };
        
        if (isFolderNode(node)) {
            Object.values(node.children).forEach((child) => {
                if (isPageNode(child)) {
                    addMetadata(child);
                }
            });
        }
    };

    Object.values(PAGES).forEach((page) => {
        if (isPageNode(page)) {
            addMetadata(page);
        }
    });

    return metadata;
})();

// parent 값을 자동으로 계산 (NAVIGATION_MENU보다 먼저 정의)
const getParentKey = (key: string): string | undefined => {
    const parts = key.split('.');
    if (parts.length <= 1) return undefined;
    return parts.slice(0, -1).join('.');
};

// 네비게이션 메뉴 필터링 (계층적 구조 지원)
export const NAVIGATION_MENU: NavigationMenuItem[] = (() => {
    const buildMenuItem = (node: PageNode): NavigationMenuItem | null => {
        if (!node.showInSidebar) return null;

        const baseItem: NavigationMenuItem = {
            label: node.title,
            icon: node.icon,
            showInSidebar: node.showInSidebar,
        };

        // Leaf 노드인 경우 path 추가
        if (isLeafNode(node)) {
            return {
                ...baseItem,
                path: node.path,
            };
        }

        // Folder 노드인 경우 children 처리
        if (isFolderNode(node)) {
            const children = Object.values(node.children)
                .map((child): NavigationMenuChild | null => {
                    if (!isPageNode(child) || !child.showInSidebar) return null;

                    // Leaf child
                    if (isLeafNode(child)) {
                        return {
                            label: child.title,
                            path: child.path,
                            parent: getParentKey(child.key),
                        };
                    }

                    // Folder child (with grandchildren)
                    if (isFolderNode(child)) {
                        const grandChildren = Object.values(child.children)
                            .map((grandChild): NavigationMenuGrandChild | null => {
                                if (!isPageNode(grandChild) || !grandChild.showInSidebar) return null;
                                if (!isLeafNode(grandChild)) return null;

                                return {
                                    label: grandChild.title,
                                    path: grandChild.path,
                                    parent: getParentKey(grandChild.key),
                                };
                            })
                            .filter((gc): gc is NavigationMenuGrandChild => gc !== null);

                        // 하위 메뉴가 없으면 폴더 미표시
                        if (grandChildren.length === 0) return null;

                        return {
                            label: child.title,
                            parent: getParentKey(child.key),
                            children: grandChildren,
                        };
                    }

                    return null;
                })
                .filter((item): item is NavigationMenuChild => item !== null);

            return {
                ...baseItem,
                children: children.length > 0 ? children : undefined,
            };
        }

        return baseItem;
    };

    return Object.values(PAGES)
        .map(buildMenuItem)
        .filter((item): item is NavigationMenuItem => item !== null);
})();

// =========================================================================
// 5. 헬퍼 함수들
// =========================================================================

// 페이지 메타데이터 가져오기
export const getPageMetadata = (pageKey: PageKey) => {
    return PAGE_METADATA[pageKey];
};

// 브라우저 타이틀 생성
export const getBrowserTitle = (pageKey?: PageKey): string => {
    if (!pageKey) {
        return APP_INFO.name;
    }
    const metadata = PAGE_METADATA[pageKey];
    if (!metadata) {
        return APP_INFO.name;
    }
    return `${metadata.title} | ${APP_INFO.name}`;
};

// URL에서 페이지 키 추출 (하위 페이지 포함)
export const getPageKeyFromPath = (pathname: string): PageKey | null => {
    const pathToKeyMap: Record<string, string> = {};

    const buildPathMap = (node: PageNode) => {
        if (isLeafNode(node)) {
            pathToKeyMap[node.path] = node.key;
        }
        
        if (isFolderNode(node)) {
            Object.values(node.children).forEach((child) => {
                if (isPageNode(child)) {
                    buildPathMap(child);
                }
            });
        }
    };

    Object.values(PAGES).forEach((page) => {
        if (isPageNode(page)) {
            buildPathMap(page);
        }
    });

    return pathToKeyMap[pathname] || null;
};

// 페이지 정보 가져오기 (하위 페이지 포함)
export const getPageInfo = (pageKey: PageKey): PageNode | null => {
    const search = (node: PageNode): PageNode | null => {
        if (node.key === pageKey) return node;
        
        if (isFolderNode(node)) {
            for (const child of Object.values(node.children)) {
                if (isPageNode(child)) {
                    const found = search(child);
                    if (found) return found;
                }
            }
        }
        
        return null;
    };

    for (const page of Object.values(PAGES)) {
        if (isPageNode(page)) {
            const found = search(page);
            if (found) return found;
        }
    }
    
    return null;
};

// 경로로 페이지 정보 가져오기
export const getPageInfoByPath = (pathname: string): PageNode | null => {
    const pageKey = getPageKeyFromPath(pathname);
    return pageKey ? getPageInfo(pageKey) : null;
};

// 폴더형 메뉴 경로들 가져오기 (404 처리용)
export const getFolderPaths = (): string[] => {
    const folderPaths: string[] = [];

    Object.values(PAGES).forEach((page) => {
        if (isFolderNode(page)) {
            folderPaths.push(`/${page.key}`);
        }
    });

    return folderPaths;
};

// =========================================================================
// 6. 아이콘 자동 감지 및 매핑
// =========================================================================

export const getIconComponent = (iconName: string) => {
    const IconComponent = (MuiIcons as Record<string, React.ComponentType>)[iconName];
    return IconComponent || MuiIcons.Home;
};
