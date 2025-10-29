import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI CardContent 컴포넌트 매핑
 */
export const CardContentMapping: ComponentMapping = {
    figmaNames: ['<CardContent>'] as const,
    muiName: 'CardContent',
    
    muiProps: {    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<CardContent${props}${sxAttribute}>
            ${content}
        </CardContent>`;
    },
};

