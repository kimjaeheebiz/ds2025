import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI CardActions 컴포넌트 매핑
 */
export const CardActionsMapping: ComponentMapping = {
    figmaNames: ['<CardActions>'] as const,
    muiName: 'CardActions',
    
    muiProps: {
        // disableSpacing
        disableSpacing: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<CardActions${props}${sxAttribute}>
            ${content}
        </CardActions>`;
    },
};

