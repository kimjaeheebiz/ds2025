/**
 * Navigation 상태 관리 훅 (Mantis 스타일)
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MAIN_MENUS, MenuItem, MenuGroup, getMainMenuTitle } from '@/config';
import { SortDirection } from '@/config/navigation';

/**
 * 경로 활성화 체크
 */
export function isPathActive(currentPath: string, targetPath?: string): boolean {
    if (!targetPath) return false;
    return currentPath === targetPath || (targetPath !== '/' && currentPath.startsWith(targetPath));
}

/**
 * 현재 경로에 해당하는 폴더들을 찾아서 열기
 */
function getFoldersToExpand(currentPath: string): Set<string> {
    const folders = new Set<string>();

    const searchMenus = (menus: MenuItem[]) => {
        for (const menu of menus) {
            if (menu.type === 'group') {
                const groupMenu = menu as MenuGroup;

                // 자식 메뉴 확인
                for (const child of groupMenu.children) {
                    // Item 타입이고 현재 경로와 매칭되면 부모 폴더 열기
                    if (child.type === 'item' && isPathActive(currentPath, child.path)) {
                        folders.add(getMainMenuTitle(menu)); // ✅ getMainMenuTitle 사용
                        return;
                    }

                    // Group 타입이면 손자 노드 확인
                    if (child.type === 'group') {
                        const childGroup = child as MenuGroup;
                        const hasMatchingGrandChild = childGroup.children.some((grandChild) => {
                            return grandChild.type === 'item' && isPathActive(currentPath, grandChild.path);
                        });

                        if (hasMatchingGrandChild) {
                            folders.add(getMainMenuTitle(menu)); // ✅ getMainMenuTitle 사용
                            folders.add(getMainMenuTitle(child)); // ✅ getMainMenuTitle 사용
                            return;
                        }
                    }
                }
            }
        }
    };

    searchMenus(MAIN_MENUS);
    return folders;
}

/**
 * Navigation 상태 관리 훅
 */
export function useNavigationState() {
    const location = useLocation();
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [sortStates, setSortStates] = useState<Record<string, { key: string; direction: SortDirection }>>({});

    // 현재 경로에 맞는 폴더 자동 열기
    useEffect(() => {
        const foldersToExpand = getFoldersToExpand(location.pathname);
        setExpandedFolders(foldersToExpand);
    }, [location.pathname]);

    const handleFolderToggle = (folderName: string) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(folderName)) {
                next.delete(folderName);
            } else {
                next.add(folderName);
            }
            return next;
        });
    };

    const handleSortChange = (key: string, direction: SortDirection) => {
        setSortStates((prev) => ({
            ...prev,
            [key]: { key, direction },
        }));
    };

    return {
        expandedFolders,
        sortStates,
        handleFolderToggle,
        handleSortChange,
        currentPath: location.pathname,
    };
}
