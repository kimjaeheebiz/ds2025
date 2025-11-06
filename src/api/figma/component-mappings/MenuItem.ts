import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI MenuItem 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/menu-item/
 */
export const MenuItemMapping: ComponentMapping = {
    figmaNames: ['<MenuItem>'] as const,
    muiName: 'MenuItem',
    
    muiProps: {
        // value
        value: {
            type: 'union',
            values: ['string', 'number'] as const,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // selected
        selected: {
            type: 'boolean',
            default: false,
        },
        
        // dense
        dense: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<MenuItem${props}${sxAttribute}>
            ${content}
        </MenuItem>`;
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

