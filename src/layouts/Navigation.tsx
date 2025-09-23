import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { NAVIGATION_MENU, NavigationMenuItem, getIconComponent, PAGES } from '../constants/app-config';

interface NavigationProps {
    open: boolean;
}

export const Navigation = ({ open }: NavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 경로 메뉴 폴더 열기
    const getFoldersToExpand = (currentPath: string): Set<string> => {
        const folders = new Set<string>();

        Object.values(PAGES).forEach((page) => {
            if ('children' in page && page.children) {
                const hasMatchingChild = Object.values(page.children).some((child) => {
                    if ('path' in child && child.path && currentPath.startsWith(child.path)) {
                        folders.add(page.title);
                        return true;
                    }
                    if ('children' in child && child.children) {
                        const hasMatchingGrandChild = Object.values(child.children).some(
                            (grandChild) => {
                                const grandChildConfig = grandChild as any;
                                return grandChildConfig.path && currentPath.startsWith(grandChildConfig.path);
                            }
                        );
                        if (hasMatchingGrandChild) {
                            folders.add(page.title);
                            folders.add(child.title);
                            return true;
                        }
                    }
                    return false;
                });
            }
        });

        return folders;
    };

    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => getFoldersToExpand(location.pathname));

    const menuItems: NavigationMenuItem[] = NAVIGATION_MENU.filter((item) => item.showInSidebar).map((item) => {
        const IconComponent = getIconComponent(item.icon as string);
        return {
            ...item,
            icon: <IconComponent />,
            isActive: item.path
                ? location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                : false,
        };
    });

    const handleNavigation = (path: string) => path && navigate(path);

    useEffect(() => {
        setExpandedFolders(getFoldersToExpand(location.pathname));
    }, [location.pathname]);

    const handleFolderToggle = (folderLabel: string) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            newSet.has(folderLabel) ? newSet.delete(folderLabel) : newSet.add(folderLabel);
            return newSet;
        });
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <List dense sx={{ p: 0 }}>
                {menuItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedFolders.has(item.label);
                    const isActive =
                        item.isActive ||
                        (hasChildren &&
                            item.children?.some(
                                (child) =>
                                    (child.path && location.pathname === child.path) ||
                                    (child.path && child.path !== '/' && location.pathname.startsWith(child.path)),
                            ));

                    return (
                        <ListItem 
                            key={item.path || item.label}
                            disablePadding
                            sx={{ 
                                display: 'block',
                                width: '100%',
                            }}
                        >
                            <Tooltip title={!open ? item.label : ''} placement="right" arrow>
                                <ListItemButton
                                    onClick={() =>
                                        hasChildren
                                            ? handleFolderToggle(item.label)
                                            : item.path && handleNavigation(item.path)
                                    }
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
                                                textTransform: 'uppercase',
                                            }}
                                        />
                                    )}
                                    {hasChildren && open && (
                                        isExpanded ? <ExpandLess /> : <ExpandMore />
                                    )}
                                </ListItemButton>
                            </Tooltip>

                            {/* 2 depth */}
                            {hasChildren && (
                                <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                                    <List component="ul" disablePadding dense>
                                        {item.children?.map((child) => {
                                            const hasGrandChildren = child.children && child.children.length > 0;
                                            const isChildExpanded = expandedFolders.has(child.label);
                                            const isChildActive = child.path
                                                ? location.pathname === child.path ||
                                                 (child.path !== '/' && location.pathname.startsWith(child.path))
                                                : hasGrandChildren &&
                                                 child.children?.some(
                                                     (grandChild) =>
                                                         location.pathname === grandChild.path ||
                                                         (grandChild.path !== '/' &&
                                                             location.pathname.startsWith(grandChild.path)),
                                                     );

                                            return (
                                                <ListItem key={child.path || child.label} disablePadding sx={{ display: 'block' }}>
                                                    <Tooltip
                                                        title={!open ? child.label : ''}
                                                        placement="right"
                                                        arrow
                                                    >
                                                        <ListItemButton
                                                            onClick={() => {
                                                                if (hasGrandChildren) {
                                                                    handleFolderToggle(child.label);
                                                                } else if (child.path) {
                                                                    handleNavigation(child.path);
                                                                }
                                                            }}
                                                            selected={isChildActive}
                                                            sx={{
                                                                pl: 8,
                                                                pr: 2,
                                                            }}
                                                        >
                                                            {open && <ListItemText primary={child.label} />}
                                                            {hasGrandChildren && open && (
                                                                isChildExpanded ? <ExpandLess /> : <ExpandMore />
                                                            )}
                                                        </ListItemButton>
                                                    </Tooltip>

                                                    {/* 3 depth */}
                                                    {hasGrandChildren && (
                                                        <Collapse
                                                            in={isChildExpanded && open}
                                                            timeout="auto"
                                                            unmountOnExit
                                                        >
                                                            <List component="ul" disablePadding dense>
                                                                {child.children?.map((grandChild) => {
                                                                    const isGrandChildActive =
                                                                        location.pathname === grandChild.path ||
                                                                        (grandChild.path !== '/' &&
                                                                            location.pathname.startsWith(
                                                                                grandChild.path,
                                                                            ));
                                                                    return (
                                                                        <ListItem key={grandChild.path} disablePadding sx={{ display: 'block' }}>
                                                                            <Tooltip
                                                                                title={!open ? grandChild.label : ''}
                                                                                placement="right"
                                                                                arrow
                                                                            >
                                                                                <ListItemButton
                                                                                    onClick={() =>
                                                                                        handleNavigation(
                                                                                            grandChild.path,
                                                                                        )
                                                                                    }
                                                                                    selected={isGrandChildActive}
                                                                                    sx={{
                                                                                        pl: 12,
                                                                                        pr: 2
                                                                                    }}
                                                                                >
                                                                                    {open && <ListItemText primary={grandChild.label} />}
                                                                                </ListItemButton>
                                                                            </Tooltip>
                                                                        </ListItem>
                                                                    );
                                                                })}
                                                            </List>
                                                        </Collapse>
                                                    )}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};
