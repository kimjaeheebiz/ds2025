import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI ListItem 컴포넌트 매핑
 */
export const ListItemMapping: ComponentMapping = {
    figmaNames: ['<ListItem>'] as const,
    muiName: 'ListItem',
    
    muiProps: {
        // button
        button: {
            type: 'boolean',
            default: false,
        },
        
        // alignItems
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center'] as const,
            default: 'center',
        },
        
        // dense
        dense: {
            type: 'boolean',
            default: false,
        },
        
        // disableGutters
        disableGutters: {
            type: 'boolean',
            default: false,
        },
        
        // divider
        divider: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<ListItem${props}${sxAttribute}>
            ${content}
        </ListItem>`;
    },
};

