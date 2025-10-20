/**
 * 앱 설정
 * 
 * 애플리케이션 전역 설정 및 편의 함수
 */

import { 
    findRouteByUrl, 
    getBreadcrumbPath,
    getMenuActions,
    findActionButton,
    getIconComponent,
    getParentId,
    getAllRoutes,
    findPageById,
} from './navigation';

// =========================================================================
// 앱 정보
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
// 페이지 메타데이터
// =========================================================================

/**
 * 페이지 메타데이터 맵 생성
 */
export const PAGE_METADATA = (() => {
    const metadata: Record<string, { 
        title: string; 
        description: string; 
        showPageHeader: boolean; 
        layout: 'default' | 'auth' | 'error';
    }> = {};

    getAllRoutes().forEach((route) => {
        metadata[route.id] = {
            title: route.title,
            description: APP_INFO.description,
            showPageHeader: route.showPageHeader,
            layout: route.layout,
        };
    });

    return metadata;
})();

/**
 * 페이지 ID로 메타데이터 가져오기
 */
export const getPageMetadata = (pageId: string) => {
    return PAGE_METADATA[pageId] || { 
        title: APP_INFO.name, 
        description: APP_INFO.description, 
        showPageHeader: false, 
        layout: 'default' as const,
    };
};

/**
 * 페이지 ID로 브라우저 타이틀 생성
 */
export const getBrowserTitle = (pageId: string): string => {
    const metadata = getPageMetadata(pageId);
    return `${metadata.title} | ${APP_INFO.name}`;
};

// =========================================================================
// 재내보내기 (편의성)
// =========================================================================

export {
    findRouteByUrl,
    getBreadcrumbPath,
    getMenuActions,
    findActionButton,
    getIconComponent,
    getParentId,
    getAllRoutes,
    findPageById,
};

export type { RouteInfo } from './navigation';
export type { PageConfig, HiddenPageConfig } from './pages';
export type { MenuItem, MenuGroup, MenuItemLeaf, ActionButton, SortOption, SortDirection } from './mainmenu';
export type { NavigationMenuItem, NavigationMenuChild, NavigationMenuGrandChild } from './navigation';
