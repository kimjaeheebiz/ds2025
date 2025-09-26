import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PAGES, PageKey, getFolderPaths } from '@/constants/app-config';
import { DefaultLayout, AuthLayout, ErrorLayout } from '@/layouts';

// Vite가 빌드 타임에 수집하는 페이지 컴포넌트 매핑 (지연 로딩)
// 절대 경로 사용: /src 로 시작해야 윈도우/별칭 환경에서도 안전합니다.
const PAGE_MODULES = import.meta.glob('/src/pages/**/*.{tsx,jsx}');

// camelCase를 kebab-case로 변환하는 함수
const camelToKebab = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// (leaf only) path가 있는 실제 페이지 키만 재귀적으로 수집
// 자식은 pageConfig.key(전체 키)를 우선 사용합니다.
const getLeafPageKeys = (pages: any): string[] => {
    const keys: string[] = [];

    const processPage = (pageKey: string, pageConfig: any) => {
        // children이 없는 leaf + path가 있는 실제 페이지만 추가
        if ('path' in pageConfig && pageConfig.path) {
            const configKey = 'key' in pageConfig && pageConfig.key ? String(pageConfig.key) : pageKey;
            keys.push(configKey);
        }

        if ('children' in pageConfig && pageConfig.children) {
            Object.entries(pageConfig.children).forEach(([childKey, childConfig]) => {
                const nextKey = 'key' in (childConfig as any) && (childConfig as any).key
                    ? String((childConfig as any).key)
                    : `${pageKey}.${childKey}`;
                processPage(nextKey, childConfig);
            });
        }
    };

    Object.entries(pages).forEach(([pageKey, pageConfig]) => {
        processPage(pageKey, pageConfig);
    });

    // 404/500은 별도 레이아웃으로 처리하므로 컴포넌트 로더에서 제외
    return keys.filter((k) => k !== 'notFound' && k !== 'serverError');
};

// 페이지 키를 파일 시스템 경로로 사상시키고, import.meta.glob 매핑에서 로더를 찾습니다
const generateComponentLoader = (pageKey: string) => {
    const pathParts = pageKey.split('.');
    const last = pathParts[pathParts.length - 1];
    // 마지막 세그먼트(파일명)는 언더스코어를 유지한 채 각 조각을 PascalCase 처리 (depth1_1_1 -> Depth1_1_1)
    const pascal = last
        .split('_')
        .map((p) => (p.length > 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
        .join('_');
    // 디렉터리 경로는 마지막 세그먼트(파일명 후보)를 제외하여 구성
    const kebabDir = pathParts.slice(0, -1).map((p) => camelToKebab(p)).join('/');
    // 혹시 마지막 세그먼트를 디렉터리로 쓰는 구조도 지원 (하위 호환)
    const kebabDirWithLast = pathParts.map((p) => camelToKebab(p)).join('/');

    // 후보 파일 경로들 (tsx 우선)
    const candidates = [
        // 권장: 디렉터리는 부모까지, 파일명은 PascalCase
        `/src/pages/${kebabDir}/${pascal}.tsx`,
        `/src/pages/${kebabDir}/${pascal}.jsx`,
        // 호환: 마지막 세그먼트를 디렉터리로도 허용
        `/src/pages/${kebabDirWithLast}/${pascal}.tsx`,
        `/src/pages/${kebabDirWithLast}/${pascal}.jsx`,
    ];

    const matched = candidates.find((c) => c in PAGE_MODULES);

    if (!matched) {
        // 키가 곧 파일인 경우(예: 이미 PascalCase 파일 바로 아래 배치)도 보조적으로 탐색
        // 우선 현재 키의 디렉터리 구조와 가장 유사한 경로를 먼저 시도
        const fallbackPreferred = Object.keys(PAGE_MODULES).find(
            (p) => p.endsWith(`/src/pages/${kebabDir}/${pascal}.tsx`) || p.endsWith(`/src/pages/${kebabDir}/${pascal}.jsx`)
        );
        const fallback = fallbackPreferred || Object.keys(PAGE_MODULES).find(
            (p) => p.endsWith(`/${pascal}.tsx`) || p.endsWith(`/${pascal}.jsx`)
        );
        const rawLoader = fallback ? ((PAGE_MODULES as any)[fallback] as () => Promise<any>) : undefined;
        if (!rawLoader) {
            // 조용히 fallback 컴포넌트를 반환 (경고 로그 제거)
            const FallbackComponent: React.FC = () =>
                React.createElement('div', null, `Page not found: ${pageKey}`);
            return () => Promise.resolve({ default: FallbackComponent as React.ComponentType });
        }
        return () => rawLoader().then((m) => ({ default: (m as any)[pascal] || (m as any).default }));
    }

    const raw = (PAGE_MODULES as any)[matched] as () => Promise<any>;
    return () => raw().then((m) => ({ default: (m as any)[pascal] || (m as any).default }));
};

// (leaf only) 실제 페이지에 대해서만 컴포넌트 매핑 생성
const PAGE_COMPONENT_MAP = getLeafPageKeys(PAGES).reduce((acc, pageKey) => {
    acc[pageKey] = generateComponentLoader(pageKey);
    return acc;
}, {} as Record<string, () => Promise<{ default: React.ComponentType }>>);

// 페이지 키에 해당하는 컴포넌트 로더 반환
const getPageComponent = (pageKey: string) => {
    const componentLoader = PAGE_COMPONENT_MAP[pageKey as keyof typeof PAGE_COMPONENT_MAP];
    
    if (!componentLoader) {
        // 기본 컴포넌트 반환 (조용히 처리)
        const MissingPage: React.FC = () =>
            React.createElement('div', null, `Page not found: ${pageKey}`);
        return () => Promise.resolve({ default: MissingPage as React.ComponentType });
    }
    
    return componentLoader;
};

// 페이지 설정에서 라우트 객체 생성
export const generateRouteFromPage = (pageKey: PageKey, pageConfig: any): RouteObject | null => {
    // 에러 페이지(404/500)는 별도의 ErrorLayout 라우트로만 처리
    if (pageKey === 'notFound' || pageKey === 'serverError') {
        return null;
    }
    // path가 없는 폴더형 메뉴는 라우트 생성하지 않음
    if (!('path' in pageConfig) || !pageConfig.path) {
        return null;
    }

    const { path } = pageConfig;
    const componentLoader = getPageComponent(pageKey);

    // 로그인/회원가입은 AuthLayout 아래에 배치
    if (path === '/login' || path === '/signup') {
        return {
            path,
            element: React.createElement(AuthLayout),
            children: [
                {
                    index: true,
                    element: React.createElement(React.lazy(componentLoader)),
                },
            ],
        };
    }

    // 일반 페이지는 DefaultLayout 사용
    return {
        path,
        element: React.createElement(React.lazy(componentLoader)),
    };
};

// 모든 페이지에서 라우트 자동 생성
export const generateAllRoutes = (): RouteObject[] => {
    const defaultLayoutChildren: RouteObject[] = [];
    const authLayoutChildren: RouteObject[] = [];

    // 페이지 설정을 재귀적으로 순회하며 라우트 생성
    const processPage = (accumulatedKey: string, pageConfig: any) => {
        // 이 노드의 실제 키는 설정의 key가 우선이며, 없으면 누적 키 사용
        const currentKey = 'key' in pageConfig && pageConfig.key ? String(pageConfig.key) : accumulatedKey;
        const route = generateRouteFromPage(currentKey as PageKey, pageConfig);
        
        if (route) {
            const { path } = pageConfig;
            // 로그인/회원가입은 최상위 라우트로(AuthLayout) 분리
            if (path === '/login' || path === '/signup') {
                authLayoutChildren.push(route);
            } else {
                defaultLayoutChildren.push(route);
            }
        }

        // 하위 페이지들도 처리
        if ('children' in pageConfig && pageConfig.children) {
            Object.entries(pageConfig.children).forEach(([childKey, childConfig]) => {
                const nextKey = 'key' in (childConfig as any) && (childConfig as any).key
                    ? String((childConfig as any).key)
                    : `${currentKey}.${childKey}`;
                processPage(nextKey, childConfig);
            });
        }
    };

    // 모든 페이지 처리
    Object.entries(PAGES).forEach(([pageKey, pageConfig]) => {
        const rootKey = 'key' in pageConfig && pageConfig.key ? String(pageConfig.key) : pageKey;
        processPage(rootKey, pageConfig);
    });

    // 라우트 구성
    const routes: RouteObject[] = [];

    // DefaultLayout으로 감싸진 메인 라우트
    if (defaultLayoutChildren.length > 0) {
        routes.push({
            path: '/',
            element: React.createElement(DefaultLayout),
            children: defaultLayoutChildren,
        });
    }

    // AuthLayout으로 감싸진 인증 라우트
    authLayoutChildren.forEach(route => {
        routes.push(route);
    });

    // 폴더형 메뉴 경로들을 404로 처리
    const folderPaths = getFolderPaths();
    folderPaths.forEach(folderPath => {
        routes.push({
            path: folderPath,
            element: React.createElement(ErrorLayout),
        });
    });

    // 에러 페이지들
    routes.push(
        {
            path: '/404',
            element: React.createElement(ErrorLayout),
        },
        {
            path: '/500',
            element: React.createElement(ErrorLayout, { statusCode: 500, title: "Server Error" }),
        },
        {
            path: '*',
            element: React.createElement(ErrorLayout),
        }
    );

    return routes;
};
