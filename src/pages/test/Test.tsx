import React from 'react';
import { Box, Typography } from '@mui/material';

// Import page-specific types
import { TestPageState } from './Test.types';

export const Test: React.FC = () => {
    return (
        <Box
            sx={{
                p: 3,
                minHeight: '100%',
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: 'primary.light',
                }}
            >
                테스트용 노드 &lt;Typography&gt; 인스턴스(904:1013), 하위
                텍스트(I904:1013;6605:52865)
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                }}
            >
                테스트 내용
            </Typography>
        </Box>
    );
};
