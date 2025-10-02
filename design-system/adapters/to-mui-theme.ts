/*
  Adapter: Tokens Studio → MUI ThemeOptions (px → rem 변환 포함)
  실행: tsx design-system/adapters/to-mui-theme.ts
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

type Json = any;

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

function safeGet(obj: any, pathKeys: string[], fallback?: any) {
    return pathKeys.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj) ?? fallback;
}

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseFontList(input: string | string[] | undefined): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
    const raw = String(input).trim();
    if (!raw) return [];
    if (raw.includes(',')) return raw.split(',').map((s) => s.trim()).filter(Boolean);
    return [raw];
}

/**
 * Figma Tokens Studio $value 추출 헬퍼 함수
 * 중첩된 토큰 객체에서 재귀적으로 $value를 추출하고 메타데이터($type, $description 등)는 제외
 */
function extractTokenValues(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    // $value가 있으면 반환
    if (obj.$value !== undefined) return obj.$value;
    
    // 중첩된 객체 재귀 처리
    const result: Record<string, any> = {};
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
function resolveTokenRef(raw: any, ...tokenSources: Json[]): any {
    if (typeof raw !== 'string') return raw;
    const m = raw.match(/^\{(.+)\}$/);
    if (!m) return raw;
    
    const keys = m[1].split('.');
    const getValue = (obj: any) => {
        const result = keys.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
        return result?.$value !== undefined ? result.$value : result;
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
function normalizeLineHeight(value: any): number {
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
function normalizeLetterSpacing(value: any): number | undefined {
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
            const n = typeof raw === 'string' ? parseInt(raw, 10) : (typeof raw === 'number' ? raw : undefined);
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
    tokensTypos: Json
): Record<string, any> | undefined {
    const variant = tokensCore?.typography?.[variantKey];
    if (!variant?.$value) return undefined;

    const v = variant.$value;
    const parseWeight = createFontWeightParser(tokensTypos);

    // fontSize: {_fontSize.6rem} → typography._fontSize → 숫자 → rem 변환
    const fontSizeRaw = resolveTokenRef(v.fontSize, tokensCore, tokensTypos);
    const fontSize = normalizeRem(fontSizeRaw);

    // lineHeight: {lineHeights.0} → "120%" → 1.2
    const lineHeightRaw = resolveTokenRef(v.lineHeight, tokensCore, tokensTypos);
    const lineHeight = normalizeLineHeight(lineHeightRaw);

    // fontWeight: {fontWeights.pretendard-variable-0} → "Regular" → 400
    const fontWeightRaw = resolveTokenRef(v.fontWeight, tokensCore, tokensTypos);
    const fontWeight = parseWeight(fontWeightRaw);

    // letterSpacing: {letterSpacing.0} → "0" → 0
    const letterSpacingRaw = resolveTokenRef(v.letterSpacing, tokensCore, tokensTypos);
    const letterSpacing = normalizeLetterSpacing(letterSpacingRaw);

    // textCase: {textCase.uppercase} → "uppercase" → textTransform
    const textCaseRaw = resolveTokenRef(v.textCase, tokensCore, tokensTypos);
    const textTransform = String(textCaseRaw).toLowerCase() === 'uppercase' ? 'uppercase' : undefined;

    const result: Record<string, any> = { fontSize, lineHeight, fontWeight };
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
        if (cfgPrimary !== undefined) fontFamilyPrimary = cfgPrimary;
        const cfgFallback = safeGet(fontsCfg, ['fontFamily', 'primaryFallback']);
        if (cfgFallback !== undefined) fallback = cfgFallback;
    } catch {}

    const primarySource = fontFamilyPrimary ?? tokenPrimaryCandidate;
    const primaryList = parseFontList(primarySource as any);
    const fallbackList = parseFontList(Array.isArray(fallback) ? fallback.join(', ') : (fallback ? String(fallback) : undefined));
    const combinedList = [...primaryList, ...fallbackList];
    const fontFamilyCombined = combinedList.length > 0 ? combinedList.join(', ') : undefined;

    // MUI Typography variants: h1~h6, body1, body2, subtitle1, subtitle2, caption, overline, button
    // https://mui.com/material-ui/customization/default-theme/#typography
    const variants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'subtitle1', 'subtitle2', 'caption', 'overline', 'button'];
    const typography: Record<string, any> = fontFamilyCombined ? { fontFamily: fontFamilyCombined } : {};

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
        if (brandData.colors && groupName) {
            const colorValue = brandData.colors[groupName]?.[colorName]?.[shade]?.$value;
            if (typeof colorValue === 'string') {
                return colorValue;
            }
        }
        
        // 그룹명이 없으면 모든 색상 그룹에서 검색
        if (!groupName && brandData.colors) {
            for (const colorGroup of Object.values(brandData.colors)) {
                const colorValue = (colorGroup as any)?.[colorName]?.[shade]?.$value;
                if (typeof colorValue === 'string') {
                    return colorValue;
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
function resolveColorRef(value: any) {
    if (typeof value !== 'string') return value;

    // 1) 기본 형식: {blue.700} / {lightBlue.A400}
    let m = value.match(/^\{([a-zA-Z]+)\.(A?\d+)\}$/);
    if (m) {
        let [, name, shade] = m as [string, string, string];
        const palette: any = (MuiColors as any)[name];
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

function buildPalette(mode: 'light' | 'dark') {
    const file = path.join(TOKENS_ROOT, 'palette', mode === 'dark' ? 'Dark.json' : 'Light.json');
    const p = readJson(file);

    // Brand 토큰은 coreTheme에서 처리하므로 palette에서는 제외

    const primary = p.primary ? {
        light: resolveColorRef(p.primary.light?.$value),
        main: resolveColorRef(p.primary.main?.$value),
        dark: resolveColorRef(p.primary.dark?.$value),
        contrastText: p.primary.contrastText?.$value,
    } : undefined;

    const secondary = p.secondary ? {
        light: resolveColorRef(p.secondary.light?.$value),
        main: resolveColorRef(p.secondary.main?.$value),
        dark: resolveColorRef(p.secondary.dark?.$value),
        contrastText: p.secondary.contrastText?.$value,
    } : undefined;

    const error = p.error ? {
        light: resolveColorRef(p.error.light?.$value),
        main: resolveColorRef(p.error.main?.$value),
        dark: resolveColorRef(p.error.dark?.$value),
        contrastText: p.error.contrastText?.$value,
    } : undefined;

    const warning = p.warning ? {
        light: resolveColorRef(p.warning.light?.$value),
        main: resolveColorRef(p.warning.main?.$value),
        dark: resolveColorRef(p.warning.dark?.$value),
        contrastText: p.warning.contrastText?.$value,
    } : undefined;

    const info = p.info ? {
        light: resolveColorRef(p.info.light?.$value),
        main: resolveColorRef(p.info.main?.$value),
        dark: resolveColorRef(p.info.dark?.$value),
        contrastText: p.info.contrastText?.$value,
    } : undefined;

    const success = p.success ? {
        light: resolveColorRef(p.success.light?.$value),
        main: resolveColorRef(p.success.main?.$value),
        dark: resolveColorRef(p.success.dark?.$value),
        contrastText: p.success.contrastText?.$value,
    } : undefined;

    const text = p.text ? {
        primary: resolveColorRef(p.text.primary?.$value),
        secondary: resolveColorRef(p.text.secondary?.$value),
        disabled: resolveColorRef(p.text.disabled?.$value),
    } : undefined;

    const background = p.background ? {
        default: resolveColorRef(p.background.default?.$value),
        paper: resolveColorRef(p.background['paper-elevation-0']?.$value || p.background.default?.$value),
    } : undefined;

    const action = p.action ? {
        active: resolveColorRef(p.action.active?.$value),
        hover: resolveColorRef(p.action.hover?.$value),
        selected: resolveColorRef(p.action.selected?.$value),
        disabled: resolveColorRef(p.action.disabled?.$value),
        disabledBackground: resolveColorRef(p.action.disabledBackground?.$value),
        focus: resolveColorRef(p.action.focus?.$value),
    } : undefined;

    const common = p.common ? {
        white: resolveColorRef(p.common.white_states?.main?.$value),
        black: resolveColorRef(p.common.black_states?.main?.$value),
    } : undefined;

    const divider = resolveColorRef(p.divider?.$value);

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
function buildComponentsOverrides(tokensCore: Json, tokensTypos: Json): Record<string, any> {
    const components: Record<string, any> = {};
    const parseWeight = createFontWeightParser(tokensTypos);

    // Helper: 타이포 토큰 → 스타일 객체
    const parseTypoToken = (tokenValue: any) => {
        if (!tokenValue) return {};
        const fontSize = normalizeRem(resolveTokenRef(tokenValue.fontSize, tokensCore, tokensTypos));
        const lineHeight = normalizeLineHeight(resolveTokenRef(tokenValue.lineHeight, tokensCore, tokensTypos));
        const fontWeight = parseWeight(resolveTokenRef(tokenValue.fontWeight, tokensCore, tokensTypos));
        const letterSpacing = normalizeLetterSpacing(resolveTokenRef(tokenValue.letterSpacing, tokensCore, tokensTypos));
        const textCaseRaw = resolveTokenRef(tokenValue.textCase, tokensCore, tokensTypos);
        const textTransform = String(textCaseRaw).toLowerCase() === 'uppercase' ? 'uppercase' : undefined;

        const result: Record<string, any> = { fontSize, lineHeight, fontWeight };
        if (letterSpacing !== undefined && letterSpacing !== 0) result.letterSpacing = letterSpacing;
        if (textTransform) result.textTransform = textTransform;
        return result;
    };

    // MuiButton: core.button.large/medium/small
    if (tokensCore?.button) {
        const btn = tokensCore.button;
        const variants: any[] = [];
        if (btn.large?.$value) {
            variants.push({ props: { size: 'large' }, style: parseTypoToken(btn.large.$value) });
        }
        if (btn.medium?.$value) {
            variants.push({ props: { size: 'medium' }, style: parseTypoToken(btn.medium.$value) });
        }
        if (btn.small?.$value) {
            variants.push({ props: { size: 'small' }, style: parseTypoToken(btn.small.$value) });
        }
        if (variants.length > 0) {
            components.MuiButton = { variants };
        }
    }

    // MuiChip: core.chip.label
    if (tokensCore?.chip?.label?.$value) {
        components.MuiChip = {
            styleOverrides: {
                label: parseTypoToken(tokensCore.chip.label.$value),
            },
        };
    }

    // MuiTooltip: core.tooltip.label
    if (tokensCore?.tooltip?.label?.$value) {
        components.MuiTooltip = {
            styleOverrides: {
                tooltip: parseTypoToken(tokensCore.tooltip.label.$value),
            },
        };
    }

    // MuiBadge: core.badge.label
    if (tokensCore?.badge?.label?.$value) {
        components.MuiBadge = {
            styleOverrides: {
                badge: parseTypoToken(tokensCore.badge.label.$value),
            },
        };
    }

    // MuiAlert: core.alert.title/description
    if (tokensCore?.alert) {
        const alert = tokensCore.alert;
        const styleOverrides: Record<string, any> = {};
        if (alert.title?.$value) styleOverrides.message = parseTypoToken(alert.title.$value);
        if (Object.keys(styleOverrides).length > 0) {
            components.MuiAlert = { styleOverrides };
        }
    }

    // MuiTextField (Input): core.input.label/value/helper
    if (tokensCore?.input) {
        const input = tokensCore.input;
        const inputOverrides: Record<string, any> = {};
        if (input.label?.$value) inputOverrides.label = parseTypoToken(input.label.$value);
        if (input.value?.$value) inputOverrides.input = parseTypoToken(input.value.$value);
        if (input.helper?.$value) inputOverrides.helperText = parseTypoToken(input.helper.$value);
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
        
        const brand: Record<string, any> = {};
        
        // Colors 처리: colors 하위의 모든 색상 그룹 추출
        if (brandData.colors) {
            brand.colors = {};
            for (const [colorGroupName, colorGroup] of Object.entries(brandData.colors)) {
                brand.colors[colorGroupName] = extractTokenValues(colorGroup);
            }
        }
        
        // Sizes 처리: sizes 하위의 모든 사이즈 그룹 추출
        if (brandData.sizes) {
            brand.sizes = {};
            for (const [sizeGroupName, sizeGroup] of Object.entries(brandData.sizes)) {
                brand.sizes[sizeGroupName] = extractTokenValues(sizeGroup);
            }
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
        const base = sp['1']?.$value ? parseFloat(sp['1'].$value) : undefined;
        spacing = base && isFinite(base) ? base : 8;
    } catch {}

    // breakpoints: breakpoints/Mode 1.json
    let breakpoints: { values: { xs: number; sm: number; md: number; lg: number; xl: number } } | undefined;
    try {
        const bp = readJson(breakpointsPath);
        breakpoints = {
            values: {
                xs: parseInt(bp.xs.$value, 10),
                sm: parseInt(bp.sm.$value, 10),
                md: parseInt(bp.md.$value, 10),
                lg: parseInt(bp.lg.$value, 10),
                xl: parseInt(bp.xl.$value, 10),
            },
        };
    } catch {}

    // shape: shape/Mode 1.json → borderRadius
    let shape: { borderRadius: number } | undefined;
    try {
        const sh = readJson(shapePath);
        const r = sh.borderRadius?.$value;
        shape = r !== undefined ? { borderRadius: isNaN(Number(r)) ? 4 : Number(r) } : undefined;
    } catch {}

    // shadows: core.elevation → MUI shadows array
    const toCssShadow = (arr: any): string => {
        if (!Array.isArray(arr)) return 'none';
        const parts = arr.map((d: any) => {
            const color = d.color;
            const x = `${d.x}px`;
            const y = `${d.y}px`;
            const blur = `${d.blur}px`;
            const spread = `${d.spread}px`;
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
        ...core,        // core.json (figma styles - raw tokens)
        ...coreTheme,   // 처리된 MUI theme options (typography, brand, shadows, components 등)
        palette,        // palette/Light.json, palette/Dark.json (figma colors)
    } as const;

    return themeOptions;
}

function writeTheme(mode: 'light' | 'dark') {
    const themeOptions = buildThemeOptions(mode);
    ensureDir(OUTPUT_ROOT);
    const outPath = path.join(OUTPUT_ROOT, `theme.${mode}.json`);
    fs.writeFileSync(outPath, JSON.stringify(themeOptions, null, 2), 'utf8');
    // eslint-disable-next-line no-console
    console.log(`Wrote: ${path.relative(REPO_ROOT, outPath)}`);
}

// 실행 스크립트
writeTheme('light');
writeTheme('dark');

export { buildThemeOptions, pxToRem };
