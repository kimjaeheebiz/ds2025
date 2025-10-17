/**
 * 브랜드 토큰 타입 정의
 * 
 * Figma brand/Mode 1.json → MUI theme.brand
 */

/**
 * 브랜드 색상 그룹
 * 
 * 구조: {colorName}/{shade}
 * @example { orange: { 50: '#fceae7', 500: '#ff6114' } }
 */
export interface BrandColorGroup {
    [colorName: string]: {
        [shade: string]: string;
    };
}

/**
 * 브랜드 사이즈 그룹
 * 
 * 구조: {sizeName}
 * @example { small: 20, medium: 24 }
 */
export interface BrandSizeGroup {
    [sizeName: string]: number;
}

/**
 * 브랜드 토큰 전체 구조
 * 
 * Figma 경로:
 * - brand/colors/{colorGroup}/{colorName}/{shade}
 * - brand/sizes/{sizeGroup}/{sizeName}
 * 
 * 사용 예시:
 * @example
 * theme.brand.colors.hecto.orange[500]  // '#ff6114'
 * theme.brand.sizes.logo.medium         // 24
 */
export interface BrandTokens {
    /**
     * 브랜드 색상 팔레트
     */
    colors?: {
        [colorGroupName: string]: BrandColorGroup;
    };
    
    /**
     * 브랜드 사이즈
     */
    sizes?: {
        [sizeGroupName: string]: BrandSizeGroup;
    };
}

