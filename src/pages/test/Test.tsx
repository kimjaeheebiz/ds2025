import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Avatar,
    IconButton,
    Button,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    CardMedia,
} from '@mui/material';
import { Settings, ChevronRight, Add } from '@mui/icons-material';

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
                <Typography
                    variant="body2"
                    sx={{
                        color: 'success.light',
                    }}
                >
                    테스트용 노드 &lt;Typography&gt; 인스턴스(904:1013),
                    <br />
                    하위 텍스트(I904:1013;6605:52865)
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: 'primary.main',
                    }}
                >
                    텍스트 테스트 1
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: 'warning.light',
                    }}
                >
                    텍스트 테스트 2
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    <Avatar>OP</Avatar>
                    <Avatar></Avatar>
                    <IconButton size="medium" color="default"></IconButton>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Settings />}
                        endIcon={<ChevronRight />}
                    >
                        버튼명버튼명
                    </Button>
                    <Button variant="outlined" size="small" color="info">
                        버튼명
                        <br />
                        버튼명
                    </Button>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: 'text.disabled',
                        }}
                    >
                        Typography
                        <br />
                        Typography
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
                        Typography
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        startIcon={<Settings />}
                        endIcon={<ChevronRight />}
                    >
                        Label
                    </Button>
                </Stack>
                <Card elevation={0} variant="outlined">
                    <CardHeader
                        avatar={<Avatar aria-label="recipe">R</Avatar>}
                        title="카드 제목입니다."
                        subheader="카드 서브 제목입니다."
                        action={
                            <IconButton aria-label="settings">
                                <Add />
                            </IconButton>
                        }
                    />
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
                        <Button size="large">
                            Action
                            <br />
                            Action
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
};
