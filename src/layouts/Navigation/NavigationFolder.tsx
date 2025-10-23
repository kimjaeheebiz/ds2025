/**
 * Navigation 폴더형 메뉴 컴포넌트 (2-depth, 3-depth)
 */

import { Collapse, List, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { NavigationMenuChild } from '@/config/navigation';
import { isPathActive } from './hooks/useNavigationState';

interface NavigationFolderProps {
    children: NavigationMenuChild[];
    open: boolean;
    isExpanded: boolean;
    currentPath: string;
    expandedFolders: Set<string>;
    onFolderToggle: (label: string) => void;
    onNavigate: (path: string) => void;
}

export function NavigationFolder({
    children,
    open,
    isExpanded,
    currentPath,
    expandedFolders,
    onFolderToggle,
    onNavigate,
}: NavigationFolderProps) {
    return (
        <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="ul" disablePadding dense>
                {children.map((child) => {
                    const hasGrandChildren = child.children && child.children.length > 0;
                    const isChildExpanded = expandedFolders.has(child.label);
                    const isChildActive = child.path
                        ? isPathActive(currentPath, child.path)
                        : hasGrandChildren &&
                          child.children?.some((grandChild) => isPathActive(currentPath, grandChild.path));

                    return (
                        <ListItem key={child.path || child.label} disablePadding sx={{ display: 'block' }}>
                            <Tooltip title={!open ? child.label : ''} placement="right" arrow>
                                <ListItemButton
                                    onClick={() => {
                                        if (hasGrandChildren) {
                                            onFolderToggle(child.label);
                                        } else if (child.path) {
                                            onNavigate(child.path);
                                        }
                                    }}
                                    selected={isChildActive}
                                    sx={{
                                        pl: 9,
                                        pr: 2,
                                    }}
                                >
                                    {open && <ListItemText primary={child.label} />}
                                    {hasGrandChildren && open && (isChildExpanded ? <ExpandLess /> : <ExpandMore />)}
                                </ListItemButton>
                            </Tooltip>

                            {/* 3 depth */}
                            {hasGrandChildren && (
                                <Collapse in={isChildExpanded && open} timeout="auto" unmountOnExit>
                                    <List component="ul" disablePadding dense>
                                        {child.children?.map((grandChild) => {
                                            const isGrandChildActive = isPathActive(currentPath, grandChild.path);
                                            return (
                                                <ListItem
                                                    key={grandChild.path}
                                                    disablePadding
                                                    sx={{ display: 'block' }}
                                                >
                                                    <Tooltip
                                                        title={!open ? grandChild.label : ''}
                                                        placement="right"
                                                        arrow
                                                    >
                                                        <ListItemButton
                                                            onClick={() => onNavigate(grandChild.path)}
                                                            selected={isGrandChildActive}
                                                            sx={{
                                                                pl: 12,
                                                                pr: 2,
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
    );
}
