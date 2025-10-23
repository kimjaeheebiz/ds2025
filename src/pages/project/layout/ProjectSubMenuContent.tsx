import React from 'react';
import { Box } from '@mui/material';

interface ProjectSubMenuContentProps {
    children: React.ReactNode;
}

export const ProjectSubMenuContent: React.FC<ProjectSubMenuContentProps> = ({ children }) => {
    return <Box>{children}</Box>;
};
