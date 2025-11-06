import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI DialogActions 컴포넌트 매핑
 */
export const DialogActionsMapping: ComponentMapping = {
    figmaNames: ['<DialogActions>'] as const,
    muiName: 'DialogActions',
    
    muiProps: {    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<DialogActions${props}${sxAttribute}>
            ${content}
        </DialogActions>`;
    },
};

