import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI CircularProgress 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-progress/
 */
export const CircularProgressMapping: ComponentMapping = {
    figmaNames: ['<CircularProgress>'] as const,
    muiName: 'CircularProgress',
    
    muiProps: {
        // size
        size: {
            type: 'union',
            values: ['number', 'string'] as const,
        },
        
        // thickness
        thickness: {
            type: 'number',
        },
        
        // value
        value: {
            type: 'number',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['determinate', 'indeterminate'] as const,
            default: 'indeterminate',
        },
        
        // color
        color: {
            type: 'union',
            values: ['inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
        },
    },
    
    excludeFromSx: [
        'color',
    ],
    
    // ✅ JSX 생성 템플릿 정의 (self-closing)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<CircularProgress${props}${sxAttribute} />`;
    },
};

