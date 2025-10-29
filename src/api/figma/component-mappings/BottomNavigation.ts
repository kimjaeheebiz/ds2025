import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI BottomNavigation 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-bottom-navigation/
 */
export const BottomNavigationMapping: ComponentMapping = {
    figmaNames: ['<BottomNavigation>'] as const,
    muiName: 'BottomNavigation',
    
    muiProps: {
        // value
        value: {
            type: 'union',
            values: ['string', 'number'] as const,
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // showLabels
        showLabels: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<BottomNavigation${props}${sxAttribute}>
            ${content}
        </BottomNavigation>`;
    },
};

