import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Fab (Floating Action Button) 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-floating-action-button/
 */
export const FabMapping: ComponentMapping = {
    figmaNames: ['<Fab>'] as const,
    muiName: 'Fab',
    
    muiProps: {
        // color
        color: {
            type: 'union',
            values: ['default', 'inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
            default: 'primary',
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
            default: 'large',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['circular', 'extended'] as const,
            default: 'circular',
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // href
        href: {
            type: 'string',
        },
        
        // disableFocusRipple
        disableFocusRipple: {
            type: 'boolean',
            default: false,
        },
        
        // disableRipple
        disableRipple: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'borderRadius',
        'color',
    ],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Fab${props}${sxAttribute}>
            ${content}
        </Fab>`;
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

