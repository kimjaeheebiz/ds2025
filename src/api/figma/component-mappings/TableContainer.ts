import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableContainer 컴포넌트 매핑
 */
export const TableContainerMapping: ComponentMapping = {
    figmaNames: ['<TableContainer>'] as const,
    muiName: 'TableContainer',
    
    muiProps: {    },
    
    excludeFromSx: ['width'],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TableContainer${props}${sxAttribute}>
            ${content}
        </TableContainer>`;
    },
};

