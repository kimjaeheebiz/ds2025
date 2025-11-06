import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Menu 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-menu/
 */
export const MenuMapping: ComponentMapping = {
    figmaNames: ['<Menu>'] as const,
    muiName: 'Menu',
    
    muiProps: {
        // open
        open: {
            type: 'boolean',
            default: false,
        },
        
        // anchorEl
        anchorEl: {
            type: 'react-node',
        },
        
        // onClose
        onClose: {
            type: 'function',
        },
        
        // anchorOrigin
        anchorOrigin: {
            type: 'object',
        },
        
        // transformOrigin
        transformOrigin: {
            type: 'object',
        },
        
        // TransitionComponent
        TransitionComponent: {
            type: 'function',
        },
        
        // disableAutoFocusItem
        disableAutoFocusItem: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Menu${props}${sxAttribute}>
            ${content}
        </Menu>`;
    },
};

