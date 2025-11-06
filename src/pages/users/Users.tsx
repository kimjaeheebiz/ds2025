import React from 'react';
import { Box, Typography } from '@mui/material';

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
            <Typography
                variant="body1"
                sx={{
                    color: 'text.primary',
                }}
            >
                메인 콘텐츠 영역입니다.
            </Typography>
        </Box>
    );
};
