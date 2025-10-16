/**
 * 라우트 자동 생성 (Mantis 스타일)
 * 
 * menus.ts의 메뉴 구조에서 React Router 라우트를 자동 생성합니다.
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';
import { getAllRoutes } from '@/config';
import { DefaultLayout, AuthLayout, ErrorLayout } from '@/layouts';

// 타입 정의
type PageModule = { default: React.ComponentType };
type PageModuleLoader = () => Promise<PageModule>;
type PageModulesMap = Record<string, PageModuleLoader>;

// Vite가 빌드 타임에 수집하는 페이지 컴포넌트 매핑 (지연 로딩)
const PAGE_MODULES = import.meta.glob('/src/pages/**/*.{tsx,jsx}') as PageModulesMap;

// camelCase를 kebab-case로 변환하는 함수
const camelToKebab = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// ID를 파일 경로로 변환 (project.project1 → project/project1)
const idToPath = (id: string): string => {
    return id.split('.').map(camelToKebab).join('/');
};

// 페이지 ID에서 컴포넌트 로더 생성
const generateComponentLoader = (id: string): PageModuleLoader => {
    const pathParts = id.split('.');
    const last = pathParts[pathParts.length - 1];
    
    // 마지막 세그먼트를 PascalCase로 변환
    const pascal = last
        .split(/[-_]/)
        .map((p) => (p.length > 0 ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : p))
        .join('');
    
    // 디렉터리 경로 생성 (소문자 그대로 유지)
    const dirPath = pathParts.slice(0, -1).join('/');
    const lastSegment = last.toLowerCase();
    const fullPath = pathParts.join('/');

    // 후보 파일 경로들
    const candidates = [
        // 1. project/project1/Project1.tsx 형식
        `/src/pages/${dirPath}/${lastSegment}/${pascal}.tsx`,
        `/src/pages/${dirPath}/${lastSegment}/${pascal}.jsx`,
        
        // 2. project.project1 → project/project1.tsx 형식
        `/src/pages/${fullPath}/${pascal}.tsx`,
        `/src/pages/${fullPath}/${pascal}.jsx`,
        
        // 3. home/Home.tsx 형식 (단일 depth)
        `/src/pages/${lastSegment}/${pascal}.tsx`,
        `/src/pages/${lastSegment}/${pascal}.jsx`,
        
        // 4. Home.tsx 형식 (루트)
        `/src/pages/${pascal}.tsx`,
        `/src/pages/${pascal}.jsx`,
    ];

    const matched = candidates.find((c) => c in PAGE_MODULES);

    if (!matched) {
        // 개발 환경에서만 디버깅 정보 출력
        if (import.meta.env.DEV) {
            console.error(`❌ Page component not found for ID: ${id}`);
            console.error(`Candidates checked:`, candidates);
            console.error(`Available modules:`, Object.keys(PAGE_MODULES).filter(k => k.includes(lastSegment)));
        }
        
        // Fallback 컴포넌트
        const FallbackComponent: React.FC = () =>
            React.createElement('div', null, `Page not found: ${id}`);
        return () => Promise.resolve({ default: FallbackComponent as React.ComponentType });
    }

    const raw = PAGE_MODULES[matched];
    return () => raw().then((m) => {
        const moduleRecord = m as Record<string, React.ComponentType>;
        return { default: moduleRecord[pascal] || moduleRecord.default };
    });
};

// 모든 라우트 자동 생성
export const generateAllRoutes = (): RouteObject[] => {
    const defaultLayoutChildren: RouteObject[] = [];
    const authLayoutChildren: RouteObject[] = [];
    const errorLayoutRoutes: RouteObject[] = [];

    // 메뉴에서 모든 라우트 정보 가져오기
    const allRoutes = getAllRoutes();

    allRoutes.forEach((route) => {
        const { url, id, layout } = route;

        // layout에 따라 분류
        if (layout === 'auth') {
            const componentLoader = generateComponentLoader(id);
            authLayoutChildren.push({
                path: url,
                element: React.createElement(AuthLayout),
                children: [
                    {
                        index: true,
                        element: React.createElement(React.lazy(componentLoader)),
                    },
                ],
            });
        } else if (layout === 'error') {
            // ErrorLayout 라우트 (statusCode를 파싱, 컴포넌트 로딩 없음)
            const statusCode = url.includes('500') ? 500 : 404;
            errorLayoutRoutes.push({
                path: url,
                element: React.createElement(ErrorLayout, { statusCode }),
            });
        } else {
            // 일반 페이지는 DefaultLayout 하위에
            const componentLoader = generateComponentLoader(id);
            defaultLayoutChildren.push({
                path: url === '/' ? url : url.replace(/^\//, ''), // '/' 제거
                element: React.createElement(React.lazy(componentLoader)),
            });
        }
    });

    const routes: RouteObject[] = [];

    // DefaultLayout으로 감싸진 메인 라우트
    if (defaultLayoutChildren.length > 0) {
        routes.push({
            path: '/',
            element: React.createElement(DefaultLayout),
            children: defaultLayoutChildren,
        });
    }

    // AuthLayout 라우트
    authLayoutChildren.forEach(route => {
        routes.push(route);
    });

    // ErrorLayout 라우트 (테스트용)
    errorLayoutRoutes.forEach(route => {
        routes.push(route);
    });

    // Catch-all 404
    routes.push({
        path: '*',
        element: React.createElement(ErrorLayout),
    });

    return routes;
};
