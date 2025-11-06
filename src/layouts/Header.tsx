import { AppBar, Toolbar, Box, Stack, IconButton, Link, useTheme } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Brand } from '@/components';
import { Menu, DarkModeOutlined, LightModeOutlined, AccountCircleOutlined } from '@mui/icons-material';
import { HEADER_HEIGHT, Z_INDEX } from '@/config';

export interface HeaderProps {
    onMenuToggle?: () => void;
    onToggleTheme?: () => void;
}

export const Header = ({ onMenuToggle, onToggleTheme }: HeaderProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <AppBar
            component="header"
            color="inherit"
            position="fixed"
            elevation={0}
            sx={{
                minHeight: `${HEADER_HEIGHT}px`,
                borderBottom: '1px solid',
                borderColor: 'divider',
                justifyContent: 'center',
                zIndex: Z_INDEX.HEADER,
            }}
        >
            <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {onMenuToggle && (
                        <IconButton color="inherit" aria-label="메뉴 토글" onClick={onMenuToggle} edge="start">
                            <Menu />
                        </IconButton>
                    )}
                    <Link
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Brand variant="mark" />
                    </Link>
                </Box>

                <Stack direction="row" spacing={1}>
                    <IconButton color="inherit" aria-label="테마 토글" onClick={onToggleTheme}>
                        {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
                    </IconButton>
                    <IconButton color="inherit" aria-label="계정 관리" onClick={() => navigate('/login')}>
                        <AccountCircleOutlined />
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
