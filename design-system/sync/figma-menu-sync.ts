/**
 * Figma 토큰 → menus.ts 동기화 스크립트
 * 
 * 사용법:
 * 1. Tokens Studio에서 JSON 내보내기
 * 2. design-system/tokens/generated/menu/menu.json에 저장
 * 3. npx tsx design-system/sync/figma-menu-sync.ts
 */

import fs from 'fs';
import path from 'path';

// =========================================================================
// 타입 정의
// =========================================================================

interface TokenValue {
    $type: string;
    $value: string;
    $description?: string;
}

interface TokenSet {
    id: Record<string, TokenValue>;
    label: Record<string, TokenValue>;
    path: Record<string, TokenValue>;
}

interface MenuItem {
    id: string;
    title: string;
    type: 'item' | 'group';
    url?: string;
    icon?: string;
    pageId?: string;
    children?: MenuItem[];
}

// =========================================================================
// 아이콘 매핑 (Figma에서 아이콘 정보가 없으면 기본값 사용)
// =========================================================================

const ICON_MAP: Record<string, string> = {
    home: 'HomeOutlined',
    project: 'FolderOutlined',
    users: 'PeopleOutlineOutlined',
    components: 'WidgetsOutlined',
};

// =========================================================================
// pageId 자동 생성 규칙
// =========================================================================

function generatePageId(id: string, parentId?: string): string {
    // home → home
    // project1 (parent: project) → project.project1
    // users → users
    
    if (parentId) {
        return `${parentId}.${id}`;
    }
    return id;
}

// =========================================================================
// 토큰 로드
// =========================================================================

function loadTokens(): TokenSet {
    const tokenPath = path.join(process.cwd(), 'design-system/tokens/generated/menu/menu.json');
    
    if (!fs.existsSync(tokenPath)) {
        throw new Error(`토큰 파일을 찾을 수 없습니다: ${tokenPath}`);
    }
    
    const raw = fs.readFileSync(tokenPath, 'utf-8');
    return JSON.parse(raw) as TokenSet;
}

// =========================================================================
// 메뉴 구조 생성
// =========================================================================

function buildMenuStructure(tokens: TokenSet): MenuItem[] {
    const menus: MenuItem[] = [];
    const childrenMap: Record<string, MenuItem[]> = {};
    
    // 1단계: 모든 메뉴 아이템 수집
    const allItems: MenuItem[] = [];
    
    Object.keys(tokens.id).forEach(key => {
        const id = tokens.id[key].$value;
        const label = tokens.label[key]?.$value || id;
        const path = tokens.path[key]?.$value || '';
        
        // path가 비어있으면 group, 있으면 item
        const type: 'item' | 'group' = path === '' ? 'group' : 'item';
        
        const item: MenuItem = {
            id,
            title: label,
            type,
        };
        
        if (type === 'item') {
            item.url = path;
        }
        
        // 아이콘 추가 (1-depth만)
        if (ICON_MAP[id]) {
            item.icon = ICON_MAP[id];
        }
        
        allItems.push(item);
    });
    
    // 2단계: 계층 구조 파악 (path 기반)
    allItems.forEach(item => {
        if (item.url) {
            const urlParts = item.url.split('/').filter(p => p);
            
            if (urlParts.length > 1) {
                // /project/project1 → parent: project
                const parentId = urlParts[0];
                
                if (!childrenMap[parentId]) {
                    childrenMap[parentId] = [];
                }
                
                // pageId 생성
                item.pageId = generatePageId(item.id, parentId);
                
                childrenMap[parentId].push(item);
            } else {
                // / 또는 /users 같은 1-depth item
                item.pageId = item.id;
                menus.push(item);
            }
        } else {
            // group item
            menus.push(item);
        }
    });
    
    // 3단계: children 연결
    menus.forEach(menu => {
        if (menu.type === 'group' && childrenMap[menu.id]) {
            menu.children = childrenMap[menu.id];
        }
    });
    
    return menus;
}

// =========================================================================
// TypeScript 코드 생성
// =========================================================================

function generateMenusCode(menus: MenuItem[]): string {
    const indent = (level: number) => '    '.repeat(level);
    
    function itemToCode(item: MenuItem, level: number): string {
        const lines: string[] = [];
        
        lines.push(`${indent(level)}{`);
        lines.push(`${indent(level + 1)}id: '${item.id}',`);
        
        if (item.title) {
            lines.push(`${indent(level + 1)}title: '${item.title}',`);
        }
        
        lines.push(`${indent(level + 1)}type: '${item.type}',`);
        
        if (item.url) {
            lines.push(`${indent(level + 1)}url: '${item.url}',`);
        }
        
        if (item.icon) {
            lines.push(`${indent(level + 1)}icon: '${item.icon}',`);
        }
        
        if (item.pageId) {
            lines.push(`${indent(level + 1)}pageId: '${item.pageId}',`);
        }
        
        if (item.children && item.children.length > 0) {
            lines.push(`${indent(level + 1)}children: [`);
            item.children.forEach((child, index) => {
                lines.push(itemToCode(child, level + 2));
                if (index < item.children!.length - 1) {
                    lines[lines.length - 1] += ',';
                }
            });
            lines.push(`${indent(level + 1)}],`);
        }
        
        lines.push(`${indent(level)}}`);
        
        return lines.join('\n');
    }
    
    const header = `/**
 * 메뉴 설정 (Figma 동기화)
 * 
 * ⚠️ 이 파일은 자동 생성되었습니다.
 * 수동 편집 시 Figma 동기화로 덮어쓰일 수 있습니다.
 * 
 * 생성 일시: ${new Date().toISOString()}
 */

import { findPageById } from './pages';

// =========================================================================
// 타입 정의
// =========================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface SortOption {
    key: string;
    label: string;
}

export type ActionButtonType = 'button' | 'sort-group';

export interface ActionButton {
    key: string;
    label?: string;
    type: ActionButtonType;
    onClick?: () => void;
    textColor?: string;
    sortOptions?: SortOption[];
    onSort?: (key: string, direction: SortDirection) => void;
}

export type MenuType = 'group' | 'item';

interface BaseMenuItem {
    id: string;
    title?: string;
    type: MenuType;
    url?: string;
    icon?: string;
    pageId?: string;
}

export interface MenuGroup extends BaseMenuItem {
    type: 'group';
    children: MenuItem[];
    actions?: ActionButton[];
}

export interface MenuItemLeaf extends BaseMenuItem {
    type: 'item';
    url: string;
    pageId: string;
}

export type MenuItem = MenuGroup | MenuItemLeaf;

// =========================================================================
// 메뉴 데이터 (Figma에서 동기화)
// =========================================================================

export const MENUS: MenuItem[] = [
`;
    
    const menuItems = menus.map((item, index) => {
        const code = itemToCode(item, 1);
        return index < menus.length - 1 ? code + ',' : code;
    }).join('\n');
    
    const footer = `
];

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * 메뉴 제목 가져오기 (title이 없으면 pages.ts에서 로드)
 */
export const getMenuTitle = (menu: MenuItem): string => {
    if (menu.title) {
        return menu.title;
    }
    if (menu.type === 'item' && menu.pageId) {
        const pageConfig = findPageById(menu.pageId);
        if (pageConfig) {
            return pageConfig.title;
        }
    }
    return menu.id;
};

/**
 * 페이지 메타데이터 가져오기
 */
export const getPageMetadataFromMenu = (menu: MenuItem) => {
    if (menu.type === 'item' && menu.pageId) {
        return findPageById(menu.pageId);
    }
    return null;
};
`;
    
    return header + menuItems + footer;
}

// =========================================================================
// 메인 실행
// =========================================================================

function main() {
    console.log('🔄 Figma 토큰 동기화 시작...\n');
    
    try {
        // 1. 토큰 로드
        console.log('📥 토큰 로드 중...');
        const tokens = loadTokens();
        console.log(`✅ ${Object.keys(tokens.id).length}개 메뉴 아이템 발견\n`);
        
        // 2. 메뉴 구조 생성
        console.log('🏗️  메뉴 구조 생성 중...');
        const menus = buildMenuStructure(tokens);
        console.log(`✅ ${menus.length}개 1-depth 메뉴 생성\n`);
        
        // 3. TypeScript 코드 생성
        console.log('📝 TypeScript 코드 생성 중...');
        const code = generateMenusCode(menus);
        
        // 4. 파일 저장
        const outputPath = path.join(process.cwd(), 'src/config/menus.ts');
        
        // 새 파일 저장
        fs.writeFileSync(outputPath, code, 'utf-8');
        console.log(`✅ 파일 저장 완료: ${outputPath}\n`);
        
        // 5. 요약
        console.log('📊 동기화 요약:');
        menus.forEach(menu => {
            console.log(`  - ${menu.icon || '📄'} ${menu.title} (${menu.type})`);
            if (menu.children) {
                menu.children.forEach(child => {
                    console.log(`    - ${child.title} (${child.url})`);
                });
            }
        });
        
        console.log('\n✅ 동기화 완료!\n');
        console.log('⚠️  다음 단계:');
        console.log('1. src/config/menus.ts 파일 확인');
        console.log('2. pageId 매핑 검토 (필요시 수정)');
        console.log('3. 액션 버튼 수동 추가 (필요시)');
        console.log('4. npm run dev로 확인\n');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error);
        process.exit(1);
    }
}

main();

