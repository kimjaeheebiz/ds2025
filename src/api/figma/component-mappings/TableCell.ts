import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableCell 컴포넌트 매핑
 */
export const TableCellMapping: ComponentMapping = {
    figmaNames: ['<TableCell>'] as const,
    muiName: 'TableCell',
    
    muiProps: {
        // align
        align: {
            type: 'union',
            values: ['left', 'right', 'center', 'inherit', 'justify'] as const,
            default: 'inherit',
        },
        
        // padding
        padding: {
            type: 'union',
            values: ['normal', 'checkbox', 'none'] as const,
            default: 'normal',
        },
        
        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
            default: 'medium',
        },
        
        // sortDirection
        sortDirection: {
            type: 'union',
            values: ['asc', 'desc', 'false'] as const,
        },
        
        // scope
        scope: {
            type: 'string',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['head', 'body', 'footer'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TableCell${props}${sxAttribute}>
            ${content}
        </TableCell>`;
    },
};

