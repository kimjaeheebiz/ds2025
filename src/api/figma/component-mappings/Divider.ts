import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Divider 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-divider/
 */
export const DividerMapping: ComponentMapping = {
    figmaNames: ['<Divider>'] as const,
    muiName: 'Divider',
    
    muiProps: {
        // orientation
        orientation: {
            type: 'union',
            values: ['horizontal', 'vertical'] as const,
            default: 'horizontal',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['fullWidth', 'inset', 'middle'] as const,
            default: 'fullWidth',
        },
        
        // textAlign
        textAlign: {
            type: 'union',
            values: ['center', 'left', 'right'] as const,
        },
        
        // flexItem
        flexItem: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의 (self-closing)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Divider${props}${sxAttribute} />`;
    },
};

