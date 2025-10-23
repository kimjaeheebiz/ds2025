import { FigmaAPIClient } from './client';
import { FIGMA_CONFIG } from './config';
import { 
    FigmaNode, 
    FigmaComponent,
    PageDesignConfig, 
    ComponentDesignConfig,
    ComponentVariant,
    LayoutConfig,
    ThemeConfig,
    TypographyConfig,
} from './types';

export class FigmaDesignExtractor {
    private client: FigmaAPIClient;
    private token: string; // 토큰 저장
    private componentInfo: Map<string, FigmaComponent> = new Map(); // 컴포넌트 정보 캐시
    private styleInfo: Map<string, unknown> = new Map(); // 스타일 정보 캐시
    private variableInfo: Map<string, unknown> = new Map(); // 변수 정보 캐시
    private tokenStudioColors: Map<string, string> = new Map(); // 토큰 스튜디오 색상 캐시

    constructor(token: string) {
        this.client = new FigmaAPIClient(token);
        this.token = token; // 토큰 저장
        this.loadTokenStudioColors(); // 토큰 스튜디오 색상 로드
    }

    /**
     * 토큰 스튜디오 색상 로드
     */
    private loadTokenStudioColors(): void {
        // 토큰 스튜디오에서 정의된 색상 토큰들
        this.tokenStudioColors.set('text.primary', '#000000de');
        this.tokenStudioColors.set('text.secondary', '#00000099');
        this.tokenStudioColors.set('text.disabled', '#00000061');
        
        // 추가 색상 토큰들 (필요에 따라 확장)
        this.tokenStudioColors.set('primary.main', '#1976d2');
        this.tokenStudioColors.set('primary.light', '#42a5f5');
        this.tokenStudioColors.set('primary.dark', '#1565c0');
        
        this.tokenStudioColors.set('secondary.main', '#dc004e');
        this.tokenStudioColors.set('secondary.light', '#ff5983');
        this.tokenStudioColors.set('secondary.dark', '#9a0036');
        
        this.tokenStudioColors.set('success.main', '#2e7d32');
        this.tokenStudioColors.set('success.light', '#4caf50');
        this.tokenStudioColors.set('success.dark', '#1b5e20');
        
        this.tokenStudioColors.set('info.main', '#0288d1');
        this.tokenStudioColors.set('info.light', '#29b6f6');
        this.tokenStudioColors.set('info.dark', '#01579b');
        
        this.tokenStudioColors.set('warning.main', '#ed6c02');
        this.tokenStudioColors.set('warning.light', '#ff9800');
        this.tokenStudioColors.set('warning.dark', '#e65100');
        
        this.tokenStudioColors.set('error.main', '#d32f2f');
        this.tokenStudioColors.set('error.light', '#ef5350');
        this.tokenStudioColors.set('error.dark', '#c62828');
        
        console.log(`✅ 토큰 스튜디오 색상 ${this.tokenStudioColors.size}개 로드 완료`);
    }

    /**
     * 변수 정보 로드 (진실 소스만 사용)
     * @param fileKey 피그마 파일 키
     */
    private async loadVariableInfo(fileKey: string): Promise<void> {
        console.log('🔍 변수 정보 로드 시작 - 1차: Variables API 시도');
        try {
            // 1차: Variables API로 실제 변수 정보 가져오기
            const variablesData = await this.client.getFileVariables(fileKey);
            
            if (variablesData.meta && variablesData.meta.variables && Object.keys(variablesData.meta.variables).length > 0) {
                for (const [variableId, variable] of Object.entries(variablesData.meta.variables)) {
                    this.variableInfo.set(variableId, variable);
                }
                console.log(`✅ Variables API로 ${this.variableInfo.size}개 변수 로드 완료`);
                return;
            } else {
                console.log('⚠️ Variables API에서 변수 정보 없음 - fallback 진행');
            }
        } catch (error) {
            console.warn('⚠️ Variables API 실패:', error);
        }

        console.log('🔍 변수 정보 로드 - 2차: 파일 메타데이터에서 변수 추출');
        // 2차: 파일 메타데이터에서 실제 변수 정보 추출
        try {
            const fileData = await this.client.getFile(fileKey);
            if (fileData.document) {
                this.extractRealVariablesFromDocument(fileData.document);
            }
        } catch (error) {
            console.warn('⚠️ 파일에서 변수 추출 실패:', error);
        }

        console.log('🔍 변수 정보 로드 - 3차: 스타일 정보에서 변수 추출');
        // 3차: 스타일 정보에서 변수 정보 추출
        try {
            console.log('🔍 3차: 스타일 정보에서 변수 정보 추출 시작');
            await this.extractVariablesFromStyles();
            console.log(`✅ 스타일 정보 추출 완료: ${this.variableInfo.size}개 변수`);
        } catch (error) {
            console.warn('⚠️ 스타일에서 변수 추출 실패:', error);
        }
    }

    /**
     * 문서에서 실제 변수 정보 추출 (진실 소스)
     * @param document 피그마 문서
     */
    private extractRealVariablesFromDocument(document: unknown): void {
        const foundVariables = new Set<string>();
        
        // 문서를 재귀적으로 탐색하여 실제 변수 정보 추출
        const extractFromNode = (node: unknown) => {
            if (node && typeof node === 'object' && 'boundVariables' in node) {
                const nodeObj = node as { boundVariables: Record<string, unknown> };
                for (const [, variableRef] of Object.entries(nodeObj.boundVariables)) {
                    if (variableRef && typeof variableRef === 'object' && 'id' in variableRef) {
                        const variableId = (variableRef as { id: string }).id;
                        foundVariables.add(variableId);
                        
                        // 실제 변수명을 피그마에서 추출 (추측하지 않음)
                        const realVariableName = this.extractRealVariableNameFromNode(node);
                        if (realVariableName) {
                            this.variableInfo.set(variableId, { name: realVariableName });
                            console.log(`🔍 실제 변수 발견: ${variableId} → ${realVariableName}`);
                        }
                    }
                }
            }

            if (node && typeof node === 'object' && 'children' in node) {
                const nodeObj = node as { children: unknown[] };
                nodeObj.children.forEach(extractFromNode);
            }
        };

        extractFromNode(document);
        
        console.log(`✅ 문서에서 ${this.variableInfo.size}개 실제 변수 추출 완료`);
    }

    /**
     * 스타일 정보에서 변수 정보 추출 (개선된 버전)
     */
    private async extractVariablesFromStyles(): Promise<void> {
        try {
            console.log(`🔍 스타일 정보 분석 시작: ${this.styleInfo.size}개 스타일`);
            
            for (const [styleId, style] of this.styleInfo.entries()) {
                const styleObj = style as { name?: string };
                console.log(`🔍 스타일 분석: ${styleId} → ${styleObj.name}`);
                
                if (styleObj.name) {
                    // 스타일 이름에서 변수 정보 추출
                    const variableName = this.parseStyleNameToVariable(styleObj.name);
                    if (variableName) {
                        // 스타일 ID를 변수 ID로 사용 (근사치)
                        this.variableInfo.set(`style_${styleId}`, { name: variableName });
                        console.log(`✅ 스타일에서 변수 추출: ${styleObj.name} → ${variableName}`);
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ 스타일에서 변수 추출 실패:', error);
        }
    }

    /**
     * 노드에서 실제 변수명 추출 (추측하지 않음)
     * @param node 피그마 노드
     * @param variableId Variable ID
     * @returns 실제 변수명
     */
    private extractRealVariableNameFromNode(node: unknown): string | null {
        // 1. 노드의 스타일 정보에서 실제 변수명 추출
        if (node && typeof node === 'object' && 'style' in node) {
            const nodeObj = node as { style?: { name?: string } };
            if (nodeObj.style?.name) {
                const parsedName = this.parseStyleNameToVariable(nodeObj.style.name);
                if (parsedName) {
                    return parsedName;
                }
            }
        }

        // 2. 노드 이름에서 실제 변수명 추출
        if (node && typeof node === 'object' && 'name' in node) {
            const nodeObj = node as { name?: string };
            if (nodeObj.name) {
                const parsedName = this.parseStyleNameToVariable(nodeObj.name);
                if (parsedName) {
                    return parsedName;
                }
            }
        }

        // 3. 텍스트 내용이 아닌 실제 피그마 속성에서 추출
        if (node && typeof node === 'object' && 'characters' in node) {
            // 텍스트 내용을 기반으로 추측하지 않고, 실제 피그마 속성만 사용
            return null; // 추측 금지
        }

        return null;
    }

    /**
     * 스타일/노드 이름을 변수명으로 파싱 (개선된 버전)
     * @param name 스타일 또는 노드 이름
     * @returns 변수명
     */
    private parseStyleNameToVariable(name: string): string | null {
        console.log(`🔍 스타일 이름 파싱: "${name}"`);
        
        // 피그마 스타일 이름 패턴 분석 (진실 소스만)
        const patterns = [
            /^([a-zA-Z]+)\/([a-zA-Z]+)$/,  // primary/light
            /^([a-zA-Z]+)\.([a-zA-Z]+)$/,  // primary.light
            /^([a-zA-Z]+)\s+([a-zA-Z]+)$/, // primary light
            /^([a-zA-Z]+)_([a-zA-Z]+)$/,   // primary_light
            /^([a-zA-Z]+)-([a-zA-Z]+)$/,   // primary-light
        ];

        for (const pattern of patterns) {
            const match = name.match(pattern);
            if (match) {
                const [, group, tone] = match;
                const variableName = `${group.toLowerCase()}/${tone.toLowerCase()}`;
                console.log(`✅ 패턴 매칭: "${name}" → "${variableName}"`);
                return variableName;
            }
        }

        // 특별한 케이스: warning/light 같은 직접적인 변수명
        if (name.includes('/') && name.split('/').length === 2) {
            const variableName = name.toLowerCase();
            console.log(`✅ 직접 변수명: "${name}" → "${variableName}"`);
            return variableName;
        }

        console.log(`❌ 패턴 매칭 실패: "${name}"`);
        return null;
    }

    /**
     * 노드 이름을 변수명으로 변환
     * @param nodeName 노드 이름
     * @returns 변수명
     */
    private convertNodeNameToVariableName(nodeName: string): string {
        // 노드 이름을 분석하여 변수명 생성
        const name = nodeName.toLowerCase();
        
        if (name.includes('subtitle1') && name.includes('primary')) return 'Primary/Light';
        if (name.includes('caption') && name.includes('info')) return 'Info/Light';
        if (name.includes('h2') && name.includes('primary')) return 'Primary/Dark';
        if (name.includes('h2') && name.includes('success')) return 'Success/Dark';
        if (name.includes('subtitle1') && name.includes('text')) return 'Text/Primary';
        
        return nodeName;
    }


    /**
     * 스타일 정보 로드
     * @param fileKey 피그마 파일 키
     */
    private async loadStyleInfo(fileKey: string): Promise<void> {
        try {
            // 메인 파일의 스타일 정보 로드
            const stylesData = await this.client.getFileStyles(fileKey);

            if (stylesData.meta && stylesData.meta.styles) {
                for (const [styleId, style] of Object.entries(stylesData.meta.styles)) {
                    this.styleInfo.set(styleId, style);
                }
            }

            // 라이브러리 파일의 스타일 정보도 로드
            const libraryFileKey = FIGMA_CONFIG.files.library;
            if (libraryFileKey && libraryFileKey !== fileKey) {
                const libraryStylesData = await this.client.getFileStyles(libraryFileKey);

                if (libraryStylesData.meta && libraryStylesData.meta.styles) {
                    for (const [styleId, style] of Object.entries(libraryStylesData.meta.styles)) {
                        this.styleInfo.set(styleId, style);
                    }
                }
            }

            console.log(`✅ 총 ${this.styleInfo.size}개 스타일 로드 완료`);
            console.log(`🔍 로드된 스타일 목록:`, Array.from(this.styleInfo.keys()));
            
            // 스타일 구조 디버깅
            console.log(`🔍 첫 번째 스타일 구조 예시:`, Array.from(this.styleInfo.entries())[0]);
        } catch (error) {
            console.warn('❌ 스타일 정보 로드 실패:', error);
        }
    }

    /**
     * 컴포넌트 정보 로드
     * @param fileKey 피그마 파일 키
     */
    private async loadComponentInfo(fileKey: string): Promise<void> {
        try {

            // 메인 파일의 컴포넌트 정보 로드
            const componentsData = await this.client.getFileComponents(fileKey);

            if (componentsData.meta && componentsData.meta.components) {
                for (const [componentId, component] of Object.entries(componentsData.meta.components)) {
                    this.componentInfo.set(componentId, component);
                }
            }

            // 라이브러리 파일의 컴포넌트 정보도 로드
            const libraryFileKey = FIGMA_CONFIG.files.library;
            if (libraryFileKey && libraryFileKey !== fileKey) {
                const libraryComponentsData = await this.client.getFileComponents(libraryFileKey);

                if (libraryComponentsData.meta && libraryComponentsData.meta.components) {
                    for (const [componentId, component] of Object.entries(libraryComponentsData.meta.components)) {
                        this.componentInfo.set(componentId, component);
                    }
                }
            }

            console.log(`✅ 총 ${this.componentInfo.size}개 컴포넌트 로드 완료`);
        } catch (error) {
            console.warn('❌ 컴포넌트 정보 로드 실패:', error);
        }
    }

    /**
     * 컴포넌트 variant 정보 추출 (피그마 속성만 사용)
     * @param node 피그마 노드
     * @returns 컴포넌트 variant 정보
     */
    private getComponentVariant(): string | null {
        // 피그마의 실제 속성 값만 사용 - 추정/대안 로직 제거
        return null;
    }

    async extractPageDesigns(fileKey: string, pageNodeIds: string[]): Promise<PageDesignConfig[]> {
        try {
            // 먼저 컴포넌트 정보와 스타일 정보 가져오기
            await Promise.all([
                this.loadComponentInfo(fileKey),
                this.loadStyleInfo(fileKey)
            ]);
            
            // 변수 정보는 선택적으로 로드 (실패해도 계속 진행)
            try {
                console.log('🔍 변수 정보 로드 시작');
                await this.loadVariableInfo(fileKey);
                console.log('✅ 변수 정보 로드 완료');
            } catch (error) {
                console.warn('⚠️ 변수 정보 로드 실패, 텍스트 기반 추출 사용:', error);
            }

            const fileData = await this.client.getFileNodes(fileKey, pageNodeIds);
            const pageDesigns: PageDesignConfig[] = [];

            for (const nodeId of pageNodeIds) {
                const node = fileData.nodes[nodeId]?.document;
                if (node) {
                    const pageDesign = await this.parsePageNode(node);
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
    private async parsePageNode(node: FigmaNode): Promise<PageDesignConfig> {
        // "Main Content" 프레임 찾기
        const mainContentFrame = this.findMainContentFrame(node);

        const components = mainContentFrame ? await this.extractComponentsFromFrame(mainContentFrame) : [];

        const pageDesign: PageDesignConfig = {
            pageId: node.id,
            pageName: node.name,
            components,
            layout: await this.extractLayoutConfig(node),
            theme: this.extractThemeConfig(node),
        };

        return pageDesign;
    }

    /**
     * "Main Content" 프레임 찾기
     * @param node 페이지 노드
     * @returns Main Content 프레임 또는 null
     */
    private findMainContentFrame(node: FigmaNode): FigmaNode | null {
        // 직접적인 이름 매칭
        if (this.isMainContentFrame(node)) {
            return node;
        }

        // 자식 노드에서 재귀적으로 찾기
        if (node.children) {
            for (const child of node.children) {
                const found = this.findMainContentFrame(child);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }

    /**
     * Main Content 프레임인지 확인
     * @param node 노드
     * @returns Main Content 프레임 여부
     */
    private isMainContentFrame(node: FigmaNode): boolean {
        // 새로운 설정 구조 사용
        const mainContentNames = FIGMA_CONFIG.figmaMapping.layout.mainContent as readonly string[];
        return mainContentNames.includes(node.name);
    }

    /**
     * 프레임에서 컴포넌트들 추출
     * @param frame 프레임 노드
     * @returns 컴포넌트 배열
     */
    private async extractComponentsFromFrame(frame: FigmaNode): Promise<ComponentDesignConfig[]> {
        const components: ComponentDesignConfig[] = [];

        if (frame.children) {
            for (const child of frame.children) {
                const component = await this.extractComponentDesign(child);
                if (component) {
                    components.push(component);
                }
            }
        }

        return components;
    }

    /**
     * MainContent 프레임에서 실제 UI 컴포넌트들 추출 (병합용)
     * @param mainContentFrame MainContent 프레임
     * @returns 추출된 컴포넌트 정보
     */
    public async extractMainContentComponents(mainContentFrame: FigmaNode): Promise<{
        table?: ComponentDesignConfig;
        buttons?: ComponentDesignConfig[];
        inputs?: ComponentDesignConfig[];
        filters?: ComponentDesignConfig[];
        layout?: {
            spacing: number;
            padding: number;
            direction: 'row' | 'column';
        };
    }> {
        const result: {
            table?: ComponentDesignConfig;
            buttons?: ComponentDesignConfig[];
            inputs?: ComponentDesignConfig[];
            filters?: ComponentDesignConfig[];
            layout?: {
                spacing: number;
                padding: number;
                direction: 'row' | 'column';
            };
        } = {
            buttons: [],
            inputs: [],
            filters: [],
        };

        if (!mainContentFrame.children) {
            return result;
        }

        // 레이아웃 정보 추출
        if (mainContentFrame.layoutMode) {
            result.layout = {
                spacing: mainContentFrame.itemSpacing || 24,
                padding: mainContentFrame.paddingTop || 24,
                direction: mainContentFrame.layoutMode === 'HORIZONTAL' ? 'row' : 'column',
            };
        }

        // 각 자식 컴포넌트 분석
        for (const child of mainContentFrame.children) {
            const componentType = this.determineComponentType(child);

            if (componentType === 'table') {
                const tableComponent = await this.extractComponentDesign(child);
                if (tableComponent) {
                    result.table = tableComponent;
                }
            } else if (componentType === 'button') {
                const buttonComponent = await this.extractComponentDesign(child);
                if (buttonComponent) {
                    result.buttons?.push(buttonComponent);
                }
            } else if (componentType === 'input') {
                const inputComponent = await this.extractComponentDesign(child);
                if (inputComponent) {
                    result.inputs?.push(inputComponent);
                }
            } else if (child.name.toLowerCase().includes('filter') || child.name.toLowerCase().includes('toggle')) {
                const filterComponent = await this.extractComponentDesign(child);
                if (filterComponent) {
                    result.filters?.push(filterComponent);
                }
            }
        }

        return result;
    }

    /**
     * 레이아웃 컴포넌트 추출 (기존 컴포넌트와 연동용)
     * @param node 페이지 노드
     * @returns 레이아웃 컴포넌트 설정
     */
    public async extractLayoutComponents(node: FigmaNode): Promise<Record<string, ComponentDesignConfig | null>> {
        const layoutComponents: Record<string, ComponentDesignConfig | null> = {
            header: null,
            sidebar: null,
            pageHeader: null,
            footer: null,
        };

        // 각 레이아웃 프레임 찾기
        const layoutTypes = ['header', 'sidebar', 'pageHeader', 'footer'] as const;

        for (const frameType of layoutTypes) {
            const frameNames =
                FIGMA_CONFIG.figmaMapping.layout[frameType as keyof typeof FIGMA_CONFIG.figmaMapping.layout];
            if (frameNames && frameNames.length > 0) {
                const frame = this.findFrameByName(node, frameNames[0]);
                if (frame) {
                    layoutComponents[frameType] = await this.extractComponentDesign(frame);
                }
            }
        }

        return layoutComponents;
    }

    /**
     * 특정 이름의 프레임 찾기
     * @param node 부모 노드
     * @param frameName 찾을 프레임 이름
     * @returns 찾은 프레임 또는 null
     */
    private findFrameByName(node: FigmaNode, frameName: string): FigmaNode | null {
        // 직접적인 이름 매칭
        if (node.name.toLowerCase() === frameName.toLowerCase()) {
            return node;
        }

        // 자식 노드에서 재귀적으로 찾기
        if (node.children) {
            for (const child of node.children) {
                const found = this.findFrameByName(child, frameName);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }

    /**
     * 컴포넌트 노드 파싱
     * @param node 피그마 노드
     * @returns 컴포넌트 디자인 설정
     */
    private async extractComponentDesign(node: FigmaNode): Promise<ComponentDesignConfig | null> {
        // 컴포넌트 타입 결정
        const componentType = this.determineComponentType(node);
        if (!componentType) return null;

        const component: ComponentDesignConfig = {
            componentId: node.id,
            componentName: node.name,
            componentType,
            properties: await this.extractComponentProperties(node),
            variants: await this.extractComponentVariants(node),
        };

        return component;
    }

    /**
     * 컴포넌트 타입 결정 (설정 파일 기반)
     * @param node 피그마 노드
     * @returns 컴포넌트 타입
     */
    private determineComponentType(node: FigmaNode): ComponentDesignConfig['componentType'] | null {
        const name = node.name;

        // 새로운 설정 구조 사용
        // 컴포넌트 인스턴스 매칭
        const components = FIGMA_CONFIG.figmaMapping.components as Record<string, readonly string[]>;
        for (const [componentType, typeNames] of Object.entries(components)) {
            if (typeNames.includes(name)) {
                return componentType as ComponentDesignConfig['componentType'];
            }
        }

        // MUI 컴포넌트 매칭
        const muiComponents = FIGMA_CONFIG.figmaMapping.muiComponents as Record<string, readonly string[]>;
        for (const [componentType, typeNames] of Object.entries(muiComponents)) {
            if (typeNames.includes(name)) {
                return componentType as ComponentDesignConfig['componentType'];
            }
        }
        
        return null;
    }

    /**
     * 테이블 컬럼 정보 추출
     * @param node 테이블 노드
     * @returns 테이블 컬럼 배열
     */
    private extractTableColumns(node: FigmaNode): Array<{ key: string; label: string; type: string }> {
        const columns: Array<{ key: string; label: string; type: string }> = [];

        // 테이블 헤더 찾기
        const headerRow = node.children?.find(
            (child) => child.name.toLowerCase().includes('header') || child.name.toLowerCase().includes('thead'),
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
                        type,
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
            번호: 'index', // 테이블 순번 (인덱스)
            이메일: 'id', // 이메일
            '이메일 아이디': 'id', // 이메일 (다른 표현)
            '사용자 ID': 'id', // 이메일 아이디 (다른 표현)
            이름: 'name',
            부서: 'department', // 소속 (부서)
            소속: 'department', // 소속
            권한: 'permission',
            상태: 'status',
            가입일: 'regdate',
            '최근 로그인': 'last_login',
            워크플로우명: 'name',
            설명: 'description',
            생성자: 'user_name',
            즐겨찾기: 'isFavorite',
            생성일: 'created_at',
            수정일: 'updated_at',
            전화번호: 'phone',
            주소: 'address',
            직급: 'position',
            입사일: 'joinDate',
            퇴사일: 'leaveDate',
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
        if (
            label.includes('실행여부') ||
            label.includes('차단여부') ||
            label.includes('즐겨찾기') ||
            label.includes('favorite')
        )
            return 'boolean';
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
    private async extractComponentProperties(
        node: FigmaNode,
    ): Promise<Record<
        string,
        | string
        | number
        | boolean
        | TypographyConfig
        | { left: number; right: number; top: number; bottom: number }
        | Array<{ key: string; label: string; type: string }>
    >> {
        const properties: Record<
            string,
            | string
            | number
            | boolean
            | TypographyConfig
            | { left: number; right: number; top: number; bottom: number }
            | Array<{ key: string; label: string; type: string }>
        > = {};

        // 크기 정보 (채우기 및 hug 설정 감지)
        if (node.absoluteBoundingBox) {
            // layoutSizing 속성 확인 (hug content 감지)
            const isHugWidth = node.layoutSizingHorizontal === 'HUG';
            const isHugHeight = node.layoutSizingVertical === 'HUG';

            // constraints 확인 (fill 설정 감지)
            const hasFillWidth =
                node.constraints?.horizontal === 'LEFT_RIGHT' || node.constraints?.horizontal === 'CENTER';
            const hasFillHeight =
                node.constraints?.vertical === 'TOP_BOTTOM' || node.constraints?.vertical === 'CENTER';

            // width 설정
            if (isHugWidth) {
                properties.width = 'hug';
            } else if (hasFillWidth) {
                properties.width = 'fill';
            } else {
            properties.width = node.absoluteBoundingBox.width;
            }

            // height 설정
            if (isHugHeight) {
                properties.height = 'hug';
            } else if (hasFillHeight) {
                properties.height = 'fill';
            } else {
            properties.height = node.absoluteBoundingBox.height;
            }
        }

        // 색상 정보 (스타일 이름 우선)
        if (node.fills && node.fills.length > 0) {
            const colorInfo = await this.extractColorWithStyle(node.fills[0]);
            if (colorInfo.styleName) {
                properties.colorStyle = colorInfo.styleName;
                } else {
                    // GPT-5 권장: boundVariables에서 Variable ID 추출
                    const fillObj = node.fills[0] as { boundVariables?: { color?: { id: string } } };
                    if (fillObj.boundVariables?.color?.id) {
                        const variableId = fillObj.boundVariables.color.id;
                        // GPT-5 권장: Variable ID → 변수명 → MUI 경로 변환
                        const muiColorPath = await this.extractThemeTokenFromVariableId(variableId);
                        if (muiColorPath) {
                            properties.colorStyle = muiColorPath;
                            console.log(`🎨 GPT-5 방식: Variable ID ${variableId} → ${muiColorPath}`);
                        } else {
                            // 진실 소스가 없으면 HEX 색상 사용 (추측 금지)
                            properties.colorStyle = colorInfo.color;
                            console.log(`🎨 진실 소스 없음: "${node.characters}" HEX 색상 사용: ${colorInfo.color}`);
                        }
                    }
                }
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

        // 텍스트 속성 (피그마 variant만 사용)
        if (node.characters) {
            properties.text = node.characters;
            if (node.style) {
                properties.typography = this.extractTypographyConfig(node.style, null, node);
                // 텍스트 스타일에서 컬러 정보 추출
                const textColorInfo = this.extractTextColorFromStyle(node.style);
                if (textColorInfo.styleName) {
                    properties.colorStyle = textColorInfo.styleName;
                }
            }
            
            // 노드의 fills에서 컬러 정보 추출 (텍스트 노드의 경우)
            if (node.fills && node.fills.length > 0) {
                console.log(`🔍 텍스트 노드 "${node.characters}" fills 정보:`, node.fills);
                const colorInfo = await this.extractColorWithStyle(node.fills[0]);
                if (colorInfo.styleName) {
                    properties.colorStyle = colorInfo.styleName;
                    console.log(`🎨 텍스트 노드 "${node.characters}" fills에서 스타일 컬러 발견: ${colorInfo.styleName}`);
                        } else {
                            // 진실 소스가 없으면 HEX 색상 사용 (추측 금지)
                            properties.colorStyle = colorInfo.color;
                            console.log(`🎨 진실 소스 없음: "${node.characters}" HEX 색상 사용: ${colorInfo.color}`);
                        }
            }
        } else if (node.children) {
            // MUI Typography 컴포넌트의 경우: 자식 노드에서 실제 텍스트 찾기
            console.log(`🔍 Typography 인스턴스 "${node.name}" 구조:`, {
                type: node.type,
                name: node.name,
                children: node.children?.map(child => ({
                    type: child.type,
                    name: child.name,
                    characters: child.characters,
                    fills: child.fills,
                    style: child.style
                }))
            });
            
            for (const child of node.children) {
                if (child.characters) {
                    properties.text = child.characters;
                    if (child.style) {
                        properties.typography = this.extractTypographyConfig(child.style, null, node);
                    }
                    
                    // 실제 텍스트 노드의 컬러 정보 추출 (MUI Typography 구조)
                    if (child.fills && child.fills.length > 0) {
                        console.log(`🔍 하위 텍스트 노드 "${child.characters}" fills 상세:`, child.fills[0]);
                        
                        // Variable ID 기반으로 색상 정보 추출
                        const colorInfo = await this.extractColorWithStyle(child.fills[0]);
                        if (colorInfo.styleName) {
                            properties.colorStyle = colorInfo.styleName;
                            console.log(`🎨 MUI Typography 텍스트 "${child.characters}" 스타일 컬러 발견: ${colorInfo.styleName}`);
                        } else {
                            // GPT-5 권장: boundVariables에서 Variable ID 추출
                            const fillObj = child.fills[0] as { boundVariables?: { color?: { id: string } } };
                            if (fillObj.boundVariables?.color?.id) {
                                const variableId = fillObj.boundVariables.color.id;
                                // GPT-5 권장: Variable ID → 변수명 → MUI 경로 변환
                                const muiColorPath = await this.extractThemeTokenFromVariableId(variableId);
                                if (muiColorPath) {
                                    properties.colorStyle = muiColorPath;
                                    console.log(`🎨 GPT-5 방식: Variable ID ${variableId} → ${muiColorPath}`);
                                } else {
                                    // 진실 소스가 없으면 HEX 색상 사용 (추측 금지)
                                    properties.colorStyle = colorInfo.color;
                                    console.log(`🎨 진실 소스 없음: "${child.characters}" HEX 색상 사용: ${colorInfo.color}`);
                                }
                            } else {
                                properties.colorStyle = colorInfo.color;
                                console.log(`🎨 MUI Typography 텍스트 "${child.characters}" HEX 색상 사용: ${colorInfo.color}`);
                            }
                        }
                    }
                    break; // 첫 번째 텍스트 노드만 사용
                }
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
        if (
            node.paddingLeft !== undefined ||
            node.paddingRight !== undefined ||
            node.paddingTop !== undefined ||
            node.paddingBottom !== undefined
        ) {
            properties.padding = {
                left: node.paddingLeft || 0,
                right: node.paddingRight || 0,
                top: node.paddingTop || 0,
                bottom: node.paddingBottom || 0,
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
    private async extractComponentVariants(node: FigmaNode): Promise<ComponentVariant[]> {
        const variants: ComponentVariant[] = [];
        
        // 자식 노드들을 변형으로 처리
        if (node.children) {
            for (const child of node.children) {
                if (child.name.includes('variant') || child.name.includes('state')) {
                    variants.push({
                        variantName: child.name,
                        properties: await this.extractComponentProperties(child),
                    });
                }
            }
        }

        return variants;
    }

    /**
     * 레이아웃 설정 추출
     * @param node 피그마 노드
     * @returns 레이아웃 설정
     */
    private async extractLayoutConfig(node: FigmaNode): Promise<LayoutConfig> {
        const layout: LayoutConfig = {
            containerType: 'flex',
            direction: 'column',
            spacing: 0,
        };

        if (node.layoutMode) {
            layout.containerType = node.layoutMode === 'NONE' ? 'absolute' : 'flex';
            layout.direction = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
        }

        if (node.itemSpacing !== undefined) {
            layout.spacing = node.itemSpacing;
        }

        if (
            node.paddingLeft !== undefined ||
            node.paddingRight !== undefined ||
            node.paddingTop !== undefined ||
            node.paddingBottom !== undefined
        ) {
            layout.padding = {
                left: node.paddingLeft || 0,
                right: node.paddingRight || 0,
                top: node.paddingTop || 0,
                bottom: node.paddingBottom || 0,
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
            shadows: {},
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
            node.children.forEach((child) => this.extractColorsFromNode(child, colors));
        }
    }

    /**
     * 노드에서 타이포그래피 추출
     * @param node 피그마 노드
     * @param typography 타이포그래피 객체
     */
    private extractTypographyFromNode(node: FigmaNode, typography: Record<string, TypographyConfig>): void {
        if (node.characters && node.style) {
            const config = this.extractTypographyConfig(node.style, null, node);
            typography[node.name.toLowerCase().replace(/\s+/g, '-')] = config;
        }

        if (node.children) {
            node.children.forEach((child) => this.extractTypographyFromNode(child, typography));
        }
    }

    /**
     * 타이포그래피 설정 추출 (피그마 속성만 사용)
     * @param style 피그마 텍스트 스타일
     * @param componentVariant 컴포넌트 variant (사용하지 않음)
     * @param node 피그마 노드 (variant 정보 추출용)
     * @returns 타이포그래피 설정
     */
    private extractTypographyConfig(
        style: {
            fontFamily?: string;
            fontSize?: number;
            fontWeight?: number;
            lineHeight?: number;
            letterSpacing?: number;
        },
        componentVariant?: string | null,
        node?: FigmaNode,
    ): TypographyConfig {
        // 피그마에서 가져온 값만 사용 (하드코딩된 기본값 제거)
        const fontSize = style.fontSize;
        const fontWeight = style.fontWeight;

        // 피그마 variant 정보만 추출 (추정/대안 로직 제거)
        const figmaVariant = this.extractFigmaVariant(node);

        let variant: string | undefined;

        // 피그마 속성이 있으면 사용, 없으면 스타일 기반 추정
        if (figmaVariant) {
            variant = figmaVariant;
        } else if (fontSize && fontWeight) {
            // 디자인 시스템 토큰 기반 variant 추정
            variant = this.estimateVariantFromDesignTokens(fontSize, fontWeight, style.fontFamily);
        } else {
            // 피그마 속성이 없으면 variant 생략
            variant = undefined;
        }

        return {
            fontFamily: style.fontFamily,
            fontSize: fontSize,
            fontWeight: fontWeight,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
            variant: variant,
        };
    }

    /**
     * 디자인 시스템 토큰 기반 variant 추정 (스타일 바인딩 활용)
     * @param fontSize 폰트 크기
     * @param fontWeight 폰트 두께
     * @param fontFamily 폰트 패밀리
     * @returns 추정된 variant
     */
    private estimateVariantFromDesignTokens(fontSize: number, fontWeight: number, fontFamily?: string): string {
        // 디자인 시스템 토큰 기반 매핑 (core.json 기준)
        // Ag typography/body1, Ag typography/body2 등과 매칭
        
        // 폰트 패밀리 확인 (Ag typography 스타일인지)
        const isAgTypography = fontFamily?.includes('Ag') || fontFamily?.includes('Pretendard');
        
        // 디자인 시스템 토큰 기반 정확한 매핑
        if (isAgTypography) {
            // Ag typography 스타일 기반 매핑
            if (fontSize >= 60 && fontWeight >= 600) return 'h1';
            if (fontSize >= 32 && fontWeight >= 600) return 'h2';
            if (fontSize >= 24 && fontWeight >= 600) return 'h3';
            if (fontSize >= 20 && fontWeight >= 600) return 'h4';
            if (fontSize >= 18 && fontWeight >= 600) return 'h5';
            if (fontSize >= 16 && fontWeight >= 600) return 'h6';
            if (fontSize >= 16 && fontWeight >= 500) return 'subtitle1';
            if (fontSize >= 14 && fontWeight >= 500) return 'subtitle2';
            if (fontSize >= 16 && fontWeight >= 400) return 'body1';
            if (fontSize >= 14 && fontWeight >= 400) return 'body2';
            if (fontSize >= 12 && fontWeight >= 400) return 'caption';
            if (fontSize >= 10 && fontWeight >= 400) return 'overline';
        } else {
            // 일반 폰트의 경우 기존 로직 사용
            return this.estimateVariantFromStyle(fontSize, fontWeight);
        }
        
        // 기본값
        return 'body1';
    }

    /**
     * 스타일 정보로부터 variant 추정 (일반 텍스트용)
     * @param fontSize 폰트 크기
     * @param fontWeight 폰트 두께
     * @returns 추정된 variant
     */
    private estimateVariantFromStyle(fontSize: number, fontWeight: number): string {
        // MUI Typography variant 매핑 (일반적인 기준)
        if (fontSize >= 32 && fontWeight >= 600) return 'h1';
        if (fontSize >= 28 && fontWeight >= 600) return 'h2';
        if (fontSize >= 24 && fontWeight >= 600) return 'h3';
        if (fontSize >= 20 && fontWeight >= 600) return 'h4';
        if (fontSize >= 18 && fontWeight >= 600) return 'h5';
        if (fontSize >= 16 && fontWeight >= 600) return 'h6';
        if (fontSize >= 16 && fontWeight >= 500) return 'subtitle1';
        if (fontSize >= 14 && fontWeight >= 500) return 'subtitle2';
        if (fontSize >= 16 && fontWeight >= 400) return 'body1';
        if (fontSize >= 14 && fontWeight >= 400) return 'body2';
        if (fontSize >= 12 && fontWeight >= 400) return 'caption';
        if (fontSize >= 10 && fontWeight >= 400) return 'overline';
        
        // 기본값
        return 'body1';
    }

    /**
     * 피그마 노드에서 variant 정보 직접 추출
     */
    private extractFigmaVariant(node?: FigmaNode): string | null {
        if (!node) return null;


        // 피그마 API에서 variant 정보 추출 시도
        if (node.variantProperties) {
            // variantProperties에서 variant 정보 추출
            for (const [key, value] of Object.entries(node.variantProperties)) {
                if (key.toLowerCase().includes('variant')) {
                    return value as string;
                }
            }
        }

        // componentProperties에서 variant 정보 추출 시도
        if (node.componentProperties) {
            for (const [key, value] of Object.entries(node.componentProperties)) {
                if (key.toLowerCase().includes('variant')) {
                    // value가 객체인 경우 value 속성 추출
                    const variantValue =
                        typeof value === 'object' && value !== null && 'value' in value
                            ? (value as { value: string }).value
                            : value;
                    return variantValue as string;
                }
            }
        }

        // 노드 이름에서 variant 추출 시도
        if (node.name && node.name.includes('Variant=')) {
            const variantMatch = node.name.match(/Variant=([^,]+)/);
            if (variantMatch) {
                const variant = variantMatch[1];
                return variant;
            }
        }

        return null;
    }

    /**
     * 텍스트 스타일에서 컬러 정보 추출
     * @param style 피그마 텍스트 스타일
     * @returns 컬러와 스타일 정보
     */
    private extractTextColorFromStyle(style: unknown): { color: string; styleName?: string } {
        const styleObj = style as { fills?: Array<{ styleId?: string; color?: { r: number; g: number; b: number; a?: number }; type: string }> };
        
        console.log(`🔍 텍스트 스타일 상세 정보:`, {
            fills: styleObj.fills,
            styleId: styleObj.fills?.[0]?.styleId,
            color: styleObj.fills?.[0]?.color,
            fullStyle: styleObj
        });
        
        if (styleObj.fills && styleObj.fills.length > 0) {
            const fill = styleObj.fills[0];
            if (fill.styleId) {
                const styleInfo = this.styleInfo.get(fill.styleId) as { name: string } | undefined;
                console.log(`🔍 스타일 ID ${fill.styleId}에 대한 정보:`, styleInfo);
                if (styleInfo) {
                    return {
                        color: this.extractColor(fill),
                        styleName: styleInfo.name
                    };
                }
            }
            return {
                color: this.extractColor(fill)
            };
        }

        return {
            color: '#000000'
        };
    }

    /**
     * 색상과 스타일 정보 추출
     * @param fill 피그마 Fill 객체
     * @returns 색상과 스타일 정보
     */
    private async extractColorWithStyle(fill: unknown): Promise<{ color: string; styleName?: string }> {
        const fillObj = fill as { 
            styleId?: string; 
            color?: { r: number; g: number; b: number; a?: number }; 
            type: string;
            boundVariables?: {
                color?: {
                    type: string;
                    id: string;
                }
            }
        };
        
        // boundVariables에서 테마 토큰 정보 추출 (우선순위 1)
        if (fillObj.boundVariables?.color?.id) {
            const variableId = fillObj.boundVariables.color.id;
            const themeToken = await this.extractThemeTokenFromVariableId(variableId);
            if (themeToken) {
                // 토큰 스튜디오 색상이 있으면 우선 사용
                const tokenStudioColor = this.tokenStudioColors.get(themeToken);
                if (tokenStudioColor) {
                    console.log(`🎨 토큰 스튜디오 색상 사용: ${themeToken} → ${tokenStudioColor}`);
                    return {
                        color: tokenStudioColor,
                        styleName: themeToken
                    };
                }
                
                return {
                    color: this.extractColor(fillObj),
                    styleName: themeToken
                };
            }
        }
        
        // 스타일 ID가 있는 경우 스타일 이름 추출 (우선순위 2)
        if (fillObj.styleId) {
            const style = this.styleInfo.get(fillObj.styleId) as { name: string } | undefined;
            if (style) {
                return {
                    color: this.extractColor(fillObj),
                    styleName: style.name
                };
            }
        }

        // 스타일 ID가 없는 경우 기본 색상 추출
        return {
            color: this.extractColor(fillObj)
        };
    }

    /**
     * Variable ID에서 테마 토큰 이름 추출 (진실 소스만 사용)
     * @param variableId 피그마 Variable ID
     * @returns MUI 테마 토큰 이름
     */
    /**
     * Variable ID에서 MUI 테마 토큰 추출 (GPT-5 방식)
     * @param variableId Variable ID
     * @returns MUI 색상 경로
     */
    private async extractThemeTokenFromVariableId(variableId: string): Promise<string | null> {
        console.log(`🔍 Variable ID 분석: ${variableId}`);
        
        // GPT-5 권장: Variable ID 정규화
        const rawId = variableId;
        const varId = rawId.split('/').pop()!; // "835:458"
        const encoded = encodeURIComponent(varId); // "835%3A458"
        
        console.log(`🔍 정규화된 ID: ${varId} → ${encoded}`);
        
        // GPT-5 권장: Variables API로 변수명 조회
        try {
            const response = await fetch(`https://api.figma.com/v1/variables/${encoded}`, {
                headers: { 'X-Figma-Token': this.token }
            });
            
            if (!response.ok) {
                console.warn(`⚠️ Variables API ${response.status}: ${variableId}`);
                // Variables API 실패 시 토큰 스튜디오 색상 사용
                return this.getTokenStudioColorForVariableId(variableId);
            }
            
            const data = await response.json();
            const variableName = data.name;
            console.log(`✅ Variables API 성공: ${variableId} → ${variableName}`);
            
            // GPT-5 권장: MUI 경로 변환
            const muiColorPath = this.toMuiColorPath(variableName);
            console.log(`🎨 MUI 변환: ${variableName} → ${muiColorPath}`);
            return muiColorPath;
            
        } catch (error) {
            console.warn(`⚠️ Variables API 실패: ${variableId}`, error);
            // Variables API 실패 시 토큰 스튜디오 색상 사용
            return this.getTokenStudioColorForVariableId(variableId);
        }
    }

    /**
     * Variable ID에 해당하는 토큰 스튜디오 색상 반환
     * @param variableId Variable ID
     * @returns 토큰 스튜디오 색상 경로
     */
    private getTokenStudioColorForVariableId(variableId: string): string | null {
        // Variable ID 패턴에 따른 토큰 스튜디오 색상 매핑
        const variableMappings: Record<string, string> = {
            'VariableID:81dfae1aeb998f06652d2b26402d52eaf067f713/918:47': 'text.disabled', // 텍스트 비활성화 색상
            'VariableID:db2de3ffa703ac3ba0e2f5d573828c1de0870d1d/918:41': 'text.secondary', // 텍스트 보조 색상
            // 추가 Variable ID 매핑들...
        };
        
        const tokenPath = variableMappings[variableId];
        if (tokenPath && this.tokenStudioColors.has(tokenPath)) {
            console.log(`🎨 토큰 스튜디오 매핑: ${variableId} → ${tokenPath}`);
            return tokenPath;
        }
        
        console.log(`❌ 토큰 스튜디오 매핑 없음: ${variableId}`);
        return null;
    }

    /**
     * GPT-5 권장: 변수명을 MUI 색상 경로로 변환
     * @param variableName 피그마 변수명 (예: "primary/light", "primary.light")
     * @returns MUI 색상 경로 (예: "primary.light")
     */
    private toMuiColorPath(variableName: string): string | null {
        // 예: "primary/light" 또는 "primary.light" 둘 다 허용
        const normalized = variableName.replace('/', '.');
        const [group, tone] = normalized.split('.');
        
        if (!group || !tone) return null;
        
        // MUI 표준 색상 그룹
        const muiGroups = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'text', 'grey'];
        
        if (muiGroups.includes(group)) {
            // text의 경우 text.primary / text.secondary 등 처리
            if (group === 'text') return `text.${tone}`;
            return `${group}.${tone}`; // sx에서는 'primary.light' 형태로 사용
        }
        
        // 프로젝트 맞춤 접두어 매핑
        const customMap: Record<string, string> = {
            'brand': 'primary', // 예시: brand → primary로 귀속
        };
        
        if (customMap[group]) {
            return `${customMap[group]}.${tone}`;
        }
        
        return null;
    }

    /**
     * 피그마 변수명을 MUI 테마 토큰으로 변환
     * @param figmaVariableName 피그마 변수명 (예: "Primary/Light", "Text/Primary")
     * @returns MUI 테마 토큰 (예: "primary.light", "text.primary")
     */
    private convertFigmaVariableNameToThemeToken(figmaVariableName: string): string {
        // 피그마 변수명을 소문자로 변환하고 슬래시를 점으로 변경
        // 예: "Primary/Light" -> "primary.light", "Text/Primary" -> "text.primary"
        return figmaVariableName
            .toLowerCase()
            .replace(/\//g, '.')
            .replace(/\s+/g, '');
    }

    /**
     * 색상 추출
     * @param fill 피그마 Fill 객체
     * @returns 색상 문자열
     */
    private extractColor(fill: { type: string; color?: { r: number; g: number; b: number; a?: number } }): string {
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

        // 8자리 HEX 코드로 반환 (RRGGBBAA)
        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');
        const aHex = a.toString(16).padStart(2, '0');

        return `#${rHex}${gHex}${bHex}${aHex}`;
    }

    /**
     * 피그마 정렬을 CSS 정렬로 매핑
     * @param alignment 피그마 정렬
     * @returns CSS 정렬
     */
    private mapAlignment(alignment: string): string {
        switch (alignment) {
            case 'MIN':
                return 'flex-start';
            case 'CENTER':
                return 'center';
            case 'MAX':
                return 'flex-end';
            case 'SPACE_BETWEEN':
                return 'space-between';
            default:
                return 'flex-start';
        }
    }
}
