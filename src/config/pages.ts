/**
 * 페이지 설정
 * 
 * 애플리케이션의 모든 페이지를 정의합니다.
 * - 페이지 ID, 제목, 메타데이터
 * - 라우팅 경로는 menus.ts에서 정의
 * - 메뉴에 없는 숨김 페이지 포함
 */

// =========================================================================
// 타입 정의
// =========================================================================

export interface PageConfig {
    id: string;
    title: string;
    showPageHeader?: boolean;  // 페이지 헤더 표시 여부 (기본: true)
    layout?: 'default' | 'auth' | 'error';  // 레이아웃 타입 (기본: default)
}

export interface HiddenPageConfig extends PageConfig {
    url: string;               // 숨김 페이지는 url 필수
    breadcrumbs?: boolean;     // Breadcrumb 표시 여부 (기본: true)
}

// =========================================================================
// 일반 페이지 (메뉴에 표시될 수 있는 페이지)
// =========================================================================

/**
 * 일반 페이지 정의
 * - url은 menus.ts에서 정의 (메뉴 구조와 함께)
 * - 여기서는 페이지 메타데이터만 관리
 */
export const PAGES: PageConfig[] = [
    {
        id: 'home',
        title: 'Home',
        showPageHeader: false,
    },
    {
        id: 'project.project1',
        title: 'Project Name 1',
        showPageHeader: true,
    },
    {
        id: 'project.project2',
        title: 'Project Name 2',
        showPageHeader: true,
    },
    {
        id: 'users',
        title: 'Users',
        showPageHeader: true,
    },
    {
        id: 'components',
        title: 'Components',
        showPageHeader: true,
    },
];

// =========================================================================
// 숨김 페이지 (메뉴에 없는 페이지)
// =========================================================================

/**
 * 메뉴에 표시되지 않는 페이지들
 * - 로그인/회원가입: 인증 페이지
 * - url 필수 (menus.ts에 없으므로)
 * 
 * ⚠️ 에러 페이지(404, 500)는 ErrorLayout에서 직접 처리
 */
export const HIDDEN_PAGES: HiddenPageConfig[] = [
    {
        id: 'login',
        title: '로그인',
        url: '/login',
        showPageHeader: false,
        breadcrumbs: false,
        layout: 'auth',
    },
    {
        id: 'signup',
        title: '계정 등록',
        url: '/signup',
        showPageHeader: false,
        breadcrumbs: false,
        layout: 'auth',
    },
];

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * ID로 페이지 설정 찾기
 */
export const findPageById = (id: string): PageConfig | HiddenPageConfig | null => {
    return PAGES.find(p => p.id === id) || HIDDEN_PAGES.find(p => p.id === id) || null;
};
