/**
 * 메뉴 설정 (Figma 동기화)
 * 
 * ⚠️ 이 파일은 자동 생성되었습니다.
 * 수동 편집 시 Figma 동기화로 덮어쓰일 수 있습니다.
 * 
 * 생성 일시: 2025-11-10T00:34:44.433Z
 */

import { findPageById } from './pages';

// =========================================================================
// 타입 정의
// =========================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface SortOption {
    key: string;
    label: string;
}

export type ActionButtonType = 'button' | 'sort-group';

export interface ActionButton {
    key: string;
    label?: string;
    type: ActionButtonType;
    onClick?: () => void;
    textColor?: string;
    sortOptions?: SortOption[];
    onSort?: (key: string, direction: SortDirection) => void;
}

export type MenuType = 'group' | 'item';

interface BaseMenuItem {
    id: string;
    title?: string;
    type: MenuType;
    path?: string;
    icon?: string;
    pageId?: string;
}

export interface MenuGroup extends BaseMenuItem {
    type: 'group';
    children: MenuItem[];
    actions?: ActionButton[];
}

export interface MenuItemLeaf extends BaseMenuItem {
    type: 'item';
    path: string;
    pageId: string;
}

export type MenuItem = MenuGroup | MenuItemLeaf;

// =========================================================================
// 메뉴 데이터 (Figma에서 동기화)
// =========================================================================

export const MAIN_MENUS: MenuItem[] = [
    {
        id: 'home',
        title: 'Home',
        type: 'item',
        path: '/',
        icon: 'HomeOutlined',
        pageId: 'home',
    },
    {
        id: 'project',
        title: 'Project',
        type: 'group',
        icon: 'FolderOutlined',
        children: [
            {
                id: 'project1',
                title: 'Project 1',
                type: 'item',
                path: '/project/project1',
                pageId: 'project.project1',
            },
            {
                id: 'project2',
                title: 'Project 2',
                type: 'item',
                path: '/project/project2',
                pageId: 'project.project2',
            }
        ],
    },
    {
        id: 'users',
        title: 'Users',
        type: 'item',
        path: '/users',
        icon: 'PeopleOutlineOutlined',
        pageId: 'users',
    },
    {
        id: 'components',
        title: 'Components',
        type: 'item',
        path: '/components',
        icon: 'WidgetsOutlined',
        pageId: 'components',
    },
    {
        id: 'test',
        title: 'Test',
        type: 'item',
        path: '/test',
        icon: 'StarBorder',
        pageId: 'test',
    }
];

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * 메뉴 제목 가져오기 (title이 없으면 pages.ts에서 로드)
 */
export const getMainMenuTitle = (menu: MenuItem): string => {
    if (menu.title) {
        return menu.title;
    }
    if (menu.type === 'item' && menu.pageId) {
        const pageConfig = findPageById(menu.pageId);
        if (pageConfig) {
            return pageConfig.title;
        }
    }
    return menu.id;
};

/**
 * 페이지 메타데이터 가져오기
 */
export const getMainPageMetadataFromMenu = (menu: MenuItem) => {
    if (menu.type === 'item' && menu.pageId) {
        return findPageById(menu.pageId);
    }
    return null;
};
