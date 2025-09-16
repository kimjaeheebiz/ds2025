import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { NAVIGATION_MENU, NavigationMenuItem, getIconComponent, PAGES } from '@/constants/app-config';

interface NavigationProps {
    open: boolean;
}

export const Navigation = ({ open }: NavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 경로에 따라 자동으로 폴더를 열기
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
                            (grandChild) => grandChild.path && currentPath.startsWith(grandChild.path),
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
            <List sx={{ p: 1 }}>
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
                        <Box key={item.path || item.label}>
                            <ListItem disablePadding sx={{ mb: 0.5 }}>
                                <Tooltip title={!open ? item.label : ''} placement="right" arrow>
                                    <ListItemButton
                                        onClick={() =>
                                            hasChildren
                                                ? handleFolderToggle(item.label)
                                                : item.path && handleNavigation(item.path)
                                        }
                                        selected={isActive}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                            borderRadius: 1,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            sx={{
                                                opacity: open ? 1 : 0,
                                                '& .MuiListItemText-primary': {
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                },
                                            }}
                                        />
                                        {hasChildren && open && (
                                            <Box sx={{ opacity: open ? 1 : 0 }}>
                                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                            </Box>
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>

                            {/* 하위 메뉴 아이템들 */}
                            {hasChildren && (
                                <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
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
                                                <Box key={child.path || child.label}>
                                                    {/* 2뎁스 메뉴 아이템 */}
                                                    <ListItem disablePadding sx={{ mb: 0.5, pl: 2 }}>
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
                                                                    minHeight: 40,
                                                                    justifyContent: open ? 'initial' : 'center',
                                                                    px: 2.5,
                                                                    borderRadius: 1,
                                                                }}
                                                            >
                                                                <ListItemText
                                                                    primary={child.label}
                                                                    sx={{
                                                                        opacity: open ? 1 : 0,
                                                                        '& .MuiListItemText-primary': {
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: 400,
                                                                        },
                                                                    }}
                                                                />
                                                                {hasGrandChildren && open && (
                                                                    <Box sx={{ opacity: open ? 1 : 0 }}>
                                                                        {isChildExpanded ? (
                                                                            <ExpandLess />
                                                                        ) : (
                                                                            <ExpandMore />
                                                                        )}
                                                                    </Box>
                                                                )}
                                                            </ListItemButton>
                                                        </Tooltip>
                                                    </ListItem>

                                                    {/* 3뎁스 메뉴 아이템들 */}
                                                    {hasGrandChildren && (
                                                        <Collapse
                                                            in={isChildExpanded && open}
                                                            timeout="auto"
                                                            unmountOnExit
                                                        >
                                                            <List component="div" disablePadding>
                                                                {child.children?.map((grandChild) => {
                                                                    const isGrandChildActive =
                                                                        location.pathname === grandChild.path ||
                                                                        (grandChild.path !== '/' &&
                                                                            location.pathname.startsWith(
                                                                                grandChild.path,
                                                                            ));
                                                                    return (
                                                                        <ListItem
                                                                            key={grandChild.path}
                                                                            disablePadding
                                                                            sx={{ mb: 0.5, pl: 4 }}
                                                                        >
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
                                                                                        minHeight: 36,
                                                                                        justifyContent: open
                                                                                            ? 'initial'
                                                                                            : 'center',
                                                                                        px: 2.5,
                                                                                        borderRadius: 1,
                                                                                    }}
                                                                                >
                                                                                    <ListItemText
                                                                                        primary={grandChild.label}
                                                                                        sx={{
                                                                                            opacity: open ? 1 : 0,
                                                                                            '& .MuiListItemText-primary':
                                                                                                {
                                                                                                    fontSize: '0.75rem',
                                                                                                    fontWeight: 400,
                                                                                                },
                                                                                        }}
                                                                                    />
                                                                                </ListItemButton>
                                                                            </Tooltip>
                                                                        </ListItem>
                                                                    );
                                                                })}
                                                            </List>
                                                        </Collapse>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
};
