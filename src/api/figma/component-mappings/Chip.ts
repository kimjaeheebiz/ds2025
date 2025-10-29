import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Chip 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-chip/
 */
export const ChipMapping: ComponentMapping = {
    figmaNames: ['<Chip>', '<Badge>'] as const,
    muiName: 'Chip',
    
    muiProps: {
        // label
        label: {
            type: 'string',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['filled', 'outlined'] as const,
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // clickable
        clickable: {
            type: 'boolean',
            default: false,
        },
        
        // deletable
        onDelete: {
            type: 'react-node',
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
        return content 
            ? `<Chip${props}${sxAttribute} label="${content}" />`
            : `<Chip${props}${sxAttribute} />`;
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

