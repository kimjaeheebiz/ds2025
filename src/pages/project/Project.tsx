import React, { useMemo, useState, useEffect } from 'react';
import {
    Box,
    Stack,
    Typography,
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
    Tabs,
    Tab,
    Chip,
} from '@mui/material';
import { Star, StarBorder, Build, PlayArrow, MoreVert, Search, Add } from '@mui/icons-material';
import { formatDate } from '../../utils';
import { ProjectProvider, useProject } from './ProjectContext';
import { sampleWorkflows } from './ProjectData';

// 샘플 데이터
const workflowData = sampleWorkflows;

const ProjectContent = () => {
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

    const [sortKey, setSortKey] = useState<keyof (typeof workflowData)[0]>('updated_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filterStats = useMemo(() => {
        const total = workflows.length;
        const mineCount = workflows.filter((workflow) => workflow.user_name === userName).length;
        const favoritesCount = workflows.filter((workflow) => workflow.isFavorite === true).length;

        return { total, mineCount, favoritesCount };
    }, [workflows, userName]);

    // 정렬된 워크플로우 계산
    const sortedWorkflows = useMemo(() => {
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

    const tabData = useMemo(
        () => [
            { id: 'all', label: 'All', count: filterStats.total, value: 'all' },
            { id: 'mine', label: 'My', count: filterStats.mineCount, value: 'mine' },
            { id: 'favorites', label: 'Favorites', count: filterStats.favoritesCount, value: 'favorites' },
        ],
        [filterStats],
    );

    useEffect(() => {
        if (workflows.length === 0) {
            setWorkflows(workflowData as any);
        }
    }, [workflows.length, setWorkflows]);

    const handleSort = (key: keyof (typeof workflowData)[0]) => {
        if (sortKey === key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const getStatusDisplay = (status: string) => (status === 'Active' ? '활성' : status === 'Idle' ? '비활성' : status);
    const getStatusColor = (status: string) => (status === 'Active' ? 'success' : 'default');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tabs
                    value={viewMode === 'favorites' ? 'favorites' : selectedFilter}
                    onChange={(_, newValue) => {
                        if (newValue === 'favorites') {
                            setSelectedFilter('all');
                            setViewMode('favorites');
                        } else {
                            setSelectedFilter(newValue as 'all' | 'mine');
                            setViewMode('all');
                        }
                    }}
                >
                    {tabData.map((tab) => (
                        <Tab
                            key={tab.id}
                            value={tab.value}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {tab.label}
                                    <Chip label={tab.count} size="small" />
                                </Box>
                            }
                        />
                    ))}
                </Tabs>

                <Stack direction="row" spacing={1}>
                    <TextField
                        placeholder="검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        size="small"
                        sx={{ minWidth: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="contained" startIcon={<Add />}>워크플로우 생성</Button>
                </Stack>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <colgroup>
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '8%' }} />
                        <col />
                        <col style={{ width: '8%' }} />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Button variant="text" onClick={() => handleSort('name')} sx={{ minWidth: 'auto', p: 0 }}>
                                    워크플로우명{sortKey === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" onClick={() => handleSort('description')} sx={{ minWidth: 'auto', p: 0 }}>
                                    설명{sortKey === 'description' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" onClick={() => handleSort('status')} sx={{ minWidth: 'auto', p: 0 }}>
                                    상태{sortKey === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" onClick={() => handleSort('updated_at')} sx={{ minWidth: 'auto', p: 0 }}>
                                    수정일{sortKey === 'updated_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="text" onClick={() => handleSort('user_name')} sx={{ minWidth: 'auto', p: 0 }}>
                                    생성자{sortKey === 'user_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>작업</TableCell>
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
                                    <Chip label={getStatusDisplay(workflow.status || '')} color={getStatusColor(workflow.status || '') as any} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{formatDate(workflow.updated_at || '')}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{workflow.user_name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <Tooltip title={workflow.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}>
                                            <IconButton size="small" onClick={() => toggleFavorite(workflow.id)}>
                                                {workflow.isFavorite ? <Star fontSize="small" color="primary" /> : <StarBorder fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="실행">
                                            <IconButton size="small"><PlayArrow fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="편집">
                                            <IconButton size="small"><Build fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="더보기">
                                            <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export const Project = () => (
    <ProjectProvider>
        <ProjectContent />
    </ProjectProvider>
);


