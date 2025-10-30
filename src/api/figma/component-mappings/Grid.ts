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
    
    excludeFromSx: [
        'display',
        'flexDirection',
        'gap',
        'width',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        let workingSx = sx || '';
        let spacingSnippet = '';

        // sx에 gap이 있으면 spacing으로 변환 (값을 그대로 전달)
        if (workingSx) {
            const genericMatch = workingSx.match(/(?:,|\{|\s)gap:\s*([^,}]+)\s*(?:,|\})/);
            if (genericMatch && genericMatch[1]) {
                const rawValue = genericMatch[1].trim();
                spacingSnippet = ` spacing={${rawValue}}`;
                // gap 항목 제거
                workingSx = workingSx
                    .replace(/\s*gap:\s*[^,}]+\s*,?/g, '')
                    .replace(/,\s*}/g, ' }')
                    .replace(/\{\s*,/g, '{ ');
            }
        }

        const sxAttribute = workingSx && /\{\s*\}/.test(workingSx) === false ? `\n            sx={${workingSx}}` : '';
        return `<Grid${props}${spacingSnippet}${sxAttribute}>
            ${content}
        </Grid>`;
    },
};

