import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Stepper 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-stepper/
 */
export const StepperMapping: ComponentMapping = {
    figmaNames: ['<Stepper>'] as const,
    muiName: 'Stepper',
    
    muiProps: {
        // activeStep
        activeStep: {
            type: 'number',
            default: 0,
        },
        
        // orientation
        orientation: {
            type: 'union',
            values: ['horizontal', 'vertical'] as const,
            default: 'horizontal',
        },
        
        // alternativeLabel
        alternativeLabel: {
            type: 'boolean',
            default: false,
        },
        
        // nonLinear
        nonLinear: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Stepper${props}${sxAttribute}>
            ${content}
        </Stepper>`;
    },
};

