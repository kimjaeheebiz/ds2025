import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI LinearProgress 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-progress/
 */
export const LinearProgressMapping: ComponentMapping = {
    figmaNames: ['<LinearProgress>'] as const,
    muiName: 'LinearProgress',
    
    muiProps: {
        // variant
        variant: {
            type: 'union',
            values: ['determinate', 'indeterminate', 'query', 'buffer'] as const,
            default: 'indeterminate',
        },
        
        // value
        value: {
            type: 'number',
        },
        
        // valueBuffer
        valueBuffer: {
            type: 'number',
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
        return `<LinearProgress${props}${sxAttribute} />`;
    },
};

