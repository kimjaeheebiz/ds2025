/**
 * 메뉴 설정 (Figma 동기화용)
 * 
 * 사이드바에 표시될 메뉴 구조를 정의합니다.
 * - 메뉴 계층 구조
 * - 아이콘 (1-depth만)
 * - URL 경로 (breadcrumb 생성용)
 * - 페이지 참조 (pageId)
 * 
 * ⚠️ Figma 연동 시:
 * - id, title, icon, url, 계층구조는 Figma에서 동기화
 * - pageId 매핑은 코드에서 관리
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

// 메뉴 타입
export type MenuType = 'group' | 'item';

// 기본 메뉴 아이템
interface BaseMenuItem {
    id: string;              // 메뉴 ID
    title?: string;          // 메뉴명 (생략 시 pages.ts에서 자동 로드)
    type: MenuType;
    url?: string;            // URL 경로 (breadcrumb 생성용)
    icon?: string;           // MUI 아이콘 이름 (1-depth만)
    pageId?: string;         // pages.ts 참조 (item 타입)
}

// Group 메뉴 (하위 메뉴 포함)
export interface MenuGroup extends BaseMenuItem {
    type: 'group';
    children: MenuItem[];
    actions?: ActionButton[];
}

// Item 메뉴 (단일 페이지)
export interface MenuItemLeaf extends BaseMenuItem {
    type: 'item';
    url: string;             // Item은 url 필수
    pageId: string;          // pages.ts 참조 필수
}

export type MenuItem = MenuGroup | MenuItemLeaf;

// =========================================================================
// 메뉴 데이터
// =========================================================================

/**
 * 사이드바 메뉴 구조
 * 
 * ⚠️ 중요:
 * - type: 'group' → 하위 메뉴 포함, url 선택적 (breadcrumb용)
 * - type: 'item' → 단일 페이지, url/pageId 필수
 * - icon은 1-depth만 표시
 * - url이 breadcrumb 경로를 결정
 * - pageId로 pages.ts의 메타데이터 참조
 * - 메뉴 순서 = 배열 순서
 * 
 * 📌 Figma 동기화 대상:
 * - id, title, type, url, icon, children, actions
 * 
 * 📌 코드에서만 관리:
 * - pageId (pages.ts 매핑)
 */
export const MENUS: MenuItem[] = [
    {
        id: 'home',
        type: 'item',
        url: '/',
        icon: 'HomeOutlined',
        pageId: 'home',              // pages.ts 참조
    },
    {
        id: 'project',
        type: 'group',
        icon: 'FolderOutlined',
        actions: [
            {
                key: 'add',
                label: '+ New Project',
                type: 'button',
                onClick: () => {
                    // TODO: 프로젝트 생성 모달 열기 구현
                    console.log('Create new project');
                },
                textColor: 'text.secondary',
            },
            {
                key: 'sort',
                type: 'sort-group',
                sortOptions: [
                    { key: 'name', label: '이름순' },
                    { key: 'date', label: '참여일순' },
                ],
                onSort: (key: string, direction) => {
                    // TODO: 프로젝트 정렬 로직 구현
                    console.log('Sort by:', key, direction);
                },
            },
        ],
        children: [
            {
                id: 'project1',
                type: 'item',
                url: '/project/project1',
                pageId: 'project.project1',  // pages.ts 참조
            },
            {
                id: 'project2',
                type: 'item',
                url: '/project/project2',
                pageId: 'project.project2',  // pages.ts 참조
            },
        ],
    },
    {
        id: 'users',
        title: 'Users',
        type: 'item',
        url: '/users',
        icon: 'PeopleOutlineOutlined',
        pageId: 'users',             // pages.ts 참조
    },
    {
        id: 'guide',
        title: 'Guide',
        type: 'group',
        icon: 'BookOutlined',
        children: [
            {
                id: 'components1',
                title: 'UI Components',
                type: 'group',
                url: '/guide/components',
                children: [
                    {
                        id: 'components',
                        title: 'UI Components',
                        type: 'item',
                        url: '/guide/components',
                        // icon: 'WidgetsOutlined',
                        pageId: 'components',        // pages.ts 참조
                    },
                ],
            },
        ],
    },
];

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * 메뉴의 pageId로 페이지 메타데이터 가져오기
 */
export const getPageMetadataFromMenu = (menu: MenuItem) => {
    if (menu.type === 'item' && menu.pageId) {
        return findPageById(menu.pageId);
    }
    return null;
};

/**
 * 메뉴의 title 가져오기 (pages.ts에서 자동 로드 또는 override)
 * - menu.title이 있으면 사용
 * - 없으면 pageId로 pages.ts에서 자동 로드
 */
export const getMenuTitle = (menu: MenuItem): string => {
    // 명시적으로 title이 지정된 경우
    if (menu.title) {
        return menu.title;
    }
    
    // pageId로 pages.ts에서 자동 로드
    if (menu.type === 'item' && menu.pageId) {
        const pageConfig = findPageById(menu.pageId);
        if (pageConfig) {
            return pageConfig.title;
        }
    }
    
    // Fallback: id를 title로 사용
    return menu.id;
};
