import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI ListItemText 컴포넌트 매핑
 */
export const ListItemTextMapping: ComponentMapping = {
    figmaNames: ['<ListItemText>'] as const,
    muiName: 'ListItemText',
    
    muiProps: {
        // inset
        inset: {
            type: 'boolean',
            default: false,
        },
        
        // primary
        primary: {
            type: 'react-node',
        },
        
        // secondary
        secondary: {
            type: 'react-node',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<ListItemText${props}${sxAttribute}>
            ${content}
        </ListItemText>`;
    },
};

