import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { APP_INFO, ROUTES } from '@/constants/app-config';
import { ArrowForward } from '@mui/icons-material';

const HomeContent = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Card sx={{ flex: 1, minWidth: 300 }}>
                <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                        Workspace
                    </Typography>
                    <Typography sx={{ mb: 2 }}>워크플로우 관리 및 실행</Typography>
                    <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate(ROUTES.workspace)}>
                        Workspace
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
                <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                        Sample
                    </Typography>
                    <Typography sx={{ mb: 2 }}>Depth 3 샘플 페이지</Typography>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/depth1/depth1_1/depth1_1_2')}
                    >
                        Sample
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
                <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                        UI Components
                    </Typography>
                    <Typography sx={{ mb: 2 }}>UI Components 페이지</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(ROUTES.components)}
                    >
                        UI Components
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export const Home = () => {
    return <HomeContent />;
};
