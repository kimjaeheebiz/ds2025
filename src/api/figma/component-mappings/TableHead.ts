import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableHead 컴포넌트 매핑
 */
export const TableHeadMapping: ComponentMapping = {
    figmaNames: ['<TableHead>'] as const,
    muiName: 'TableHead',
    
    muiProps: {},
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TableHead${props}${sxAttribute}>
            ${content}
        </TableHead>`;
    },
};

