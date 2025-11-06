import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI CardMedia 컴포넌트 매핑
 */
export const CardMediaMapping: ComponentMapping = {
    figmaNames: ['<CardMedia>'] as const,
    muiName: 'CardMedia',
    
    muiProps: {
        // image
        image: {
            type: 'string',
        },
        
        // src
        src: {
            type: 'string',
        },
        
        // alt
        alt: {
            type: 'string',
        },
        
        // component
        component: {
            type: 'string',
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<CardMedia${props}${sxAttribute}>
            ${content}
        </CardMedia>`;
    },
};

