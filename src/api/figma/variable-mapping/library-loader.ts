/**
 * 라이브러리 파일에서 Variable ID 매핑 로드
 * design-system/tokens/generated/$themes.json에서 Variable ID 추출
 */

import { VariableMappingInfo } from './types';
import { formatMuiPath, determineVariableType } from './theme-mapper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 라이브러리 Variable ID 매핑 로드
 */
export function loadLibraryVariableMappings(): Map<string, VariableMappingInfo> {
    const mappings = new Map<string, VariableMappingInfo>();
    
    try {
        // $themes.json 파일 읽기
        // process.cwd()는 프로젝트 루트를 반환
        const themesPath = path.resolve(process.cwd(), 'design-system/tokens/generated/$themes.json');
        const themesData = JSON.parse(fs.readFileSync(themesPath, 'utf8'));
        
        // 모든 테마의 $figmaVariableReferences 추출
        for (const theme of themesData) {
            if (theme.$figmaVariableReferences) {
                for (const [tokenPath, variableId] of Object.entries(theme.$figmaVariableReferences)) {
                    const mappingInfo: VariableMappingInfo = {
                        variableId: variableId as string,
                        variableName: tokenPath, // 예: "primary.main"
                        muiThemePath: tokenPath, // MUI 테마 경로 (이미 점 구분됨)
                        type: determineVariableType(tokenPath),
                    };
                    
                    mappings.set(variableId as string, mappingInfo);
                    // console.log(`📚 라이브러리 변수 매핑: ${variableId} → ${tokenPath}`);
                }
            }
        }
        
        console.log(`✅ 라이브러리 변수 매핑 로드 완료: ${mappings.size}개`);
    } catch (error) {
        console.warn('⚠️ 라이브러리 변수 매핑 로드 실패:', error);
    }
    
    return mappings;
}

