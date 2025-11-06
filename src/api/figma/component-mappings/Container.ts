import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Container 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-container/
 */
export const ContainerMapping: ComponentMapping = {
    figmaNames: ['<Container>'] as const,
    muiName: 'Container',
    
    muiProps: {
        // maxWidth
        maxWidth: {
            type: 'union',
            values: ['xs', 'sm', 'md', 'lg', 'xl', false] as const,
            default: 'lg',
        },
        
        // fixed
        fixed: {
            type: 'boolean',
            default: false,
        },
        
        // disableGutters
        disableGutters: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Container${props}${sxAttribute}>
            ${content}
        </Container>`;
    },
};

