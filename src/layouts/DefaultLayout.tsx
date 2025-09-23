import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageHeader } from './PageHeader';
import { useRouterPageTitle } from '@/hooks/useRouterPageTitle';
import { HEADER_HEIGHT } from '@/constants/layout';
import { getPageKeyFromPath, PAGE_METADATA, getPageInfo } from '@/constants/app-config';

export const DefaultLayout = () => {
    useRouterPageTitle();

    const location = useLocation();
    const pageKey = getPageKeyFromPath(location.pathname)!;
    const pageMetadata = PAGE_METADATA[pageKey];
    const pageInfo = getPageInfo(pageKey);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

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
            <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                {/* 사이드바 */}
                <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

                {/* 메인 영역 */}
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                    }}
                >
                    {/* 페이지 헤더 */}
                    {pageInfo && 'showPageHeader' in pageInfo && pageInfo.showPageHeader && (
                        <PageHeader title={pageMetadata.title} />
                    )}

                    {/* 페이지 콘텐츠 */}
                    <Box sx={{ flex: 1 }}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
