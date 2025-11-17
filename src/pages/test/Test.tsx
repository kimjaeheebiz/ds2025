import React from 'react';
import {
    Box,
    Stack,
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CardActions,
} from '@mui/material';
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
            >
                <Stack direction="row" spacing={2}>
                    <Button variant="contained">primary</Button>
                    <Button variant="contained" color="secondary">
                        secondary
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<ChevronLeft />}
                        endIcon={<ChevronRight />}
                    >
                        success
                    </Button>
                </Stack>
                <Stack direction="row" spacing={3}>
                    <Card
                        elevation={3}
                        variant="elevation"
                        sx={{
                            width: '400px',
                        }}
                    >
                        <CardHeader title="카드 제목입니다." subheader="카드 서브 제목입니다." />
                        <CardContent>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.primary',
                                }}
                            >
                                이건 카드 내용입니다.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button>Action</Button>
                            <Button>Action</Button>
                        </CardActions>
                    </Card>
                    <Card
                        elevation={0}
                        variant="outlined"
                        sx={{
                            flex: 1,
                        }}
                    >
                        <CardHeader title="카드 제목입니다." subheader="카드 서브 제목입니다." />
                        <CardContent>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.primary',
                                }}
                            >
                                카드 내용입니다.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button>Action</Button>
                            <Button>Action</Button>
                        </CardActions>
                    </Card>
                </Stack>
            </Box>
        </Box>
    );
};
