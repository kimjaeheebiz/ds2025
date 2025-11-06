import { createTheme, ThemeOptions } from '@mui/material/styles';
import { BrandTokens } from '../../design-system/generators/types';
import lightThemeOptions from './generated/theme.light.json';
import darkThemeOptions from './generated/theme.dark.json';

// 확장된 테마 옵션 타입
interface ExtendedThemeOptions {
    palette?: Record<string, unknown>;
    brand?: BrandTokens;
    [key: string]: unknown;
}

// 타입 가드: brand.colors 존재 여부 확인
function hasBrandColors(brand: unknown): brand is BrandTokens & { colors: NonNullable<BrandTokens['colors']> } {
    return (
        brand !== null &&
        typeof brand === 'object' &&
        'colors' in brand &&
        typeof (brand as BrandTokens).colors === 'object' &&
        (brand as BrandTokens).colors !== null
    );
}

/**
 * MUI 색상 시스템 확장
 * brand.colors의 색상 그룹들을 palette에 추가하여 sx prop에서 사용 가능하도록 함
 *
 * @param themeOptions - 원본 테마 옵션
 * @returns 확장된 테마 옵션 (불변성 유지)
 */
const extendColorSystem = (themeOptions: ExtendedThemeOptions): ExtendedThemeOptions => {
    const { palette = {}, brand, ...rest } = themeOptions;

    // brand.colors가 없으면 원본 그대로 반환
    if (!hasBrandColors(brand)) {
        return themeOptions;
    }

    // 불변성 유지: 새 객체 반환
    return {
        ...rest,
        brand,
        palette: {
            ...palette,
            ...brand.colors, // brand.colors의 모든 색상 그룹을 palette에 병합
        },
    };
};

// MUI v5 호환: 어댑터 결과물을 각각 createTheme로 생성
export const lightTheme = createTheme(extendColorSystem(lightThemeOptions as ExtendedThemeOptions) as ThemeOptions);
export const darkTheme = createTheme(extendColorSystem(darkThemeOptions as ExtendedThemeOptions) as ThemeOptions);

/**
 * 테마 모드에 따라 테마 반환
 * @param mode - 'light' 또는 'dark'
 * @returns 선택된 테마
 */
export const getThemeByMode = (mode: 'light' | 'dark') => (mode === 'light' ? lightTheme : darkTheme);
