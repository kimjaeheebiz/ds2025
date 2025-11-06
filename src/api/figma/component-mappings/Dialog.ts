import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Dialog 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-dialog/
 */
export const DialogMapping: ComponentMapping = {
    figmaNames: ['<Dialog>'] as const,
    muiName: 'Dialog',
    
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
        
        // fullScreen
        fullScreen: {
            type: 'boolean',
            default: false,
        },
        
        // fullWidth
        fullWidth: {
            type: 'boolean',
            default: false,
        },
        
        // maxWidth
        maxWidth: {
            type: 'union',
            values: ['xs', 'sm', 'md', 'lg', 'xl', false] as const,
            default: 'sm',
        },
        
        // scroll
        scroll: {
            type: 'union',
            values: ['body', 'paper'] as const,
        },
        
        // TransitionComponent
        TransitionComponent: {
            type: 'function',
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Dialog${props}${sxAttribute}>
            ${content}
        </Dialog>`;
    },
};

