import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Rating 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-rating/
 */
export const RatingMapping: ComponentMapping = {
    figmaNames: ['<Rating>'] as const,
    muiName: 'Rating',
    
    muiProps: {
        // value
        value: {
            type: 'number',
        },
        
        // defaultValue
        defaultValue: {
            type: 'number',
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // max
        max: {
            type: 'number',
            default: 5,
        },
        
        // readOnly
        readOnly: {
            type: 'boolean',
            default: false,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // precision
        precision: {
            type: 'number',
            default: 1,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의 (self-closing)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Rating${props}${sxAttribute} />`;
    },
};

