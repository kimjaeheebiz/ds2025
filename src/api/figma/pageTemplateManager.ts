import { ComponentDesignConfig, TypographyConfig } from './types';

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
    contentStyles: {
        colors: Record<string, string>;
        spacing: Record<string, string>;
        typography: Record<string, TypographyConfig>;
    };
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
            contentStyles: {
                colors: {
                    contentBackground: 'transparent', // DefaultLayout 배경 사용
                    contentText: 'inherit', // 테마 색상 상속
                    accentColor: 'primary.main', // MUI 테마 색상 사용
                    cardBackground: 'background.paper',
                    cardBorder: 'divider'
                },
                spacing: {
                    contentPadding: '24px', // DefaultLayout의 메인 콘텐츠 패딩
                    sectionGap: '32px',
                    componentGap: '16px',
                    cardPadding: '16px'
                },
                typography: {
                    pageTitle: {
                        fontFamily: 'inherit',
                        fontSize: 24, // PageHeader와 조화
                        fontWeight: 600,
                        lineHeight: 1.2
                    },
                    sectionTitle: {
                        fontFamily: 'inherit',
                        fontSize: 20,
                        fontWeight: 500,
                        lineHeight: 1.3
                    },
                    bodyText: {
                        fontFamily: 'inherit',
                        fontSize: 14,
                        fontWeight: 400,
                        lineHeight: 1.5
                    }
                }
            }
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
            contentStyles: {
                colors: {
                    formBackground: 'background.paper',
                    formBorder: 'divider',
                    formFocus: 'primary.main',
                    formError: 'error.main',
                    formSuccess: 'success.main'
                },
                spacing: {
                    formPadding: '32px',
                    fieldGap: '20px',
                    buttonGap: '16px',
                    formMaxWidth: '400px'
                },
                typography: {
                    formTitle: {
                        fontFamily: 'inherit',
                        fontSize: 24,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textAlign: 'center'
                    },
                    formSubtitle: {
                        fontFamily: 'inherit',
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: 1.5,
                        textAlign: 'center'
                    },
                    fieldLabel: {
                        fontFamily: 'inherit',
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: 1.4
                    }
                }
            }
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
            contentStyles: {
                colors: {
                    errorBackground: 'background.default',
                    errorText: 'text.primary',
                    errorAccent: 'error.main',
                    errorIcon: 'error.main'
                },
                spacing: {
                    errorPadding: '48px',
                    errorGap: '24px',
                    errorMaxWidth: '600px'
                },
                typography: {
                    errorCode: {
                        fontFamily: 'inherit',
                        fontSize: 72,
                        fontWeight: 700,
                        lineHeight: 1,
                        textAlign: 'center'
                    },
                    errorTitle: {
                        fontFamily: 'inherit',
                        fontSize: 24,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textAlign: 'center'
                    },
                    errorMessage: {
                        fontFamily: 'inherit',
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: 1.5,
                        textAlign: 'center'
                    }
                }
            }
        };
    }

    /**
     * 페이지 콘텐츠 스타일 오버라이드
     * @param baseConfig 기본 페이지 콘텐츠 설정
     * @param overrides 오버라이드할 스타일
     * @returns 오버라이드된 페이지 콘텐츠 설정
     */
    static applyContentStyleOverrides(
        baseConfig: PageContentConfig, 
        overrides: Partial<PageContentConfig['contentStyles']>
    ): PageContentConfig {
        return {
            ...baseConfig,
            contentStyles: {
                colors: {
                    ...baseConfig.contentStyles.colors,
                    ...overrides.colors
                },
                spacing: {
                    ...baseConfig.contentStyles.spacing,
                    ...overrides.spacing
                },
                typography: {
                    ...baseConfig.contentStyles.typography,
                    ...overrides.typography
                }
            }
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
        figmaContent: PageContentConfig
    ): PageContentConfig {
        const layoutType = pageConfig.layout || 'default';
        const template = this.getLayoutAwareTemplate(layoutType, pageConfig.title);
        
        return {
            ...figmaContent,
            pageName: pageConfig.title,
            pageId: pageConfig.id,
            contentStyles: {
                ...template.contentStyles,
                ...figmaContent.contentStyles,
                colors: {
                    ...template.contentStyles.colors,
                    ...figmaContent.contentStyles.colors
                },
                spacing: {
                    ...template.contentStyles.spacing,
                    ...figmaContent.contentStyles.spacing
                },
                typography: {
                    ...template.contentStyles.typography,
                    ...figmaContent.contentStyles.typography
                }
            }
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
        pageName: string
    ): PageContentConfig {
        const baseTemplate = this.getLayoutAwareTemplate(layoutType, pageName);
        
        switch (templateType) {
            case 'dashboard':
                return this.applyContentStyleOverrides(baseTemplate, {
                    spacing: {
                        ...baseTemplate.contentStyles.spacing,
                        contentPadding: '16px',
                        sectionGap: '24px',
                        componentGap: '16px'
                    },
                    colors: {
                        ...baseTemplate.contentStyles.colors,
                        cardBackground: 'background.paper',
                        cardBorder: 'divider'
                    }
                });
            
            case 'form':
                return this.applyContentStyleOverrides(baseTemplate, {
                    spacing: {
                        ...baseTemplate.contentStyles.spacing,
                        contentPadding: '32px',
                        sectionGap: '24px',
                        componentGap: '20px'
                    },
                    colors: {
                        ...baseTemplate.contentStyles.colors,
                        formBackground: 'background.paper',
                        formBorder: 'divider',
                        formFocus: 'primary.main'
                    }
                });
            
            case 'list':
                return this.applyContentStyleOverrides(baseTemplate, {
                    spacing: {
                        ...baseTemplate.contentStyles.spacing,
                        contentPadding: '16px',
                        sectionGap: '16px',
                        componentGap: '8px'
                    }
                });
            
            case 'detail':
                return this.applyContentStyleOverrides(baseTemplate, {
                    spacing: {
                        ...baseTemplate.contentStyles.spacing,
                        contentPadding: '24px',
                        sectionGap: '24px',
                        componentGap: '16px'
                    }
                });
            
            default:
                return baseTemplate;
        }
    }
}
