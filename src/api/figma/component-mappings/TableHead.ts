import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableHead 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-table/
 * 
 * 변환 규칙:
 * - 피그마 <TableHeadRow> 인스턴스 → TableHead + TableRow로 변환
 */
export const TableHeadMapping: ComponentMapping = {
    figmaNames: ['<TableHead>', '<TableHeadRow>'] as const,
    muiName: 'TableHead',
    
    // MUI API: https://mui.com/material-ui/api/table-head/
    // TableHead는 children, classes, component, sx만 지원
    muiProps: {
        // component
        component: {
            type: 'string',
        },
    },
    
    // 하위 컴포넌트 import 목록
    // TableHead 구조: TableHead > TableRow > TableCell
    subComponents: [
        'TableRow', 'TableCell'
    ],
    
    // ✅ JSX 생성 템플릿 정의
    // Table 관련 컴포넌트는 피그마와 개발 코드의 UI 스타일 구성 방식이 달라 sx 속성을 제거
    generateJSX: (componentName, props, content, sx) => {
        return `<TableHead${props}>
            ${content}
        </TableHead>`;
    },
};

