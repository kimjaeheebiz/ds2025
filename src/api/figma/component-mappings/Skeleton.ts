import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Skeleton 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-skeleton/
 */
export const SkeletonMapping: ComponentMapping = {
    figmaNames: ['<Skeleton>'] as const,
    muiName: 'Skeleton',
    
    muiProps: {
        // variant
        variant: {
            type: 'union',
            values: ['text', 'circular', 'rectangular', 'rounded'] as const,
            default: 'text',
        },
        
        // width
        width: {
            type: 'union',
            values: ['number', 'string'] as const,
        },
        
        // height
        height: {
            type: 'union',
            values: ['number', 'string'] as const,
        },
        
        // animation
        animation: {
            type: 'union',
            values: ['pulse', 'wave', false] as const,
            default: 'pulse',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의 (self-closing)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Skeleton${props}${sxAttribute} />`;
    },
};

