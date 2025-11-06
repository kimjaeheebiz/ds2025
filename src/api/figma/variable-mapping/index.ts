/**
 * 변수 매핑 관리 (캐시 + API)
 */

import { VariableMappingInfo } from './types';
import { FigmaVariableFetcher } from './variable-fetcher';
import { formatMuiPath, determineVariableType } from './theme-mapper';
import { loadLibraryVariableMappings } from './library-loader';

/**
 * 변수 매핑 매니저
 */
export class VariableMappingManager {
    private cache = new Map<string, VariableMappingInfo>();
    private fetcher: FigmaVariableFetcher;
    
    constructor(token: string) {
        this.fetcher = new FigmaVariableFetcher(token);
        this.loadLibraryMappings(); // 라이브러리 변수 매핑 로드
    }

    /**
     * 라이브러리 파일에서 Variable ID 매핑 로드
     */
    private loadLibraryMappings(): void {
        const mappings = loadLibraryVariableMappings();
        
        // 캐시에 추가 (해시값만 저장)
        for (const [id, info] of mappings.entries()) {
            const hash = this.extractVariableHash(id);
            this.cache.set(hash, info);
        }
    }

    /**
     * Variable ID로 매핑 정보 가져오기 (캐시 우선)
     */
    async getMapping(variableId: string): Promise<VariableMappingInfo | null> {
        // Variable ID에서 해시값 추출
        const hash = this.extractVariableHash(variableId);
        console.log(`🔍 Variable ID에서 해시 추출: ${variableId} → ${hash}`);
        
        // 해시값으로 캐시 확인
        if (this.cache.has(hash)) {
            const mapping = this.cache.get(hash)!;
            console.log(`✅ 캐시에서 매핑 발견: ${hash} → ${mapping.muiThemePath}`);
            return mapping;
        }
        
        // API에서 가져오기
        const mapping = await this.fetcher.fetchVariableById(variableId);
        if (mapping) {
            this.cache.set(hash, mapping);
        }
        
        return mapping;
    }

    /**
     * Variable ID에서 해시값 추출
     * VariableID:93911b632d.../14026:22 → 93911b632d...
     */
    private extractVariableHash(variableId: string): string {
        // VariableID:{hash}/{node_id} 형식
        const match = variableId.match(/VariableID:(.+?)\//);
        if (match) {
            return match[1];
        }
        
        // VariableID:{hash} 형식 (노드 ID 없음)
        return variableId.replace('VariableID:', '');
    }

    /**
     * 파일의 모든 변수 매핑 로드 (초기화용)
     * File Variables API는 404이므로 사용하지 않음
     */
    async loadFileMappings(fileKey: string, fileType: 'library' | 'platform'): Promise<void> {
        console.log(`📥 ${fileType} 파일 변수 매핑 로드: ${fileKey}`);
        
        // File Variables API가 404를 반환하므로
        // 라이브러리 매핑은 이미 로드됨 (loadLibraryMappings)
        console.log(`✅ ${fileType} 파일 변수 매핑 완료: 라이브러리 매핑 사용`);
    }

    /**
     * MUI 테마 경로 직접 추출 (간단한 변수명 기반)
     */
    extractMuiPathFromVariableId(variableId: string, variableName?: string): string | null {
        if (!variableName) {
            return null;
        }
        
        const type = determineVariableType(variableName);
        return formatMuiPath(variableName, type);
    }
}

