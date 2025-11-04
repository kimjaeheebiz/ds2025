import { ComponentMapping } from './types/PropertyMapper';
import { ComponentProperties } from '../types';

/**
 * MUI Table 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-table/
 */
export const TableMapping: ComponentMapping = {
    figmaNames: ['<Table>', '<DataGrid>'] as const,
    muiName: 'Table',
    
    muiProps: {
        // size (피그마에서는 small boolean prop으로 설정됨)
        // MUI API: https://mui.com/material-ui/api/table/#table-prop-size
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
        
        // stickyHeader
        // MUI API: https://mui.com/material-ui/api/table/#table-prop-stickyHeader
        stickyHeader: {
            type: 'boolean',
            default: false,
        },
        
        // padding
        // MUI API: https://mui.com/material-ui/api/table/#table-prop-padding
        padding: {
            type: 'union',
            values: ['checkbox', 'none', 'normal'] as const,
            default: 'normal',
    },
    
        // component
        // MUI API: https://mui.com/material-ui/api/table/#table-prop-component
        component: {
            type: 'string',
        },
    },
    
    // 하위 컴포넌트 import 목록
    // Table 구조: Table > TableHead + TableBody + TableFooter
    subComponents: [
        'TableHead', 'TableBody', 'TableFooter'
    ],
    
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
        return `<Table${props}>
            ${content}
        </Table>`;
    },
};

