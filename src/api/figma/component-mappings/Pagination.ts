import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Pagination 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-pagination/
 */
export const PaginationMapping: ComponentMapping = {
    figmaNames: ['<Pagination>'] as const,
    muiName: 'Pagination',
    
    muiProps: {
        // count
        count: {
            type: 'number',
        },
        
        // page
        page: {
            type: 'number',
        },
        
        // onChange
        onChange: {
            type: 'function',
        },
        
        // color
        color: {
            type: 'union',
            values: ['primary', 'secondary', 'standard'] as const,
            default: 'standard',
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // hideNextButton
        hideNextButton: {
            type: 'boolean',
            default: false,
        },
        
        // hidePrevButton
        hidePrevButton: {
            type: 'boolean',
            default: false,
        },
        
        // showFirstButton
        showFirstButton: {
            type: 'boolean',
            default: false,
        },
        
        // showLastButton
        showLastButton: {
            type: 'boolean',
            default: false,
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
            default: 'medium',
        },
        
        // siblingCount
        siblingCount: {
            type: 'number',
            default: 1,
        },
        
        // boundaryCount
        boundaryCount: {
            type: 'number',
            default: 1,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의 (self-closing)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Pagination${props}${sxAttribute} />`;
    },
};

