/**
 * Path 생성 규칙
 * 
 * Figma에서 동기화할 때 key 기반으로 path를 자동 생성하되,
 * 특수한 경우 Figma에서 직접 지정한 path를 우선 사용
 */

export interface PathGenerationRule {
    key: string;
    customPath?: string;  // Figma에서 지정한 커스텀 path
}

/**
 * Key를 kebab-case path로 변환
 */
export function keyToPath(key: string): string {
    // 특수 케이스 처리
    if (key === 'home') return '/';
    if (key === 'notFound') return '/404';
    if (key === 'serverError') return '/500';
    
    // 일반 케이스: key를 path로 변환
    // "users" → "/users"
    // "project.project1" → "/project/project1"
    // "myNewPage" → "/my-new-page"
    
    const parts = key.split('.');
    const kebabParts = parts.map(part => camelToKebab(part));
    
    return '/' + kebabParts.join('/');
}

/**
 * camelCase를 kebab-case로 변환
 */
function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Path 생성 (Figma 커스텀 path 우선)
 */
export function generatePath(key: string, customPath?: string): string {
    // 1. Figma에서 커스텀 path를 지정했으면 그것을 사용
    if (customPath && customPath.trim() !== '') {
        return customPath;
    }
    
    // 2. 아니면 key 기반 자동 생성
    return keyToPath(key);
}

/**
 * Path 검증
 */
export function validatePath(path: string): boolean {
    // Path 규칙 검증
    if (!path.startsWith('/')) {
        console.warn(`Path must start with '/': ${path}`);
        return false;
    }
    
    // 허용되지 않는 문자 체크
    const invalidChars = /[^a-z0-9\-/]/;
    if (invalidChars.test(path)) {
        console.warn(`Path contains invalid characters: ${path}`);
        return false;
    }
    
    return true;
}

/**
 * Figma 동기화 시 사용할 Path 매핑 예시
 */
export const PATH_GENERATION_EXAMPLES = {
    // 자동 생성 예시
    auto: [
        { key: 'home', expected: '/' },
        { key: 'users', expected: '/users' },
        { key: 'project.project1', expected: '/project/project1' },
        { key: 'myNewPage', expected: '/my-new-page' },
        { key: 'adminPanel', expected: '/admin-panel' },
    ],
    
    // 커스텀 path 예시
    custom: [
        { key: 'home', customPath: '/', expected: '/' },
        { key: 'dashboard', customPath: '/app/dashboard', expected: '/app/dashboard' },
        { key: 'settings', customPath: '/user/settings', expected: '/user/settings' },
    ],
};

/**
 * 테스트 함수
 */
export function testPathGeneration() {
    console.log('=== Auto Generation Tests ===');
    PATH_GENERATION_EXAMPLES.auto.forEach(({ key, expected }) => {
        const result = generatePath(key);
        const passed = result === expected;
        console.log(`${passed ? '✓' : '✗'} ${key} → ${result} (expected: ${expected})`);
    });
    
    console.log('\n=== Custom Path Tests ===');
    PATH_GENERATION_EXAMPLES.custom.forEach(({ key, customPath, expected }) => {
        const result = generatePath(key, customPath);
        const passed = result === expected;
        console.log(`${passed ? '✓' : '✗'} ${key} (custom: ${customPath}) → ${result}`);
    });
}

