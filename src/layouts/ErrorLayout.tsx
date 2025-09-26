import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRouterPageTitle } from '@/hooks/useRouterPageTitle';
import { Brand } from './Brand';

export interface ErrorLayoutProps {
    statusCode?: number;
    title?: string;
    message?: string;
}

export const ErrorLayout = ({ statusCode = 404, title, message }: ErrorLayoutProps) => {
    const getDefaultTitle = () => {
        switch (statusCode) {
            case 404:
                return 'Page Not Found';
            case 500:
                return 'Server Error';
            default:
                return 'Error';
        }
    };

    const getDefaultMessage = () => {
        switch (statusCode) {
            case 404:
                return '입력하신 주소가 정확한지 다시 한번 확인해 주세요.';
            case 500:
                return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
            default:
                return '오류가 발생했습니다.';
        }
    };

    const errorTitle = title || getDefaultTitle();
    const errorMessage = message || getDefaultMessage();
    const navigate = useNavigate();
    useRouterPageTitle();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                    <Brand size="large" showText={true} />
                </Box>

                <Typography component="h1" sx={{ fontSize: '7rem', fontWeight: '600', lineHeight: 1.2}}>
                    {statusCode}
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                    <strong>{errorTitle}</strong>
                </Typography>
                <Typography variant="body1">
                    {errorMessage}
                </Typography>
                <Button variant="contained" color="primary" size="large" sx={{ mt: 5 }} onClick={() => navigate('/')}>
                    Home
                </Button>
            </Container>
        </Box>
    );
};
