import { Box, Container, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useRouterPageTitle } from '@/hooks/useRouterPageTitle';
import { Brand } from './Brand';
import { Footer } from './Footer';
import { APP_INFO } from '@/constants/app-config';

export const AuthLayout = () => {
    useRouterPageTitle();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'grey.50',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Paper sx={{ px: 4, py: 5 }}>
                        <Box sx={{ mb: 3 }}>
                            <Brand size="medium" showText={true} />
                        </Box>
                        <Outlet />
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};
