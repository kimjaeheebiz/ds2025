import { ComponentDesignConfig } from './types';

/**
 * 레이아웃 타입 정의
 */
export type LayoutType = 'default' | 'auth' | 'error';

/**
 * 페이지 콘텐츠 설정 (레이아웃과 분리된 페이지 콘텐츠만)
 */
export interface PageContentConfig {
    pageName: string;
    pageId: string;
    components: ComponentDesignConfig[];
}

/**
 * 레이아웃별 페이지 템플릿 시스템
 * 기존 레이아웃 시스템과 통합하여 페이지 콘텐츠만 생성
 */
export class PageTemplateManager {
    /**
     * 레이아웃별 페이지 콘텐츠 템플릿 생성
     * @param layoutType 레이아웃 타입
     * @param pageName 페이지 이름
     * @returns 페이지 콘텐츠 설정
     */
    static getLayoutAwareTemplate(layoutType: LayoutType, pageName: string): PageContentConfig {
        switch (layoutType) {
            case 'default':
                return this.getDefaultLayoutContentTemplate(pageName);
            case 'auth':
                return this.getAuthLayoutContentTemplate(pageName);
            case 'error':
                return this.getErrorLayoutContentTemplate(pageName);
            default:
                return this.getDefaultLayoutContentTemplate(pageName);
        }
    }

    /**
     * DefaultLayout용 페이지 콘텐츠 템플릿
     * Header + Sidebar + Main Content 구조에 맞춤
     */
    static getDefaultLayoutContentTemplate(pageName: string): PageContentConfig {
        return {
            pageName,
            pageId: pageName.toLowerCase(),
            components: [],
        };
    }

    /**
     * AuthLayout용 페이지 콘텐츠 템플릿
     * 중앙 정렬된 폼 구조에 맞춤
     */
    static getAuthLayoutContentTemplate(pageName: string): PageContentConfig {
        return {
            pageName,
            pageId: pageName.toLowerCase(),
            components: [],
        };
    }

    /**
     * ErrorLayout용 페이지 콘텐츠 템플릿
     * 에러 페이지 구조에 맞춤
     */
    static getErrorLayoutContentTemplate(pageName: string): PageContentConfig {
        return {
            pageName,
            pageId: pageName.toLowerCase(),
            components: [],
        };
    }

    /**
     * 기존 페이지 설정과 통합
     * @param pageConfig 기존 페이지 설정 (pages.ts에서)
     * @param figmaContent Figma에서 추출된 콘텐츠
     * @returns 통합된 페이지 콘텐츠 설정
     */
    static integrateWithExistingPage(
        pageConfig: { id: string; title: string; layout?: LayoutType },
        figmaContent: PageContentConfig,
    ): PageContentConfig {
        return {
            ...figmaContent,
            pageName: pageConfig.title,
            pageId: pageConfig.id,
        };
    }

    /**
     * 레이아웃별 특수 템플릿 생성
     * @param layoutType 레이아웃 타입
     * @param templateType 특수 템플릿 타입
     * @param pageName 페이지 이름
     * @returns 특수 템플릿 설정
     */
    static getSpecializedTemplate(
        layoutType: LayoutType,
        templateType: 'dashboard' | 'form' | 'list' | 'detail',
        pageName: string,
    ): PageContentConfig {
        return this.getLayoutAwareTemplate(layoutType, pageName);
    }
}
