import React from 'react';
import {
    Box,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { StatusChip, FilterToggleGroup } from '@/components';
import { sampleUsers } from '@/data';

export const Users = () => {
    const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'admin' | 'user'>('all');
    const [searchKeyword, setSearchKeyword] = React.useState('');

    // 권한 라벨 매핑
    const permissionLabels = React.useMemo(() => ({
        admin: '시스템관리자',
        user: '일반사용자',
    } as const), []);

    // 필터링된 사용자 목록
    const filteredUsers = React.useMemo(() => {
        let filtered = sampleUsers;

        // 권한별 필터링
        if (selectedFilter !== 'all') {
            filtered = filtered.filter(user => user.permission === selectedFilter);
        }

        // 검색 키워드 필터링
        if (searchKeyword.trim()) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                user.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                (user.department && user.department.toLowerCase().includes(searchKeyword.toLowerCase()))
            );
        }

        return filtered;
    }, [selectedFilter, searchKeyword]);

    // 필터별 카운트 계산
    const filterStats = React.useMemo(() => {
        const total = sampleUsers.length;
        const adminCount = sampleUsers.filter(user => user.permission === 'admin').length;
        const userCount = sampleUsers.filter(user => user.permission === 'user').length;
        return { total, adminCount, userCount };
    }, []);

    // 필터 옵션 정의
    const filterOptions = React.useMemo(() => [
        { value: 'all', label: 'All', count: filterStats.total },
        { value: 'admin', label: permissionLabels.admin, count: filterStats.adminCount },
        { value: 'user', label: permissionLabels.user, count: filterStats.userCount },
    ], [filterStats, permissionLabels]);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* 필터 */}
                <FilterToggleGroup
                    options={filterOptions}
                    value={selectedFilter}
                    onChange={(value) => setSelectedFilter(value as 'all' | 'admin' | 'user')}
                />

                {/* 검색, 등록 버튼 */}
                <Stack direction="row" spacing={1}>
                    <TextField
                        placeholder="이름, 이메일, 소속 검색"
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
                    <Button variant="contained" startIcon={<Add />}>새 계정</Button>
                </Stack>
            </Box>

            {/* 테이블 */}
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <Table size="small">
                    {/* <colgroup>
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '12%' }} />
                        <col />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '12%' }} />
                    </colgroup> */}
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                번호
                            </TableCell>
                            <TableCell>
                                이메일
                            </TableCell>
                            <TableCell>
                                이름
                            </TableCell>
                            <TableCell>
                                소속
                            </TableCell>
                            <TableCell>
                                권한
                            </TableCell>
                            <TableCell>
                                상태
                            </TableCell>
                            <TableCell>
                                가입일
                            </TableCell>
                            <TableCell>
                                최근 로그인
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user, index) => (
                            <TableRow key={user.seq} hover>
                                <TableCell>
                                    <Typography variant="body2">
                                        {filteredUsers.length - index}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {user.id}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {user.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {user.department || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {permissionLabels[user.permission as keyof typeof permissionLabels]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status={user.status === 'active' ? 'active' : 'stop'} />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {user.regdate}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {user.last_login || '-'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
