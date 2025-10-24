import { Box, Typography } from '@mui/material';
import logoImage from '@/assets/images/logo.svg';
import markImage from '@/assets/images/mark.svg';
import { APP_INFO } from '@/config';

export interface BrandProps {
    size?: 'small' | 'medium' | 'large';
    showText?: boolean;
    variant?: 'logo' | 'mark';
}

export const Brand = ({ size = 'medium', showText = true, variant = 'logo' }: BrandProps) => {
    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return { logoHeight: 20, fontSize: '1rem' };
            case 'large':
                return { logoHeight: 28, fontSize: '1.5rem' };
            default:
                return { logoHeight: 24, fontSize: '1.25rem' };
        }
    };

    const { logoHeight, fontSize } = getSizeConfig();
    const imageSrc = variant === 'mark' ? markImage : logoImage;

    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src={imageSrc} alt="Hecto" sx={{ height: logoHeight, width: 'auto' }} />
            {showText && (
                <Typography variant="h6" sx={{ fontSize, lineHeight: 1.1 }}>
                    {APP_INFO.name}
                </Typography>
            )}
        </Box>
    );
};
