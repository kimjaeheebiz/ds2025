import React, { useState, useMemo, useEffect } from 'react';
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
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';

// 샘플 데이터
const workflowData = [
    {
        workspace_seq: 6,
        name: '사내 복지 검색 에이전트',
        id: '9883cac00b48462cb9f997f64d1d6726',
        description: '사내 복지 제도 검색을 위한 AI 에이전트',
        user_name: '김민정',
        status: 'Active',
        isFavorite: true,
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-20T14:22:00Z',
    },
    {
        workspace_seq: 5,
        name: '고객 문의 자동 응답 시스템',
        id: 'a1b2c3d4e5f6789012345678901234567',
        description: '고객 문의에 대한 자동 응답을 제공하는 워크플로우',
        user_name: '신효정',
        status: 'Idle',
        isFavorite: false,
        created_at: '2024-01-10T11:15:00Z',
        updated_at: '2024-01-18T16:45:00Z',
    },
    {
        workspace_seq: 4,
        name: '데이터 분석 자동화',
        id: 'f9e8d7c6b5a4321098765432109876543',
        description: '일일 데이터 분석 및 리포트 생성 자동화',
        user_name: '김재희',
        status: 'Active',
        isFavorite: true,
        created_at: '2024-01-05T08:20:00Z',
        updated_at: '2024-01-19T10:30:00Z',
    },
    {
        workspace_seq: 3,
        name: '문서 번역 워크플로우',
        id: '1234567890abcdef1234567890abcdef12',
        description: '다국어 문서 자동 번역 시스템',
        user_name: '신효정',
        status: 'Active',
        isFavorite: false,
        created_at: '2024-01-01T14:00:00Z',
        updated_at: '2024-01-17T09:15:00Z',
    },
    {
        workspace_seq: 2,
        name: '알림 시스템 관리',
        id: 'abcdef1234567890abcdef1234567890ab',
        description: '시스템 알림 및 모니터링 자동화',
        user_name: '김민정',
        status: 'Idle',
        isFavorite: false,
        created_at: '2023-12-28T16:30:00Z',
        updated_at: '2024-01-15T12:00:00Z',
    },
    {
        workspace_seq: 1,
        name: '보고서 생성 자동화',
        id: '9876543210fedcba9876543210fedcba98',
        description: '주간/월간 보고서 자동 생성 및 배포',
        user_name: '김민정',
        status: 'Active',
        isFavorite: true,
        created_at: '2023-12-20T10:45:00Z',
        updated_at: '2024-01-16T15:20:00Z',
    },
];

const WorkspaceContent = () => {
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
    } = useWorkspace();

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
            {
                id: 'all',
                label: 'All',
                count: filterStats.total,
                value: 'all',
            },
            {
                id: 'mine',
                label: 'My',
                count: filterStats.mineCount,
                value: 'mine',
            },
            {
                id: 'favorites',
                label: 'Favorites',
                count: filterStats.favoritesCount,
                value: 'favorites',
            },
        ],
        [filterStats],
    );

    useEffect(() => {
        if (workflows.length === 0) {
            setWorkflows(workflowData as any);
        }
    }, [workflows.length, setWorkflows]);

    const handleSort = (key: keyof (typeof workflowData)[0]) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'Active':
                return '활성';
            case 'Idle':
                return '비활성';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Idle':
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 테이블 상단 컨트롤 영역 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* 필터 */}
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
                    aria-label="workflow filter tabs"
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

                {/* 우측 영역 */}
                <Stack direction="row" spacing={1}>
                    {/* 검색 */}
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
                    {/* 버튼 */}
                    <Button variant="contained" startIcon={<Add />}>
                        워크플로우 생성
                    </Button>
                </Stack>
            </Box>

            {/* 테이블 */}
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
                                <Button
                                    variant="text"
                                    onClick={() => handleSort('name')}
                                    sx={{ minWidth: 'auto', p: 0 }}
                                >
                                    워크플로우명
                                    {sortKey === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="text"
                                    onClick={() => handleSort('description')}
                                    sx={{ minWidth: 'auto', p: 0 }}
                                >
                                    설명
                                    {sortKey === 'description' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="text"
                                    onClick={() => handleSort('status')}
                                    sx={{ minWidth: 'auto', p: 0 }}
                                >
                                    상태
                                    {sortKey === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="text"
                                    onClick={() => handleSort('updated_at')}
                                    sx={{ minWidth: 'auto', p: 0 }}
                                >
                                    수정일
                                    {sortKey === 'updated_at' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="text"
                                    onClick={() => handleSort('user_name')}
                                    sx={{ minWidth: 'auto', p: 0 }}
                                >
                                    생성자
                                    {sortKey === 'user_name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                </Button>
                            </TableCell>
                            <TableCell>작업</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedWorkflows.map((workflow) => (
                            <TableRow key={workflow.workspace_seq} hover>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {workflow.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {workflow.id}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {workflow.description}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusDisplay(workflow.status || '')}
                                        color={getStatusColor(workflow.status || '') as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(workflow.updated_at || '')}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{workflow.user_name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <Tooltip title={workflow.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}>
                                            <IconButton size="small" onClick={() => toggleFavorite(workflow.id)}>
                                                {workflow.isFavorite ? (
                                                    <Star fontSize="small" color="primary" />
                                                ) : (
                                                    <StarBorder fontSize="small" />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="실행">
                                            <IconButton size="small">
                                                <PlayArrow fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="편집">
                                            <IconButton size="small">
                                                <Build fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="더보기">
                                            <IconButton size="small">
                                                <MoreVert fontSize="small" />
                                            </IconButton>
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

export const Workspace = () => {
    return (
        <WorkspaceProvider>
            <WorkspaceContent />
        </WorkspaceProvider>
    );
};
