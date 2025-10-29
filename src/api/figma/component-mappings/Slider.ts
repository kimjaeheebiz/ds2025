import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Slider 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-slider/
 */
export const SliderMapping: ComponentMapping = {
    figmaNames: ['<Slider>'] as const,
    muiName: 'Slider',
    
    muiProps: {
        // value
        value: {
            type: 'union',
            values: ['number', 'array'] as const,
        },
        
        // defaultValue
        defaultValue: {
            type: 'union',
            values: ['number', 'array'] as const,
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // min
        min: {
            type: 'number',
            default: 0,
        },
        
        // max
        max: {
            type: 'number',
            default: 100,
        },
        
        // step
        step: {
            type: 'number',
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // marks
        marks: {
            type: 'union',
            values: ['boolean', 'array'] as const,
        },
        
        // valueLabelDisplay
        valueLabelDisplay: {
            type: 'union',
            values: ['off', 'on', 'auto'] as const,
        },
        
        // orientation
        orientation: {
            type: 'union',
            values: ['horizontal', 'vertical'] as const,
            default: 'horizontal',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의 (self-closing)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Slider${props}${sxAttribute} />`;
    },
};

