import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableRow 컴포넌트 매핑
 */
export const TableRowMapping: ComponentMapping = {
    figmaNames: ['<TableRow>'] as const,
    muiName: 'TableRow',
    
    // MUI API: https://mui.com/material-ui/api/table-row/
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
        
        // component
        component: {
            type: 'string',
        },
    },
    
    // 하위 컴포넌트 import 목록
    // TableRow 구조: TableRow > TableCell
    subComponents: [
        'TableCell'
    ],
    
    // ✅ JSX 생성 템플릿 정의
    // Table 관련 컴포넌트는 피그마와 개발 코드의 UI 스타일 구성 방식이 달라 sx 속성을 제거
    generateJSX: (componentName, props, content, sx) => {
        return `<TableRow${props}>
            ${content}
        </TableRow>`;
    },
};

