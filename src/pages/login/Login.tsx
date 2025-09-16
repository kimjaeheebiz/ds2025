import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                로그인
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="이메일" type="email" variant="outlined" fullWidth required />
                <TextField label="비밀번호" type="password" variant="outlined" fullWidth required />

                <Button variant="contained" size="large" sx={{ mt: 2 }} onClick={() => navigate('/')}>
                    로그인
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography>
                        계정이 없으신가요?{' '}
                        <Link component="button" onClick={() => navigate('/signup')}>
                            계정 등록
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
