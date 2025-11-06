import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI FormControl 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/form-control/
 */
export const FormControlMapping: ComponentMapping = {
    figmaNames: ['<FormControl>'] as const,
    muiName: 'FormControl',
    
    muiProps: {
        // variant
        variant: {
            type: 'union',
            values: ['standard', 'outlined', 'filled'] as const,
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
        
        // required
        required: {
            type: 'boolean',
            default: false,
        },
        
        // error
        error: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<FormControl${props}${sxAttribute}>
            ${content}
        </FormControl>`;
    },
};

