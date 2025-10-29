import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Avatar 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-avatar/
 */
export const AvatarMapping: ComponentMapping = {
    figmaNames: ['<Avatar>'] as const,
    muiName: 'Avatar',
    
    muiProps: {
        // src
        src: {
            type: 'string',
        },
        
        // alt
        alt: {
            type: 'string',
        },
        
        // sizes
        sizes: {
            type: 'string',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['circular', 'rounded', 'square'] as const,
            default: 'circular',
        },
        
        // color
        color: {
            type: 'union',
            values: ['default'] as const,
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'borderRadius',
        'width',
        'height',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Avatar${props}${sxAttribute}>
            ${content}
        </Avatar>`;
    },
};

