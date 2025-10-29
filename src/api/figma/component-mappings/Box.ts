import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Box 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-box/
 */
export const BoxMapping: ComponentMapping = {
    figmaNames: ['<Box>', 'MainContent', 'MainArea', 'Main', 'Content', 'Submenu', 'ControlArea'] as const,
    muiName: 'Box',
    
    muiProps: {
        // component
        component: {
            type: 'string',
            default: 'div',
        },
        
        // sx는 동적으로 생성됨
    },
    
    // Box는 sx를 사용하여 모든 스타일 적용 (width 제외)
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Box${props}${sxAttribute}>
            ${content}
        </Box>`;
    },
};

