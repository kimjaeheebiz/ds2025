import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI FormLabel 컴포넌트 매핑
 */
export const FormLabelMapping: ComponentMapping = {
    figmaNames: ['<FormLabel>'] as const,
    muiName: 'FormLabel',
    
    muiProps: {
        // component
        component: {
            type: 'string',
        },
        
        // focused
        focused: {
            type: 'boolean',
        },
        
        // required
        required: {
            type: 'boolean',
            default: false,
        },
        
        // filled
        filled: {
            type: 'boolean',
        },
        
        // error
        error: {
            type: 'boolean',
            default: false,
        },
        
        // disabled
        disabled: {
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
        return `<FormLabel${props}${sxAttribute}>
            ${content}
        </FormLabel>`;
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

