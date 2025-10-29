import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Table 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-table/
 */
export const TableMapping: ComponentMapping = {
    figmaNames: ['<Table>', '<DataGrid>'] as const,
    muiName: 'Table',
    
    muiProps: {
        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
        },
        
        // stickyHeader
        stickyHeader: {
            type: 'boolean',
            default: false,
        },
        
        // padding
        padding: {
            type: 'union',
            values: ['default', 'checkbox', 'none'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // 하위 컴포넌트 import 목록
    subComponents: [
        'TableHead', 'TableBody', 'TableRow', 'TableCell', 'TableContainer', 'Paper'
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Table${props}${sxAttribute}>
            ${content}
        </Table>`;
    },
};

