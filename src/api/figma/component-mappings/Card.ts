import { ComponentMapping } from './types/PropertyMapper';
import { FigmaNode, ComponentProperties } from '../types';

/**
 * MUI Card 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-card/
 */
export const CardMapping: ComponentMapping = {
    figmaNames: ['<Card>', '<Paper>'] as const,
    muiName: 'Card',
    
    muiProps: {
        // elevation
        elevation: {
            type: 'union-number',
        },
        
        // raised
        raised: {
            type: 'boolean',
            default: false,
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['elevation', 'outlined'] as const,
            extractFromFigma: (node) => {
                // Card > Paper의 Variant 속성 추출
                const props = (node as any).componentProperties || {};
                const variantProps = props.Variant || props.variant;
                
                if (variantProps) {
                    const value = typeof variantProps === 'object' && 'value' in variantProps 
                        ? variantProps.value 
                        : variantProps;
                    
                    if (typeof value === 'string') {
                        // "Elevation" → "elevation"
                        return value.toLowerCase();
                    }
                    return value;
                }
                return null;
            }
        },
    },
    
    excludeFromSx: [],
    
    // 하위 컴포넌트 import 목록
    subComponents: [
        'CardHeader', 'CardContent', 'CardActions', 'CardMedia'
    ],
    
    // ✅ 속성 추출 커스텀 로직 (Paper 속성을 Card로 전달)
    extractProperties: async (node: FigmaNode, extractor?: any): Promise<ComponentProperties> => {
        const properties: ComponentProperties = {};
        
        // Card 하위에서 Paper 노드 찾기
        if (node.children && node.children.length > 0) {
            const paperNode = node.children.find(child => 
                child.name === '<Paper>' || child.name.includes('Paper')
            );
            
            if (paperNode) {
                // Paper의 componentProperties에서 variant, elevation 추출
                const paperProps = (paperNode as any).componentProperties || {};
                
                // Variant 속성 추출
                const variantProps = paperProps.Variant || paperProps.variant;
                if (variantProps) {
                    const value = typeof variantProps === 'object' && 'value' in variantProps 
                        ? variantProps.value 
                        : variantProps;
                    
                    if (typeof value === 'string') {
                        properties.variant = value.toLowerCase();
                    } else if (value) {
                        properties.variant = value;
                    }
                }
                
                // Elevation 속성 추출
                const elevationProps = paperProps.Elevation || paperProps.elevation;
                if (elevationProps) {
                    const value = typeof elevationProps === 'object' && 'value' in elevationProps 
                        ? elevationProps.value 
                        : elevationProps;
                    
                    if (typeof value === 'number') {
                        properties.elevation = value;
                    } else if (typeof value === 'string') {
                        properties.elevation = parseInt(value);
                    }
                }
                
                console.log(`✅ [Card] Paper 속성 추출: variant=${properties.variant}, elevation=${properties.elevation}`);
            }
        }
        
        return properties;
    },
    
    // ✅ 자식 노드 추출 로직 (Card 구조)
    extractChildren: async (node: FigmaNode): Promise<FigmaNode[]> => {
        const children: FigmaNode[] = [];
        
        // Card 하위 컴포넌트 체크 함수
        const isCardSubComponent = (node: FigmaNode): boolean => {
            const cardSubComponentNames = [
                '<CardHeader>', '<CardContent>', '<CardActions>', '<CardMedia>'
            ];
            
            return cardSubComponentNames.includes(node.name) ||
                node.name.startsWith('Card') ||
                // Boolean 속성 체크 (Card Elements에서)
                (node as any).name?.includes('Media') ||
                (node as any).name?.includes('Header') ||
                (node as any).name?.includes('Content') ||
                (node as any).name?.includes('Actions');
        };
        
        // Card 하위 컴포넌트 포함 여부 체크 함수 (Boolean 속성 기반)
        const shouldIncludeCardSubComponent = (childNode: FigmaNode, cardElementsProps: any): boolean => {
            const componentName = childNode.name;
            
            // Card 하위 컴포넌트인지 확인
            if (!(componentName.includes('Media') || componentName.includes('Header') || 
                componentName.includes('Content') || componentName.includes('Actions'))) {
                return false;
            }
            
            // Card Elements의 componentProperties에서 Boolean 값 확인
            // 예: { 'CardMedia?': { value: false }, 'CardHeader?': { value: true } } 형식
            const props = cardElementsProps || {};
            
            // 속성 이름에서 "?"를 제거하고 매칭
            const propKey = Object.keys(props).find(key => {
                const propName = key.replace('?', '').toLowerCase();
                const nodeName = componentName.replace('<', '').replace('>', '').toLowerCase();
                return propName.includes(nodeName) || nodeName.includes(propName);
            });
            
            if (propKey) {
                const propValue = props[propKey];
                // Boolean 값을 확인
                if (typeof propValue === 'object' && propValue !== null) {
                    // BOOLEAN 타입인 경우
                    if (propValue.type === 'BOOLEAN') {
                        return propValue.value === true || propValue.value === 'True';
                    }
                    // 직접 값이 있는 경우
                    return propValue === true || propValue === 'True';
                }
                // 직접 Boolean 값
                return propValue === true || propValue === 'True';
            }
            
            // Boolean 속성이 없으면 기본적으로 포함하지 않음 (안전성)
            return false;
        };
        
        // Card > Paper > Card Elements 구조 추출
        if (node.children && node.children.length > 0) {
            // Paper 노드 찾기
            const paperNode = node.children.find(child => 
                child.name === '<Paper>' || child.name.includes('Paper')
            );
            
            if (paperNode && paperNode.children) {
                // Card Elements 찾기
                const cardElements = paperNode.children.find(child =>
                    child.name === 'Card Elements' || child.name.includes('Card Elements')
                );
                
                if (cardElements && cardElements.children) {
                    // Card Elements의 componentProperties 가져오기
                    const cardElementsProps = (cardElements as any).componentProperties || {};
                    
                    // CardElements의 자식 노드들을 각각 처리
                    for (const child of cardElements.children) {
                        // Boolean 속성 체크 (Card Elements에 정의된 불린 값)
                        if (shouldIncludeCardSubComponent(child, cardElementsProps)) {
                            if (isCardSubComponent(child)) {
                                children.push(child);
                            }
                        }
                    }
                }
            }
        }
        
        return children;
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Card${props}${sxAttribute}>
            ${content}
        </Card>`;
    },
};

