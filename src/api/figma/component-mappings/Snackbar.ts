import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Snackbar 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-snackbar/
 */
export const SnackbarMapping: ComponentMapping = {
    figmaNames: ['<Snackbar>'] as const,
    muiName: 'Snackbar',
    
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
        
        // anchorOrigin
        anchorOrigin: {
            type: 'object',
        },
        
        // autoHideDuration
        autoHideDuration: {
            type: 'number',
        },
        
        // message
        message: {
            type: 'string',
        },
        
        // TransitionComponent
        TransitionComponent: {
            type: 'function',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Snackbar${props}${sxAttribute}>
            ${content}
        </Snackbar>`;
    },
};

