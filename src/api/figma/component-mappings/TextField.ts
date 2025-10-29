import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TextField 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-text-field/
 */
export const TextFieldMapping: ComponentMapping = {
    figmaNames: ['<TextField>', '<Input>'] as const,
    muiName: 'TextField',
    
    muiProps: {
        // variant
        variant: {
            type: 'union',
            values: ['outlined', 'filled', 'standard'] as const,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
        },
        
        // placeholder
        placeholder: {
            type: 'string',
        },
        
        // label
        label: {
            type: 'string',
        },
        
        // helperText
        helperText: {
            type: 'string',
        },
        
        // required
        required: {
            type: 'boolean',
            default: false,
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
        
        // multiline
        multiline: {
            type: 'boolean',
            default: false,
        },
        
        // rows
        rows: {
            type: 'union-number',
        },
        
        // autoFocus
        autoFocus: {
            type: 'boolean',
            default: false,
        },
        
        // type
        type: {
            type: 'union',
            values: ['text', 'password', 'number', 'email', 'tel', 'url', 'search'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TextField${props}${sxAttribute}>
            ${content}
        </TextField>`;
    },
};

