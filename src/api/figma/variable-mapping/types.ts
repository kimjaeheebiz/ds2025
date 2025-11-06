/**
 * 피그마 변수 타입 정의
 */

/**
 * 피그마 Variables API 응답 구조
 */
export interface FigmaVariable {
    id: string;
    name: string;
    type: 'FLOAT' | 'STRING' | 'COLOR' | 'BOOLEAN';
    valuesByMode: Record<string, any>;
    resolvedType: string;
    remote?: boolean;
    description?: string;
    hiddenFromPublishing?: boolean;
    scopes?: string[];
    codeSyntax?: Record<string, string>;
}

/**
 * 피그마 Variables Collection 응답 구조
 */
export interface FigmaVariableCollection {
    id: string;
    name: string;
    modes: Array<{ modeId: string; name: string }>;
    defaultModeId: string;
    remote?: boolean;
    hiddenFromPublishing?: boolean;
    variableIds: string[];
}

/**
 * 변수 정보 (매핑용)
 */
export interface VariableMappingInfo {
    variableId: string;
    variableName: string;        // 피그마 변수명 (예: "Primary/Light")
    muiThemePath: string;         // MUI 테마 경로 (예: "primary.light")
    type: 'color' | 'size' | 'variant' | 'typography' | 'other';
    defaultValue?: any;
}

/**
 * 파일별 변수 매핑
 */
export interface FileVariableMapping {
    fileKey: string;
    fileType: 'library' | 'platform';
    variables: Map<string, VariableMappingInfo>;
}

