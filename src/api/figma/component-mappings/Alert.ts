import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Alert 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-alert/
 */
export const AlertMapping: ComponentMapping = {
    figmaNames: ['<Alert>'] as const,
    muiName: 'Alert',
    
    muiProps: {
        // severity
        severity: {
            type: 'union',
            values: ['error', 'warning', 'info', 'success'] as const,
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['standard', 'filled', 'outlined'] as const,
            default: 'standard',
        },
        
        // color
        color: {
            type: 'union',
            values: ['success', 'info', 'warning', 'error'] as const,
        },
        
        // icon
        icon: {
            type: 'react-node',
        },
        
        // closeText
        closeText: {
            type: 'string',
        },
        
        // onClose
        onClose: {
            type: 'function',
        },
        
        // action
        action: {
            type: 'react-node',
        },
        
        // role
        role: {
            type: 'string',
        },
        
        // square
        square: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        // Alert 내용 텍스트 추출
        const textProp = (node as any).componentProperties?.text?.value;
        if (textProp) return textProp;
        
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Alert${props}${sxAttribute}>
            ${content}
        </Alert>`;
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

