import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Link 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-link/
 */
export const LinkMapping: ComponentMapping = {
    figmaNames: ['<Link>'] as const,
    muiName: 'Link',
    
    muiProps: {
        // href
        href: {
            type: 'string',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['body1', 'body2', 'button', 'caption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'inherit', 'overline', 'subtitle1', 'subtitle2'] as const,
        },
        
        // underline
        underline: {
            type: 'union',
            values: ['none', 'hover', 'always'] as const,
            default: 'always',
        },
        
        // color
        color: {
            type: 'union',
            values: ['primary', 'secondary'] as const,
        },
        
        // component
        component: {
            type: 'string',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Link${props}${sxAttribute}>
            ${content}
        </Link>`;
    },
};

