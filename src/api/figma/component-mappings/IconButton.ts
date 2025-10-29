import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI IconButton 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-icon-button/
 */
export const IconButtonMapping: ComponentMapping = {
    figmaNames: ['<IconButton>'] as const,
    muiName: 'IconButton',
    
    muiProps: {
        // size
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'] as const,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // edge
        edge: {
            type: 'union',
            values: ['start', 'end', 'false'] as const,
        },
        
        // disableFocusRipple
        disableFocusRipple: {
            type: 'boolean',
            default: false,
        },
        
        // disableRipple
        disableRipple: {
            type: 'boolean',
            default: false,
        },
        
        // ariaLabel
        'aria-label': {
            type: 'string',
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'borderRadius',
        'color',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<IconButton${props}${sxAttribute}>
            ${content}
        </IconButton>`;
    },
};

