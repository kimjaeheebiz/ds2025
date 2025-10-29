import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI ToggleButtonGroup 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-toggle-button/
 */
export const ToggleButtonGroupMapping: ComponentMapping = {
    figmaNames: ['<ToggleButtonGroup>'] as const,
    muiName: 'ToggleButtonGroup',
    
    muiProps: {
        // value
        value: {
            type: 'union',
            values: ['string', 'number', 'array'] as const,
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // exclusive
        exclusive: {
            type: 'boolean',
            default: false,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
        },
        
        // color
        color: {
            type: 'union',
            values: ['standard', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // fullWidth
        fullWidth: {
            type: 'boolean',
            default: false,
        },
        
        // orientation
        orientation: {
            type: 'union',
            values: ['horizontal', 'vertical'] as const,
            default: 'horizontal',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<ToggleButtonGroup${props}${sxAttribute}>
            ${content}
        </ToggleButtonGroup>`;
    },
};

