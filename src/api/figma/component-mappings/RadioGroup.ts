import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI RadioGroup 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/radio-group/
 */
export const RadioGroupMapping: ComponentMapping = {
    figmaNames: ['<RadioGroup>'] as const,
    muiName: 'RadioGroup',
    
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
        
        // name
        name: {
            type: 'string',
        },
        
        // row
        row: {
            type: 'boolean',
            default: false,
        },
        
        // defaultValue
        defaultValue: {
            type: 'union',
            values: ['string', 'number'] as const,
        },
        
        // ariaLabel
        'aria-label': {
            type: 'string',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<RadioGroup${props}${sxAttribute}>
            ${content}
        </RadioGroup>`;
    },
};

