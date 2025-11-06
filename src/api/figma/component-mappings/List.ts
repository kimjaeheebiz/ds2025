import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI List 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-list/
 */
export const ListMapping: ComponentMapping = {
    figmaNames: ['<List>'] as const,
    muiName: 'List',
    
    muiProps: {
        // dense
        dense: {
            type: 'boolean',
            default: false,
        },
        
        // disablePadding
        disablePadding: {
            type: 'boolean',
            default: false,
        },
        
        // subheader
        subheader: {
            type: 'react-node',
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<List${props}${sxAttribute}>
            ${content}
        </List>`;
    },
};

