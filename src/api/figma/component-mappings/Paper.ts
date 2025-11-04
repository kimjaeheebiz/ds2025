import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Paper 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-paper/
 */
export const PaperMapping: ComponentMapping = {
    figmaNames: ['<Paper>'] as const,
    muiName: 'Paper',
    
    muiProps: {
        // elevation
        elevation: {
            type: 'union-number',
        },
        
        // raised
        raised: {
            type: 'boolean',
            default: false,
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['elevation', 'outlined'] as const,
        },
        
        // square
        square: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [
        'width',
        'borderColor',
        'borderWidth',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Paper${props}${sxAttribute}>
            ${content}
        </Paper>`;
    },
};

