import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Breadcrumbs 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-breadcrumbs/
 */
export const BreadcrumbsMapping: ComponentMapping = {
    figmaNames: ['<Breadcrumbs>'] as const,
    muiName: 'Breadcrumbs',
    
    muiProps: {
        // separator
        separator: {
            type: 'react-node',
        },
        
        // maxItems
        maxItems: {
            type: 'number',
        },
        
        // itemsAfterCollapse
        itemsAfterCollapse: {
            type: 'number',
        },
        
        // itemsBeforeCollapse
        itemsBeforeCollapse: {
            type: 'number',
        },
        
        // expandText
        expandText: {
            type: 'string',
        },
        
        // ariaLabel
        'aria-label': {
            type: 'string',
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Breadcrumbs${props}${sxAttribute}>
            ${content}
        </Breadcrumbs>`;
    },
};

