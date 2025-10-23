/**
 * Navigation 메인 컴포넌트
 *
 * 좌측 사이드바의 네비게이션 메뉴를 렌더링합니다.
 * 설정은 config/navigation.ts에서 관리됩니다.
 */

import { Box, List, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION_MENU, getIconComponent, getMenuActions } from '@/config';
import { useNavigationState, isPathActive } from './hooks/useNavigationState';
import { NavigationItem } from './NavigationItem';
import { NavigationFolder } from './NavigationFolder';
import { NavigationActions } from './NavigationActions';
import { NavigationProps } from './types';

export const Navigation = ({ open }: NavigationProps) => {
    const navigate = useNavigate();
    const { expandedFolders, sortStates, handleFolderToggle, handleSortChange, currentPath } = useNavigationState();

    // 네비게이션 핸들러
    const handleNavigation = (path: string) => path && navigate(path);

    // 메뉴 아이템 처리 (아이콘을 React Element로 변환)
    const menuItems = NAVIGATION_MENU.filter((item) => item.showInSidebar).map((item) => {
        const IconComponent = getIconComponent(item.icon as string);
        return {
            ...item,
            icon: <IconComponent />,
            isActive: isPathActive(currentPath, item.path),
        };
    });

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <List dense sx={{ p: 0 }}>
                {menuItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedFolders.has(item.label);
                    const isActive =
                        item.isActive ||
                        (hasChildren && item.children?.some((child) => isPathActive(currentPath, child.path)));

                    // 액션 버튼 가져오기
                    const actions = getMenuActions(item.label);

                    return (
                        <Box key={item.path || item.label}>
                            {/* 1-depth 메뉴 아이템 */}
                            <NavigationItem
                                item={item}
                                open={open}
                                isActive={isActive || false}
                                isExpanded={isExpanded}
                                hasChildren={hasChildren || false}
                                onToggle={() => handleFolderToggle(item.label)}
                                onNavigate={handleNavigation}
                            />

                            {/* 2-depth, 3-depth 폴더 메뉴 */}
                            {hasChildren && (
                                <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                                    <List component="ul" disablePadding dense>
                                        {/* 액션 버튼 영역 */}
                                        {actions && actions.length > 0 && (
                                            <NavigationActions
                                                actions={actions}
                                                sortStates={sortStates}
                                                onSortChange={handleSortChange}
                                            />
                                        )}

                                        {/* 하위 메뉴 */}
                                        <NavigationFolder
                                            children={item.children || []}
                                            open={open}
                                            isExpanded={isExpanded}
                                            currentPath={currentPath}
                                            expandedFolders={expandedFolders}
                                            onFolderToggle={handleFolderToggle}
                                            onNavigate={handleNavigation}
                                        />
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
