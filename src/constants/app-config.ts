// =========================================================================
// 앱 전체 설정을 중앙에서 관리
// 1. 앱 기본 정보
// 2. 라우트 정의 및 페이지 설정 통합
// 3. 자동 생성되는 타입들
// 4. 헬퍼 함수들
// 5. 아이콘 자동 감지 및 매핑
// =========================================================================


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
// 2. 라우트 정의 및 페이지 설정 통합
// =========================================================================

// 페이지별 설정 통합 (라우트 + 메타데이터 + 네비게이션)
export const PAGES = {
    home: {
        key: 'home' as const,
        path: '/',
        title: 'Home',
        icon: 'HomeOutlined',
        showInSidebar: true,
        showPageHeader: false,
        
    },
    project: {
        key: 'project' as const,
        title: 'Project',
        icon: 'FolderOutlined',
        children: {
            project1: {
                key: 'project.project1' as const,
                path: '/project/project1',
                title: 'Project Name 1',
                showInSidebar: true,
                showPageHeader: true,
                
            },
            project2: {
                key: 'project.project2' as const,
                path: '/project/project2',
                title: 'Project Name 2',
                showInSidebar: true,
                showPageHeader: true,
                
            },
        },
    },
    users: {
        key: 'users' as const,
        path: '/users',
        title: 'Users',
        icon: 'PeopleOutlineOutlined',
        showInSidebar: true,
        showPageHeader: true,
        
    },
    components: {
        key: 'components' as const,
        path: '/components',
        title: 'MUI Components',
        icon: 'WidgetsOutlined',
        showInSidebar: true,
        showPageHeader: true,
        
    },
    login: {
        key: 'login' as const,
        path: '/login',
        title: '로그인',
        icon: 'Login',
        showInSidebar: false,
        showPageHeader: false,
        
    },
    signup: {
        key: 'signup' as const,
        path: '/signup',
        title: '계정 등록',
        icon: 'PersonAdd',
        showInSidebar: false,
        showPageHeader: false,
        
    },
    notFound: {
        key: 'notFound' as const,
        path: '/404',
        title: '페이지 없음',
        icon: 'Error',
        showInSidebar: false,
        showPageHeader: false,
        
    },
    serverError: {
        key: 'serverError' as const,
        path: '/500',
        title: '서버 오류',
        icon: 'Error',
        showInSidebar: false,
        showPageHeader: false,
        
    },
} as const;

// =========================================================================
// 3. 자동 생성되는 타입들
// =========================================================================

// 페이지 키 타입 (자동 생성)
export type PageKey = keyof typeof PAGES;

// 페이지 정보 타입 (자동 생성)
export type PageInfo = (typeof PAGES)[PageKey];

// 네비게이션 메뉴 아이템 타입
export interface NavigationMenuItem {
    label: string;
    path?: string; // 폴더형 메뉴는 path가 없을 수 있음
    icon: string | React.ReactElement; // 설정에서는 string, 렌더링에서는 ReactElement
    showInSidebar: boolean;
    isActive?: boolean; // UI 상태 (선택적)
    children?: Array<{
        label: string;
        path?: string;
        parent?: string;
        children?: Array<{
            label: string;
            path: string;
            parent?: string;
        }>;
    }>;
}

// 라우트 경로만 추출 (폴더형 메뉴 제외) - children이 있으면 폴더로 인식
export const ROUTES = Object.fromEntries(
    Object.entries(PAGES)
        .filter(([, page]) => !('children' in page && (page as any).children))
        .map(([key, page]) => [key, 'path' in page ? (page as any).path : '']),
) as Record<PageKey, string>;

// 페이지 메타데이터만 추출 (하위 페이지 포함)
export const PAGE_METADATA = (() => {
    const metadata: Record<string, { title: string; description: string }> = {};

    // 메인 페이지들
    Object.entries(PAGES).forEach(([key, page]) => {
        if (!('children' in page && (page as any).children)) {
            metadata[key] = { title: (page as any).title, description: APP_INFO.description };
        }

        // 폴더의 하위 페이지들
        if ('children' in page && (page as any).children) {
            Object.entries((page as any).children).forEach(([, child]) => {
                // 2뎁스 페이지
                if ('path' in (child as any)) {
                    metadata[(child as any).key] = { title: (child as any).title, description: APP_INFO.description };
                }
                // 3뎁스 폴더
                else if ('children' in (child as any) && (child as any).children) {
                    Object.entries((child as any).children).forEach(([, grandChild]) => {
                        const grandChildConfig = grandChild as any;
                        metadata[grandChildConfig.key] = { title: grandChildConfig.title, description: APP_INFO.description };
                    });
                }
            });
        }
    });

    return metadata as Record<PageKey, { title: string; description: string }>;
})();

// parent 값을 자동으로 계산 (NAVIGATION_MENU보다 먼저 정의)
const getParentKey = (key: string): string | undefined => {
    const parts = key.split('.');
    if (parts.length <= 1) return undefined;
    return parts.slice(0, -1).join('.');
};

// 네비게이션 메뉴 필터링 (계층적 구조 지원)
export const NAVIGATION_MENU: NavigationMenuItem[] = Object.values(PAGES)
    .filter((page) => ('showInSidebar' in page ? (page as any).showInSidebar : true))
    .map((page) => {
        // 폴더인 경우 path 제외
        const baseItem = {
            label: (page as any).title,
            ...('children' in page && (page as any).children ? {} : { path: 'path' in page ? (page as any).path : '' }),
            icon: (page as any).icon,
            showInSidebar: 'showInSidebar' in page ? (page as any).showInSidebar : true,
        } as any;

        if ('children' in page && (page as any).children) {
            const children = Object.values((page as any).children)
                .map((child: any) => {
                    if ('path' in child) {
                        return {
                            label: child.title,
                            path: child.path,
                            parent: getParentKey(child.key),
                        };
                    } else if ('children' in child && child.children) {
                        const grandChildren = Object.values(child.children).map((grandChild: any) => {
                            return {
                                label: grandChild.title,
                                path: grandChild.path,
                                parent: getParentKey(grandChild.key),
                            };
                        });
                        return {
                            label: child.title,
                            parent: getParentKey(child.key),
                            children: grandChildren.length > 0 ? grandChildren : undefined,
                        };
                    }
                    return null;
                })
                .filter((item) => item !== null) as any[];

            return {
                ...baseItem,
                children: children.length > 0 ? children : undefined,
            };
        }

        return baseItem;
    });

// =========================================================================
// 4. 헬퍼 함수들
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
    const pageTitle = PAGE_METADATA[pageKey].title;
    return `${pageTitle} | ${APP_INFO.name}`;
};

// URL에서 페이지 키 추출 (하위 페이지 포함)
export const getPageKeyFromPath = (pathname: string): PageKey | null => {
    const pathToKeyMap: Record<string, PageKey> = {} as any;

    Object.entries(PAGES).forEach(([key, page]) => {
        if ('path' in page) {
            pathToKeyMap[(page as any).path] = key as PageKey;
        }
        if ('children' in page && (page as any).children) {
            Object.values((page as any).children).forEach((child: any) => {
                if ('path' in child) {
                    pathToKeyMap[child.path] = child.key as PageKey;
                }
            });
        }
    });

    return pathToKeyMap[pathname] || null;
};

// 페이지 정보 가져오기 (하위 페이지 포함)
export const getPageInfo = (pageKey: PageKey) => {
    if (pageKey in PAGES) {
        return (PAGES as any)[pageKey as any];
    }
    for (const page of Object.values(PAGES) as any[]) {
        if ('children' in page && page.children) {
            for (const child of Object.values(page.children) as any[]) {
                if (child.key === pageKey) {
                    return child;
                }
            }
        }
    }
    return null;
};

// 경로로 페이지 정보 가져오기
export const getPageInfoByPath = (pathname: string) => {
    const pageKey = getPageKeyFromPath(pathname);
    return pageKey ? getPageInfo(pageKey) : null;
};

// 폴더형 메뉴 경로들 가져오기 (404 처리용)
export const getFolderPaths = (): string[] => {
    const folderPaths: string[] = [];

    Object.values(PAGES).forEach((page: any) => {
        if ('children' in page && page.children) {
            folderPaths.push(`/${page.key}`);
        }
    });

    return folderPaths;
};

// =========================================================================
// 5. 아이콘 자동 감지 및 매핑
// =========================================================================

import * as MuiIcons from '@mui/icons-material';

export const getAllUsedIcons = () => {
    const iconNames = new Set<string>();
    Object.values(PAGES).forEach((page: any) => {
        if (page.icon) {
            iconNames.add(page.icon);
        }
    });
    return Array.from(iconNames);
};

export const USED_ICONS = getAllUsedIcons();

export const getIconComponent = (iconName: string) => {
    const IconComponent = (MuiIcons as any)[iconName];
    return IconComponent || MuiIcons.Home;
};
