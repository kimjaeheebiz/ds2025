import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI ListItemIcon 컴포넌트 매핑
 */
export const ListItemIconMapping: ComponentMapping = {
    figmaNames: ['<ListItemIcon>'] as const,
    muiName: 'ListItemIcon',
    
    muiProps: {
        // align
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<ListItemIcon${props}${sxAttribute}>
            ${content}
        </ListItemIcon>`;
    },
};

