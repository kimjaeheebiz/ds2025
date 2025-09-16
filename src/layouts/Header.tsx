import { AppBar, Toolbar, Box, IconButton, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Brand } from './Brand';
import { Person, Menu } from '@mui/icons-material';
import { HEADER_HEIGHT, Z_INDEX } from '@/constants/layout';

export interface HeaderProps {
    onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
    const navigate = useNavigate();

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
                        <Brand variant="mark" showText={true} />
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton color="inherit" aria-label="계정 관리" onClick={() => navigate('/login')}>
                        <Person />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
