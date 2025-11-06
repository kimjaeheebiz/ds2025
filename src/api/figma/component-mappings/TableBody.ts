import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableBody 컴포넌트 매핑
 */
export const TableBodyMapping: ComponentMapping = {
    figmaNames: ['<TableBody>'] as const,
    muiName: 'TableBody',
    
    // MUI API: https://mui.com/material-ui/api/table-body/
    // TableBody는 children, classes, component, sx만 지원
    muiProps: {
        // component
        component: {
            type: 'string',
        },
    },
    
    // 하위 컴포넌트 import 목록
    // TableBody 구조: TableBody > TableRow > TableCell
    subComponents: [
        'TableRow', 'TableCell'
    ],
    
    // ✅ JSX 생성 템플릿 정의
    // Table 관련 컴포넌트는 피그마와 개발 코드의 UI 스타일 구성 방식이 달라 sx 속성을 제거
    generateJSX: (componentName, props, content, sx) => {
        return `<TableBody${props}>
            ${content}
        </TableBody>`;
    },
};

