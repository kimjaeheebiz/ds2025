/**
 * 레이아웃 관련 정의
 */

// PC 전용 최소 사이즈
export const MIN_WIDTH = 1000;

// 헤더 높이
export const HEADER_HEIGHT = 64;

// 사이드바 너비
export const SIDEBAR_WIDTH = 300;
export const SIDEBAR_MINI_WIDTH = 64;

// Z-Index 레벨
export const Z_INDEX = {
    HEADER: 1300,
    SIDEBAR: 1200,
    MODAL: 1400,
    TOOLTIP: 1500,
} as const;
