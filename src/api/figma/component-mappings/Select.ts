import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Select 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-select/
 */
export const SelectMapping: ComponentMapping = {
    figmaNames: ['<Select>'] as const,
    muiName: 'Select',
    
    muiProps: {
        // value
        value: {
            type: 'union',
            values: ['string', 'number'] as const,
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // native
        native: {
            type: 'boolean',
            default: false,
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['standard', 'outlined', 'filled'] as const,
            default: 'outlined',
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
        },
        
        // fullWidth
        fullWidth: {
            type: 'boolean',
            default: false,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // displayEmpty
        displayEmpty: {
            type: 'boolean',
            default: false,
        },
        
        // multiple
        multiple: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Select${props}${sxAttribute}>
            ${content}
        </Select>`;
    },
};

