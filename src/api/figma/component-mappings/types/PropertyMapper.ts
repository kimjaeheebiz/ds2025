import { FigmaNode, ComponentProperties } from '../../types';

/**
 * 속성 추출 함수 타입
 */
export type PropertyExtractor = (node: FigmaNode) => any;

/**
 * MUI 속성 정의
 */
export interface MUIPropertyDefinition {
    type: 'string' | 'number' | 'boolean' | 'union' | 'union-number' | 'react-node' | 'function' | 'array' | 'object';
    values?: readonly (string | boolean)[];  // union 타입인 경우
    default?: any;
    extractFromFigma?: PropertyExtractor;
    transform?: (value: any) => any;  // 값 변환 함수
}

/**
 * 컴포넌트 매핑 인터페이스
 */
export interface ComponentMapping {
    /** 피그마에서 인식할 컴포넌트 이름들 */
    figmaNames: readonly string[];
    
    /** MUI 컴포넌트 이름 */
    muiName: string;
    
    /** MUI 공식 Props 정의 */
    muiProps: Record<string, MUIPropertyDefinition>;
    
    /** sx에서 제외할 속성 (기본 스타일) */
    excludeFromSx?: string[];
    
    /** 하위 컴포넌트 import 목록 (Table, Card 등) */
    subComponents?: readonly string[];
    
    /** 컴포넌트 내용 추출 커스텀 로직 */
    extractContent?: (node: FigmaNode) => string | null;
    
    /** 코드 생성 커스텀 로직 */
    generateCode?: (props: string, content: string) => string;
    
    /** ✅ 추가: 속성 추출 커스텀 로직 (extractor.ts에서 사용) */
    extractProperties?: (node: FigmaNode, extractor?: any) => Promise<ComponentProperties>;
    
    /** ✅ 추가: JSX 생성 커스텀 로직 (generator.ts에서 사용) */
    generateJSX?: (componentName: string, props: string, content: string, sx?: string | null, properties?: any) => string;
    
    /** ✅ 추가: 아이콘 추출 로직 */
    extractIcons?: (node: FigmaNode, extractor?: any) => Promise<{ startIcon?: string, endIcon?: string, startIconComponentId?: string, endIconComponentId?: string }>;
    
    /** ✅ 추가: 자식 노드 추출 로직 (Card, Table 등 복잡한 구조) */
    extractChildren?: (node: FigmaNode) => Promise<FigmaNode[]>;
    
    /** ✅ 추가: Props 변환 로직 (Table의 small → size 같은 특수 변환) */
    transformProps?: (properties: ComponentProperties) => ComponentProperties;
}

