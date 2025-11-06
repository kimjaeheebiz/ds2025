import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Avatar 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-avatar/
 */
export const AvatarMapping: ComponentMapping = {
    figmaNames: ['<Avatar>'] as const,
    muiName: 'Avatar',
    
    muiProps: {
        // src
        src: {
            type: 'string',
        },
        
        // alt
        alt: {
            type: 'string',
        },
        
        // variant
        variant: {
            type: 'union',
            values: ['circular', 'rounded', 'square'] as const,
            default: 'circular',
        },
        
        // color
        color: {
            type: 'union',
            values: ['default'] as const,
        },
    },
    
    excludeFromSx: [
        'borderRadius',
        'backgroundColor',
        'width',
        'height',
    ],
    
    // 속성 추출: 아이콘 콘텐츠 + 배경색(BG) 보존 및 자식 fill fallback
    extractProperties: async (node, extractor) => {
        const properties: Record<string, any> = {};
        
        // 아이콘 콘텐츠 추출: <Avatar> > <Icon> > 인스턴스명 구조에서 무조건 인스턴스 가져오기
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
                        properties.__avatarIconName = muiIconName;
                    }
                }
            }
        } catch {
            // 무음 처리
        }

        // 배경 컬러 변수명은 extractor가 colorStyle로 채운 값을 우선 사용
        // (없으면 Avatar 배경색은 지정하지 않음; 전역 로직이 처리)
        
        return properties as any;
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx, properties) => {
        // Avatar 전용 추가 sx 구성: 배경색, 절대 width/height
        const extraEntries: string[] = [];
        const absW = (properties as any)?.absoluteWidth;
        const absH = (properties as any)?.absoluteHeight;
        const avatarBG = (properties as any)?.__avatarColorStyle;
        if (typeof absW === 'number') extraEntries.push(`width: '${absW}px'`);
        if (typeof absH === 'number') extraEntries.push(`height: '${absH}px'`);
        if (avatarBG) extraEntries.push(`backgroundColor: '${avatarBG}'`);

        let mergedSx = '';
        if (sx && extraEntries.length > 0) {
            // sx는 "{ ... }" 형태의 문자열이므로 바깥 중괄호를 제거해 병합
            const trimmed = sx.trim();
            const inner = trimmed.startsWith('{') && trimmed.endsWith('}')
                ? trimmed.slice(1, -1).trim()
                : trimmed;
            const comma = inner.length > 0 ? ', ' : '';
            mergedSx = `\n            sx={{ ${inner}${comma}${extraEntries.join(', ')} }}`;
        } else if (sx) {
            mergedSx = `\n            sx=${sx}`;
        } else if (extraEntries.length > 0) {
            mergedSx = `\n            sx={{ ${extraEntries.join(', ')} }}`;
        }
        
        // Icon 콘텐츠가 감지된 경우 아이콘 컴포넌트로 렌더링
        if (properties && (properties as any).__avatarIconName) {
            const icon = (properties as any).__avatarIconName as string;
            return `<Avatar${props}${mergedSx}>
            <${icon} />
        </Avatar>`;
        }
        
        return `<Avatar${props}${mergedSx}>
            ${content}
        </Avatar>`;
    },
};

