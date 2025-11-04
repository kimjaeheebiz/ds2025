import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableFooter 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/table-footer/
 * 
 * TableFooter는 TableBody와 동일한 구조로 TableRow, TableCell을 포함합니다.
 */
export const TableFooterMapping: ComponentMapping = {
    figmaNames: ['<TableFooter>'] as const,
    muiName: 'TableFooter',
    
    // MUI API: https://mui.com/material-ui/api/table-footer/
    // TableFooter는 children, classes, component, sx만 지원
    muiProps: {
        // component
        component: {
            type: 'string',
        },
    },
    
    // 하위 컴포넌트 import 목록
    // TableFooter 구조: TableFooter > TableRow > TableCell
    subComponents: [
        'TableRow', 'TableCell'
    ],
    
    // ✅ JSX 생성 템플릿 정의
    // Table 관련 컴포넌트는 피그마와 개발 코드의 UI 스타일 구성 방식이 달라 sx 속성을 제거
    generateJSX: (componentName, props, content, sx) => {
        return `<TableFooter${props}>
            ${content}
        </TableFooter>`;
    },
};

