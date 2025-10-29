import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Grid (Grid2) 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-grid/
 */
export const GridMapping: ComponentMapping = {
    figmaNames: ['Grid', '<Grid>'] as const,
    muiName: 'Grid',
    
    muiProps: {
        // container
        container: {
            type: 'boolean',
            default: false,
        },
        
        // item
        item: {
            type: 'boolean',
            default: true,
        },
        
        // xs, sm, md, lg, xl
        xs: { type: 'union-number' },
        sm: { type: 'union-number' },
        md: { type: 'union-number' },
        lg: { type: 'union-number' },
        xl: { type: 'union-number' },
        
        // spacing
        spacing: {
            type: 'union-number',
        },
        
        // justifyContent
        justifyContent: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const,
        },
        
        // alignItems
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] as const,
        },
    },
    
    excludeFromSx: [],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Grid${props}${sxAttribute}>
            ${content}
        </Grid>`;
    },
};

