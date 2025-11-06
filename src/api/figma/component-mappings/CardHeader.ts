import { ComponentMapping } from './types/PropertyMapper';
import { FigmaNode, ComponentProperties } from '../types';
import { getMuiIconName } from '../icon-mapper';
import { extractIconsForCardHeader } from '../utils/icon-extractor';

/**
 * MUI CardHeader 컴포넌트 매핑
 * 공식 문서: https://mui.com/material-ui/react-card/
 * 공식 문서(API): https://mui.com/material-ui/api/card-header/
 * 
 * Props:
 * - title: string | ReactNode (required) - 카드 제목
 * - subheader: string | ReactNode - 카드 부제목목
 * - avatar: ReactNode - 왼쪽 아바타
 * - action: ReactNode - 오른쪽 액션 버튼
 */
export const CardHeaderMapping: ComponentMapping = {
    figmaNames: ['<CardHeader>'] as const,
    muiName: 'CardHeader',
    
    muiProps: {
        // title: string | ReactNode
        title: {
            type: 'string',
        },
        
        // subheader: string | ReactNode
        subheader: {
            type: 'string',
        },
        
        // avatar: ReactNode (Avatar, Icon 등)
        avatar: {
            type: 'react-node',
        },
        
        // action: ReactNode (IconButton 등)
        action: {
            type: 'react-node',
        },
        
        // hasAction: IconButton 존재 여부
        hasAction: {
            type: 'boolean',
            default: false,
        },
        
        // disableTypography
        disableTypography: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: ['width'],
    
    // ✅ 하위 컴포넌트 추출 커스텀 로직
    extractProperties: async (node: FigmaNode, extractor?: any): Promise<ComponentProperties> => {
        const properties: ComponentProperties = {};
        
        if (node.children) {
            // 1. Content 노드 찾기 (통일된 구조)
            const contentNode = node.children.find(child => 
                child.name === 'Content' || child.name.toLowerCase().includes('content')
            );
            
            if (contentNode && contentNode.children) {
                // Content의 자식에서 Header와 Subheader 찾기
                for (const child of contentNode.children) {
                    const childName = child.name.toLowerCase();
                    
                    // Header 찾기 ({Header} 또는 Header 포함)
                    if (childName.includes('header') && !childName.includes('sub')) {
                        const headerText = extractTextFromNode(child);
                        if (headerText) {
                            (properties as any).title = headerText;
                            console.log(`✅ [CardHeader] title 추출: "${headerText}"`);
                        }
                    }
                    
                    // Subheader 찾기 ({Subheader} 또는 Subheader 포함)
                    if (childName.includes('subheader') || (childName.includes('sub') && childName.includes('header'))) {
                        const subheaderText = extractTextFromNode(child);
                        if (subheaderText) {
                            (properties as any).subheader = subheaderText;
                            console.log(`✅ [CardHeader] subheader 추출: "${subheaderText}"`);
                        }
                    }
                }
            }
            
            // 2. Avatar Wrapper에서 Avatar 찾기
            const avatarWrapper = node.children.find(child => 
                child.name === 'Avatar Wrapper' || child.name.toLowerCase().includes('avatar wrapper')
            );
            
            if (avatarWrapper && avatarWrapper.children) {
                const avatar = avatarWrapper.children.find(child =>
                    child.name === '<Avatar>' || child.name.toLowerCase().includes('avatar')
                );
                
                if (avatar) {
                    const avatarText = extractTextFromNode(avatar);
                    if (avatarText) {
                        (properties as any).avatar = avatarText; // 'true'가 아니라 실제 텍스트
                        console.log(`✅ [CardHeader] Avatar 발견: "${avatarText}"`);
                    }
                }
            }
            
            // 3. IconButton에서 action icon 추출 (icon-extractor.ts 재사용)
            const iconButton = node.children.find(child => 
                child.name === '<IconButton>' || child.name.toLowerCase().includes('iconbutton')
            );
            if (iconButton) {
                (properties as any).hasAction = true;
                console.log(`✅ [CardHeader] IconButton 발견 (action으로 사용)`);
                
                // icon-extractor 사용
                const iconData = await extractIconsForCardHeader(node, extractor);
                if (iconData.actionIconComponentId) {
                    (properties as any).actionIconComponentId = iconData.actionIconComponentId;
                }
                if (iconData.actionIconName) {
                    (properties as any).actionIconName = iconData.actionIconName;
                    console.log(`✅ [CardHeader] IconButton 아이콘 이름 조회: ${iconData.actionIconName}`);
                }
            }
        }
        
        return properties;
    },
    
    // ✅ 자식 노드 추출 커스텀 로직 (Content, Avatar, IconButton 노드 제외)
    extractChildren: async (node: FigmaNode): Promise<FigmaNode[]> => {
        // CardHeader는 모든 자식 노드를 props로 처리하므로 children 반환하지 않음
        return [];
    },
    
    // ✅ JSX 생성 템플릿 정의
    // CardHeader는 avatar, action props 렌더링
    generateJSX: (componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        
        // props에서 avatar와 action 추출
        const propsObj: any = {};
        
        // avatar 추출 (Avatar 토글이 true일 때만 렌더링)
        const avatarEnabled = (
            props.includes('avatar="true"') ||
            props.includes('avatar={true}') ||
            (properties && (properties.avatar === true || properties.avatar === 'true'))
        );

        if (avatarEnabled) {
            // avatar 텍스트가 실제로 제공되면 사용, 없거나 true일 경우 기본값 'R'
            const hasRealAvatarText = (
                properties &&
                typeof properties.avatar === 'string' &&
                properties.avatar.trim().length > 0 &&
                properties.avatar !== 'true' &&
                properties.avatar !== 'false'
            );

            const avatarText = hasRealAvatarText ? properties.avatar : 'R';
            propsObj.avatar = `<Avatar aria-label="recipe">${avatarText}</Avatar>`;
        }
        
        // hasAction 추출 - properties에서 actionIcon 정보 사용
        if (props.includes('hasAction="true"') || props.includes('hasAction={true}')) {
            let actionIcon = '';
            
            // properties에서 actionIcon 정보 추출
            if (properties) {
                const iconComponentId = properties.actionIconComponentId;
                const iconName = properties.actionIconName;
                
                if (iconComponentId || iconName) {
                    const muiIconName = getMuiIconName(iconComponentId || '', iconName);
                    if (muiIconName) {
                        actionIcon = `<${muiIconName} />`;
                        console.log(`🎨 [CardHeader] Action icon 매핑: ${iconName || iconComponentId} → ${muiIconName}`);
                    } else {
                        console.log(`⚠️ [CardHeader] Action icon 매핑 실패, 아이콘 생성하지 않음`);
                    }
                }
            }
            
            // 아이콘이 있을 때만 IconButton 생성, 없으면 action 속성 자체를 추가하지 않음
            if (actionIcon) {
                propsObj.action = `<IconButton aria-label="settings">${actionIcon}</IconButton>`;
            }
        }
        
        // props에서 avatar, hasAction 제거
        let finalProps = props.replace(/avatar="[^"]*"/g, '');
        finalProps = finalProps.replace(/hasAction="[^"]*"/g, '');
        finalProps = finalProps.replace(/hasAction=\{[^}]*\}/g, '');
        finalProps = finalProps.trim();
        
        // avatar와 action props 추가
        if (propsObj.avatar) {
            finalProps = `avatar={${propsObj.avatar}}${finalProps ? ' ' : ''}${finalProps}`;
        }
        if (propsObj.action) {
            finalProps = `${finalProps ? finalProps + ' ' : ''}action={${propsObj.action}}`;
        }
        
        return `<CardHeader${finalProps ? ' ' + finalProps : ''}${sxAttribute} />`;
    },
};

/**
 * 노드에서 텍스트 추출 (재귀적, 줄바꿈 제거)
 */
function extractTextFromNode(node: FigmaNode): string | null {
    let text: string | null = null;
    
    // 직접 characters가 있는 경우
    if ((node as any).characters) {
        text = (node as any).characters;
    } else if (node.children && node.children.length > 0) {
        // 하위 텍스트 노드에서 재귀적으로 추출
        for (const child of node.children) {
            const childText = extractTextFromNode(child);
            if (childText) {
                text = childText;
                break;
            }
        }
    }
    
    // 줄바꿈을 공백으로 변환
    if (text) {
        return text.replace(/\n/g, ' ').trim();
    }
    
    return null;
}

