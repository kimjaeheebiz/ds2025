import React from 'react';
import {
    Box,
    Stack,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { Add } from '@mui/icons-material';

// Import page-specific types
import { UsersPageState } from './Users.types';

export const Users: React.FC = () => {
    return (
        <Box
            sx={{
                p: 3,
                minHeight: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Stack
                    direction="row"
                    spacing={10}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button variant="outlined" color="secondary">
                        Outline Button
                    </Button>
                    <Button variant="contained" startIcon={<Add />}>
                        새 계정
                    </Button>
                </Stack>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    variant="outlined"
                    sx={{
                        backgroundColor: 'background.paper-elevation-0',
                    }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>번호</TableCell>
                                <TableCell>이름</TableCell>
                                <TableCell>이메일</TableCell>
                                <TableCell>소속</TableCell>
                                <TableCell>권한</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>최근 로그인</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>2</TableCell>
                                <TableCell>홍길동</TableCell>
                                <TableCell>hecto@hecto.co.kr</TableCell>
                                <TableCell>(주)헥토</TableCell>
                                <TableCell>시스템관리자</TableCell>
                                <TableCell>활성</TableCell>
                                <TableCell>2025.01.01</TableCell>
                                <TableCell>2025.01.02</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>이순신</TableCell>
                                <TableCell>hectodata@hecto.co.kr</TableCell>
                                <TableCell>(주)헥토데이터</TableCell>
                                <TableCell>일반사용자</TableCell>
                                <TableCell>중지</TableCell>
                                <TableCell>2025.01.01</TableCell>
                                <TableCell>2025.01.01</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
