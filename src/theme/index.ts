import { createTheme } from '@mui/material/styles';
import lightThemeOptions from './generated/theme.light.json';
import darkThemeOptions from './generated/theme.dark.json';

// MUI v5 호환: 어댑터 결과물을 각각 createTheme로 생성
// JSON 파일을 직접 전달하면 createTheme가 내부적으로 타입 처리
export const lightTheme = createTheme(lightThemeOptions as any);
export const darkTheme = createTheme(darkThemeOptions as any);
export const getThemeByMode = (mode: 'light' | 'dark') => (mode === 'light' ? lightTheme : darkTheme);