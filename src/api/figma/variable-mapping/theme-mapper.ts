/**
 * 변수명 → MUI 테마 경로 변환 유틸리티
 */

import { VariableMappingInfo } from './types';

/**
 * 피그마 변수명을 MUI 테마 경로로 변환
 * 
 * @example
 * 'Primary/Light' → 'primary.light'
 * 'Text/Primary' → 'text.primary'
 * 'Button/Contained' → 'contained'
 * 'Size/Medium' → 'medium'
 */
export function figmaVariableNameToMuiPath(variableName: string): string {
    // 슬래시를 점으로 변환하고 소문자로
    const path = variableName
        .split('/')
        .map(segment => segment.trim())
        .filter(Boolean)
        .join('.')
        .toLowerCase();
    
    return path;
}

/**
 * MUI Prop 타입에 따른 변수 타입 결정
 */
export function determineVariableType(variableName: string): VariableMappingInfo['type'] {
    const lower = variableName.toLowerCase();
    
    if (lower.includes('color') || lower.includes('palette')) {
        return 'color';
    }
    if (lower.includes('variant') || lower.includes('contained') || lower.includes('outlined')) {
        return 'variant';
    }
    if (lower.includes('size') || lower.includes('large') || lower.includes('small')) {
        return 'size';
    }
    if (lower.includes('typography') || lower.includes('font')) {
        return 'typography';
    }
    
    return 'other';
}

/**
 * 변수 타입별 MUI 경로 포맷팅
 */
export function formatMuiPath(variableName: string, type: VariableMappingInfo['type']): string {
    const basePath = figmaVariableNameToMuiPath(variableName);
    
    switch (type) {
        case 'color':
            // 색상은 palette 하위
            return `palette.${basePath}`;
            
        case 'variant':
            // variant는 직접 값 (contained, outlined, text)
            return basePath.split('.').pop() || basePath;
            
        case 'size':
            // size는 직접 값 (small, medium, large)
            return basePath.split('.').pop() || basePath;
            
        case 'typography':
            // typography는 theme.typography 하위
            return `typography.${basePath}`;
            
        default:
            return basePath;
    }
}

