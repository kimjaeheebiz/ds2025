import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Autocomplete 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-autocomplete/
 */
export const AutocompleteMapping: ComponentMapping = {
    figmaNames: ['<Autocomplete>'] as const,
    muiName: 'Autocomplete',
    
    muiProps: {
        // options
        options: {
            type: 'array',
        },
        
        // value
        value: {
            type: 'union',
            values: ['string', 'object'] as const,
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // getOptionLabel
        getOptionLabel: {
            type: 'function',
        },
        
        // isOptionEqualToValue
        isOptionEqualToValue: {
            type: 'function',
        },
        
        // renderInput
        renderInput: {
            type: 'function',
        },
        
        // multiple
        multiple: {
            type: 'boolean',
            default: false,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // freeSolo
        freeSolo: {
            type: 'boolean',
            default: false,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Autocomplete${props}${sxAttribute}>
            ${content}
        </Autocomplete>`;
    },
};

