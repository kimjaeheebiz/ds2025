import React from 'react';
import { Box, Stack, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            ></Box>

            <Stack direction="row">
                <Button variant="contained" size="large">
                    Label
                </Button>
                <Button variant="contained" size="large" color="secondary">
                    Label
                </Button>
                <Button variant="contained" size="large">
                    Label
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ChevronLeft />}
                    endIcon={<ChevronRight />}
                >
                    test
                </Button>
            </Stack>
        </Box>
    );
};
