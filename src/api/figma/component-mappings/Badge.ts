import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Badge 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-badge/
 */
export const BadgeMapping: ComponentMapping = {
    figmaNames: ['<Badge>'] as const,
    muiName: 'Badge',
    
    muiProps: {
        // badgeContent
        badgeContent: {
            type: 'union',
            values: ['string', 'number'] as const,
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
            default: 'primary',
        },
        
        // max
        max: {
            type: 'number',
            default: 99,
        },
        
        // overlap
        overlap: {
            type: 'union',
            values: ['rectangular', 'circular'] as const,
            default: 'rectangular',
        },
        
        // showZero
        showZero: {
            type: 'boolean',
            default: false,
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['standard', 'dot'] as const,
            default: 'standard',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Badge${props}${sxAttribute}>
            ${content}
        </Badge>`;
    },
};

