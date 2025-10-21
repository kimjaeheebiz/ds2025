import {
    FigmaFileResponse,
    FigmaNodesResponse,
    FigmaImagesResponse,
    FigmaFileVersionsResponse,
    FigmaFileComponentsResponse,
    FigmaFileStylesResponse
} from './types';
import {
    FigmaAPIError,
    FigmaTokenError,
    FigmaFileNotFoundError,
    FigmaNodeNotFoundError,
    FigmaRateLimitError,
    FigmaNetworkError,
    handleFigmaError,
    retryWithBackoff
} from './errors';

export class FigmaAPIClient {
    private token: string;
    private baseURL = 'https://api.figma.com/v1';

    constructor(token: string) {
        if (!token || token.trim() === '') {
            throw new FigmaTokenError('Figma token is required');
        }
        this.token = token;
    }

    /**
     * 피그마 파일 정보 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 피그마 파일 데이터
     */
    async getFile(fileKey: string): Promise<FigmaFileResponse> {
        return retryWithBackoff(async () => {
            try {
                const response = await fetch(`${this.baseURL}/files/${fileKey}`, {
                    headers: {
                        'X-Figma-Token': this.token,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new FigmaFileNotFoundError(fileKey);
                    }
                    if (response.status === 429) {
                        throw new FigmaRateLimitError(fileKey);
                    }
                    if (response.status >= 500) {
                        throw new FigmaNetworkError(`Server error: ${response.status} ${response.statusText}`);
                    }
                    throw new FigmaAPIError(
                        `API Error: ${response.status} ${response.statusText}`,
                        fileKey,
                        response.status
                    );
                }

                return await response.json();
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new FigmaNetworkError('Network request failed', error);
                }
                handleFigmaError(error, `getFile(${fileKey})`);
            }
        });
    }

    /**
     * 특정 노드들만 가져오기
     * @param fileKey 피그마 파일 키
     * @param nodeIds 노드 ID 배열
     * @returns 피그마 노드 데이터
     */
    async getFileNodes(fileKey: string, nodeIds: string[]): Promise<FigmaNodesResponse> {
        return retryWithBackoff(async () => {
            try {
                if (!nodeIds || nodeIds.length === 0) {
                    throw new FigmaAPIError('Node IDs array cannot be empty', fileKey);
                }

                const response = await fetch(`${this.baseURL}/files/${fileKey}/nodes?ids=${nodeIds.join(',')}`, {
                    headers: {
                        'X-Figma-Token': this.token,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new FigmaFileNotFoundError(fileKey);
                    }
                    if (response.status === 429) {
                        throw new FigmaRateLimitError(fileKey);
                    }
                    throw new FigmaAPIError(
                        `API Error: ${response.status} ${response.statusText}`,
                        fileKey,
                        response.status
                    );
                }

                const data = await response.json();
                
                // 노드가 존재하지 않는 경우 확인
                const missingNodes = nodeIds.filter(id => !data.nodes[id]);
                if (missingNodes.length > 0) {
                    throw new FigmaNodeNotFoundError(missingNodes[0], fileKey);
                }

                return data;
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new FigmaNetworkError('Network request failed', error);
                }
                handleFigmaError(error, `getFileNodes(${fileKey}, [${nodeIds.join(',')}])`);
            }
        });
    }

    /**
     * 노드 이미지 가져오기
     * @param fileKey 피그마 파일 키
     * @param nodeIds 노드 ID 배열
     * @param format 이미지 포맷 (PNG, JPG, SVG, PDF)
     * @param scale 이미지 스케일 (1, 2, 4)
     * @returns 이미지 URL 맵
     */
    async getNodeImages(
        fileKey: string, 
        nodeIds: string[], 
        format: 'PNG' | 'JPG' | 'SVG' | 'PDF' = 'PNG',
        scale: 1 | 2 | 4 = 1
    ): Promise<FigmaImagesResponse> {
        try {
            const params = new URLSearchParams({
                ids: nodeIds.join(','),
                format,
                scale: scale.toString()
            });

            const response = await fetch(`${this.baseURL}/images/${fileKey}?${params}`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch Figma images:', error);
            throw error;
        }
    }

    /**
     * 파일 버전 히스토리 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 버전 히스토리
     */
    async getFileVersions(fileKey: string): Promise<FigmaFileVersionsResponse> {
        try {
            const response = await fetch(`${this.baseURL}/files/${fileKey}/versions`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch Figma file versions:', error);
            throw error;
        }
    }

    /**
     * 파일의 컴포넌트 정보 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 컴포넌트 정보
     */
    async getFileComponents(fileKey: string): Promise<FigmaFileComponentsResponse> {
        try {
            const response = await fetch(`${this.baseURL}/files/${fileKey}/components`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch Figma components:', error);
            throw error;
        }
    }

    /**
     * 파일의 스타일 정보 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 스타일 정보
     */
    async getFileStyles(fileKey: string): Promise<FigmaFileStylesResponse> {
        try {
            const response = await fetch(`${this.baseURL}/files/${fileKey}/styles`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch Figma styles:', error);
            throw error;
        }
    }
}
