/**
 * 피그마 Variables API를 사용한 변수 정보 가져오기
 */

import { FigmaVariable, VariableMappingInfo } from './types';
import { formatMuiPath, determineVariableType } from './theme-mapper';

/**
 * 피그마 Variables API 클라이언트
 */
export class FigmaVariableFetcher {
    constructor(private token: string) {}

    /**
     * Variable ID로 변수 정보 가져오기
     */
    async fetchVariableById(variableId: string): Promise<VariableMappingInfo | null> {
        try {
            // Variable ID 정규화 (encoded)
            const varId = variableId.split('/').pop() || variableId;
            const encoded = encodeURIComponent(varId);
            
            const response = await fetch(`https://api.figma.com/v1/variables/${encoded}`, {
                headers: { 
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                console.warn(`⚠️ Variables API 실패: ${variableId} (${response.status})`);
                return null;
            }
            
            const variable: FigmaVariable = await response.json();
            
            // 변수명에서 첫 번째 값 추출 (valuesByMode)
            const variableName = variable.name;
            const type = determineVariableType(variableName);
            const muiThemePath = formatMuiPath(variableName, type);
            
            return {
                variableId,
                variableName,
                muiThemePath,
                type,
                defaultValue: Object.values(variable.valuesByMode)[0],
            };
            
        } catch (error) {
            console.warn(`⚠️ Variables API 오류: ${variableId}`, error);
            return null;
        }
    }

    /**
     * 파일의 모든 변수 가져오기
     */
    async fetchFileVariables(fileKey: string): Promise<Map<string, VariableMappingInfo>> {
        try {
            const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables`, {
                headers: { 
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                console.warn(`⚠️ File Variables API 실패: ${fileKey} (${response.status})`);
                return new Map();
            }
            
            const data = await response.json();
            const variables: FigmaVariable[] = data.meta.variables || [];
            
            const mapping = new Map<string, VariableMappingInfo>();
            
            for (const variable of variables) {
                const type = determineVariableType(variable.name);
                const muiThemePath = formatMuiPath(variable.name, type);
                
                mapping.set(variable.id, {
                    variableId: variable.id,
                    variableName: variable.name,
                    muiThemePath,
                    type,
                    defaultValue: Object.values(variable.valuesByMode)[0],
                });
            }
            
            return mapping;
            
        } catch (error) {
            console.warn(`⚠️ File Variables API 오류: ${fileKey}`, error);
            return new Map();
        }
    }
}

