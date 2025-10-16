/**
 * Navigation Schema Validator
 * 
 * Figma에서 동기화된 네비게이션 데이터를 검증하고 변환합니다.
 */

// =========================================================================
// 타입 정의
// =========================================================================

export interface NavigationMetadata {
    figmaNodeId?: string;
    figmaComponentKey?: string;
    lastModified?: string;
}

export interface SortOption {
    key: string;
    label: string;
}

export interface ActionButton {
    key: string;
    label?: string;
    type: 'button' | 'sort-group';
    textColor?: string;
    sortOptions?: SortOption[];
}

export interface NavigationGrandChild {
    id: string;
    key: string;
    label: string;
    path: string;
    order?: number;
    metadata?: NavigationMetadata;
}

export interface NavigationChild {
    id: string;
    key: string;
    label: string;
    type: 'leaf' | 'folder';
    path?: string;
    order?: number;
    children?: NavigationGrandChild[];
    metadata?: NavigationMetadata;
}

export interface NavigationItem {
    id: string;
    key: string;
    label: string;
    icon: string;
    type: 'leaf' | 'folder';
    path?: string;
    showInSidebar?: boolean;
    order?: number;
    actions?: ActionButton[];
    children?: NavigationChild[];
    metadata?: NavigationMetadata;
}

export interface NavigationSchema {
    version: string;
    lastSync?: string;
    figmaFileKey?: string;
    navigation: NavigationItem[];
}

// =========================================================================
// 검증 에러 타입
// =========================================================================

export class ValidationError extends Error {
    constructor(
        message: string,
        public path: string,
        public value?: unknown
    ) {
        super(`[${path}] ${message}`);
        this.name = 'ValidationError';
    }
}

// =========================================================================
// 타입 가드
// =========================================================================

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

// =========================================================================
// 검증 함수
// =========================================================================

/**
 * 버전 문자열 검증 (semver 형식)
 */
function validateVersion(version: unknown, path: string): string {
    if (!isString(version)) {
        throw new ValidationError('version must be a string', path, version);
    }
    
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(version)) {
        throw new ValidationError(
            'version must follow semver format (e.g., "1.0.0")',
            path,
            version
        );
    }
    
    return version;
}

/**
 * ISO 8601 날짜 문자열 검증
 */
function validateISODate(date: unknown, path: string): string {
    if (!isString(date)) {
        throw new ValidationError('date must be a string', path, date);
    }
    
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
        throw new ValidationError('date must be a valid ISO 8601 date', path, date);
    }
    
    return date;
}

/**
 * ActionButton 검증
 */
function validateActionButton(action: unknown, path: string): ActionButton {
    if (!isObject(action)) {
        throw new ValidationError('action must be an object', path, action);
    }
    
    // key 검증
    if (!isString(action.key)) {
        throw new ValidationError('action.key must be a string', `${path}.key`, action.key);
    }
    
    // type 검증
    if (!isString(action.type) || !['button', 'sort-group'].includes(action.type)) {
        throw new ValidationError(
            'action.type must be "button" or "sort-group"',
            `${path}.type`,
            action.type
        );
    }
    
    const result: ActionButton = {
        key: action.key,
        type: action.type as 'button' | 'sort-group',
    };
    
    // button 타입: label 필수
    if (action.type === 'button') {
        if (!isString(action.label)) {
            throw new ValidationError(
                'action.label is required for button type',
                `${path}.label`,
                action.label
            );
        }
        result.label = action.label;
    }
    
    // sort-group 타입: sortOptions 필수
    if (action.type === 'sort-group') {
        if (!isArray(action.sortOptions)) {
            throw new ValidationError(
                'action.sortOptions is required for sort-group type',
                `${path}.sortOptions`,
                action.sortOptions
            );
        }
        
        result.sortOptions = action.sortOptions.map((opt, idx) => {
            if (!isObject(opt)) {
                throw new ValidationError(
                    'sortOption must be an object',
                    `${path}.sortOptions[${idx}]`,
                    opt
                );
            }
            if (!isString(opt.key) || !isString(opt.label)) {
                throw new ValidationError(
                    'sortOption must have key and label strings',
                    `${path}.sortOptions[${idx}]`,
                    opt
                );
            }
            return { key: opt.key, label: opt.label };
        });
    }
    
    // 선택적 필드
    if (action.textColor !== undefined) {
        if (!isString(action.textColor)) {
            throw new ValidationError(
                'action.textColor must be a string',
                `${path}.textColor`,
                action.textColor
            );
        }
        result.textColor = action.textColor;
    }
    
    return result;
}

/**
 * NavigationGrandChild 검증 (3-depth)
 */
function validateNavigationGrandChild(
    item: unknown,
    path: string
): NavigationGrandChild {
    if (!isObject(item)) {
        throw new ValidationError('grandchild must be an object', path, item);
    }
    
    // 필수 필드
    if (!isString(item.id)) {
        throw new ValidationError('grandchild.id must be a string', `${path}.id`, item.id);
    }
    if (!isString(item.key)) {
        throw new ValidationError('grandchild.key must be a string', `${path}.key`, item.key);
    }
    if (!isString(item.label)) {
        throw new ValidationError('grandchild.label must be a string', `${path}.label`, item.label);
    }
    if (!isString(item.path)) {
        throw new ValidationError('grandchild.path must be a string', `${path}.path`, item.path);
    }
    
    const result: NavigationGrandChild = {
        id: item.id,
        key: item.key,
        label: item.label,
        path: item.path,
    };
    
    // 선택적 필드
    if (item.order !== undefined) {
        if (!isNumber(item.order)) {
            throw new ValidationError(
                'grandchild.order must be a number',
                `${path}.order`,
                item.order
            );
        }
        result.order = item.order;
    }
    
    if (item.metadata !== undefined) {
        if (!isObject(item.metadata)) {
            throw new ValidationError(
                'grandchild.metadata must be an object',
                `${path}.metadata`,
                item.metadata
            );
        }
        result.metadata = item.metadata as NavigationMetadata;
    }
    
    return result;
}

/**
 * NavigationChild 검증 (2-depth)
 */
function validateNavigationChild(item: unknown, path: string): NavigationChild {
    if (!isObject(item)) {
        throw new ValidationError('child must be an object', path, item);
    }
    
    // 필수 필드
    if (!isString(item.id)) {
        throw new ValidationError('child.id must be a string', `${path}.id`, item.id);
    }
    if (!isString(item.key)) {
        throw new ValidationError('child.key must be a string', `${path}.key`, item.key);
    }
    if (!isString(item.label)) {
        throw new ValidationError('child.label must be a string', `${path}.label`, item.label);
    }
    if (!isString(item.type) || !['leaf', 'folder'].includes(item.type)) {
        throw new ValidationError(
            'child.type must be "leaf" or "folder"',
            `${path}.type`,
            item.type
        );
    }
    
    const result: NavigationChild = {
        id: item.id,
        key: item.key,
        label: item.label,
        type: item.type as 'leaf' | 'folder',
    };
    
    // leaf 타입: path 필수
    if (item.type === 'leaf') {
        if (!isString(item.path)) {
            throw new ValidationError(
                'child.path is required for leaf type',
                `${path}.path`,
                item.path
            );
        }
        result.path = item.path;
    }
    
    // folder 타입: children 필수
    if (item.type === 'folder') {
        if (!isArray(item.children)) {
            throw new ValidationError(
                'child.children is required for folder type',
                `${path}.children`,
                item.children
            );
        }
        result.children = item.children.map((child, idx) =>
            validateNavigationGrandChild(child, `${path}.children[${idx}]`)
        );
    }
    
    // 선택적 필드
    if (item.order !== undefined) {
        if (!isNumber(item.order)) {
            throw new ValidationError('child.order must be a number', `${path}.order`, item.order);
        }
        result.order = item.order;
    }
    
    if (item.metadata !== undefined) {
        if (!isObject(item.metadata)) {
            throw new ValidationError(
                'child.metadata must be an object',
                `${path}.metadata`,
                item.metadata
            );
        }
        result.metadata = item.metadata as NavigationMetadata;
    }
    
    return result;
}

/**
 * NavigationItem 검증 (1-depth)
 */
function validateNavigationItem(item: unknown, path: string): NavigationItem {
    if (!isObject(item)) {
        throw new ValidationError('item must be an object', path, item);
    }
    
    // 필수 필드
    if (!isString(item.id)) {
        throw new ValidationError('item.id must be a string', `${path}.id`, item.id);
    }
    if (!isString(item.key)) {
        throw new ValidationError('item.key must be a string', `${path}.key`, item.key);
    }
    if (!isString(item.label)) {
        throw new ValidationError('item.label must be a string', `${path}.label`, item.label);
    }
    if (!isString(item.icon)) {
        throw new ValidationError('item.icon must be a string', `${path}.icon`, item.icon);
    }
    if (!isString(item.type) || !['leaf', 'folder'].includes(item.type)) {
        throw new ValidationError(
            'item.type must be "leaf" or "folder"',
            `${path}.type`,
            item.type
        );
    }
    
    const result: NavigationItem = {
        id: item.id,
        key: item.key,
        label: item.label,
        icon: item.icon,
        type: item.type as 'leaf' | 'folder',
    };
    
    // leaf 타입: path 필수
    if (item.type === 'leaf') {
        if (!isString(item.path)) {
            throw new ValidationError(
                'item.path is required for leaf type',
                `${path}.path`,
                item.path
            );
        }
        result.path = item.path;
    }
    
    // folder 타입: children 필수
    if (item.type === 'folder') {
        if (!isArray(item.children)) {
            throw new ValidationError(
                'item.children is required for folder type',
                `${path}.children`,
                item.children
            );
        }
        result.children = item.children.map((child, idx) =>
            validateNavigationChild(child, `${path}.children[${idx}]`)
        );
    }
    
    // 선택적 필드
    if (item.showInSidebar !== undefined) {
        if (!isBoolean(item.showInSidebar)) {
            throw new ValidationError(
                'item.showInSidebar must be a boolean',
                `${path}.showInSidebar`,
                item.showInSidebar
            );
        }
        result.showInSidebar = item.showInSidebar;
    }
    
    if (item.order !== undefined) {
        if (!isNumber(item.order)) {
            throw new ValidationError('item.order must be a number', `${path}.order`, item.order);
        }
        result.order = item.order;
    }
    
    if (item.actions !== undefined) {
        if (!isArray(item.actions)) {
            throw new ValidationError(
                'item.actions must be an array',
                `${path}.actions`,
                item.actions
            );
        }
        result.actions = item.actions.map((action, idx) =>
            validateActionButton(action, `${path}.actions[${idx}]`)
        );
    }
    
    if (item.metadata !== undefined) {
        if (!isObject(item.metadata)) {
            throw new ValidationError(
                'item.metadata must be an object',
                `${path}.metadata`,
                item.metadata
            );
        }
        result.metadata = item.metadata as NavigationMetadata;
    }
    
    return result;
}

/**
 * NavigationSchema 검증
 */
export function validateNavigationSchema(data: unknown): NavigationSchema {
    if (!isObject(data)) {
        throw new ValidationError('schema must be an object', 'root', data);
    }
    
    // version 검증
    const version = validateVersion(data.version, 'version');
    
    // navigation 배열 검증
    if (!isArray(data.navigation)) {
        throw new ValidationError(
            'navigation must be an array',
            'navigation',
            data.navigation
        );
    }
    
    const navigation = data.navigation.map((item, idx) =>
        validateNavigationItem(item, `navigation[${idx}]`)
    );
    
    const result: NavigationSchema = {
        version,
        navigation,
    };
    
    // 선택적 필드
    if (data.lastSync !== undefined) {
        result.lastSync = validateISODate(data.lastSync, 'lastSync');
    }
    
    if (data.figmaFileKey !== undefined) {
        if (!isString(data.figmaFileKey)) {
            throw new ValidationError(
                'figmaFileKey must be a string',
                'figmaFileKey',
                data.figmaFileKey
            );
        }
        result.figmaFileKey = data.figmaFileKey;
    }
    
    return result;
}

// =========================================================================
// 변환 유틸리티
// =========================================================================

/**
 * order 필드 기준으로 정렬
 */
export function sortNavigationItems<T extends { order?: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
    });
}

/**
 * showInSidebar가 true인 아이템만 필터링
 */
export function filterVisibleItems(schema: NavigationSchema): NavigationSchema {
    return {
        ...schema,
        navigation: schema.navigation
            .filter((item) => item.showInSidebar !== false)
            .map((item) => {
                if (item.type === 'folder' && item.children) {
                    return {
                        ...item,
                        children: item.children.map((child) => {
                            if (child.type === 'folder' && child.children) {
                                return {
                                    ...child,
                                    children: child.children,
                                };
                            }
                            return child;
                        }),
                    };
                }
                return item;
            }),
    };
}

/**
 * key로 특정 네비게이션 아이템 찾기
 */
export function findNavigationItemByKey(
    schema: NavigationSchema,
    key: string
): NavigationItem | NavigationChild | NavigationGrandChild | null {
    for (const item of schema.navigation) {
        if (item.key === key) return item;
        
        if (item.children) {
            for (const child of item.children) {
                if (child.key === key) return child;
                
                if (child.children) {
                    for (const grandChild of child.children) {
                        if (grandChild.key === key) return grandChild;
                    }
                }
            }
        }
    }
    
    return null;
}

/**
 * path로 특정 네비게이션 아이템 찾기
 */
export function findNavigationItemByPath(
    schema: NavigationSchema,
    path: string
): NavigationItem | NavigationChild | NavigationGrandChild | null {
    for (const item of schema.navigation) {
        if (item.path === path) return item;
        
        if (item.children) {
            for (const child of item.children) {
                if (child.path === path) return child;
                
                if (child.children) {
                    for (const grandChild of child.children) {
                        if (grandChild.path === path) return grandChild;
                    }
                }
            }
        }
    }
    
    return null;
}

