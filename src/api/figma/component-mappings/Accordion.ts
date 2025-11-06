import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Accordion 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-accordion/
 */
export const AccordionMapping: ComponentMapping = {
    figmaNames: ['<Accordion>'] as const,
    muiName: 'Accordion',
    
    muiProps: {
        // expanded
        expanded: {
            type: 'boolean',
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // defaultExpanded
        defaultExpanded: {
            type: 'boolean',
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // square
        square: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Accordion${props}${sxAttribute}>
            ${content}
        </Accordion>`;
    },
};

