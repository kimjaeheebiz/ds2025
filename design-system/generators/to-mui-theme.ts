/*
  Adapter: Tokens Studio → MUI ThemeOptions (px → rem 변환 포함)
  실행: tsx design-system/generators/to-mui-theme.ts
  - design-system/tokens/generated/* 를 읽어 src/theme/generated/theme.(light|dark).json 생성

  아키텍처:
  1. Core 선반영 (core.json 기반) - 디자인 핵심 UI
     - typography: core.typography.* (h1~h6, body1, body2, subtitle, caption, overline, button)
     - spacing: spacing/Mode 1.json
     - breakpoints: breakpoints/Mode 1.json
     - shape: shape/Mode 1.json
     - shadows: core.elevation (elevation 1~24 → MUI shadows)
     - components: core.button/chip/tooltip/badge/alert/input → MUI components

  2. Palette 오버레이 (Light/Dark) - 컬러 테마
     - palette/Light.json → theme.light.json
     - palette/Dark.json → theme.dark.json

  참조:
  - https://mui.com/material-ui/customization/theming/
  - https://mui.com/material-ui/customization/default-theme/
  - https://mui.com/material-ui/customization/typography/
  - https://mui.com/material-ui/customization/theme-components/
*/

import fs from 'fs';
import path from 'path';
import * as MuiColors from '@mui/material/colors';
import {
    Json,
    JsonRecord,
    PaletteColorGroup,
    TextColorGroup,
    BackgroundColorGroup,
    ActionColorGroup,
    CommonColorGroup,
    isTokenValue,
    hasProperty,
    asJsonRecord,
} from './types';

const REPO_ROOT = process.cwd();
const TOKENS_ROOT = path.join(REPO_ROOT, 'design-system', 'tokens', 'generated');
const OUTPUT_ROOT = path.join(REPO_ROOT, 'src', 'theme', 'generated');

const PX_BASE = 16; // px → rem 기준

function pxToRem(pxNumberOrString: number | string): string {
    const num = typeof pxNumberOrString === 'string' ? parseFloat(pxNumberOrString) : pxNumberOrString;
    if (!isFinite(num)) return '1rem';
    return `${num / PX_BASE}rem`;
}

function readJson(p: string): Json {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function safeGet(obj: Record<string, unknown>, pathKeys: string[], fallback?: unknown): unknown {
    return (
        pathKeys.reduce((acc: unknown, k: string) => {
            if (acc && typeof acc === 'object' && acc !== null && k in acc) {
                return (acc as Record<string, unknown>)[k];
            }
            return undefined;
        }, obj as unknown) ?? fallback
    );
}

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseFontList(input: string | string[] | undefined): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
    const raw = String(input).trim();
    if (!raw) return [];
    if (raw.includes(','))
        return raw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    return [raw];
}

/**
 * Figma Tokens Studio $value 추출 헬퍼 함수
 * 중첩된 토큰 객체에서 재귀적으로 $value를 추출하고 메타데이터($type, $description 등)는 제외
 */
function extractTokenValues(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

    // $value가 있으면 반환
    if ('$value' in obj && obj.$value !== undefined) return obj.$value;

    // 중첩된 객체 재귀 처리
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue; // $type 등 메타데이터 제외
        result[key] = extractTokenValues(value);
    }
    return result;
}

function normalizeRem(size: string | number): string {
    if (typeof size === 'number') return pxToRem(size);
    const s = String(size).trim().replace(',', '.');
    if (s.endsWith('rem')) {
        const n = parseFloat(s);
        return isFinite(n) ? `${n}rem` : '1rem';
    }
    if (s.endsWith('px')) {
        const n = parseFloat(s);
        return isFinite(n) ? pxToRem(n) : '1rem';
    }
    const n = parseFloat(s);
    return isFinite(n) ? pxToRem(n) : '1rem';
}

/**
 * 토큰 참조 문자열 "{a.b.c}" → 실제 값으로 해석
 * core.json, typography.json 등 여러 소스에서 우선순위로 조회
 */
function resolveTokenRef(raw: unknown, ...tokenSources: Json[]): unknown {
    if (typeof raw !== 'string') return raw;
    const m = raw.match(/^\{(.+)\}$/);
    if (!m) return raw;

    const keys = m[1].split('.');
    const getValue = (obj: Record<string, unknown>) => {
        const result = keys.reduce((acc: unknown, k: string) => {
            if (acc && typeof acc === 'object' && acc !== null && k in acc) {
                return (acc as Record<string, unknown>)[k];
            }
            return undefined;
        }, obj as unknown);
        return result && typeof result === 'object' && '$value' in result
            ? (result as { $value: unknown }).$value
            : result;
    };

    // 우선순위: 첫 번째 소스부터 순차 조회
    for (const source of tokenSources) {
        const val = getValue(source);
        if (val !== undefined) return val;
    }
    return raw;
}

/**
 * lineHeight 값을 MUI 형식으로 정규화
 * "150%" → 1.5, "24" → 1.5(기본값), 숫자 → 그대로
 */
function normalizeLineHeight(value: unknown): number {
    if (typeof value === 'number') return value;
    const s = String(value).trim();
    if (s.endsWith('%')) {
        const n = parseFloat(s);
        return isFinite(n) ? n / 100 : 1.5;
    }
    const n = parseFloat(s);
    return isFinite(n) && n > 0 && n < 10 ? n : 1.5; // 배수로 추정
}

/**
 * letterSpacing 값을 숫자로 정규화 (px/em 단위 무시, 순수 숫자만)
 */
function normalizeLetterSpacing(value: unknown): number | undefined {
    if (value === undefined || value === null) return undefined;
    const n = parseFloat(String(value));
    return isFinite(n) ? n : undefined;
}

// Material colors에서 HEX 값 추출
function getMaterialColorHex(name: string, shade: string): string | undefined {
    try {
        const materialPath = path.join(TOKENS_ROOT, 'material', 'colors', 'Mode 1.json');
        const materialData = readJson(materialPath);
        const colorValue = materialData?.[name]?.[shade]?.$value;
        return typeof colorValue === 'string' ? colorValue : undefined;
    } catch (error) {
        console.error(`Failed to get material color ${name}.${shade}:`, error);
        return undefined;
    }
}

function createFontWeightParser(tokensTypos: Json) {
    const getNumMulti = (...paths: string[][]): number | undefined => {
        for (const p of paths) {
            const raw = safeGet(tokensTypos, [...p, '$value']);
            const n = typeof raw === 'string' ? parseInt(raw, 10) : typeof raw === 'number' ? raw : undefined;
            if (n !== undefined && isFinite(n)) return n;
        }
        return undefined;
    };
    const dict: Record<string, number> = {
        thin: getNumMulti(['fontWeightThin'], ['fontWeight', 'thin']) ?? 100,
        extralight: getNumMulti(['fontWeightExtraLight'], ['fontWeight', 'extraLight']) ?? 200,
        light: getNumMulti(['fontWeightLight'], ['fontWeight', 'light']) ?? 300,
        regular: getNumMulti(['fontWeightRegular'], ['fontWeight', 'regular']) ?? 400,
        normal: getNumMulti(['fontWeightRegular'], ['fontWeight', 'normal']) ?? 400,
        medium: getNumMulti(['fontWeightMedium'], ['fontWeight', 'medium']) ?? 500,
        semibold: getNumMulti(['fontWeightSemiBold'], ['fontWeight', 'semiBold']) ?? 600,
        demibold: getNumMulti(['fontWeightSemiBold'], ['fontWeight', 'demiBold']) ?? 600,
        bold: getNumMulti(['fontWeightBold'], ['fontWeight', 'bold']) ?? 700,
        extrabold: getNumMulti(['fontWeightExtraBold'], ['fontWeight', 'extraBold']) ?? 800,
        heavy: getNumMulti(['fontWeightExtraBold'], ['fontWeight', 'heavy']) ?? 800,
        black: getNumMulti(['fontWeightBlack'], ['fontWeight', 'black']) ?? 900,
    };

    return (token: string | number): number => {
        if (typeof token === 'number') return token;
        const t = String(token).trim();
        if (/^\d+$/.test(t)) return parseInt(t, 10);
        const norm = t.toLowerCase().replace(/[^a-z]/g, '');
        if (dict[norm] !== undefined) return dict[norm];
        // 최후 보정: 포함 관계 우선순위
        if (norm.includes('semibold') || norm.includes('demibold')) return dict.semibold;
        if (norm.includes('extrabold') || norm.includes('heavy')) return dict.extrabold;
        if (norm.includes('bold')) return dict.bold;
        if (norm.includes('black')) return dict.black;
        if (norm.includes('medium')) return dict.medium;
        if (norm.includes('regular') || norm.includes('normal')) return dict.regular;
        if (norm.includes('extralight')) return dict.extralight;
        if (norm.includes('light')) return dict.light;
        if (norm.includes('thin')) return dict.thin;
        return 400;
    };
}

/**
 * core.typography.* 에서 단일 variant 읽기 (MUI 공식 구조 준수)
 * 참조: https://mui.com/material-ui/customization/typography/
 */
function readTypographyVariant(
    variantKey: string,
    tokensCore: Json,
    tokensTypos: Json,
): Record<string, unknown> | undefined {
    const variant = tokensCore?.typography?.[variantKey];
    if (!variant?.$value) return undefined;

    const v = variant.$value;
    const parseWeight = createFontWeightParser(tokensTypos);

    // fontSize: {_fontSize.6rem} → typography._fontSize → 숫자 → rem 변환
    const fontSizeRaw = resolveTokenRef(v.fontSize, tokensCore, tokensTypos);
    const fontSize = normalizeRem(fontSizeRaw as string | number);

    // lineHeight: {lineHeights.0} → "120%" → 1.2
    const lineHeightRaw = resolveTokenRef(v.lineHeight, tokensCore, tokensTypos);
    const lineHeight = normalizeLineHeight(lineHeightRaw as string | number);

    // fontWeight: {fontWeights.pretendard-variable-0} → "Regular" → 400
    const fontWeightRaw = resolveTokenRef(v.fontWeight, tokensCore, tokensTypos);
    const fontWeight = parseWeight(fontWeightRaw as string | number);

    // letterSpacing: {letterSpacing.0} → "0" → 0
    const letterSpacingRaw = resolveTokenRef(v.letterSpacing, tokensCore, tokensTypos);
    const letterSpacing = normalizeLetterSpacing(letterSpacingRaw);

    // textCase: {textCase.uppercase} → "uppercase" → textTransform
    const textCaseRaw = resolveTokenRef(v.textCase, tokensCore, tokensTypos);
    const textTransform = String(textCaseRaw).toLowerCase() === 'uppercase' ? 'uppercase' : undefined;

    const result: Record<string, unknown> = { fontSize, lineHeight, fontWeight };
    if (letterSpacing !== undefined && letterSpacing !== 0) result.letterSpacing = letterSpacing;
    if (textTransform) result.textTransform = textTransform;

    return result;
}

/**
 * Typography 전체 빌드: core.typography.* 우선, 없으면 기본값
 * 참조: https://mui.com/material-ui/customization/typography/
 */
function buildTypography(tokensCore: Json, tokensTypos: Json) {
    // fontFamily: tokens/src/fonts.json 우선, 없으면 tokensTypos.fontFamily.primary
    const tokenPrimaryCandidate = safeGet(tokensTypos, ['fontFamily', 'primary', '$value']) || undefined;
    let fontFamilyPrimary: string | string[] | undefined = undefined;
    let fallback: string | string[] | undefined = undefined;

    try {
        const fontsCfg = readJson(path.join(TOKENS_ROOT, '..', 'src', 'fonts.json'));
        const cfgPrimary = safeGet(fontsCfg, ['fontFamily', 'primary']);
        if (cfgPrimary !== undefined && cfgPrimary !== null) fontFamilyPrimary = cfgPrimary as string | string[];
        const cfgFallback = safeGet(fontsCfg, ['fontFamily', 'primaryFallback']);
        if (cfgFallback !== undefined && cfgFallback !== null) fallback = cfgFallback as string | string[];
    } catch {
        // 폰트 설정 로드 실패 시 기본값 사용
    }

    const primarySource = fontFamilyPrimary ?? tokenPrimaryCandidate;
    const primaryList = parseFontList(primarySource as string | string[]);
    const fallbackList = parseFontList(
        Array.isArray(fallback) ? fallback.join(', ') : fallback ? String(fallback) : undefined,
    );
    const combinedList = [...primaryList, ...fallbackList];
    const fontFamilyCombined = combinedList.length > 0 ? combinedList.join(', ') : undefined;

    // MUI Typography variants: h1~h6, body1, body2, subtitle1, subtitle2, caption, overline, button
    // https://mui.com/material-ui/customization/default-theme/#typography
    const variants = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body1',
        'body2',
        'subtitle1',
        'subtitle2',
        'caption',
        'overline',
        'button',
    ];
    const typography: Record<string, unknown> = fontFamilyCombined ? { fontFamily: fontFamilyCombined } : {};

    for (const key of variants) {
        const variant = readTypographyVariant(key, tokensCore, tokensTypos);
        if (variant) {
            typography[key] = variant;
        }
    }

    return typography;
}

// 브랜드 색상에서 HEX 값 추출 (새로운 colors 구조만 지원)
function getBrandColorHex(colorName: string, shade: string, groupName?: string): string | undefined {
    try {
        const brandPath = path.join(TOKENS_ROOT, 'brand', 'Mode 1.json');
        const brandData = readJson(brandPath);

        // 새로운 구조: colors 하위에서 검색
        if (hasProperty(brandData, 'colors') && groupName) {
            const colors = asJsonRecord(brandData.colors);
            if (hasProperty(colors, groupName)) {
                const colorGroup = asJsonRecord(colors[groupName]);
                if (hasProperty(colorGroup, colorName)) {
                    const color = asJsonRecord(colorGroup[colorName]);
                    if (hasProperty(color, shade)) {
                        const shadeValue = color[shade];
                        if (isTokenValue(shadeValue) && typeof shadeValue.$value === 'string') {
                            return shadeValue.$value;
                        }
                    }
                }
            }
        }

        // 그룹명이 없으면 모든 색상 그룹에서 검색
        if (!groupName && hasProperty(brandData, 'colors')) {
            const colors = asJsonRecord(brandData.colors);
            for (const colorGroup of Object.values(colors)) {
                if (hasProperty(colorGroup, colorName)) {
                    const color = asJsonRecord(asJsonRecord(colorGroup)[colorName]);
                    if (hasProperty(color, shade)) {
                        const shadeValue = color[shade];
                        if (isTokenValue(shadeValue) && typeof shadeValue.$value === 'string') {
                            return shadeValue.$value;
                        }
                    }
                }
            }
        }

        return undefined;
    } catch (error) {
        console.error(`Failed to get brand color ${groupName}.${colorName}.${shade}:`, error);
        return undefined;
    }
}

// 참조(예: {blue.700}) → MUI colors 해석
function resolveColorRef(value: unknown) {
    if (typeof value !== 'string') return value;

    // 1) 기본 형식: {blue.700} / {lightBlue.A400}
    const m = value.match(/^\{([a-zA-Z]+)\.(A?\d+)\}$/);
    if (m) {
        const [, name, shade] = m as [string, string, string];
        const palette = (MuiColors as Record<string, unknown>)[name] as Record<string, string> | undefined;
        if (palette && palette[shade]) return palette[shade];
        const mc = getMaterialColorHex(name, shade);
        if (mc) return mc;
        return value;
    }

    // 2) 새로운 브랜드 색상 패턴: {colors.brandColorGroup.colorName.shade}
    const newBrandColor = value.match(/^\{colors\.([a-zA-Z][\w-]*)\.([a-zA-Z][\w-]*)\.(A?\d+)\}$/);
    if (newBrandColor) {
        const [, groupName, colorName, shade] = newBrandColor as [string, string, string, string];
        const brandHex = getBrandColorHex(colorName, shade, groupName);
        if (brandHex) return brandHex;
        return value;
    }

    // 3) 기존 브랜드 색상 패턴: {brandColorGroup.colorName.shade}
    const brandColor = value.match(/^\{([a-zA-Z][\w-]*)\.([a-zA-Z][\w-]*)\.(A?\d+)\}$/);
    if (brandColor) {
        const [, groupName, colorName, shade] = brandColor as [string, string, string, string];
        const brandHex = getBrandColorHex(colorName, shade, groupName);
        if (brandHex) return brandHex;
        return value;
    }

    return value;
}

// 헬퍼: 색상 그룹에서 값 추출
function extractPaletteColor(
    group: unknown,
): { light?: unknown; main?: unknown; dark?: unknown; contrastText?: unknown } | undefined {
    if (!hasProperty(group, 'main')) return undefined;

    const colorGroup = group as PaletteColorGroup;
    return {
        light: colorGroup.light?.$value ? resolveColorRef(colorGroup.light.$value) : undefined,
        main: colorGroup.main?.$value ? resolveColorRef(colorGroup.main.$value) : undefined,
        dark: colorGroup.dark?.$value ? resolveColorRef(colorGroup.dark.$value) : undefined,
        contrastText: colorGroup.contrastText?.$value,
    };
}

function buildPalette(mode: 'light' | 'dark') {
    const file = path.join(TOKENS_ROOT, 'palette', mode === 'dark' ? 'Dark.json' : 'Light.json');
    const p = readJson(file);

    // Brand 토큰은 coreTheme에서 처리하므로 palette에서는 제외
    const primary = hasProperty(p, 'primary') ? extractPaletteColor(p.primary) : undefined;
    const secondary = hasProperty(p, 'secondary') ? extractPaletteColor(p.secondary) : undefined;
    const error = hasProperty(p, 'error') ? extractPaletteColor(p.error) : undefined;
    const warning = hasProperty(p, 'warning') ? extractPaletteColor(p.warning) : undefined;
    const info = hasProperty(p, 'info') ? extractPaletteColor(p.info) : undefined;
    const success = hasProperty(p, 'success') ? extractPaletteColor(p.success) : undefined;

    const text = hasProperty(p, 'text')
        ? (() => {
              const textGroup = p.text as TextColorGroup;
              return {
                  primary: textGroup.primary?.$value ? resolveColorRef(textGroup.primary.$value) : undefined,
                  secondary: textGroup.secondary?.$value ? resolveColorRef(textGroup.secondary.$value) : undefined,
                  disabled: textGroup.disabled?.$value ? resolveColorRef(textGroup.disabled.$value) : undefined,
              };
          })()
        : undefined;

    const background = hasProperty(p, 'background')
        ? (() => {
              const bgGroup = p.background as BackgroundColorGroup;
              const defaultBg = bgGroup.default?.$value ? resolveColorRef(bgGroup.default.$value) : undefined;
              const paperBg = bgGroup['paper-elevation-0']?.$value
                  ? resolveColorRef(bgGroup['paper-elevation-0'].$value)
                  : defaultBg;
              return {
                  default: defaultBg,
                  paper: paperBg,
              };
          })()
        : undefined;

    const action = hasProperty(p, 'action')
        ? (() => {
              const actionGroup = p.action as ActionColorGroup;
              return {
                  active: actionGroup.active?.$value ? resolveColorRef(actionGroup.active.$value) : undefined,
                  hover: actionGroup.hover?.$value ? resolveColorRef(actionGroup.hover.$value) : undefined,
                  selected: actionGroup.selected?.$value ? resolveColorRef(actionGroup.selected.$value) : undefined,
                  disabled: actionGroup.disabled?.$value ? resolveColorRef(actionGroup.disabled.$value) : undefined,
                  disabledBackground: actionGroup.disabledBackground?.$value
                      ? resolveColorRef(actionGroup.disabledBackground.$value)
                      : undefined,
                  focus: actionGroup.focus?.$value ? resolveColorRef(actionGroup.focus.$value) : undefined,
              };
          })()
        : undefined;

    const common = hasProperty(p, 'common')
        ? (() => {
              const commonGroup = p.common as CommonColorGroup;
              return {
                  white: commonGroup.white_states?.main?.$value
                      ? resolveColorRef(commonGroup.white_states.main.$value)
                      : undefined,
                  black: commonGroup.black_states?.main?.$value
                      ? resolveColorRef(commonGroup.black_states.main.$value)
                      : undefined,
              };
          })()
        : undefined;

    const divider =
        hasProperty(p, 'divider') && isTokenValue(p.divider) ? resolveColorRef(p.divider.$value) : undefined;

    return {
        mode,
        ...(primary ? { primary } : {}),
        ...(secondary ? { secondary } : {}),
        ...(error ? { error } : {}),
        ...(warning ? { warning } : {}),
        ...(info ? { info } : {}),
        ...(success ? { success } : {}),
        ...(text ? { text } : {}),
        ...(background ? { background } : {}),
        ...(action ? { action } : {}),
        ...(common ? { common } : {}),
        ...(divider ? { divider } : {}),
    };
}

/**
 * core.json 컴포넌트 토큰 → MUI theme.components 매핑
 * 참조: https://mui.com/material-ui/customization/theme-components/
 *
 * core.button.*, chip.*, tooltip.*, alert.*, input.* 등을 MUI 컴포넌트 스타일로 변환
 */
function buildComponentsOverrides(tokensCore: Json, tokensTypos: Json): JsonRecord {
    const components: JsonRecord = {};
    const parseWeight = createFontWeightParser(tokensTypos);

    // Helper: 타이포 토큰 → 스타일 객체
    const parseTypoToken = (tokenValue: unknown): JsonRecord => {
        if (!tokenValue || typeof tokenValue !== 'object') return {};
        const token = asJsonRecord(tokenValue);

        const fontSize = normalizeRem(resolveTokenRef(token.fontSize, tokensCore, tokensTypos) as string | number);
        const lineHeight = normalizeLineHeight(
            resolveTokenRef(token.lineHeight, tokensCore, tokensTypos) as string | number,
        );
        const fontWeight = parseWeight(resolveTokenRef(token.fontWeight, tokensCore, tokensTypos) as string | number);
        const letterSpacing = normalizeLetterSpacing(resolveTokenRef(token.letterSpacing, tokensCore, tokensTypos));
        const textCaseRaw = resolveTokenRef(token.textCase, tokensCore, tokensTypos);
        const textTransform = String(textCaseRaw).toLowerCase() === 'uppercase' ? 'uppercase' : undefined;

        const result: JsonRecord = { fontSize, lineHeight, fontWeight };
        if (letterSpacing !== undefined && letterSpacing !== 0) result.letterSpacing = letterSpacing;
        if (textTransform) result.textTransform = textTransform;
        return result;
    };

    // MuiButton: core.button.large/medium/small
    if (tokensCore?.button) {
        const btn = asJsonRecord(tokensCore.button);
        const variants: Array<{ props: JsonRecord; style: JsonRecord }> = [];
        if (btn.large && typeof btn.large === 'object' && btn.large !== null && '$value' in btn.large) {
            variants.push({ props: { size: 'large' }, style: parseTypoToken(asJsonRecord(btn.large).$value) });
        }
        if (btn.medium && typeof btn.medium === 'object' && btn.medium !== null && '$value' in btn.medium) {
            variants.push({ props: { size: 'medium' }, style: parseTypoToken(asJsonRecord(btn.medium).$value) });
        }
        if (btn.small && typeof btn.small === 'object' && btn.small !== null && '$value' in btn.small) {
            variants.push({ props: { size: 'small' }, style: parseTypoToken(asJsonRecord(btn.small).$value) });
        }
        if (variants.length > 0) {
            components.MuiButton = { variants };
        }
    }

    // MuiChip: core.chip.label
    if (hasProperty(tokensCore, 'chip')) {
        const chip = asJsonRecord(tokensCore.chip);
        if (hasProperty(chip, 'label') && isTokenValue(chip.label)) {
            components.MuiChip = {
                styleOverrides: {
                    label: parseTypoToken(chip.label.$value),
                },
            };
        }
    }

    // MuiTooltip: core.tooltip.label
    if (hasProperty(tokensCore, 'tooltip')) {
        const tooltip = asJsonRecord(tokensCore.tooltip);
        if (hasProperty(tooltip, 'label') && isTokenValue(tooltip.label)) {
            components.MuiTooltip = {
                styleOverrides: {
                    tooltip: parseTypoToken(tooltip.label.$value),
                },
            };
        }
    }

    // MuiBadge: core.badge.label
    if (hasProperty(tokensCore, 'badge')) {
        const badge = asJsonRecord(tokensCore.badge);
        if (hasProperty(badge, 'label') && isTokenValue(badge.label)) {
            components.MuiBadge = {
                styleOverrides: {
                    badge: parseTypoToken(badge.label.$value),
                },
            };
        }
    }

    // MuiAlert: core.alert.title/description
    if (hasProperty(tokensCore, 'alert')) {
        const alert = asJsonRecord(tokensCore.alert);
        const styleOverrides: JsonRecord = {};
        if (hasProperty(alert, 'title') && isTokenValue(alert.title)) {
            styleOverrides.message = parseTypoToken(alert.title.$value);
        }
        if (Object.keys(styleOverrides).length > 0) {
            components.MuiAlert = { styleOverrides };
        }
    }

    // MuiTextField (Input): core.input.label/value/helper
    if (hasProperty(tokensCore, 'input')) {
        const input = asJsonRecord(tokensCore.input);
        const inputOverrides: JsonRecord = {};
        if (hasProperty(input, 'label') && isTokenValue(input.label)) {
            inputOverrides.label = parseTypoToken(input.label.$value);
        }
        if (hasProperty(input, 'value') && isTokenValue(input.value)) {
            inputOverrides.input = parseTypoToken(input.value.$value);
        }
        if (hasProperty(input, 'helper') && isTokenValue(input.helper)) {
            inputOverrides.helperText = parseTypoToken(input.helper.$value);
        }
        if (Object.keys(inputOverrides).length > 0) {
            components.MuiTextField = { styleOverrides: inputOverrides };
        }
    }

    return components;
}

/**
 * Brand 토큰 → custom theme 확장 (새로운 colors/sizes 구조 지원)
 * brand/Mode 1.json의 새로운 구조에 따라 theme.brand에 추가
 */
function buildBrandExtensions() {
    try {
        const brandPath = path.join(TOKENS_ROOT, 'brand', 'Mode 1.json');
        const brandData = readJson(brandPath);

        const brand: JsonRecord = {};

        // Colors 처리: colors 하위의 모든 색상 그룹 추출
        if (brandData.colors) {
            const colors: JsonRecord = {};
            for (const [colorGroupName, colorGroup] of Object.entries(brandData.colors)) {
                colors[colorGroupName] = extractTokenValues(colorGroup);
            }
            brand.colors = colors;
        }

        // Sizes 처리: sizes 하위의 모든 사이즈 그룹 추출 (문자열 → 숫자 변환)
        if (brandData.sizes) {
            const sizes: JsonRecord = {};
            for (const [sizeGroupName, sizeGroup] of Object.entries(brandData.sizes)) {
                const extractedSizes = extractTokenValues(sizeGroup) as Record<string, unknown>;
                const convertedSizes: Record<string, number> = {};

                for (const [sizeName, sizeValue] of Object.entries(extractedSizes)) {
                    // 문자열을 숫자로 변환
                    const numericValue = typeof sizeValue === 'string' ? parseFloat(sizeValue) : Number(sizeValue);
                    if (!isNaN(numericValue)) {
                        convertedSizes[sizeName] = numericValue;
                    }
                }

                sizes[sizeGroupName] = convertedSizes;
            }
            brand.sizes = sizes;
        }

        // Logo 처리: 하위 호환성을 위해 유지
        if (brandData.logo) {
            brand.logo = extractTokenValues(brandData.logo);
        }

        return { brand };
    } catch (error) {
        console.error('Failed to load brand tokens:', error);
        throw error;
    }
}

/**
 * Core 테마 옵션 빌드 (palette 제외)
 * core.json을 우선 반영 → spacing/breakpoints/shape/shadows/typography/components
 */
function buildCoreThemeOptions(tokensCore: Json, tokensTypos: Json) {
    const spacingTokensPath = path.join(TOKENS_ROOT, 'spacing', 'Mode 1.json');
    const breakpointsPath = path.join(TOKENS_ROOT, 'breakpoints', 'Mode 1.json');
    const shapePath = path.join(TOKENS_ROOT, 'shape', 'Mode 1.json');

    // Typography: core.typography.* 우선 (하드코딩 제거)
    const typography = buildTypography(tokensCore, tokensTypos);

    // spacing: spacing/Mode 1.json → ['1'].$value (기본 8)
    let spacing: number = 8;
    try {
        const sp = readJson(spacingTokensPath);
        const base = (sp['1'] as Record<string, unknown>)?.$value
            ? parseFloat((sp['1'] as Record<string, unknown>).$value as string)
            : undefined;
        spacing = base && isFinite(base) ? base : 8;
    } catch {
        // spacing 토큰 파일이 없으면 기본값(8) 사용
    }

    // breakpoints: breakpoints/Mode 1.json
    let breakpoints: { values: { xs: number; sm: number; md: number; lg: number; xl: number } } | undefined;
    try {
        const bp = readJson(breakpointsPath);
        breakpoints = {
            values: {
                xs: parseInt((bp.xs as Record<string, unknown>).$value as string, 10),
                sm: parseInt((bp.sm as Record<string, unknown>).$value as string, 10),
                md: parseInt((bp.md as Record<string, unknown>).$value as string, 10),
                lg: parseInt((bp.lg as Record<string, unknown>).$value as string, 10),
                xl: parseInt((bp.xl as Record<string, unknown>).$value as string, 10),
            },
        };
    } catch {
        // breakpoints 토큰 파일이 없으면 MUI 기본값 사용
    }

    // shape: shape/Mode 1.json → borderRadius
    let shape: { borderRadius: number } | undefined;
    try {
        const sh = readJson(shapePath);
        const r = (sh.borderRadius as Record<string, unknown>)?.$value;
        shape = r !== undefined ? { borderRadius: isNaN(Number(r)) ? 4 : Number(r) } : undefined;
    } catch {
        // shape 토큰 파일이 없으면 MUI 기본값 사용
    }

    // shadows: core.elevation → MUI shadows array
    const toCssShadow = (arr: unknown): string => {
        if (!Array.isArray(arr)) return 'none';
        const parts = arr.map((d: unknown) => {
            if (!d || typeof d !== 'object') return 'none';
            const shadow = d as Record<string, unknown>;
            const color = shadow.color;
            const x = `${shadow.x}px`;
            const y = `${shadow.y}px`;
            const blur = `${shadow.blur}px`;
            const spread = `${shadow.spread}px`;
            return `${x} ${y} ${blur} ${spread} ${color}`;
        });
        return parts.join(', ');
    };
    const shadows: string[] = ['none'];
    for (let i = 1; i <= 24; i++) {
        const e = tokensCore?.elevation?.[String(i)]?.$value;
        shadows[i] = toCssShadow(e);
    }

    // components: core.button/chip/tooltip/... → MUI components
    const components = buildComponentsOverrides(tokensCore, tokensTypos);

    // brand: brand/Mode 1.json → custom theme extensions
    const brandExtensions = buildBrandExtensions();

    return {
        typography,
        spacing,
        ...(breakpoints ? { breakpoints } : {}),
        ...(shape ? { shape } : {}),
        shadows,
        ...(Object.keys(components).length > 0 ? { components } : {}),
        ...brandExtensions,
    };
}

/**
 * 최종 테마 옵션 빌드: Core(core.json) + Palette(Light/Dark 오버레이)
 * 참조: https://mui.com/material-ui/customization/theming/
 */
function buildThemeOptions(mode: 'light' | 'dark') {
    const core = readJson(path.join(TOKENS_ROOT, 'core.json'));
    const typo = readJson(path.join(TOKENS_ROOT, 'typography', 'Mode 1.json'));

    // 1. Core 선반영 (core.json 기반)
    const coreTheme = buildCoreThemeOptions(core, typo);

    // 2. Palette 오버레이 (Light/Dark)
    const palette = buildPalette(mode);

    // 3. Core + Palette 병합
    const themeOptions = {
        ...core, // core.json (figma styles - raw tokens)
        ...coreTheme, // 처리된 MUI theme options (typography, brand, shadows, components 등)
        palette, // palette/Light.json, palette/Dark.json (figma colors)
    } as const;

    return themeOptions;
}

function writeTheme(mode: 'light' | 'dark') {
    const themeOptions = buildThemeOptions(mode);
    ensureDir(OUTPUT_ROOT);
    const outPath = path.join(OUTPUT_ROOT, `theme.${mode}.json`);
    fs.writeFileSync(outPath, JSON.stringify(themeOptions, null, 2), 'utf8');
}

// 실행 스크립트
writeTheme('light');
writeTheme('dark');

export { buildThemeOptions, pxToRem };
