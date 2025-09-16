// 앱 전체 설정을 중앙에서 관리하는 파일

// ============================================================================
// 1. 앱 기본 정보
// ============================================================================
export const APP_INFO = {
    name: 'Agent Platform',
    description: 'Hecto Agent Platform',
    version: '1.0.0',
    author: 'Hecto',
    company: 'Hecto',
    copyright: '© 2025 Hecto. All Rights Reserved.',
    website: 'https://hsuda-stage.hecto.co.kr',
} as const;

// ============================================================================
// 2. 라우트 정의 및 페이지 설정 통합
// ============================================================================

// 페이지별 설정 통합 (라우트 + 메타데이터 + 네비게이션)
export const PAGES = {
    home: {
        key: 'home' as const,
        path: '/',
        title: '홈',
        icon: 'HomeOutlined',
        showInSidebar: true,
        showPageHeader: false,
        requiresAuth: false,
    },
    project: {
        key: 'project' as const,
        path: '/project',
        title: '프로젝트',
        icon: 'FolderOutlined',
        showInSidebar: true,
        showPageHeader: true,
        requiresAuth: true,
    },
    depth1: {
        key: 'depth1' as const,
        title: 'Depth 1',
        icon: 'Menu',
        children: {
            depth1_1: {
                key: 'depth1.depth1_1' as const,
                title: 'Depth 1-1',
                children: {
                    depth1_1_1: {
                        key: 'depth1.depth1_1.depth1_1_1' as const,
                        path: '/depth1/depth1_1/depth1_1_1',
                        title: 'Depth 1-1-1',
                        showInSidebar: true,
                        showPageHeader: true,
                        requiresAuth: true,
                    },
                    depth1_1_2: {
                        key: 'depth1.depth1_1.depth1_1_2' as const,
                        path: '/depth1/depth1_1/depth1_1_2',
                        title: 'Depth 1-1-2',
                        showInSidebar: true,
                        showPageHeader: true,
                        requiresAuth: true,
                    },
                },
            },
            depth1_2: {
                key: 'depth1.depth1_2' as const,
                path: '/depth1/depth1_2',
                title: 'Depth 1-2',
                showInSidebar: true,
                showPageHeader: true,
                requiresAuth: true,
            },
        },
    },
    users: {
        key: 'users' as const,
        path: '/users',
        title: '회원 관리',
        icon: 'PeopleOutlineOutlined',
        showInSidebar: true,
        showPageHeader: true,
        requiresAuth: false,
    },
    components: {
        key: 'components' as const,
        path: '/components',
        title: 'UI 컴포넌트',
        icon: 'WidgetsOutlined',
        showInSidebar: true,
        showPageHeader: true,
        requiresAuth: false,
    },
    login: {
        key: 'login' as const,
        path: '/login',
        title: '로그인',
        icon: 'Login',
        showInSidebar: false,
        showPageHeader: false,
        requiresAuth: false,
    },
    signup: {
        key: 'signup' as const,
        path: '/signup',
        title: '계정 등록',
        icon: 'PersonAdd',
        showInSidebar: false,
        showPageHeader: false,
        requiresAuth: false,
    },
    notFound: {
        key: 'notFound' as const,
        path: '/404',
        title: '페이지 없음',
        icon: 'Error',
        showInSidebar: false,
        showPageHeader: false,
        requiresAuth: false,
    },
    serverError: {
        key: 'serverError' as const,
        path: '/500',
        title: '서버 오류',
        icon: 'Error',
        showInSidebar: false,
        showPageHeader: false,
        requiresAuth: false,
    },
} as const;

// ============================================================================
// 3. 자동 생성되는 타입들
// ============================================================================

// 페이지 키 타입 (자동 생성)
export type PageKey = keyof typeof PAGES;
export type PageKeyType =
    | PageKey
    | 'depth1.depth1_1'
    | 'depth1.depth1_2'
    | 'depth1.depth1_1.depth1_1_1'
    | 'depth1.depth1_1.depth1_1_2';

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
        .filter(([key, page]) => !('children' in page && page.children))
        .map(([key, page]) => [key, 'path' in page ? page.path : '']),
) as Record<PageKeyType, string>;

// 페이지 메타데이터만 추출 (하위 페이지 포함)
export const PAGE_METADATA = (() => {
    const metadata: Record<string, { title: string; description: string }> = {};

    // 메인 페이지들
    Object.entries(PAGES).forEach(([key, page]) => {
        if (!('children' in page && page.children)) {
            metadata[key] = { title: page.title, description: APP_INFO.description };
        }

        // 폴더의 하위 페이지들 (2뎁스, 3뎁스 지원) - children이 있으면 폴더로 인식
        if ('children' in page && page.children) {
            Object.entries(page.children).forEach(([childKey, child]) => {
                // 2뎁스 페이지
                if ('path' in child) {
                    metadata[child.key] = { title: child.title, description: APP_INFO.description };
                }
                // 3뎁스 폴더 - children이 있으면 폴더로 인식
                else if ('children' in child && child.children) {
                    Object.entries(child.children).forEach(([grandChildKey, grandChild]) => {
                        metadata[grandChild.key] = { title: grandChild.title, description: APP_INFO.description };
                    });
                }
            });
        }
    });

    return metadata as Record<PageKeyType, { title: string; description: string }>;
})();

// parent 값을 자동으로 계산하는 함수 (NAVIGATION_MENU보다 먼저 정의)
const getParentKey = (key: string): string | undefined => {
    const parts = key.split('.');
    if (parts.length <= 1) return undefined;
    return parts.slice(0, -1).join('.');
};

// 네비게이션 메뉴 필터링 (계층적 구조 지원)
export const NAVIGATION_MENU: NavigationMenuItem[] = Object.values(PAGES)
    .filter((page) => ('showInSidebar' in page ? page.showInSidebar : true)) // 폴더형 메뉴는 기본적으로 표시
    .map((page) => {
        // 폴더인 경우 path 제외 - children이 있으면 폴더로 인식
        const baseItem = {
            label: page.title,
            ...('children' in page && page.children ? {} : { path: 'path' in page ? page.path : '' }),
            icon: page.icon, // 아이콘명을 그대로 전달
            showInSidebar: 'showInSidebar' in page ? page.showInSidebar : true, // 폴더형 메뉴는 기본적으로 표시
        };

        // 폴더인 경우 하위 메뉴 추가 (2뎁스, 3뎁스 지원) - children이 있으면 폴더로 인식
        if ('children' in page && page.children) {
            const children = Object.values(page.children)
                .map((child) => {
                    // 2뎁스 페이지
                    if ('path' in child) {
                        return {
                            label: child.title,
                            path: child.path,
                            parent: getParentKey(child.key),
                        };
                    }
                    // 3뎁스 폴더 - children이 있으면 폴더로 인식
                    else if ('children' in child && child.children) {
                        const grandChildren = Object.values(child.children).map((grandChild) => ({
                            label: grandChild.title,
                            path: grandChild.path,
                            parent: getParentKey(grandChild.key),
                        }));

                        return {
                            label: child.title,
                            parent: getParentKey(child.key),
                            children: grandChildren.length > 0 ? grandChildren : undefined,
                        };
                    }
                    return null;
                })
                .filter((item): item is NonNullable<typeof item> => item !== null);

            return {
                ...baseItem,
                children: children.length > 0 ? children : undefined,
            };
        }

        return baseItem;
    });

// 인증이 필요한 페이지들 (폴더형 메뉴 제외) - children이 있으면 폴더로 인식
export const PROTECTED_PAGES = Object.values(PAGES)
    .filter((page) => !('children' in page && page.children) && 'requiresAuth' in page && page.requiresAuth)
    .map((page) => ('path' in page ? page.path : ''));

// ============================================================================
// 4. 헬퍼 함수들
// ============================================================================

// 페이지 메타데이터 가져오기
export const getPageMetadata = (pageKey: PageKeyType) => {
    return PAGE_METADATA[pageKey];
};

// 브라우저 타이틀 생성
export const getBrowserTitle = (pageKey?: PageKeyType): string => {
    if (!pageKey) {
        return APP_INFO.name;
    }
    const pageTitle = PAGE_METADATA[pageKey].title;
    return `${pageTitle} | ${APP_INFO.name}`;
};

// URL에서 페이지 키 추출 (하위 페이지 포함)
export const getPageKeyFromPath = (pathname: string): PageKeyType | null => {
    const pathToKeyMap: Record<string, PageKeyType> = {};

    // 메인 페이지들
    Object.entries(PAGES).forEach(([key, page]) => {
        if ('path' in page) {
            pathToKeyMap[page.path] = key as PageKeyType;
        }

        // 폴더의 하위 페이지들 (2뎁스, 3뎁스 지원) - children이 있으면 폴더로 인식
        if ('children' in page && page.children) {
            Object.entries(page.children).forEach(([childKey, child]) => {
                // 2뎁스 페이지
                if ('path' in child) {
                    pathToKeyMap[child.path] = child.key as PageKeyType;
                }
                // 3뎁스 폴더 - children이 있으면 폴더로 인식
                else if ('children' in child && child.children) {
                    Object.entries(child.children).forEach(([grandChildKey, grandChild]) => {
                        pathToKeyMap[grandChild.path] = grandChild.key as PageKeyType;
                    });
                }
            });
        }
    });

    return pathToKeyMap[pathname] || null;
};

// 페이지 정보 가져오기 (하위 페이지 포함)
export const getPageInfo = (pageKey: PageKeyType) => {
    // 메인 페이지에서 찾기
    if (pageKey in PAGES) {
        return PAGES[pageKey as keyof typeof PAGES];
    }

    // 하위 페이지에서 찾기 (2뎁스, 3뎁스 지원) - children이 있으면 폴더로 인식
    for (const page of Object.values(PAGES)) {
        if ('children' in page && page.children) {
            for (const child of Object.values(page.children)) {
                // 2뎁스 페이지
                if (child.key === pageKey) {
                    return child;
                }
                // 3뎁스 폴더에서 찾기 - children이 있으면 폴더로 인식
                if ('children' in child && child.children) {
                    for (const grandChild of Object.values(child.children)) {
                        if (grandChild.key === pageKey) {
                            return grandChild;
                        }
                    }
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

// 폴더형 메뉴 경로들 가져오기 (404 처리용) - children이 있으면 자동으로 폴더로 인식
export const getFolderPaths = (): string[] => {
    const folderPaths: string[] = [];

    Object.values(PAGES).forEach((page) => {
        // children이 있으면 폴더로 인식
        if ('children' in page && page.children) {
            // 1뎁스 폴더 경로 추가
            folderPaths.push(`/${page.key}`);

            // 2뎁스 폴더 경로 추가
            Object.values(page.children).forEach((child) => {
                if ('children' in child && child.children) {
                    folderPaths.push(`/${page.key}/${child.key.split('.')[1]}`);
                }
            });
        }
    });

    return folderPaths;
};

// 인증이 필요한 페이지인지 확인
export const isProtectedPage = (pathname: string): boolean => {
    return PROTECTED_PAGES.includes(pathname as any);
};

// ============================================================================
// 5. 아이콘 자동 감지 및 매핑
// ============================================================================

// 모든 MUI 아이콘을 한 번에 import
import * as MuiIcons from '@mui/icons-material';

// PAGES에서 사용되는 모든 아이콘을 자동으로 추출
export const getAllUsedIcons = () => {
    const iconNames = new Set<string>();

    Object.values(PAGES).forEach((page) => {
        if (page.icon) {
            iconNames.add(page.icon);
        }
    });

    return Array.from(iconNames);
};

// 사용되는 아이콘 목록 (자동 생성)
export const USED_ICONS = getAllUsedIcons();

// 아이콘명을 React 컴포넌트로 자동 변환
export const getIconComponent = (iconName: string) => {
    // MuiIcons에서 해당 아이콘을 자동으로 찾아서 반환
    const IconComponent = (MuiIcons as any)[iconName];
    return IconComponent || MuiIcons.Home;
};
