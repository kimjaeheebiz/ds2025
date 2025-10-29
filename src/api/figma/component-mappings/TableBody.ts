import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableBody 컴포넌트 매핑
 */
export const TableBodyMapping: ComponentMapping = {
    figmaNames: ['<TableBody>'] as const,
    muiName: 'TableBody',
    
    muiProps: {},
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TableBody${props}${sxAttribute}>
            ${content}
        </TableBody>`;
    },
};

