/**
 * 네비게이션 빌더 및 헬퍼 함수
 * 
 * menus.ts와 pages.ts를 결합하여:
 * - 네비게이션 메뉴 생성
 * - 라우팅 정보 제공
 * - Breadcrumb 경로 생성
 */

import React from 'react';
import * as MuiIcons from '@mui/icons-material';
import { MAIN_MENUS, MenuItem, MenuGroup, MenuItemLeaf, ActionButton, getMainPageMetadataFromMenu, getMainMenuTitle } from './mainmenu';
import { PAGES, HIDDEN_PAGES, PageConfig, HiddenPageConfig, findPageById } from './pages';

// =========================================================================
// 네비게이션 메뉴 아이템 타입 (렌더링용)
// =========================================================================

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
    icon: string | React.ReactElement;
    path?: string;
    showInSidebar: boolean;
    actions?: ActionButton[];
    children?: NavigationMenuChild[];
}

// =========================================================================
// 라우팅 정보 타입
// =========================================================================

export interface RouteInfo {
    url: string;
    title: string;
    id: string;
    pageId?: string;
    showPageHeader: boolean;
    layout: 'default' | 'auth' | 'error';
}

// =========================================================================
// 네비게이션 메뉴 생성
// =========================================================================

/**
 * parent ID 자동 계산
 */
export const getParentId = (id: string): string | undefined => {
    const parts = id.split('.');
    if (parts.length <= 1) return undefined;
    return parts.slice(0, -1).join('.');
};

/**
 * 메뉴를 렌더링용 네비게이션 구조로 변환
 */
export const NAVIGATION_MENU: NavigationMenuItem[] = (() => {
    const buildNavigationItem = (menu: MenuItem, depth: number = 1): NavigationMenuItem | NavigationMenuChild | null => {
        // 1-depth: NavigationMenuItem 생성
        if (depth === 1) {
            const baseItem: NavigationMenuItem = {
                label: getMainMenuTitle(menu),  // ✅ getMainMenuTitle 사용
                icon: menu.icon || 'HomeOutlined',
                showInSidebar: true,
            };

            if (menu.type === 'item') {
                return {
                    ...baseItem,
                    path: menu.path,
                };
            }

            if (menu.type === 'group') {
                const groupMenu = menu as MenuGroup;
                const children = groupMenu.children
                    .map((child): NavigationMenuChild | null => {
                        return buildNavigationItem(child, 2) as NavigationMenuChild | null;
                    })
                    .filter((item): item is NavigationMenuChild => item !== null);

                return {
                    ...baseItem,
                    path: menu.path,
                    children: children.length > 0 ? children : undefined,
                    actions: groupMenu.actions,
                };
            }
        }

        // 2-depth: NavigationMenuChild 생성 (아이콘 없음)
        if (depth === 2) {
            if (menu.type === 'item') {
                return {
                    label: getMainMenuTitle(menu),  // ✅ getMainMenuTitle 사용
                    path: menu.path,
                    parent: getParentId(menu.id),
                };
            }

            if (menu.type === 'group') {
                const groupMenu = menu as MenuGroup;
                const grandChildren = groupMenu.children
                    .map((grandChild): NavigationMenuGrandChild | null => {
                        if (grandChild.type !== 'item') return null;
                        
                        return {
                            label: getMainMenuTitle(grandChild),  // ✅ getMainMenuTitle 사용
                            path: grandChild.path,
                            parent: getParentId(grandChild.id),
                        };
                    })
                    .filter((item): item is NavigationMenuGrandChild => item !== null);

                return grandChildren.length > 0
                    ? {
                        label: getMainMenuTitle(menu),  // ✅ getMainMenuTitle 사용
                        parent: getParentId(menu.id),
                        children: grandChildren,
                    }
                    : null;
            }
        }

        return null;
    };

    return MAIN_MENUS
        .map(menu => buildNavigationItem(menu, 1))
        .filter((item): item is NavigationMenuItem => item !== null);
})();

// =========================================================================
// 라우팅 정보 생성
// =========================================================================

/**
 * 메뉴에서 라우트 정보 추출 (재귀)
 */
function extractRoutesFromMenu(menu: MenuItem): RouteInfo[] {
    const routes: RouteInfo[] = [];

    if (menu.type === 'item') {
        const pageMetadata = menu.pageId ? findPageById(menu.pageId) : null;
        
        routes.push({
            url: menu.path,
            title: getMainMenuTitle(menu),  // ✅ getMainMenuTitle 사용
            id: menu.pageId || menu.id,  // pageId 우선 사용
            pageId: menu.pageId,
            showPageHeader: pageMetadata?.showPageHeader ?? true,
            layout: pageMetadata?.layout || 'default',
        });
    }

    if (menu.type === 'group' && menu.children) {
        menu.children.forEach(child => {
            routes.push(...extractRoutesFromMenu(child));
        });
    }

    return routes;
}

/**
 * 모든 라우트 정보 (메뉴 페이지 + 숨김 페이지)
 */
export const ALL_ROUTES: RouteInfo[] = [
    // 메뉴 페이지
    ...MAIN_MENUS.flatMap(extractRoutesFromMenu),
    // 숨김 페이지
    ...HIDDEN_PAGES.map(page => ({
        url: page.url,
        title: page.title,
        id: page.id,
        showPageHeader: page.showPageHeader ?? true,
        layout: page.layout || 'default',
    })),
];

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * MUI 아이콘 컴포넌트 가져오기
 */
export const getIconComponent = (iconName: string) => {
    const IconComponent = (MuiIcons as Record<string, React.ComponentType>)[iconName];
    return IconComponent || MuiIcons.Home;
};

/**
 * URL로 메뉴 아이템 찾기 (재귀)
 */
export const findMenuByUrl = (url: string, menus: MenuItem[] = MAIN_MENUS): MenuItem | null => {
    for (const menu of menus) {
        if (menu.path === url) return menu;
        
        if (menu.type === 'group' && menu.children) {
            const found = findMenuByUrl(url, menu.children);
            if (found) return found;
        }
    }
    return null;
};

/**
 * URL로 라우트 정보 찾기
 */
export const findRouteByUrl = (url: string): RouteInfo | null => {
    return ALL_ROUTES.find(route => route.url === url) || null;
};

/**
 * ID로 메뉴 아이템 찾기 (재귀)
 */
export const findMenuById = (id: string, menus: MenuItem[] = MAIN_MENUS): MenuItem | null => {
    for (const menu of menus) {
        if (menu.id === id) return menu;
        
        if (menu.type === 'group' && menu.children) {
            const found = findMenuById(id, menu.children);
            if (found) return found;
        }
    }
    return null;
};

/**
 * URL로 Breadcrumb 경로 생성 (메뉴 구조 기반)
 */
export const getBreadcrumbPath = (url: string): Array<{ title: string; path?: string }> => {
    const breadcrumbs: Array<{ title: string; path?: string }> = [];
    
    const findPath = (targetUrl: string, menus: MenuItem[], ancestors: MenuItem[] = []): boolean => {
        for (const menu of menus) {
            const currentAncestors = [...ancestors, menu];
            
            if (menu.path === targetUrl) {
                breadcrumbs.push(...currentAncestors.map(m => ({ 
                    title: getMainMenuTitle(m),  // ✅ getMainMenuTitle 사용
                    path: m.path 
                })));
                return true;
            }
            
            if (menu.type === 'group' && menu.children) {
                if (findPath(targetUrl, menu.children, currentAncestors)) {
                    return true;
                }
            }
        }
        return false;
    };
    
    findPath(url, MAIN_MENUS);
    return breadcrumbs;
};

/**
 * 모든 라우트 경로 추출 (라우트 생성용)
 */
export const getAllRoutes = (): RouteInfo[] => {
    return ALL_ROUTES;
};

/**
 * 메뉴 제목으로 액션 버튼 찾기
 */
export const getMenuActions = (menuTitle: string): ActionButton[] | undefined => {
    const search = (menus: MenuItem[]): ActionButton[] | undefined => {
        for (const menu of menus) {
            if (getMainMenuTitle(menu) === menuTitle && menu.type === 'group' && menu.actions) {  // ✅ getMainMenuTitle 사용
                return menu.actions;
            }
            if (menu.type === 'group' && menu.children) {
                const found = search(menu.children);
                if (found) return found;
            }
        }
        return undefined;
    };
    
    return search(MAIN_MENUS);
};

/**
 * 특정 액션 버튼 찾기
 */
export const findActionButton = (menuTitle: string, actionKey: string): ActionButton | undefined => {
    const actions = getMenuActions(menuTitle);
    return actions?.find((action) => action.key === actionKey);
};

// =========================================================================
// 내보내기
// =========================================================================

export type { 
    ActionButton, 
    SortOption, 
    SortDirection, 
    MenuItem, 
    MenuGroup, 
    MenuItemLeaf 
} from './mainmenu';

export type { 
    PageConfig, 
    HiddenPageConfig 
} from './pages';

export { 
    MAIN_MENUS,
    getMainPageMetadataFromMenu,
    getMainMenuTitle,  // ✅ export 추가
} from './mainmenu';

export { 
    PAGES,
    HIDDEN_PAGES,
    findPageById,
} from './pages';
