import { 
    Box, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Tooltip, 
    Collapse,
} from '@mui/material';
import { 
    ExpandLess, 
    ExpandMore,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { 
    NAVIGATION_MENU, 
    NavigationMenuItem, 
    getIconComponent, 
    PAGES, 
    isPageNode, 
    isFolderNode,
    ActionButton,
    SortDirection,
    SortOption,
} from '@/config';

interface NavigationProps {
    open: boolean;
}

// 경로 활성화 체크 헬퍼 함수
function isPathActive(currentPath: string, targetPath?: string): boolean {
    if (!targetPath) return false;
    return currentPath === targetPath || (targetPath !== '/' && currentPath.startsWith(targetPath));
}

export const Navigation = ({ open }: NavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 정렬 상태 관리 (key: sortKey, value: direction)
    const [sortStates, setSortStates] = useState<Record<string, SortDirection>>({});

    // 현재 경로 메뉴 폴더 열기
    const getFoldersToExpand = (currentPath: string): Set<string> => {
        const folders = new Set<string>();

        Object.values(PAGES).forEach((page) => {
            if (!isPageNode(page) || !isFolderNode(page)) return;

            Object.values(page.children).some((child) => {
                if (!isPageNode(child)) return false;

                // Leaf 자식이 현재 경로와 매칭되면 부모 폴더 열기
                if ('path' in child && isPathActive(currentPath, child.path)) {
                    folders.add(page.title);
                    return true;
                }

                // Folder 자식인 경우 손자 노드 확인
                if (isFolderNode(child)) {
                    const hasMatchingGrandChild = Object.values(child.children).some((grandChild) => {
                        if (!isPageNode(grandChild)) return false;
                        return 'path' in grandChild && isPathActive(currentPath, grandChild.path);
                    });

                    if (hasMatchingGrandChild) {
                        folders.add(page.title);
                        folders.add(child.title);
                        return true;
                    }
                }

                return false;
            });
        });

        return folders;
    };

    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => getFoldersToExpand(location.pathname));

    const menuItems: NavigationMenuItem[] = NAVIGATION_MENU.filter((item) => item.showInSidebar).map((item) => {
        const IconComponent = getIconComponent(item.icon as string);
        return {
            ...item,
            icon: <IconComponent />,
            isActive: isPathActive(location.pathname, item.path),
        };
    });

    const handleNavigation = (path: string) => path && navigate(path);

    useEffect(() => {
        setExpandedFolders(getFoldersToExpand(location.pathname));
    }, [location.pathname]);

    const handleFolderToggle = (folderLabel: string) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(folderLabel)) {
                newSet.delete(folderLabel);
            } else {
                newSet.add(folderLabel);
            }
            return newSet;
        });
    };

    // 정렬 옵션 렌더링 함수
    const renderSortOption = (sortOption: SortOption, onSort: (key: string, direction: SortDirection) => void) => {
        const currentDirection = sortStates[sortOption.key];
        
        const handleSort = () => {
            let newDirection: SortDirection;
            
            if (currentDirection === null || currentDirection === undefined) {
                newDirection = 'asc';
            } else if (currentDirection === 'asc') {
                newDirection = 'desc';
            } else {
                newDirection = null;
            }
            
            setSortStates(prev => ({
                ...prev,
                [sortOption.key]: newDirection,
            }));
            
            onSort(sortOption.key, newDirection);
        };

        return (
            <ListItemButton
                key={sortOption.key}
                onClick={handleSort}
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.5,
                    fontSize: '13px',  // 14px (small 사이즈)
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    '&:hover': {
                        bgcolor: 'action.focus',
                    },
                }}
            >
                <Box component="span">
                    {sortOption.label}
                </Box>
                {currentDirection === 'asc' && (
                    <ArrowUpwardIcon sx={{ fontSize: 'inherit', ml: 0.5 }} />
                )}
                {currentDirection === 'desc' && (
                    <ArrowDownwardIcon sx={{ fontSize: 'inherit', ml: 0.5 }} />
                )}
            </ListItemButton>
        );
    };

    // 액션 버튼 렌더링 함수
    const renderActionButton = (action: ActionButton) => {
        // Button 타입 (일반 버튼)
        if (action.type === 'button') {
            return (
                <ListItem key={action.key} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        onClick={action.onClick}
                        sx={{
                            pl: 8,
                            pr: 2,
                        }}
                    >
                        <ListItemText 
                            primary={action.label}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: action.textColor || 'text.primary',
                                },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            );
        }

        // Sort Group 타입 (정렬 버튼 그룹)
        if (action.type === 'sort-group' && action.sortOptions) {
            return (
                <ListItem key={action.key} disablePadding sx={{ display: 'block' }}>
                    <Box
                        sx={{
                            pl: 8,
                            pr: 2,
                            py: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {action.sortOptions.map((sortOption) => 
                            renderSortOption(sortOption, action.onSort!)
                        )}
                    </Box>
                </ListItem>
            );
        }

        return null;
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
                            item.children?.some((child) => isPathActive(location.pathname, child.path)));

                    // 원본 페이지 데이터에서 actions 가져오기
                    const pageData = Object.values(PAGES).find(p => p.title === item.label);
                    const actions = pageData && isFolderNode(pageData) ? pageData.actions : undefined;

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
                                        {/* 액션 버튼 영역 */}
                                        {actions && actions.length > 0 && actions.map((action) => renderActionButton(action))}
                                        
                                        {/* 기존 children 리스트 */}
                                        {item.children?.map((child) => {
                                            const hasGrandChildren = child.children && child.children.length > 0;
                                            const isChildExpanded = expandedFolders.has(child.label);
                                            const isChildActive = child.path
                                                ? isPathActive(location.pathname, child.path)
                                                : hasGrandChildren &&
                                                 child.children?.some((grandChild) => 
                                                     isPathActive(location.pathname, grandChild.path)
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
                                                                    const isGrandChildActive = isPathActive(location.pathname, grandChild.path);
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
