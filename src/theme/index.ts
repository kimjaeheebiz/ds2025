import { createTheme } from '@mui/material/styles';
import lightThemeOptions from './generated/theme.light.json';
import darkThemeOptions from './generated/theme.dark.json';

// MUI 색상 시스템 확장: brand.colors에서 색상 그룹들을 palette에 추가
const extendColorSystem = (themeOptions: any) => {
    // palette 초기화 확인
    if (!themeOptions.palette) {
        themeOptions.palette = {};
    }
    
    // brand.colors에서 색상 그룹들을 추출하여 palette에 추가 (MUI sx prop 지원)
    if (themeOptions.brand?.colors) {
        Object.keys(themeOptions.brand.colors).forEach(colorGroupName => {
            themeOptions.palette[colorGroupName] = themeOptions.brand.colors[colorGroupName];
        });
    }
    
    return themeOptions;
};

// MUI v5 호환: 어댑터 결과물을 각각 createTheme로 생성
// JSON 파일을 직접 전달하면 createTheme가 내부적으로 타입 처리
export const lightTheme = createTheme(extendColorSystem(lightThemeOptions as any));
export const darkTheme = createTheme(extendColorSystem(darkThemeOptions as any));
export const getThemeByMode = (mode: 'light' | 'dark') => (mode === 'light' ? lightTheme : darkTheme);