// App configuration
export {
    APP_INFO,
    PAGE_METADATA,
    NAVIGATION_MENU,
    PAGES,
    getPageMetadata,
    getBrowserTitle,
    getPageKeyFromPath,
    getPageInfo,
    getFolderPaths,
    getIconComponent,
    isLeafNode,
    isFolderNode,
    isPageNode,
} from './app';
export type { 
    PageNode, 
    LeafPageNode, 
    FolderPageNode, 
    PageKey, 
    NavigationMenuItem, 
    NavigationMenuChild, 
    NavigationMenuGrandChild,
    ActionButton,
    ActionButtonType,
    SortDirection,
    SortOption,
} from './app';

// Layout configuration
export { MIN_WIDTH, HEADER_HEIGHT, SIDEBAR_WIDTH, SIDEBAR_MINI_WIDTH, Z_INDEX } from './layout';

// Project menu configuration
export { DEFAULT_PROJECT_TABS } from './projectMenu';
export type { ProjectSubMenuTab } from './projectMenu';

