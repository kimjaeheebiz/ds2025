import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI SpeedDial 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-speed-dial/
 */
export const SpeedDialMapping: ComponentMapping = {
    figmaNames: ['<SpeedDial>'] as const,
    muiName: 'SpeedDial',
    
    muiProps: {
        // open
        open: {
            type: 'boolean',
            default: false,
        },
        
        // onOpen
        onOpen: {
            type: 'function',
        },
        
        // onClose
        onClose: {
            type: 'function',
        },
        
        // direction
        direction: {
            type: 'union',
            values: ['up', 'down', 'left', 'right'] as const,
            default: 'up',
        },
        
        // hidden
        hidden: {
            type: 'boolean',
            default: false,
        },
        
        // ariaLabel
        'aria-label': {
            type: 'string',
        },
        
        // FabProps
        FabProps: {
            type: 'object',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<SpeedDial${props}${sxAttribute}>
            ${content}
        </SpeedDial>`;
    },
};

