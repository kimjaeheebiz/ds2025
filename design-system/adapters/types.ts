/**
 * Figma Tokens Studio 어댑터 타입 정의
 */

// JSON 기본 타입
export type Json = Record<string, unknown>;  // Figma 토큰 파일 전체 구조 (읽기 전용)
export type JsonRecord = Record<string, unknown>;  // 동적 객체 타입 변환용 (읽기/쓰기 가능 - 헬퍼 함수)

// Figma Token 구조 타입
export interface TokenValue<T = unknown> {
    $value: T;
    $type?: string;
    $description?: string;
}

// 색상 관련 타입
export interface ColorToken extends TokenValue<string> {
    $value: string;
}

export interface PaletteColorGroup {
    light?: ColorToken;
    main?: ColorToken;
    dark?: ColorToken;
    contrastText?: ColorToken;
}

export interface TextColorGroup {
    primary?: ColorToken;
    secondary?: ColorToken;
    disabled?: ColorToken;
}

export interface BackgroundColorGroup {
    default?: ColorToken;
    'paper-elevation-0'?: ColorToken;
}

export interface ActionColorGroup {
    active?: ColorToken;
    hover?: ColorToken;
    selected?: ColorToken;
    disabled?: ColorToken;
    disabledBackground?: ColorToken;
    focus?: ColorToken;
}

export interface CommonColorGroup {
    white_states?: { main?: ColorToken };
    black_states?: { main?: ColorToken };
}

// 타입 가드
export function isTokenValue(value: unknown): value is TokenValue {
    return (
        value !== null &&
        typeof value === 'object' &&
        '$value' in value
    );
}

export function hasProperty<K extends string>(
    obj: unknown,
    key: K
): obj is Record<K, unknown> {
    return obj !== null && typeof obj === 'object' && key in obj;
}

export function asJsonRecord(obj: unknown): JsonRecord {
    return obj as JsonRecord;
}

