import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Tab 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/tab/
 */
export const TabMapping: ComponentMapping = {
    figmaNames: ['<Tab>'] as const,
    muiName: 'Tab',
    
    muiProps: {
        // label
        label: {
            type: 'string',
        },
        
        // icon
        icon: {
            type: 'react-node',
        },
        
        // iconPosition
        iconPosition: {
            type: 'union',
            values: ['top', 'start', 'end', 'bottom'] as const,
            default: 'top',
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // wrapped
        wrapped: {
            type: 'boolean',
            default: false,
        },
        
        // value
        value: {
            type: 'union',
            values: ['string', 'number'] as const,
        },
    },
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        const labelProp = (node as any).componentProperties?.label?.value;
        if (labelProp) return labelProp;
        
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Tab${props}${sxAttribute} label="${content}" />`;
    },
};

function findTextRecursively(children: any[]): string | null {
    for (const child of children) {
        if (child.characters) {
            return child.characters;
        }
        if (child.children && child.children.length > 0) {
            const text = findTextRecursively(child.children);
            if (text) return text;
        }
    }
    return null;
}

