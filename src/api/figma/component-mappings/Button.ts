import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Button 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-button/
 */
export const ButtonMapping: ComponentMapping = {
    // 피그마 컴포넌트 이름
    figmaNames: ['<Button>'] as const,
    
    // MUI 컴포넌트 이름
    muiName: 'Button',
    
    // MUI 공식 속성 (API 문서 기반)
    muiProps: {
        // variant 속성 (MUI 기본값: 'text')
        variant: {
            type: 'union',
            values: ['contained', 'outlined', 'text'] as const,
            default: 'text',
            extractFromFigma: (node) => {
                // 피그마 componentProperties에서 직접 추출 (PascalCase도 확인)
                const variantProps = (node as any).componentProperties?.Variant || 
                                    (node as any).componentProperties?.variant;
                if (variantProps) {
                    // 값이 객체인 경우 value 속성 추출, 아니면 직접 사용
                    const value = typeof variantProps === 'object' && 'value' in variantProps 
                        ? variantProps.value 
                        : variantProps;
                    
                    // "Contained", "Outlined", "Text" → "contained", "outlined", "text"
                    if (typeof value === 'string') {
                        return value.toLowerCase();
                    }
                    return value;
                }
                
                // variantProperties에서도 시도
                const variantProps2 = (node as any).variantProperties?.variant || 
                                     (node as any).variantProperties?.Variant;
                if (variantProps2) {
                    return typeof variantProps2 === 'string' ? variantProps2.toLowerCase() : variantProps2;
                }
                
                return null;
            }
        },
        
        // size 속성 (MUI 기본값: 'medium')
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
            default: 'medium',
            extractFromFigma: (node) => {
                const sizeProps = (node as any).componentProperties?.Size || 
                                  (node as any).componentProperties?.size;
                if (sizeProps) {
                    const value = typeof sizeProps === 'object' && 'value' in sizeProps 
                        ? sizeProps.value 
                        : sizeProps;
                    if (typeof value === 'string') {
                        return value.toLowerCase();
                    }
                    return value;
                }
                return null;
            }
        },
        
        // color 속성 (MUI 기본값: 'primary')
        color: {
            type: 'union',
            values: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'] as const,
            default: 'primary',
            extractFromFigma: (node) => {
                const colorProps = (node as any).componentProperties?.Color || 
                                   (node as any).componentProperties?.color;
                if (colorProps) {
                    const value = typeof colorProps === 'object' && 'value' in colorProps 
                        ? colorProps.value 
                        : colorProps;
                    if (typeof value === 'string') {
                        return value.toLowerCase();
                    }
                    return value;
                }
                return null;
            }
        },
        
        // disabled 속성
        disabled: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                const stateProps = (node as any).componentProperties?.state;
                if (stateProps?.value) {
                    return stateProps.value === 'Disabled';
                }
                return false;
            }
        },
        
        // fullWidth 속성
        fullWidth: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                return (node as any).layoutSizingHorizontal === 'FILL';
            }
        },
        
        // disableElevation
        disableElevation: {
            type: 'boolean',
            default: false,
        },
        
        // disableFocusRipple
        disableFocusRipple: {
            type: 'boolean',
            default: false,
        },
        
        // disableRipple
        disableRipple: {
            type: 'boolean',
            default: false,
        },
        
        // startIcon
        startIcon: {
            type: 'react-node',
            extractFromFigma: (node) => {
                // Figma의 'Start Icon' 속성 확인 (PascalCase 대소문자 무시)
                const startIconProps = (node as any).componentProperties?.['Start Icon'] || 
                                      (node as any).componentProperties?.['Start Icon#9973:33'];
                
                if (startIconProps) {
                    const value = typeof startIconProps === 'object' && 'value' in startIconProps 
                        ? startIconProps.value 
                        : startIconProps;
                    return value === true || value === 'true';
                }
                return false;
            }
        },
        
        // endIcon
        endIcon: {
            type: 'react-node',
            extractFromFigma: (node) => {
                // Figma의 'End Icon' 속성 확인 (PascalCase 대소문자 무시)
                const endIconProps = (node as any).componentProperties?.['End Icon'] || 
                                    (node as any).componentProperties?.['End Icon#9974:219'];
                
                if (endIconProps) {
                    const value = typeof endIconProps === 'object' && 'value' in endIconProps 
                        ? endIconProps.value 
                        : endIconProps;
                    return value === true || value === 'true';
                }
                return false;
            }
        },
        
        // href (LinkButton)
        href: {
            type: 'string',
        },
    },
    
    // sx에서 제외할 속성 (MUI가 관리)
    excludeFromSx: [
        'backgroundColor',   // variant가 관리
        'borderRadius',      // MUI variant가 관리
        'justifyContent',    // MUI 레이아웃이 관리
        'alignItems',        // MUI 레이아웃이 관리
        'padding',           // MUI variant가 관리
        'color',             // variant가 관리
        'borderColor',       // variant가 관리
    ],
    
    // 하위 텍스트 추출 커스텀 로직
    extractContent: (node) => {
        // Label 속성에서 텍스트 추출
        const labelProp = (node as any).componentProperties?.label?.value;
        if (labelProp) return labelProp;
        
        // 하위 텍스트 노드 재귀 탐색
        return findTextRecursively(node.children || []);
    },
    
    // ✅ 아이콘 추출 커스텀 로직 (icon-extractor.ts 재사용)
    extractIcons: async (node: any, extractor?: any) => {
        // extractor는 extractIcons의 두 번째 파라미터로 전달됨
        const { extractIconsForButton } = await import('../utils/icon-extractor');
        return await extractIconsForButton(node, extractor);
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
            
            return `<Button${props}${sxAttribute}>${jsxContent}</Button>`;
        }
        
        return `<Button${props}${sxAttribute}>${content}</Button>`;
    },
};

/**
 * 재귀적으로 텍스트 찾기
 */
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

