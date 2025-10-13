// MUI Theme 확장 타입 정의
// https://mui.com/material-ui/customization/theming/#custom-variables

import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        brand: {
            // 새로운 구조: colors/sizes 분리
            colors: {
                [colorGroupName: string]: {
                    [colorName: string]: {
                        [shade: string]: string;
                    };
                };
            };
            sizes: {
                [sizeGroupName: string]: {
                    [sizeName: string]: number;
                };
            };
            // 하위 호환성: logo 속성
            logo?: {
                size: {
                    small: number;
                    medium: number;
                    large: number;
                    extraLarge: number;
                };
            };
        };
    }

    // 동적 브랜드 색상 그룹을 위한 별도 인터페이스
    interface BrandColorGroups {
        [colorGroupName: string]: {
            [colorName: string]: {
                [shade: string]: string;
            };
        };
    }

    // Theme에 BrandColorGroups 확장
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Theme extends BrandColorGroups {}

    interface ThemeOptions {
        brand?: {
            // 새로운 구조: colors/sizes 분리
            colors?: {
                [colorGroupName: string]: {
                    [colorName: string]: {
                        [shade: string]: string;
                    };
                };
            };
            sizes?: {
                [sizeGroupName: string]: {
                    [sizeName: string]: number;
                };
            };
            // 하위 호환성: logo 속성
            logo?: {
                size?: {
                    small?: number;
                    medium?: number;
                    large?: number;
                    extraLarge?: number;
                };
            };
        };
    }

    // ThemeOptions에 BrandColorGroups 확장
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ThemeOptions extends Partial<BrandColorGroups> {}

    // Palette에 동적 브랜드 색상 그룹 추가 ({colorGroup.colorName.shade} 패턴 지원)
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Palette extends BrandColorGroups {}

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface PaletteOptions extends Partial<BrandColorGroups> {}
}

