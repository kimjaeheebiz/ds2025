import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI DialogContent 컴포넌트 매핑
 */
export const DialogContentMapping: ComponentMapping = {
    figmaNames: ['<DialogContent>'] as const,
    muiName: 'DialogContent',
    
    muiProps: {
        // dividers
        dividers: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<DialogContent${props}${sxAttribute}>
            ${content}
        </DialogContent>`;
    },
};

