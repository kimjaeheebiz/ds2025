import { createTheme, ThemeOptions } from '@mui/material/styles';
import lightThemeOptions from './generated/theme.light.json';
import darkThemeOptions from './generated/theme.dark.json';

// MUI v5 호환: 어댑터 결과물을 각각 createTheme로 생성
export const lightTheme = createTheme(lightThemeOptions as ThemeOptions);
export const darkTheme = createTheme(darkThemeOptions as ThemeOptions);
export const getThemeByMode = (mode: 'light' | 'dark') => (mode === 'light' ? lightTheme : darkTheme);