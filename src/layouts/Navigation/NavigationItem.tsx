/**
 * Navigation 메뉴 아이템 컴포넌트 (1-depth)
 */

import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { NavigationMenuItem } from '@/config/navigation';

interface NavigationItemProps {
    item: NavigationMenuItem;
    open: boolean;
    isActive: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    onToggle: () => void;
    onNavigate: (path: string) => void;
}

export function NavigationItem({
    item,
    open,
    isActive,
    isExpanded,
    hasChildren,
    onToggle,
    onNavigate,
}: NavigationItemProps) {
    const handleClick = () => {
        if (hasChildren) {
            onToggle();
        } else if (item.path) {
            onNavigate(item.path);
        }
    };

    return (
        <ListItem
            disablePadding
            sx={{
                display: 'block',
                width: '100%',
            }}
        >
            <Tooltip title={!open ? item.label : ''} placement="right" arrow>
                <ListItemButton
                    onClick={handleClick}
                    selected={isActive}
                    sx={{
                        justifyContent: open ? 'flex-start' : 'center',
                        minHeight: 48,
                        px: open ? 2 : 'auto',
                        width: '100%',
                        display: 'flex',
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: open ? 40 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    {open && (
                        <ListItemText
                            primary={item.label}
                            sx={{
                                ml: 1,
                            }}
                        />
                    )}
                    {hasChildren && open && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
            </Tooltip>
        </ListItem>
    );
}
