import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI InputLabel 컴포넌트 매핑
 */
export const InputLabelMapping: ComponentMapping = {
    figmaNames: ['<InputLabel>'] as const,
    muiName: 'InputLabel',
    
    muiProps: {
        // htmlFor
        htmlFor: {
            type: 'string',
        },
        
        // id
        id: {
            type: 'string',
        },
        
        // required
        required: {
            type: 'boolean',
            default: false,
        },
        
        // shrink
        shrink: {
            type: 'boolean',
        },
        
        // focused
        focused: {
            type: 'boolean',
        },
    },
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<InputLabel${props}${sxAttribute}>
            ${content}
        </InputLabel>`;
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

