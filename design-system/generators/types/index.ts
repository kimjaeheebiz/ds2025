/**
 * 디자인 시스템 어댑터 타입 통합 export
 *
 * 구조:
 * - tokens.ts: Figma 토큰 기본 타입 + 타입 가드
 * - palette.ts: MUI 팔레트 타입
 * - brand.ts: 브랜드 토큰 타입
 */

// Figma 토큰 타입
export type { Json, JsonRecord, TokenValue, ColorToken } from './tokens';
export { isTokenValue, hasProperty, asJsonRecord } from './tokens';

// MUI 팔레트 타입
export type {
    PaletteColorGroup,
    TextColorGroup,
    BackgroundColorGroup,
    ActionColorGroup,
    CommonColorGroup,
} from './palette';

// 브랜드 토큰 타입
export type { BrandColorGroup, BrandSizeGroup, BrandTokens } from './brand';
