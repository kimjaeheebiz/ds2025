/**
 * MUI Palette 타입 정의
 *
 * Material-UI 테마의 palette 구조를 위한 타입
 * @see https://mui.com/material-ui/customization/palette/
 */

import { ColorToken } from './tokens';

/**
 * MUI 색상 그룹 (primary, secondary, error 등)
 */
export interface PaletteColorGroup {
    light?: ColorToken;
    main?: ColorToken;
    dark?: ColorToken;
    contrastText?: ColorToken;
}

/**
 * 텍스트 색상 그룹
 */
export interface TextColorGroup {
    primary?: ColorToken;
    secondary?: ColorToken;
    disabled?: ColorToken;
}

/**
 * 배경 색상 그룹
 */
export interface BackgroundColorGroup {
    default?: ColorToken;
    'paper-elevation-0'?: ColorToken;
}

/**
 * 액션 색상 그룹 (hover, active, selected 등)
 */
export interface ActionColorGroup {
    active?: ColorToken;
    hover?: ColorToken;
    selected?: ColorToken;
    disabled?: ColorToken;
    disabledBackground?: ColorToken;
    focus?: ColorToken;
}

/**
 * 공통 색상 그룹 (white, black)
 */
export interface CommonColorGroup {
    white_states?: { main?: ColorToken };
    black_states?: { main?: ColorToken };
}
