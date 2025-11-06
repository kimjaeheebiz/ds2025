import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Typography 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-typography/
 */
export const TypographyMapping: ComponentMapping = {
    figmaNames: ['<Typography>'] as const,
    muiName: 'Typography',
    
    muiProps: {
        // variant 속성
        variant: {
            type: 'union',
            values: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'subtitle1', 'subtitle2',
                'body1', 'body2',
                'caption', 'overline'
            ] as const,
        },
        
        // component
        component: {
            type: 'string',
        },
        
        // align
        align: {
            type: 'union',
            values: ['inherit', 'left', 'center', 'right', 'justify'] as const,
        },
        
        // gutterBottom
        gutterBottom: {
            type: 'boolean',
            default: false,
        },
        
        // noWrap
        noWrap: {
            type: 'boolean',
            default: false,
        },
        
        // paragraph
        paragraph: {
            type: 'boolean',
            default: false,
        },
    },
    
    // Typography는 sx를 사용하여 스타일 적용
    excludeFromSx: [],
    
    extractContent: (node) => {
        // 직접 characters가 있는 경우
        if ((node as any).characters) {
            return (node as any).characters;
        }
        
        // 하위 텍스트 노드에서 추출
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const hasNewline = content && content.includes('\n');
        
        const sxAttribute = sx ? ` sx={${sx}}` : '';
        
        if (hasNewline) {
            // 줄바꿈을 <br /> 태그로 변환
            const jsxContent = content
                .replace(/\\n/g, '\n')
                .split('\n')
                .map((line, i, arr) => i < arr.length - 1 ? `${line}\n<br />` : line)
                .join('');
            
            return `<Typography${props}${sxAttribute}>${jsxContent}</Typography>`;
        }
        
        return `<Typography${props}${sxAttribute}>${content}</Typography>`;
    },
};

function findTextRecursively(children: any[]): string | null {
    for (const child of children) {
        if (child.characters) {
            return child.characters;
        }
        if (child.children && child.children.length > 0) {
            const text = findTextRecursively(child.children);
            if (text) return text;
        }
    }
    return null;
}

