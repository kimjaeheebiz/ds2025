// MUI Theme 확장 타입 정의
// https://mui.com/material-ui/customization/theming/#custom-variables

import '@mui/material/styles';
import { BrandTokens, BrandColorGroup } from '../../design-system/generators/types';

declare module '@mui/material/styles' {
    // Theme에 brand 속성 추가
    interface Theme {
        brand: Required<BrandTokens>;
    }

    // ThemeOptions에 brand 속성 추가
    interface ThemeOptions {
        brand?: BrandTokens;
    }

    // Palette에 동적 브랜드 색상 그룹 추가 (sx prop에서 사용 가능)
    interface Palette {
        [colorGroupName: string]: BrandColorGroup | unknown;
    }

    interface PaletteOptions {
        [colorGroupName: string]: Partial<BrandColorGroup> | unknown;
    }
}
