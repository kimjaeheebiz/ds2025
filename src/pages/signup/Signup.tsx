import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                계정 등록
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="이름" variant="outlined" fullWidth required />
                <TextField label="이메일" type="email" variant="outlined" fullWidth required />
                <TextField label="비밀번호" type="password" variant="outlined" fullWidth required />
                <TextField label="비밀번호 확인" type="password" variant="outlined" fullWidth required />

                <Button variant="contained" size="large" sx={{ mt: 2 }} onClick={() => navigate('/')}>
                    계정 등록
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography>
                        Already have an account?{' '}
                        <Link component="button" onClick={() => navigate('/login')}>
                            로그인
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
