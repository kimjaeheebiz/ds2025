import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

const HomeContent = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                            Project
                        </Typography>
                        <Typography sx={{ mb: 2 }}>프로젝트별 워크플로우 관리 및 실행</Typography>
                        <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate('/project/project1')}>
                            Project 1
                        </Button>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                            Users
                        </Typography>
                        <Typography sx={{ mb: 2 }}>사용자 관리</Typography>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/users')}
                        >
                            Users
                        </Button>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                            MUI Components
                        </Typography>
                        <Typography sx={{ mb: 2 }}>주요 MUI 컴포넌트 참고</Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/components')}
                        >
                            UI Components
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export const Home = () => {
    return <HomeContent />;
};
