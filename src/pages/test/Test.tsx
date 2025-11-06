import React from 'react';
import {
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
    Avatar,
    IconButton,
    Button,
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
} from '@mui/material';
import { SettingsOutlined, ChevronRight, Settings } from '@mui/icons-material';

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
                                <TableCell>Title</TableCell>
                                <TableCell>Head</TableCell>
                                <TableCell>Head</TableCell>
                                <TableCell>Head 4</TableCell>
                                <TableCell>Head</TableCell>
                                <TableCell>Head</TableCell>
                                <TableCell>Head</TableCell>
                                <TableCell>Head</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                                <TableCell>Cell</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        variant="rounded"
                        sx={{ width: '32px', height: '32px', backgroundColor: 'info.light' }}
                    >
                        BB
                    </Avatar>
                    <Avatar
                        sx={{ width: '40px', height: '40px', backgroundColor: 'warning.light' }}
                    >
                        <SettingsOutlined />
                    </Avatar>
                    <IconButton size="medium" color="default">
                        <SettingsOutlined />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SettingsOutlined />}
                        endIcon={<ChevronRight />}
                    >
                        버튼명
                    </Button>
                    <Button variant="outlined" size="small">
                        버튼명
                    </Button>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: 'primary.light',
                        }}
                    >
                        Typography
                        <br />
                        줄바꿈 테스트입니다.
                    </Typography>
                </Stack>
                <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'text.disabled',
                        }}
                    >
                        Stack &gt; Typography
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        startIcon={<Settings />}
                        endIcon={<ChevronRight />}
                    >
                        버튼명
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
                                이건 카드 내용이에요.
                                <br />
                                이건 카드 내용이에요.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.disabled',
                                }}
                            >
                                Action area test
                            </Typography>
                            <Button size="large">Action</Button>
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
                                이건 카드 내용이에요.
                                <br />
                                이건 카드 내용이에요.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.disabled',
                                }}
                            >
                                Action area test
                            </Typography>
                            <Button size="large">Action</Button>
                        </CardActions>
                    </Card>
                </Stack>
            </Box>
        </Box>
    );
};
