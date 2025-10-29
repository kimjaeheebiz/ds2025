import React from 'react';
import { Box, Card, CardContent, CardActions, CardHeader, CardMedia } from '@mui/material';

// Import API functions and types
// TODO: API 모듈이 구현되면 주석 해제
// import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/users';
import { UsersPageState, UsersTableProps, UsersApiResponse } from './Users.types';

export const Users: React.FC = () => {
    return (
        <Box
            sx={{
                p: 3,
                minHeight: '100%',
            }}
        >
            Users Page
        </Box>
    );
};
