import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI AlertTitle 컴포넌트 매핑
 */
export const AlertTitleMapping: ComponentMapping = {
    figmaNames: ['<AlertTitle>'] as const,
    muiName: 'AlertTitle',
    
    muiProps: {},
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<AlertTitle${props}${sxAttribute}>
            ${content}
        </AlertTitle>`;
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

