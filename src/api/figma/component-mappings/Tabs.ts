import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Tabs 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-tabs/
 */
export const TabsMapping: ComponentMapping = {
    figmaNames: ['<Tabs>'] as const,
    muiName: 'Tabs',
    
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
        
        // variant
        variant: {
            type: 'union',
            values: ['standard', 'scrollable', 'fullWidth'] as const,
            default: 'standard',
        },
        
        // orientation
        orientation: {
            type: 'union',
            values: ['horizontal', 'vertical'] as const,
            default: 'horizontal',
        },
        
        // scrollButtons
        scrollButtons: {
            type: 'union',
            values: ['auto', false, true] as const,
            default: false,
        },
        
        // ariaLabel
        'aria-label': {
            type: 'string',
        },
        
        // indicatorColor
        indicatorColor: {
            type: 'union',
            values: ['primary', 'secondary'] as const,
            default: 'primary',
        },
        
        // textColor
        textColor: {
            type: 'union',
            values: ['primary', 'secondary', 'inherit'] as const,
            default: 'primary',
        },
    },
    
    excludeFromSx: [
        'borderColor',
        'borderBottom',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Tabs${props}${sxAttribute}>
            ${content}
        </Tabs>`;
    },
};

