import { createContext, useContext } from 'react';

export const ColorModeContext = createContext<{ mode: 'light' | 'dark'; toggleTheme: () => void }>({
    mode: 'light',
    toggleTheme: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);
