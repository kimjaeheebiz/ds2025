/**
 * Figma Tokens Studio 토큰 타입 정의
 *
 * Figma Variables → Tokens Studio → JSON 파일 구조를 TypeScript 타입으로 정의
 */

// JSON 기본 타입
export type Json = Record<string, unknown>; // Figma 토큰 파일 전체 구조 (읽기 전용)
export type JsonRecord = Record<string, unknown>; // 동적 객체 타입 변환용 (읽기/쓰기 가능)

/**
 * Figma Token 기본 구조
 * @example
 * {
 *   "$value": "#FF0000",
 *   "$type": "color",
 *   "$description": "Primary brand color"
 * }
 */
export interface TokenValue<T = unknown> {
    $value: T;
    $type?: string;
    $description?: string;
}

/**
 * 색상 토큰
 */
export interface ColorToken extends TokenValue<string> {
    $value: string;
}

// ============================================
// 타입 가드
// ============================================

/**
 * TokenValue 타입 가드
 */
export function isTokenValue(value: unknown): value is TokenValue {
    return value !== null && typeof value === 'object' && '$value' in value;
}

/**
 * 객체 속성 존재 여부 확인 타입 가드
 */
export function hasProperty<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
    return obj !== null && typeof obj === 'object' && key in obj;
}

/**
 * unknown 타입을 JsonRecord로 변환
 */
export function asJsonRecord(obj: unknown): JsonRecord {
    return obj as JsonRecord;
}
