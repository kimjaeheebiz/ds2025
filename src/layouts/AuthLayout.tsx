import { Box, Container, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useRouterPageTitle } from '@/hooks/useRouterPageTitle';
import { Brand } from '@/components';
import { Footer } from './Footer';

export const AuthLayout = () => {
    useRouterPageTitle();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
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
                    <Paper
                        sx={{
                            px: 4,
                            py: 5,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
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
