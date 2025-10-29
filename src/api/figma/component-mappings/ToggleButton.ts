import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI ToggleButton 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/toggle-button/
 */
export const ToggleButtonMapping: ComponentMapping = {
    figmaNames: ['<ToggleButton>'] as const,
    muiName: 'ToggleButton',
    
    muiProps: {
        // value
        value: {
            type: 'union',
            values: ['string', 'number'] as const,
        },
        
        // selected
        selected: {
            type: 'boolean',
            default: false,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
        },
        
        // color
        color: {
            type: 'union',
            values: ['standard', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
            default: 'standard',
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // fullWidth
        fullWidth: {
            type: 'boolean',
            default: false,
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // exclusive
        exclusive: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'borderRadius',
    ],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<ToggleButton${props}${sxAttribute}>
            ${content}
        </ToggleButton>`;
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

