// 피그마 API 타입 정의
export interface FigmaFile {
    document: FigmaNode;
    components: Record<string, FigmaComponent>;
    styles: Record<string, FigmaStyle>;
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
}

export interface FigmaNode {
    id: string;
    name: string;
    type: string;
    visible?: boolean;
    children?: FigmaNode[];
    absoluteBoundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    fills?: FigmaFill[];
    strokes?: FigmaStroke[];
    effects?: FigmaEffect[];
    characters?: string;
    style?: FigmaTextStyle;
    layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
    primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    itemSpacing?: number;
    layoutWrap?: 'NO_WRAP' | 'WRAP';
    layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
    layoutGrow?: number;
    layoutSizingHorizontal?: 'FIXED' | 'HUG' | 'FILL';
    layoutSizingVertical?: 'FIXED' | 'HUG' | 'FILL';
    constraints?: {
        vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
        horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
    };
    exportSettings?: FigmaExportSetting[];
    cornerRadius?: number;
    rectangleCornerRadii?: number[];
    blendMode?: string;
    opacity?: number;
    isMask?: boolean;
    characterStyleOverrides?: number[];
    styleOverrideTable?: Record<number, FigmaTextStyle>;
    lineTypes?: string[];
    lineIndentations?: number[];
    componentId?: string;
    variantProperties?: Record<string, unknown>;
    componentProperties?: Record<string, unknown>;
}

export interface FigmaComponent {
    key: string;
    name: string;
    description: string;
    componentSetId?: string;
    documentationLinks: FigmaDocumentationLink[];
}

export interface FigmaStyle {
    key: string;
    name: string;
    description: string;
    styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
}

export interface FigmaFill {
    type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
    visible?: boolean;
    opacity?: number;
    color?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    gradientStops?: FigmaColorStop[];
    gradientTransform?: FigmaTransform;
    scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
    imageRef?: string;
    filters?: FigmaImageFilters;
}

export interface FigmaStroke {
    type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND';
    visible?: boolean;
    opacity?: number;
    color?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    blendMode?: string;
    gradientStops?: FigmaColorStop[];
    gradientTransform?: FigmaTransform;
}

export interface FigmaEffect {
    type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
    visible?: boolean;
    radius?: number;
    color?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    blendMode?: string;
    offset?: {
        x: number;
        y: number;
    };
    spread?: number;
    showShadowBehindNode?: boolean;
}

export interface FigmaTextStyle {
    fontFamily: string;
    fontPostScriptName?: string;
    paragraphSpacing?: number;
    paragraphIndent?: number;
    listSpacing?: number;
    hangingPunctuation?: boolean;
    hangingList?: boolean;
    fontSize: number;
    textDecoration?: 'STRIKETHROUGH' | 'UNDERLINE';
    textCase?: 'UPPER' | 'LOWER' | 'TITLE' | 'SMALL_CAPS' | 'SMALL_CAPS_FORCED';
    lineHeightPx?: number;
    lineHeightPercent?: number;
    lineHeightPercentFontSize?: number;
    lineHeightUnit?: 'PIXELS' | 'FONT_SIZE_%' | 'INHERIT';
    letterSpacing?: number;
    letterSpacingUnit?: 'PIXELS' | 'PERCENT';
    textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
    textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
    textAutoResize?: 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'NONE';
    textStyleId?: string;
    fontWeight?: number;
    italic?: boolean;
    fills?: FigmaFill[];
    hyperlink?: FigmaHyperlink;
    opentypeFlags?: Record<string, number>;
}

export interface FigmaExportSetting {
    suffix: string;
    format: 'JPG' | 'PNG' | 'SVG' | 'PDF';
    constraint?: {
        type: 'SCALE' | 'WIDTH' | 'HEIGHT';
        value: number;
    };
}

export interface FigmaColorStop {
    position: number;
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}

export interface FigmaTransform {
    m00: number;
    m01: number;
    m02: number;
    m10: number;
    m11: number;
    m12: number;
}

export interface FigmaImageFilters {
    exposure?: number;
    contrast?: number;
    saturation?: number;
    temperature?: number;
    tint?: number;
    highlights?: number;
    shadows?: number;
}

export interface FigmaDocumentationLink {
    uri: string;
}

export interface FigmaHyperlink {
    type: 'URL' | 'NODE';
    url?: string;
    nodeID?: string;
}

// API 응답 타입
export interface FigmaFileResponse {
    document: FigmaNode;
    components: Record<string, FigmaComponent>;
    styles: Record<string, FigmaStyle>;
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    version: string;
    role: string;
    editorType: string;
    linkAccess: string;
}

export interface FigmaNodesResponse {
    nodes: Record<string, { document: FigmaNode }>;
}

export interface FigmaImagesResponse {
    images: Record<string, string>;
    status: number;
    err?: string;
}

export interface FigmaFileVersionsResponse {
    versions: FigmaVersion[];
}

export interface FigmaVersion {
    id: string;
    created_at: string;
    label: string;
    description: string;
    user: {
        handle: string;
        img_url: string;
    };
    thumbnail_url: string;
}

export interface FigmaFileComponentsResponse {
    meta: {
        components: Record<string, FigmaComponent>;
    };
}

export interface FigmaFileStylesResponse {
    meta: {
        styles: Record<string, FigmaStyle>;
    };
}

export interface FigmaFileVariablesResponse {
    meta: {
        variables: Record<string, FigmaVariable>;
    };
}

export interface FigmaVariable {
    name: string;
    key: string;
    variableCollectionId: string;
    resolvedType: string;
    valuesByMode: Record<string, unknown>;
}

// 페이지별 디자인 설정 타입
export interface PageDesignConfig {
    pageId: string;
    pageName: string;
    components: ComponentDesignConfig[];
    layout: LayoutConfig;
    theme: ThemeConfig;
}

export interface ComponentDesignConfig {
    componentId: string;
    componentName: string;
    componentType:
        | 'button'
        | 'input'
        | 'table'
        | 'card'
        | 'navigation'
        | 'layout'
        | 'chip'
        | 'dialog'
        | 'form'
        | 'list'
        | 'tabs'
        | 'typography';
    properties: ComponentProperties;
    variants?: ComponentVariant[];
}

export interface ComponentProperties {
    width?: number | string;
    height?: number | string;
    backgroundColor?: string;
    colorStyle?: string; // 피그마 스타일 이름
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    opacity?: number;
    gap?: number;
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number | string;
    color?: string;
    padding?: number | string;
    margin?: number | string;
    display?: 'flex' | 'block' | 'inline' | 'inline-block' | 'grid';
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    zIndex?: number;
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
    cursor?: 'default' | 'pointer' | 'text' | 'move' | 'not-allowed';
    transition?: string;
    variant?: string;
    size?: string;
    transform?: string;
    boxShadow?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textDecoration?: 'none' | 'underline' | 'line-through';
    lineHeight?: number | string;
    letterSpacing?: number | string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
    wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
    verticalAlign?: 'baseline' | 'sub' | 'super' | 'top' | 'text-top' | 'middle' | 'bottom' | 'text-bottom';
    // Component-specific properties
    label?: string;
    severity?: 'error' | 'warning' | 'info' | 'success';
    src?: string;
    alt?: string;
    badgeContent?: string | number;
    elevation?: number;
    type?: string;
    // Table-specific properties
    columns?: Array<{ key: string; label: string; type: string }>;
}

export interface ComponentVariant {
    variantName: string;
    properties: ComponentProperties;
}

export interface LayoutConfig {
    containerType: 'flex' | 'grid' | 'absolute';
    direction?: 'row' | 'column';
    spacing?: number;
    padding?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

export interface ThemeConfig {
    colors: Record<string, string>;
    typography: Record<string, TypographyConfig>;
    spacing: Record<string, number>;
    borderRadius: Record<string, number>;
    shadows: Record<string, string>;
}

export interface TypographyConfig {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: string;
    variant?: string;
}

// Design Token Manager용 TypographyToken 타입
export interface TypographyToken {
    fontFamily: string;
    fontSize: number;
    fontWeight: number | string;
    lineHeight: number | string;
    letterSpacing?: number;
}

// 페이지 전용 스타일 토큰 (기존 테마와 충돌 방지)
export interface PageStyleTokens {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    typography: Record<string, TypographyToken>;
    layout: Record<string, Record<string, string | number>>;
}

// 페이지 컴포넌트 설정
export interface PageComponentConfig {
    pageName: string;
    pageId: string;
    components: ComponentDesignConfig[];
    layout: LayoutConfig;
    styles: PageStyleTokens;
}

// 검증 결과 인터페이스
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
