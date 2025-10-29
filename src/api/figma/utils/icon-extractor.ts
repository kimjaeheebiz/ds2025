/**
 * Icon 추출 전역 유틸리티
 * 
 * 컴포넌트 간 공통으로 사용하는 Icon 추출 로직을 중앙화
 */

import { FigmaNode } from '../types';

export interface IconExtractionResult {
    startIconComponentId?: string;
    endIconComponentId?: string;
    startIconName?: string;
    endIconName?: string;
    actionIconComponentId?: string;
    actionIconName?: string;
}

/**
 * 컴포넌트 매핑에서 사용하는 형식 (기존 호환성 유지)
 */
export interface IconData {
    startIcon?: string;
    endIcon?: string;
    startIconComponentId?: string;
    endIconComponentId?: string;
}

/**
 * 컴포넌트 properties에서 Icon 정보 추출
 * @param node Figma 노드
 * @param position 'start' | 'end' | 'action'
 * @returns Icon 추출 결과
 */
export function extractIconFromProperties(
    node: FigmaNode,
    position: 'start' | 'end' | 'action' = 'start'
): { componentId?: string; iconName?: string } {
    const iconProps = (node as any).componentProperties || {};
    const result: { componentId?: string; iconName?: string } = {};

    for (const [key, propData] of Object.entries(iconProps)) {
        const prop = propData as any;
        if (prop && typeof prop === 'object' && prop.type === 'INSTANCE_SWAP') {
            const iconComponentId = prop.value;
            
            // position에 따라 매칭
            if (position === 'start' && key.toLowerCase().includes('start')) {
                result.componentId = iconComponentId;
            } else if (position === 'end' && key.toLowerCase().includes('end')) {
                result.componentId = iconComponentId;
            } else if (position === 'action' && (key.toLowerCase().includes('icon') || key.includes('#'))) {
                result.componentId = iconComponentId;
            }
        }
    }

    return result;
}

/**
 * 노드의 자식에서 Icon 인스턴스 찾기
 * @param node Figma 노드
 * @returns Icon 인스턴스 정보
 */
export function extractIconFromChildren(node: FigmaNode): { componentId?: string; iconName?: string } {
    const result: { componentId?: string; iconName?: string } = {};

    if (node.children) {
        const iconChild = node.children.find((child: any) => 
            child.type === 'INSTANCE' && 
            (child.name.includes('Icon') || child.name.toLowerCase().includes('icon'))
        );

        if (iconChild && (iconChild as any).componentId) {
            result.componentId = (iconChild as any).componentId;
            const iconName = (iconChild as any).name?.replace(/<|>/g, '');
            if (iconName && iconName !== 'Icon') {
                result.iconName = iconName;
            }
        }
    }

    return result;
}

/**
 * Figma API를 통해 아이콘 이름 조회
 * @param iconComponentId 아이콘 컴포넌트 ID
 * @param extractor FigmaDesignExtractor 인스턴스
 * @returns 아이콘 이름
 */
export async function fetchIconName(
    iconComponentId: string,
    extractor: any
): Promise<string | undefined> {
    if (!extractor) {
        console.warn(`⚠️ extractor를 찾을 수 없음: ${iconComponentId}`);
        return undefined;
    }

    try {
        // 1. extractor의 componentInfo에서 먼저 조회
        if ((extractor as any).componentInfo && (extractor as any).componentInfo.has(iconComponentId)) {
            const componentInfo = (extractor as any).componentInfo.get(iconComponentId);
            const iconName = componentInfo?.name || componentInfo?.description || componentInfo?.key;
            if (iconName) {
                return iconName;
            }
        }

        // 2. Figma API로 조회
        const fileKey = (extractor as any).fileKey || (extractor as any)._fileKey;
        if (!fileKey || !(extractor as any).client) {
            return undefined;
        }

        const iconNodesResponse = await (extractor as any).client.getFileNodes(
            fileKey,
            [iconComponentId]
        );

        if (iconNodesResponse.nodes && iconNodesResponse.nodes[iconComponentId]) {
            const iconNode = iconNodesResponse.nodes[iconComponentId].document;
            let iconName = iconNode.name;

            // 이름이 properties 형태이면 실제 아이콘 이름 추출
            if (iconName.includes('Size=') || iconName.includes('Type=') || iconName.includes('=')) {
                // children에서 실제 아이콘 찾기
                if (iconNode.children && iconNode.children.length > 0) {
                    // 먼저 VECTOR 또는 GROUP 타입의 아이콘 찾기
                    let childIcon = iconNode.children.find((child: any) => 
                        child.type === 'VECTOR' || child.type === 'GROUP'
                    );
                    
                    // 없으면 'Icon'이 포함된 이름 찾기
                    if (!childIcon) {
                        childIcon = iconNode.children.find((child: any) => 
                            child.name.includes('Icon')
                        );
                    }
                    
                    // 없으면 '='가 포함되지 않은 이름 찾기
                    if (!childIcon) {
                        childIcon = iconNode.children.find((child: any) => 
                            !child.name.includes('=')
                        );
                    }
                    
                    // 없으면 첫 번째 자식 사용
                    if (!childIcon && iconNode.children.length > 0) {
                        childIcon = iconNode.children[0];
                    }
                    
                    if (childIcon) {
                        iconName = childIcon.name;
                    }
                }
            }

            return iconName;
        }
    } catch (error) {
        // 아이콘 정보 조회 실패 (무음)
    }

    return undefined;
}

/**
 * Figma API를 통해 여러 아이콘 이름 일괄 조회
 * @param iconComponentIds 아이콘 컴포넌트 ID 배열
 * @param extractor FigmaDesignExtractor 인스턴스
 * @returns 아이콘 ID → 이름 매핑
 */
export async function fetchIconNames(
    iconComponentIds: string[],
    extractor: any
): Promise<Map<string, string>> {
    const iconNamesMap = new Map<string, string>();
    
    if (!extractor || iconComponentIds.length === 0) {
        return iconNamesMap;
    }

    try {
        const fileKey = (extractor as any).fileKey || (extractor as any)._fileKey;
        if (!fileKey || !(extractor as any).client) {
            console.warn(`⚠️ fileKey 또는 client 정보가 없습니다.`);
            return iconNamesMap;
        }

        const iconNodesResponse = await (extractor as any).client.getFileNodes(
            fileKey,
            iconComponentIds
        );

        if (iconNodesResponse.nodes) {
            for (const [nodeId, nodeData] of Object.entries(iconNodesResponse.nodes)) {
                const iconNode = (nodeData as any).document;
                let iconName = iconNode.name;

                // 이름이 properties 형태이면 실제 아이콘 이름 추출
                if (iconName.includes('Size=') || iconName.includes('Type=') || iconName.includes('=')) {
                    // children에서 실제 아이콘 찾기
                    if (iconNode.children && iconNode.children.length > 0) {
                        // 먼저 VECTOR 또는 GROUP 타입의 아이콘 찾기
                        let childIcon = iconNode.children.find((child: any) => 
                            child.type === 'VECTOR' || child.type === 'GROUP'
                        );
                        
                        // 없으면 'Icon'이 포함된 이름 찾기
                        if (!childIcon) {
                            childIcon = iconNode.children.find((child: any) => 
                                child.name.includes('Icon')
                            );
                        }
                        
                        // 없으면 '='가 포함되지 않은 이름 찾기
                        if (!childIcon) {
                            childIcon = iconNode.children.find((child: any) => 
                                !child.name.includes('=')
                            );
                        }
                        
                        // 없으면 첫 번째 자식 사용
                        if (!childIcon && iconNode.children.length > 0) {
                            childIcon = iconNode.children[0];
                        }
                        
                        if (childIcon) {
                            iconName = childIcon.name;
                        }
                    }
                }

                iconNamesMap.set(nodeId, iconName);
            }
        }
    } catch (error) {
        // 아이콘 노드 조회 실패 (무음)
    }

    return iconNamesMap;
}

/**
 * Button용 Icon 추출 (기존 API와 호환)
 */
export async function extractIconsForButton(
    node: FigmaNode,
    extractor?: any
): Promise<IconData> {
    const result: IconData = {};
    
    // Component properties에서 아이콘 ID 추출
    const iconProps = (node as any).componentProperties || {};
    
    for (const [key, propData] of Object.entries(iconProps)) {
        const prop = propData as any;
        if (prop && typeof prop === 'object' && prop.type === 'INSTANCE_SWAP') {
            const iconComponentId = prop.value;
            if (key.toLowerCase().includes('start')) {
                result.startIconComponentId = iconComponentId;
            } else if (key.toLowerCase().includes('end')) {
                result.endIconComponentId = iconComponentId;
            }
        }
    }
    
    // 아이콘 이름 가져오기
    const iconIds = [result.startIconComponentId, result.endIconComponentId].filter(Boolean) as string[];
    if (iconIds.length > 0 && extractor) {
        const iconNamesMap = await fetchIconNames(iconIds, extractor);
        
        if (result.startIconComponentId) {
            result.startIcon = iconNamesMap.get(result.startIconComponentId) || result.startIcon;
        }
        if (result.endIconComponentId) {
            result.endIcon = iconNamesMap.get(result.endIconComponentId) || result.endIcon;
        }
    }
    
    return result;
}

/**
 * CardHeader용 Icon 추출
 */
export async function extractIconsForCardHeader(
    node: FigmaNode,
    extractor?: any
): Promise<IconExtractionResult> {
    const result: IconExtractionResult = {};

    // IconButton의 자식에서 Icon 찾기
    if (node.children) {
        const iconButton = node.children.find(child => 
            child.name === '<IconButton>' || child.name.toLowerCase().includes('iconbutton')
        );
        
        if (iconButton && iconButton.children) {
            
            const iconChild = iconButton.children.find((child: any) => 
                child.type === 'INSTANCE' && child.name.includes('Icon')
            );
            
            
            if (iconChild && (iconChild as any).componentId) {
                const iconComponentId = (iconChild as any).componentId;
                result.actionIconComponentId = iconComponentId;
                
                // 1. 먼저 인스턴스 자체의 이름 확인
                let iconName = (iconChild as any).name?.replace(/<|>/g, '');
                
                // 2. 이름이 빈 값이거나 'Icon'만 있으면 extractor의 componentInfo에서 조회
                if (!iconName || iconName === 'Icon') {
                    // componentInfo에서 조회 (가장 정확)
                    if ((extractor as any).componentInfo && (extractor as any).componentInfo.has(iconComponentId)) {
                        const componentInfo = (extractor as any).componentInfo.get(iconComponentId);
                        iconName = componentInfo?.name || componentInfo?.description || componentInfo?.key;
                    }
                    
                    // 여전히 없으면 fetchIconName으로 조회 (fallback)
                    if (!iconName || iconName === 'Icon') {
                        const fetchedName = await fetchIconName(iconComponentId, extractor);
                        if (fetchedName) {
                            iconName = fetchedName;
                        }
                    }
                }
                
                if (iconName && iconName !== 'Icon') {
                    result.actionIconName = iconName;
                }
            }
        }
    }

    return result;
}

/**
 * 범용 Icon 추출 (모든 위치 지원)
 */
export async function extractIconsUniversal(
    node: FigmaNode,
    extractor?: any
): Promise<IconExtractionResult> {
    const result: IconExtractionResult = {};

    // 1. Start Icon 추출
    const startIcon = extractIconFromProperties(node, 'start');
    if (startIcon.componentId) {
        result.startIconComponentId = startIcon.componentId;
        
        // 이름도 가져오기
        const iconName = await fetchIconName(startIcon.componentId, extractor);
        if (iconName) {
            result.startIconName = iconName;
        }
    }

    // 2. End Icon 추출
    const endIcon = extractIconFromProperties(node, 'end');
    if (endIcon.componentId) {
        result.endIconComponentId = endIcon.componentId;
        
        const iconName = await fetchIconName(endIcon.componentId, extractor);
        if (iconName) {
            result.endIconName = iconName;
        }
    }

    // 3. Action Icon 추출 (자식에서 찾기)
    const actionIcon = extractIconFromChildren(node);
    if (actionIcon.componentId) {
        result.actionIconComponentId = actionIcon.componentId;
        
        const iconName = await fetchIconName(actionIcon.componentId, extractor);
        if (iconName) {
            result.actionIconName = iconName;
        }
    }

    return result;
}

