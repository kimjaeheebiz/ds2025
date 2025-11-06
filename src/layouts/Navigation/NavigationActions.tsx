/**
 * Navigation 액션 버튼 컴포넌트
 */

import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import { ActionButton, SortOption, SortDirection } from '@/config/navigation';

interface NavigationActionsProps {
    actions: ActionButton[];
    sortStates: Record<string, { key: string; direction: SortDirection }>;
    onSortChange: (key: string, direction: SortDirection) => void;
}

/**
 * 정렬 옵션 버튼 렌더링
 */
function SortOptionButton({
    sortOption,
    currentDirection,
    onSort,
}: {
    sortOption: SortOption;
    currentDirection: SortDirection;
    onSort: () => void;
}) {
    return (
        <ListItemButton
            onClick={onSort}
            sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                fontSize: '13px',
                color: 'text.secondary',
                bgcolor: 'action.hover',
                '&:hover': {
                    bgcolor: 'action.focus',
                },
            }}
        >
            <Box component="span">{sortOption.label}</Box>
            {currentDirection === 'asc' && <ArrowUpwardIcon sx={{ fontSize: 'inherit', ml: 0.5 }} />}
            {currentDirection === 'desc' && <ArrowDownwardIcon sx={{ fontSize: 'inherit', ml: 0.5 }} />}
        </ListItemButton>
    );
}

/**
 * 액션 버튼 그룹 컴포넌트
 */
export function NavigationActions({ actions, sortStates, onSortChange }: NavigationActionsProps) {
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
                        {action.sortOptions.map((sortOption) => {
                            const sortState = sortStates[sortOption.key];
                            const currentDirection = sortState?.direction;

                            const handleSort = () => {
                                let newDirection: SortDirection;

                                if (currentDirection === null || currentDirection === undefined) {
                                    newDirection = 'asc';
                                } else if (currentDirection === 'asc') {
                                    newDirection = 'desc';
                                } else {
                                    newDirection = null;
                                }

                                onSortChange(sortOption.key, newDirection);
                                action.onSort?.(sortOption.key, newDirection);
                            };

                            return (
                                <SortOptionButton
                                    key={sortOption.key}
                                    sortOption={sortOption}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                />
                            );
                        })}
                    </Box>
                </ListItem>
            );
        }

        return null;
    };

    return <>{actions.map(renderActionButton)}</>;
}
