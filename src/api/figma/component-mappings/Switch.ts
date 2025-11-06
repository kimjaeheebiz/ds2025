import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Switch 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-switch/
 */
export const SwitchMapping: ComponentMapping = {
    figmaNames: ['<Switch>'] as const,
    muiName: 'Switch',
    
    muiProps: {
        // checked
        checked: {
            type: 'boolean',
            default: false,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
            default: 'medium',
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
            default: 'primary',
        },
        
        // edge
        edge: {
            type: 'union',
            values: ['start', 'end', false] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의 (self-closing)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Switch${props}${sxAttribute} />`;
    },
};

