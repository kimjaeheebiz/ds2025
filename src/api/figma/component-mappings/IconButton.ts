import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI IconButton 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-icon-button/
 */
export const IconButtonMapping: ComponentMapping = {
    figmaNames: ['<IconButton>'] as const,
    muiName: 'IconButton',
    
    muiProps: {
        // size
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'] as const,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // edge
        edge: {
            type: 'union',
            values: ['start', 'end', 'false'] as const,
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
        
        // ariaLabel
        'aria-label': {
            type: 'string',
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'borderRadius',
        'color',
    ],
    
    // 속성 추출: 아이콘 콘텐츠 지원
    extractProperties: async (node, extractor) => {
        const properties: Record<string, any> = {};
        
        // 아이콘 콘텐츠 추출: <IconButton> > <Icon> > 인스턴스명 구조에서 무조건 인스턴스 가져오기
        try {
            // <Icon> 컨테이너 찾기
            const findIconContainer = (children: any[]): any => {
                if (!children || children.length === 0) return null;
                
                for (const child of children) {
                    // 숨김 노드는 제외
                    if (child?.visible === false) continue;
                    
                    // <Icon> 컨테이너 찾기 (이름으로 판단)
                    const name = (child.name || '').trim();
                    if (name === 'Icon' || name === '<Icon>') {
                        return child;
                    }
                    
                    // 재귀적으로 탐색
                    if (child.children && child.children.length > 0) {
                        const found = findIconContainer(child.children);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            // <Icon> 컨테이너 찾기
            const iconContainer = findIconContainer((node as any).children || []);
            
            if (iconContainer && iconContainer.children && iconContainer.children.length > 0) {
                // <Icon> 하위에서 첫 번째 INSTANCE 타입 찾기 (이름 조건 없이)
                const iconInstance = iconContainer.children.find((child: any) => 
                    child?.visible !== false && 
                    child.type === 'INSTANCE' && 
                    child.componentId
                );
                
                if (iconInstance && iconInstance.componentId) {
                    const { fetchIconName } = await import('../utils/icon-extractor');
                    const { getMuiIconName } = await import('../icon-mapper');
                    
                    // 1) 인스턴스 자체의 name 우선 사용 (getMuiIconName 함수가 Filled 제거 처리)
                    const rawName = iconInstance.name || '';
                    let muiIconName = getMuiIconName(iconInstance.componentId, rawName);
                    
                    // 2) name 기반 매핑이 실패(null)면 Figma API로 보강 조회
                    if (!muiIconName) {
                        const fetchedName = await fetchIconName(iconInstance.componentId, extractor);
                        if (fetchedName) {
                            muiIconName = getMuiIconName(iconInstance.componentId, fetchedName);
                        }
                    }
                    
                    if (muiIconName) {
                        properties.__iconButtonIconName = muiIconName;
                    }
                }
            }
        } catch {
            // 무음 처리
        }
        
        return properties as any;
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        
        // Icon 콘텐츠가 감지된 경우 아이콘 컴포넌트로 렌더링
        if (properties && (properties as any).__iconButtonIconName) {
            const icon = (properties as any).__iconButtonIconName as string;
            return `<IconButton${props}${sxAttribute}>
            <${icon} />
        </IconButton>`;
        }
        
        return `<IconButton${props}${sxAttribute}>
            ${content}
        </IconButton>`;
    },
};

