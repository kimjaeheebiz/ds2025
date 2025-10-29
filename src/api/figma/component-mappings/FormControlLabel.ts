import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI FormControlLabel 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/form-control-label/
 */
export const FormControlLabelMapping: ComponentMapping = {
    figmaNames: ['<FormControlLabel>'] as const,
    muiName: 'FormControlLabel',
    
    muiProps: {
        // control
        control: {
            type: 'react-node',
        },
        
        // label
        label: {
            type: 'string',
        },
        
        // labelPlacement
        labelPlacement: {
            type: 'union',
            values: ['end', 'start', 'top', 'bottom'] as const,
            default: 'end',
        },
        
        // checked
        checked: {
            type: 'boolean',
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // value
        value: {
            type: 'union',
            values: ['string', 'number', 'boolean'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<FormControlLabel${props}${sxAttribute}>
            ${content}
        </FormControlLabel>`;
    },
};

