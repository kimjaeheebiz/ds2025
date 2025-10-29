import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Toolbar 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/toolbar/
 */
export const ToolbarMapping: ComponentMapping = {
    figmaNames: ['<Toolbar>'] as const,
    muiName: 'Toolbar',
    
    muiProps: {
        // variant
        variant: {
            type: 'union',
            values: ['regular', 'dense'] as const,
            default: 'regular',
        },
        
        // disableGutters
        disableGutters: {
            type: 'boolean',
            default: false,
        },
        
        // sx의 justifyContent, alignItems 등은 sx로 처리
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Toolbar${props}${sxAttribute}>
            ${content}
        </Toolbar>`;
    },
};

