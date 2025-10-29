import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Drawer 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-drawer/
 */
export const DrawerMapping: ComponentMapping = {
    figmaNames: ['<Drawer>'] as const,
    muiName: 'Drawer',
    
    muiProps: {
        // open
        open: {
            type: 'boolean',
            default: false,
        },
        
        // onClose
        onClose: {
            type: 'function',
        },
        
        // anchor
        anchor: {
            type: 'union',
            values: ['bottom', 'left', 'right', 'top'] as const,
            default: 'left',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['permanent', 'persistent', 'temporary'] as const,
            default: 'temporary',
        },
        
        // ModalProps
        ModalProps: {
            type: 'object',
        },
        
        // PaperProps
        PaperProps: {
            type: 'object',
        },
        
        // SlideProps
        SlideProps: {
            type: 'object',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Drawer${props}${sxAttribute}>
            ${content}
        </Drawer>`;
    },
};

