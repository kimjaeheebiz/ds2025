import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Button,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { Star, StarBorder, Key, Build, SmartToy, MoreVert, Search, Add } from '@mui/icons-material';
import { formatDate } from '../../../utils';
import type { Workflow } from '../ProjectContext';
import { StatusChip } from './StatusChip';
import { useProject } from '../ProjectContext';

export interface AgentContentProps {
    workflowData?: Workflow[];
}

export const AgentContent: React.FC<AgentContentProps> = ({ workflowData }) => {
    const {
        searchKeyword,
        setSearchKeyword,
        selectedFilter,
        setSelectedFilter,
        viewMode,
        setViewMode,
        filteredWorkflows,
        workflows,
        setWorkflows,
        toggleFavorite,
        userName,
    } = useProject();
    const [sortKey, setSortKey] = React.useState<keyof Workflow>('updated_at');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

    const filterStats = React.useMemo(() => {
        const total = workflows.length;
        const mineCount = workflows.filter((workflow) => workflow.user_name === userName).length;
        const favoritesCount = workflows.filter((workflow) => workflow.isFavorite === true).length;
        return { total, mineCount, favoritesCount };
    }, [workflows, userName]);

    const sortedWorkflows = React.useMemo(() => {
        return [...filteredWorkflows].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            if (aValue === undefined || bValue === undefined) return 0;
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }, [filteredWorkflows, sortKey, sortOrder]);

    React.useEffect(() => {
        if (workflows.length === 0) {
            setWorkflows(workflowData as any);
        }
    }, [workflows.length, setWorkflows, workflowData]);

    const handleSort = (key: keyof Workflow) => {
        if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* 필터 */}
                <ToggleButtonGroup
                    exclusive
                    value={viewMode === 'favorites' ? 'favorites' : selectedFilter}
                    aria-label="filter toggle buttons"
                    onChange={(e, newValue) => {
                        if (!newValue) return;
                        if (newValue === 'favorites') {
                            setSelectedFilter('all');
                            setViewMode('favorites');
                        } else {
                            setSelectedFilter(newValue as 'all' | 'mine');
                            setViewMode('all');
                        }
                    }}
                >
                    {[
                        { id: 'all', label: 'All Agent', count: filterStats.total, value: 'all' },
                        { id: 'mine', label: 'My Agent', count: filterStats.mineCount, value: 'mine' },
                        { id: 'favorites', label: 'Favorites', count: filterStats.favoritesCount, value: 'favorites' },
                    ].map((tab) => (
                        <ToggleButton size="small" key={tab.id} value={tab.value} sx={{ gap: 1 }}>
                            {tab.label}
                            <Chip label={tab.count} size="small" />
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {/* 검색, 생성 버튼 */}
                <Stack direction="row" spacing={1}>
                    <TextField
                        placeholder="Search"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        size="small"
                        sx={{ width: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="contained" startIcon={<Add />}>New Workflow</Button>
                </Stack>
            </Box>

            {/* 테이블 */}
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <Table size="small">
                    <colgroup>
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '8%' }} />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Button variant="text" color="inherit" onClick={() => handleSort('name')} sx={{ minWidth: 'auto', p: 0 }}>
                                    NAME
                                    {sortKey === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" color="inherit" onClick={() => handleSort('description')} sx={{ minWidth: 'auto', p: 0 }}>
                                    DESCRIPTION
                                    {sortKey === 'description' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" color="inherit" onClick={() => handleSort('updated_at')} sx={{ minWidth: 'auto', p: 0 }}>
                                    UPDATED
                                    {sortKey === 'updated_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" color="inherit" onClick={() => handleSort('user_name')} sx={{ minWidth: 'auto', p: 0 }}>
                                    OWNER
                                    {sortKey === 'user_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" color="inherit" onClick={() => handleSort('status')} sx={{ minWidth: 'auto', p: 0 }}>
                                    STATUS
                                    {sortKey === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedWorkflows.map((workflow) => (
                            <TableRow key={(workflow as any).seq} hover>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{workflow.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{workflow.id}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{workflow.description}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{formatDate(workflow.updated_at || '')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{workflow.user_name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={workflow.status} />
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title={workflow.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}>
                                            <IconButton size="small" onClick={() => toggleFavorite(workflow.id)}>
                                                {workflow.isFavorite ? <Star fontSize="small" color="primary" /> : <StarBorder fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="API KEY 발급">
                                            <IconButton size="small"><Key fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="챗봇">
                                            <IconButton size="small"><SmartToy fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="빌더">
                                            <IconButton size="small"><Build fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="더보기">
                                            <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};


