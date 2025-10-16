import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { SIDEBAR_WIDTH, SIDEBAR_MINI_WIDTH, HEADER_HEIGHT, Z_INDEX } from '@/config';
import { Navigation } from './Navigation/Navigation';

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

export const Sidebar = ({ open, onToggle }: SidebarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? open : true}
            onClose={isMobile ? onToggle : undefined}
            sx={{
                width: isMobile ? SIDEBAR_WIDTH : open ? SIDEBAR_WIDTH : SIDEBAR_MINI_WIDTH,
                flexShrink: 0,
                zIndex: Z_INDEX.SIDEBAR,
                '& .MuiDrawer-paper': {
                    width: isMobile ? SIDEBAR_WIDTH : open ? SIDEBAR_WIDTH : SIDEBAR_MINI_WIDTH,
                    boxSizing: 'border-box',
                    transition: isMobile ? 'none' : 'width 0.3s ease',
                    overflow: 'auto',
                    top: `${HEADER_HEIGHT}px`,
                    height: `calc(100% - ${HEADER_HEIGHT}px)`,
                },
            }}
        >
            <Navigation open={open} />
        </Drawer>
    );
};
