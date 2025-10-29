import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

const HomeContent = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100%', p: 3, gap: 3 }}>
            <Grid container spacing={2} sx={{ minHeight: '100%' }}>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Project
                            </Typography>
                            <Typography sx={{ mb: 2 }}>프로젝트별 워크플로우 관리 및 실행</Typography>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/project/project1')}
                            >
                                Project 1
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Users
                            </Typography>
                            <Typography sx={{ mb: 2 }}>사용자 관리</Typography>
                            <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate('/users')}>
                                Users
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                UI Components
                            </Typography>
                            <Typography sx={{ mb: 2 }}>주요 컴포넌트 참고</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/components')}
                            >
                                Components
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Test
                            </Typography>
                            <Typography color="error.main" sx={{ mb: 2 }}>페이지 자동 생성 (컴포넌트 매핑 개발 중)</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/test')}
                            >
                                Test
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export const Home = () => {
    return <HomeContent />;
};
