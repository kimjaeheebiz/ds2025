import { FigmaAPIClient } from './client';
import { 
    FigmaNode, 
    PageDesignConfig, 
    ComponentDesignConfig,
    ComponentVariant,
    LayoutConfig,
    ThemeConfig,
    TypographyConfig
} from './types';

export class FigmaDesignExtractor {
    private client: FigmaAPIClient;

    constructor(token: string) {
        this.client = new FigmaAPIClient(token);
    }

    /**
     * 페이지별 디자인 설정 추출
     * @param fileKey 피그마 파일 키
     * @param pageNodeIds 페이지 노드 ID 배열
     * @returns 페이지별 디자인 설정
     */
    async extractPageDesigns(fileKey: string, pageNodeIds: string[]): Promise<PageDesignConfig[]> {
        try {
            const fileData = await this.client.getFileNodes(fileKey, pageNodeIds);
            const pageDesigns: PageDesignConfig[] = [];

            for (const nodeId of pageNodeIds) {
                const node = fileData.nodes[nodeId]?.document;
                if (node) {
                    const pageDesign = this.parsePageNode(node);
                    pageDesigns.push(pageDesign);
                }
            }

            return pageDesigns;
        } catch (error) {
            console.error('Failed to extract page designs:', error);
            throw error;
        }
    }

    /**
     * 페이지 노드 파싱
     * @param node 피그마 노드
     * @returns 페이지 디자인 설정
     */
    private parsePageNode(node: FigmaNode): PageDesignConfig {
        const pageDesign: PageDesignConfig = {
            pageId: node.id,
            pageName: node.name,
            components: [],
            layout: this.extractLayoutConfig(node),
            theme: this.extractThemeConfig(node)
        };

        // 페이지 내 컴포넌트들 추출
        if (node.children) {
            node.children.forEach(child => {
                const component = this.parseComponentNode(child);
                if (component) {
                    pageDesign.components.push(component);
                }
            });
        }

        return pageDesign;
    }

    /**
     * 컴포넌트 노드 파싱
     * @param node 피그마 노드
     * @returns 컴포넌트 디자인 설정
     */
    private parseComponentNode(node: FigmaNode): ComponentDesignConfig | null {
        // 컴포넌트 타입 결정
        const componentType = this.determineComponentType(node);
        if (!componentType) return null;

        const component: ComponentDesignConfig = {
            componentId: node.id,
            componentName: node.name,
            componentType,
            properties: this.extractComponentProperties(node),
            variants: this.extractComponentVariants(node)
        };

        return component;
    }

    /**
     * 컴포넌트 타입 결정
     * @param node 피그마 노드
     * @returns 컴포넌트 타입
     */
    private determineComponentType(node: FigmaNode): ComponentDesignConfig['componentType'] | null {
        const name = node.name.toLowerCase();
        
        if (name.includes('button')) return 'button';
        if (name.includes('input') || name.includes('textfield')) return 'input';
        if (name.includes('table')) return 'table';
        if (name.includes('card')) return 'card';
        if (name.includes('nav') || name.includes('menu')) return 'navigation';
        if (name.includes('layout') || name.includes('container')) return 'layout';
        
        return null;
    }

    /**
     * 테이블 컬럼 정보 추출
     * @param node 테이블 노드
     * @returns 테이블 컬럼 배열
     */
    private extractTableColumns(node: FigmaNode): Array<{key: string, label: string, type: string}> {
        const columns: Array<{key: string, label: string, type: string}> = [];
        
        // 테이블 헤더 찾기
        const headerRow = node.children?.find(child => 
            child.name.toLowerCase().includes('header') || 
            child.name.toLowerCase().includes('thead')
        );
        
        if (headerRow?.children) {
            headerRow.children.forEach((headerCell) => {
                const cellText = headerCell.characters || headerCell.name;
                if (cellText) {
                    const key = this.generateColumnKey(cellText);
                    const type = this.determineColumnType(cellText);
                    
                    columns.push({
                        key,
                        label: cellText,
                        type
                    });
                }
            });
        }
        
        return columns;
    }

    /**
     * 컬럼 키 생성
     * @param label 컬럼 라벨
     * @returns 컬럼 키
     */
    private generateColumnKey(label: string): string {
        // 한글 라벨을 영문 키로 변환
        const keyMap: Record<string, string> = {
            '번호': 'index',        // 테이블 순번 (인덱스)
            '이메일': 'id',         // 이메일
            '이메일 아이디': 'id',   // 이메일 (다른 표현)
            '사용자 ID': 'id',      // 이메일 아이디 (다른 표현)
            '이름': 'name',
            '부서': 'department',    // 소속 (부서)
            '소속': 'department',    // 소속
            '권한': 'permission',
            '상태': 'status',
            '가입일': 'regdate',
            '최근 로그인': 'last_login',
            '워크플로우명': 'name',
            '설명': 'description',
            '생성자': 'user_name',
            '즐겨찾기': 'isFavorite',
            '생성일': 'created_at',
            '수정일': 'updated_at',
            '전화번호': 'phone',
            '주소': 'address',
            '직급': 'position',
            '입사일': 'joinDate',
            '퇴사일': 'leaveDate'
        };
        
        return keyMap[label] || label.toLowerCase().replace(/\s+/g, '_');
    }

    /**
     * 컬럼 타입 결정
     * @param label 컬럼 라벨
     * @returns 컬럼 타입
     */
    private determineColumnType(label: string): string {
        if (label.includes('이메일') || label.includes('email')) return 'email';
        if (label.includes('일') || label.includes('날짜') || label.includes('date')) return 'date';
        if (label.includes('상태') || label.includes('status')) return 'status';
        if (label.includes('권한') || label.includes('permission')) return 'permission';
        if (label.includes('프로젝트') || label.includes('project')) return 'project';
        if (label.includes('실행여부') || label.includes('차단여부') || label.includes('즐겨찾기') || label.includes('favorite')) return 'boolean';
        if (label.includes('번호') && !label.includes('전화')) return 'index'; // 테이블 순번
        if (label.includes('전화번호') || label.includes('phone')) return 'phone';
        if (label.includes('주소') || label.includes('address')) return 'text';
        if (label.includes('직급') || label.includes('position')) return 'text';
        return 'text';
    }

    /**
     * 컴포넌트 속성 추출
     * @param node 피그마 노드
     * @returns 컴포넌트 속성
     */
    private extractComponentProperties(node: FigmaNode): Record<string, string | number | boolean | TypographyConfig | {left: number, right: number, top: number, bottom: number} | Array<{key: string, label: string, type: string}>> {
        const properties: Record<string, string | number | boolean | TypographyConfig | {left: number, right: number, top: number, bottom: number} | Array<{key: string, label: string, type: string}>> = {};

        // 크기 정보
        if (node.absoluteBoundingBox) {
            properties.width = node.absoluteBoundingBox.width;
            properties.height = node.absoluteBoundingBox.height;
        }

        // 색상 정보
        if (node.fills && node.fills.length > 0) {
            properties.backgroundColor = this.extractColor(node.fills[0]);
        }

        // 테두리 정보
        if (node.strokes && node.strokes.length > 0) {
            properties.borderColor = this.extractColor(node.strokes[0]);
            properties.borderWidth = 1; // 기본값
        }

        // 모서리 둥글기
        if (node.cornerRadius !== undefined) {
            properties.borderRadius = node.cornerRadius;
        }

        // 투명도
        if (node.opacity !== undefined) {
            properties.opacity = node.opacity;
        }

        // 텍스트 속성
        if (node.characters) {
            properties.text = node.characters;
            if (node.style) {
                properties.typography = this.extractTypographyConfig(node.style);
            }
        }

        // 테이블 컬럼 정보 추출
        if (this.determineComponentType(node) === 'table') {
            properties.columns = this.extractTableColumns(node);
        }

        // 레이아웃 속성
        if (node.layoutMode) {
            properties.layoutMode = node.layoutMode;
            properties.direction = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
        }

        if (node.primaryAxisAlignItems) {
            properties.justifyContent = this.mapAlignment(node.primaryAxisAlignItems);
        }

        if (node.counterAxisAlignItems) {
            properties.alignItems = this.mapAlignment(node.counterAxisAlignItems);
        }

        // 패딩
        if (node.paddingLeft !== undefined || node.paddingRight !== undefined || 
            node.paddingTop !== undefined || node.paddingBottom !== undefined) {
            properties.padding = {
                left: node.paddingLeft || 0,
                right: node.paddingRight || 0,
                top: node.paddingTop || 0,
                bottom: node.paddingBottom || 0
            };
        }

        // 간격
        if (node.itemSpacing !== undefined) {
            properties.gap = node.itemSpacing;
        }

        return properties;
    }

    /**
     * 컴포넌트 변형 추출
     * @param node 피그마 노드
     * @returns 컴포넌트 변형 배열
     */
    private extractComponentVariants(node: FigmaNode): ComponentVariant[] {
        const variants: ComponentVariant[] = [];
        
        // 자식 노드들을 변형으로 처리
        if (node.children) {
            node.children.forEach(child => {
                if (child.name.includes('variant') || child.name.includes('state')) {
                    variants.push({
                        variantName: child.name,
                        properties: this.extractComponentProperties(child)
                    });
                }
            });
        }

        return variants;
    }

    /**
     * 레이아웃 설정 추출
     * @param node 피그마 노드
     * @returns 레이아웃 설정
     */
    private extractLayoutConfig(node: FigmaNode): LayoutConfig {
        const layout: LayoutConfig = {
            containerType: 'flex',
            direction: 'column',
            spacing: 0
        };

        if (node.layoutMode) {
            layout.containerType = node.layoutMode === 'NONE' ? 'absolute' : 'flex';
            layout.direction = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
        }

        if (node.itemSpacing !== undefined) {
            layout.spacing = node.itemSpacing;
        }

        if (node.paddingLeft !== undefined || node.paddingRight !== undefined || 
            node.paddingTop !== undefined || node.paddingBottom !== undefined) {
            layout.padding = {
                left: node.paddingLeft || 0,
                right: node.paddingRight || 0,
                top: node.paddingTop || 0,
                bottom: node.paddingBottom || 0
            };
        }

        return layout;
    }

    /**
     * 테마 설정 추출
     * @param node 피그마 노드
     * @returns 테마 설정
     */
    private extractThemeConfig(node: FigmaNode): ThemeConfig {
        const theme: ThemeConfig = {
            colors: {},
            typography: {},
            spacing: {},
            borderRadius: {},
            shadows: {}
        };

        // 색상 추출
        this.extractColorsFromNode(node, theme.colors);

        // 타이포그래피 추출
        this.extractTypographyFromNode(node, theme.typography);

        // 간격 추출
        if (node.itemSpacing !== undefined) {
            theme.spacing['component-gap'] = node.itemSpacing;
        }

        // 모서리 둥글기 추출
        if (node.cornerRadius !== undefined) {
            theme.borderRadius['component'] = node.cornerRadius;
        }

        return theme;
    }

    /**
     * 노드에서 색상 추출
     * @param node 피그마 노드
     * @param colors 색상 객체
     */
    private extractColorsFromNode(node: FigmaNode, colors: Record<string, string>): void {
        if (node.fills && node.fills.length > 0) {
            const fill = node.fills[0];
            if (fill.type === 'SOLID' && fill.color) {
                colors[node.name.toLowerCase().replace(/\s+/g, '-')] = this.rgbaToHex(fill.color);
            }
        }

        if (node.children) {
            node.children.forEach(child => this.extractColorsFromNode(child, colors));
        }
    }

    /**
     * 노드에서 타이포그래피 추출
     * @param node 피그마 노드
     * @param typography 타이포그래피 객체
     */
    private extractTypographyFromNode(node: FigmaNode, typography: Record<string, TypographyConfig>): void {
        if (node.characters && node.style) {
            const config = this.extractTypographyConfig(node.style);
            typography[node.name.toLowerCase().replace(/\s+/g, '-')] = config;
        }

        if (node.children) {
            node.children.forEach(child => this.extractTypographyFromNode(child, typography));
        }
    }

    /**
     * 타이포그래피 설정 추출
     * @param style 피그마 텍스트 스타일
     * @returns 타이포그래피 설정
     */
    private extractTypographyConfig(style: {fontFamily?: string, fontSize?: number, fontWeight?: number, lineHeight?: number, letterSpacing?: number}): TypographyConfig {
        return {
            fontFamily: style.fontFamily || 'Inter',
            fontSize: style.fontSize || 14,
            fontWeight: style.fontWeight || 400,
            lineHeight: style.lineHeight || style.fontSize || 14,
            letterSpacing: style.letterSpacing || 0
        };
    }

    /**
     * 색상 추출
     * @param fill 피그마 Fill 객체
     * @returns 색상 문자열
     */
    private extractColor(fill: {type: string, color?: {r: number, g: number, b: number, a?: number}}): string {
        if (fill.type === 'SOLID' && fill.color) {
            return this.rgbaToHex(fill.color);
        }
        return '#000000';
    }

    /**
     * RGBA를 HEX로 변환
     * @param color RGBA 색상 객체
     * @returns HEX 색상 문자열
     */
    private rgbaToHex(color: { r: number; g: number; b: number; a?: number }): string {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        const a = Math.round((color.a ?? 1) * 255);

        if (a < 255) {
            return `rgba(${r}, ${g}, ${b}, ${color.a})`;
        }

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * 피그마 정렬을 CSS 정렬로 매핑
     * @param alignment 피그마 정렬
     * @returns CSS 정렬
     */
    private mapAlignment(alignment: string): string {
        switch (alignment) {
            case 'MIN': return 'flex-start';
            case 'CENTER': return 'center';
            case 'MAX': return 'flex-end';
            case 'SPACE_BETWEEN': return 'space-between';
            default: return 'flex-start';
        }
    }
}
