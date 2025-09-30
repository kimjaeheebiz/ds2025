// MUI Theme 확장 타입 정의
// https://mui.com/material-ui/customization/theming/#custom-variables

import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        brand: {
            logo: {
                size: {
                    small: number;
                    medium: number;
                    large: number;
                    extraLarge: number;
                };
            };
        };
    }

    interface ThemeOptions {
        brand?: {
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
}

