import { Box, Typography, useTheme } from '@mui/material';
import logoImage from '@/assets/images/logo.svg';
import markImage from '@/assets/images/mark.svg';
import { APP_INFO } from '@/config';

export interface BrandProps {
    size?: 'small' | 'medium' | 'large' | 'extraLarge';
    showText?: boolean;
    variant?: 'logo' | 'mark';
    color?: 'default' | 'white';
}

/**
 * Brand 컴포넌트
 * 
 * Figma 연동:
 * - size: theme.brand.logo.* (Figma Variables → Tokens Studio → theme)
 * - variant: logo(전체) / mark(심볼만)
 * - showText: 텍스트 표시 여부
 * - color: default(테마 자동) / white(어두운 배경용)
 */

export const Brand = ({ size = 'medium', showText = true, variant = 'logo', color = 'default' }: BrandProps) => {
    const theme = useTheme();
    const logoHeight = theme.brand.sizes?.logo?.[size] || theme.brand.logo?.[size] || 24;
    const imageSrc = variant === 'mark' ? markImage : logoImage;

    // Typography variant 매핑
    const textVariantMap = {
        small: 'body1',
        medium: 'h6',
        large: 'h5',
        extraLarge: 'h4',
    } as const;

    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Box 
                component="img" 
                src={imageSrc} 
                alt={APP_INFO.name}
                sx={{ height: logoHeight, width: 'auto' }} 
            />
            {showText && (
                <Typography 
                    variant={textVariantMap[size]}
                    color={color === 'white' ? 'common.white' : 'text.primary'}
                    sx={{ lineHeight: 1.1 }}
                >
                    {APP_INFO.name}
                </Typography>
            )}
        </Box>
    );
};

