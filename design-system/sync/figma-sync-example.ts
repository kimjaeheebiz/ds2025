/**
 * Figma 동기화 예시
 * 
 * 실제 Figma Plugin에서 사용할 동기화 로직 예시
 */

import { generatePath, validatePath } from './path-generator';
import { validateNavigationSchema } from '../validators/navigation-validator';

// Figma Plugin API 타입 (예시)
interface FigmaNode {
    id: string;
    name: string;
    type: string;
    getPluginData: (key: string) => string;
    setPluginData: (key: string, value: string) => void;
}

interface FigmaComponentProperty {
    key: string;
    label: string;
    icon: string;
    path?: string;  // 선택적: 지정하지 않으면 key에서 자동 생성
    order?: number;
}

/**
 * Figma Component에서 Properties 읽기
 */
function getComponentProperties(node: FigmaNode): FigmaComponentProperty {
    // Figma Component Properties 읽기
    // 실제로는 figma.getPluginData() 또는 Component Properties API 사용
    
    const key = node.getPluginData('key') || '';
    const label = node.getPluginData('label') || node.name;
    const icon = node.getPluginData('icon') || 'HomeOutlined';
    const customPath = node.getPluginData('path') || '';  // 비어있으면 자동 생성
    const order = parseInt(node.getPluginData('order') || '0', 10);
    
    return {
        key,
        label,
        icon,
        path: customPath,
        order,
    };
}

/**
 * Figma에서 Navigation 데이터 동기화
 */
export async function syncNavigationFromFigma(figmaNodes: FigmaNode[]) {
    const navigationItems = figmaNodes.map((node, index) => {
        const props = getComponentProperties(node);
        
        // Path 생성 (커스텀 path가 있으면 사용, 없으면 key에서 자동 생성)
        const generatedPath = generatePath(props.key, props.path);
        
        // Path 검증
        if (!validatePath(generatedPath)) {
            throw new Error(`Invalid path generated for key "${props.key}": ${generatedPath}`);
        }
        
        return {
            id: `nav-${node.id}`,
            key: props.key,
            label: props.label,
            icon: props.icon,
            type: 'leaf' as const,
            path: generatedPath,
            showInSidebar: true,
            order: props.order || index,
            metadata: {
                figmaNodeId: node.id,
                lastModified: new Date().toISOString(),
            },
        };
    });
    
    // JSON Schema 검증
    const navigationData = {
        version: '1.0.0',
        lastSync: new Date().toISOString(),
        figmaFileKey: 'your-figma-file-key',
        navigation: navigationItems,
    };
    
    try {
        const validated = validateNavigationSchema(navigationData);
        console.log('✓ Navigation data validated successfully');
        return validated;
    } catch (error) {
        console.error('✗ Validation failed:', error);
        throw error;
    }
}

/**
 * 사용 예시
 */
export const FIGMA_SYNC_EXAMPLES = {
    // 예시 1: path를 자동 생성 (key만 지정)
    autoPath: {
        figmaProperties: {
            key: 'users',
            label: 'Users',
            icon: 'PeopleOutlineOutlined',
            // path 미지정 → 자동으로 "/users" 생성
        },
        result: {
            key: 'users',
            label: 'Users',
            icon: 'PeopleOutlineOutlined',
            path: '/users',  // 자동 생성됨
        },
    },
    
    // 예시 2: 커스텀 path 지정
    customPath: {
        figmaProperties: {
            key: 'dashboard',
            label: 'Dashboard',
            icon: 'DashboardOutlined',
            path: '/app/dashboard',  // 커스텀 path 지정
        },
        result: {
            key: 'dashboard',
            label: 'Dashboard',
            icon: 'DashboardOutlined',
            path: '/app/dashboard',  // 지정한 path 사용
        },
    },
    
    // 예시 3: 중첩된 메뉴 (key로 자동 생성)
    nestedPath: {
        figmaProperties: {
            key: 'project.project1',
            label: 'Project 1',
            icon: 'FolderOutlined',
            // path 미지정 → 자동으로 "/project/project1" 생성
        },
        result: {
            key: 'project.project1',
            label: 'Project 1',
            icon: 'FolderOutlined',
            path: '/project/project1',  // 자동 생성됨
        },
    },
};

/**
 * Figma Plugin에서 실제 사용할 코드 예시
 */
export const FIGMA_PLUGIN_CODE = `
// Figma Plugin 코드 (figma-plugin/navigation-sync.ts)

figma.showUI(__html__, { width: 400, height: 600 });

// Navigation Frame 찾기
const navFrame = figma.currentPage.findOne(
    node => node.type === 'FRAME' && node.name === 'Navigation'
);

if (!navFrame || navFrame.type !== 'FRAME') {
    figma.notify('Navigation Frame을 찾을 수 없습니다.');
    figma.closePlugin();
}

// NavItem 컴포넌트들 찾기
const navItems = navFrame.children.filter(
    node => node.type === 'INSTANCE' && node.name.startsWith('NavItem')
);

// 데이터 추출
const navigationData = navItems.map((node, index) => {
    // Component Properties 읽기
    const key = node.getPluginData('key') || '';
    const label = node.getPluginData('label') || node.name;
    const icon = node.getPluginData('icon') || 'HomeOutlined';
    const customPath = node.getPluginData('path') || '';  // 선택적
    
    return {
        id: node.id,
        key,
        label,
        icon,
        path: customPath,  // 비어있으면 나중에 자동 생성
        order: index,
    };
});

// GitHub API로 전송
figma.ui.postMessage({
    type: 'sync-navigation',
    data: navigationData,
});
`;

