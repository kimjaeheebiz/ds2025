import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI AppBar 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-app-bar/
 */
export const AppBarMapping: ComponentMapping = {
    figmaNames: ['<AppBar>', '<Header>'] as const,
    muiName: 'AppBar',
    
    muiProps: {
        // position
        position: {
            type: 'union',
            values: ['fixed', 'absolute', 'sticky', 'static', 'relative'] as const,
            default: 'fixed',
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'inherit', 'primary', 'secondary', 'transparent'] as const,
            default: 'primary',
        },
        
        // elevation
        elevation: {
            type: 'union-number',
        },
        
        // enableColorOnDark
        enableColorOnDark: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'color',
        'elevation',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<AppBar${props}${sxAttribute}>
            ${content}
        </AppBar>`;
    },
};

