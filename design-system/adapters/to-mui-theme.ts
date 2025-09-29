/*
  Adapter: Tokens Studio → MUI ThemeOptions (px → rem 변환 포함)
  실행: tsx design-system/adapters/to-mui-theme.ts
  - design-system/tokens/generated/* 를 읽어 src/theme/generated/theme.(light|dark).json 생성
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

// Material colors JSON 캐시 (Tokens Studio 산출물)
let materialColorsCache: any | undefined;
function getMaterialColorHex(name: string, shade: string): string | undefined {
    try {
        if (!materialColorsCache) {
            const p = path.join(TOKENS_ROOT, 'material', 'colors', 'Mode 1.json');
            materialColorsCache = readJson(p);
        }
        const v = materialColorsCache?.[name]?.[shade]?.$value;
        return typeof v === 'string' ? v : undefined;
    } catch {
        return undefined;
    }
}

// Brand colors JSON 캐시 (Tokens Studio 산출물)
let brandColorsCache: any | undefined;
function getBrandColorHex(name: string, shade: string): string | undefined {
    try {
        if (!brandColorsCache) {
            const p = path.join(TOKENS_ROOT, 'brand', 'Mode 1.json');
            brandColorsCache = readJson(p);
        }
        // 지원: brand.color.*, brand.hectoColors.* (둘 다 허용)
        const v = brandColorsCache?.hectoColors?.[name]?.[shade]?.$value
            ?? brandColorsCache?.color?.[name]?.[shade]?.$value;
        return typeof v === 'string' ? v : undefined;
    } catch {
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

// Typography 추출 및 px→rem 변환
function buildTypography(tokensGlobal: Json, tokensTypos: Json) {
    // 폰트 패밀리 (필수) + 폴백은 분리 파일에서 로드
    const tokenPrimaryCandidate = safeGet(tokensTypos, ['fontFamily', 'primary', '$value'])
        || undefined;

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

    const parseWeight = createFontWeightParser(tokensTypos);
    const pick = (sizeTokenKey: string, lineKey: string, weightKeyPath: string[]) => {
        const line = safeGet(tokensTypos, ['lineHeights', lineKey, '$value']) ?? '150%';
        const weightToken = safeGet(tokensTypos, ['fontWeights', ...weightKeyPath, '$value'])
            || safeGet(tokensGlobal, ['fontWeights', ...weightKeyPath, '$value'])
            || '400';
        const fontWeight = parseWeight(weightToken);

        // lineHeight: 퍼센트면 소수로 변환, 숫자면 배수 기본값
        const lineHeight = typeof line === 'string' && line.endsWith('%')
            ? parseFloat(line) / 100
            : 1.5;

        return {
            fontSize: normalizeRem(sizeTokenKey ?? 16),
            lineHeight,
            fontWeight,
        };
    };

    // 문자열/배열 모두 지원하여 최종 font-family 문자열 생성 (따옴표 포함 여부는 입력값 유지)
    const primaryList = parseFontList(primarySource as any);
    const fallbackList = parseFontList(Array.isArray(fallback) ? fallback.join(', ') : (fallback ? String(fallback) : undefined));
    const combinedList = [...primaryList, ...fallbackList];
    const fontFamilyCombined = combinedList.length > 0 ? combinedList.join(', ') : undefined;

    return {
        ...(fontFamilyCombined ? { fontFamily: fontFamilyCombined } : {}),
        h1: pick('6rem', '0', ['pretendard-variable-0']),
        h2: pick('3,75rem', '1', ['pretendard-variable-1']),
        h3: pick('3rem', '1', ['pretendard-variable-1']),
        h4: pick('2,125rem', '1', ['pretendard-variable-1']),
        h5: pick('1,5rem', '1', ['pretendard-variable-1']),
        h6: pick('1,25rem', '1', ['pretendard-variable-1']),
        body1: pick('1rem', '6', ['pretendard-variable-0']),
        body2: pick('0,875rem', '6', ['pretendard-variable-0']),
        subtitle1: pick('1rem', '1', ['pretendard-variable-2']),
        subtitle2: pick('0,875rem', '9', ['pretendard-variable-2']),
        caption: pick('0,75rem', '6', ['pretendard-variable-0']),
        overline: {
            ...pick('0,75rem', '10', ['pretendard-variable-0']),
            textTransform: 'uppercase',
        },
    };
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

    // 2) 네임스페이스 패턴(단일 처리):
    //    {hectoColors.orange.500} / {color.orange.500}
    //    {brand.hectoColors.orange.500} / {brand.color.gray.100}
    const ns = value.match(/^\{(?:brand\.)?(?:hectoColors|color)\.([a-zA-Z][\w-]*)\.(A?\d+)\}$/);
    if (ns) {
        const [, name, shade] = ns as [string, string, string];
        const brandHex = getBrandColorHex(name, shade);
        if (brandHex) return brandHex;
        const palette: any = (MuiColors as any)[name];
        if (palette && palette[shade]) return palette[shade];
        const mc = getMaterialColorHex(name, shade);
        if (mc) return mc;
        return value;
    }

    return value;
}

function buildPalette(mode: 'light' | 'dark') {
    const file = path.join(TOKENS_ROOT, 'palette', mode === 'dark' ? 'Dark.json' : 'Light.json');
    const p = readJson(file);

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

function buildThemeOptions(mode: 'light' | 'dark') {
    const global = readJson(path.join(TOKENS_ROOT, 'global.json'));
    const typo = readJson(path.join(TOKENS_ROOT, 'typography', 'Mode 1.json'));
    const spacingTokensPath = path.join(TOKENS_ROOT, 'spacing', 'Mode 1.json');
    const breakpointsPath = path.join(TOKENS_ROOT, 'breakpoints', 'Mode 1.json');
    const shapePath = path.join(TOKENS_ROOT, 'shape', 'Mode 1.json');

    const typography = buildTypography(global, typo);
    const palette = buildPalette(mode);

    // spacing: 기본 factor를 spacing['1'] 값으로 유추, 없으면 8
    let spacing: number = 8;
    try {
        const sp = readJson(spacingTokensPath);
        const base = sp['1']?.$value ? parseFloat(sp['1'].$value) : undefined;
        spacing = base && isFinite(base) ? base : 8;
    } catch {}

    // breakpoints
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

    // shape
    let shape: { borderRadius: number } | undefined;
    try {
        const sh = readJson(shapePath);
        const r = sh.borderRadius?.$value;
        shape = r !== undefined ? { borderRadius: isNaN(Number(r)) ? 4 : Number(r) } : undefined;
    } catch {}

    // shadows (elevation 0..24)
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
        const e = (global as any)?.elevation?.[String(i)]?.$value;
        shadows[i] = toCssShadow(e);
    }

    const themeOptions = {
        palette,
        typography,
        spacing,
        ...(breakpoints ? { breakpoints } : {}),
        ...(shape ? { shape } : {}),
        shadows,
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
