import { ComponentMapping } from './types/PropertyMapper';
import { ComponentProperties } from '../types';

/**
 * MUI TableCell 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-table/
 * 
 * 변환 규칙:
 * - 피그마 <TableHead> 인스턴스는 TableHeadRow 내부에서만 TableCell로 변환됨 (extractor에서 처리)
 */
export const TableCellMapping: ComponentMapping = {
    figmaNames: ['<TableCell>'] as const,
    muiName: 'TableCell',
    
    // MUI API: https://mui.com/material-ui/api/table-cell/
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
        
        // size (피그마에서는 small boolean prop으로 설정될 수 있음)
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
            default: 'medium',
        },
        
        // small (피그마 boolean prop, size="small"로 변환됨)
        small: {
            type: 'boolean',
            default: false,
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
        
        // component
        component: {
            type: 'string',
        },
    },
    
    // ✅ Props 변환: 피그마의 small boolean prop을 size="small"로 변환
    transformProps: (properties: ComponentProperties) => {
        const transformed = { ...properties };
        
        // small={true}를 size="small"로 변환
        if (transformed['small'] === true) {
            transformed['size'] = 'small';
            delete transformed['small'];
        }
        
        return transformed;
    },
    
    // ✅ JSX 생성 템플릿 정의
    // Table 관련 컴포넌트는 피그마와 개발 코드의 UI 스타일 구성 방식이 달라 sx 속성을 제거
    generateJSX: (componentName, props, content, sx) => {
        return `<TableCell${props}>
            ${content}
        </TableCell>`;
    },
};

