import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { MIN_WIDTH } from '@/constants/layout';
import { theme } from '@/theme';
import './styles/globals.css';

const queryClient = new QueryClient();

function App() {
    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box sx={{ minWidth: MIN_WIDTH }}>
                        <RouterProvider router={router} />
                    </Box>
                </ThemeProvider>
            </QueryClientProvider>
        </RecoilRoot>
    );
}

export default App;
