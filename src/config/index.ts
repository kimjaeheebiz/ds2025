/**
 * Config 중앙 내보내기
 */

// App configuration
export {
    APP_INFO,
    PAGE_METADATA,
    getPageMetadata,
    getBrowserTitle,
    findRouteByUrl,
    getBreadcrumbPath,
    getMenuActions,
    findActionButton,
    getIconComponent,
    getParentId,
    getAllRoutes,
    findPageById,
} from './app';

export type {
    RouteInfo,
    PageConfig,
    HiddenPageConfig,
    MenuItem,
    MenuGroup,
    MenuItemLeaf,
    ActionButton,
    SortOption,
    SortDirection,
    NavigationMenuItem,
    NavigationMenuChild,
    NavigationMenuGrandChild,
} from './app';

// Navigation
export { NAVIGATION_MENU, MENUS, getPageMetadataFromMenu, getMenuTitle } from './navigation';

// Pages
export { PAGES, HIDDEN_PAGES } from './navigation';

// Layout configuration
export { MIN_WIDTH, HEADER_HEIGHT, SIDEBAR_WIDTH, SIDEBAR_MINI_WIDTH, Z_INDEX } from './layout';

// Project menu configuration
export { DEFAULT_PROJECT_TABS } from './projectMenu';
export type { ProjectSubMenuTab } from './projectMenu';
