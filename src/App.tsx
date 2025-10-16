import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { MIN_WIDTH } from '@/config';
import { lightTheme, darkTheme } from '@/theme';
import './styles/globals.css';
import { useMemo, useState } from 'react';
import { ColorModeContext } from '@/contexts/ColorModeContext';

const queryClient = new QueryClient();

function App() {
    const [mode, setMode] = useState<'light' | 'dark'>('light'); // 기본 모드 설정
    const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
    const ctx = useMemo(() => ({ mode, toggleTheme: () => setMode((m) => (m === 'light' ? 'dark' : 'light')) }), [mode]);

    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <ColorModeContext.Provider value={ctx}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Box sx={{ minWidth: MIN_WIDTH }}>
                            <RouterProvider router={router} />
                        </Box>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </QueryClientProvider>
        </RecoilRoot>
    );
}

export default App;
