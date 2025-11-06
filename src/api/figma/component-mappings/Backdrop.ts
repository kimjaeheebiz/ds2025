import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Backdrop 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-backdrop/
 */
export const BackdropMapping: ComponentMapping = {
    figmaNames: ['<Backdrop>'] as const,
    muiName: 'Backdrop',
    
    muiProps: {
        // open
        open: {
            type: 'boolean',
            default: false,
        },
        
        // invisible
        invisible: {
            type: 'boolean',
            default: false,
        },
        
        // onClick
        onClick: {
            type: 'function',
        },
        
        // transitionDuration
        transitionDuration: {
            type: 'union',
            values: ['number', 'object'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Backdrop${props}${sxAttribute}>
            ${content}
        </Backdrop>`;
    },
};

