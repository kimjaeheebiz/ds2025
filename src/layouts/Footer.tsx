import { Box, Typography } from '@mui/material';
import { APP_INFO } from '@/config';

export const Footer = () => (
    <Box component="footer" sx={{ py: 2, px: 3 }}>
        <Typography variant="body2" color="text.disabled" align="center">
            {APP_INFO.copyright}
        </Typography>
    </Box>
);
