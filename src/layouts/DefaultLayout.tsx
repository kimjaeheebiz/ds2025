import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageHeader } from './PageHeader';
import { useRouterPageTitle } from '@/hooks/useRouterPageTitle';
import { HEADER_HEIGHT, findRouteByUrl } from '@/config';
import { useColorMode } from '@/contexts/ColorModeContext';

export const DefaultLayout = () => {
    useRouterPageTitle();

    const location = useLocation();
    const currentRoute = findRouteByUrl(location.pathname);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const { toggleTheme } = useColorMode();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                pt: `${HEADER_HEIGHT}px`,
            }}
        >
            {/* <Header> */}
            <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} onToggleTheme={toggleTheme} />

            {/* MainArea */}
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                {/* <Sidebar> */}
                <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

                {/* Main */}
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                    }}
                >
                    {/* <PageHeader> */}
                    {currentRoute && currentRoute.showPageHeader && <PageHeader title={currentRoute.title} />}

                    {/* 페이지 콘텐츠 */}
                    <Box sx={{ flex: 1 }}>
                        {/* MainContent - 페이지 메인 콘텐츠 프레임 자동 추출 */}
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
