import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableRow 컴포넌트 매핑
 */
export const TableRowMapping: ComponentMapping = {
    figmaNames: ['<TableRow>'] as const,
    muiName: 'TableRow',
    
    muiProps: {
        // hover
        hover: {
            type: 'boolean',
            default: false,
        },
        
        // selected
        selected: {
            type: 'boolean',
            default: false,
        },
        
        // sx의 hover 효과는 sx로 처리
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TableRow${props}${sxAttribute}>
            ${content}
        </TableRow>`;
    },
};

