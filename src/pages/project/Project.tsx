import React from 'react';
import { Box } from '@mui/material';

// Import API functions and types
// TODO: API 모듈이 구현되면 주석 해제
// import { fetchProjects, createProject, updateProject } from '@/api/projects';
import { ProjectPageState, ProjectCardProps, ProjectApiResponse } from './Project.types';

export const Project: React.FC = () => {
    return (
        <Box
            sx={{
                p: 3,
                minHeight: '100%',
            }}
        >
            <Box
                sx={{
                    width: '1572px',
                    height: '42px',
                    borderColor: '#000000ff',
                    borderWidth: '1px',
                }}
            ></Box>

            <Box
                sx={{
                    width: '1572px',
                    gap: 3,
                }}
            ></Box>
        </Box>
    );
};
