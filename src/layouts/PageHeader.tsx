import { Box, Typography } from '@mui/material';
import { Breadcrumb } from './Breadcrumb';

export interface PageHeaderProps {
    title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => (
    <Box
        sx={{
            pt: 3,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
        }}
    >
        <Typography component="h1" variant="h5" className="page-title" sx={{ fontWeight: 600, m: 0 }}>
            {title}
        </Typography>
        <Breadcrumb />
    </Box>
);
