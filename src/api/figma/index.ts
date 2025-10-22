import { FigmaAPIClient } from './client';
import { FigmaDesignExtractor } from './extractor';
import { FigmaCodeGenerator } from './generator';
import { FIGMA_CONFIG, validateFigmaEnvironment } from './config';
import { PageDesignConfig, ComponentProperties, FigmaNode, FigmaFill, TypographyConfig, ComponentDesignConfig } from './types';
import { PageTemplateManager, PageContentConfig, LayoutType } from './pageTemplateManager';
import { FileSystemManager } from './fileSystem';
import { handleFigmaError } from './errors';

export class FigmaIntegrationService {
    private client: FigmaAPIClient;
    private extractor: FigmaDesignExtractor;
    private generator: FigmaCodeGenerator;
    private fileSystem: FileSystemManager;

    constructor() {
        const env = validateFigmaEnvironment();
        this.client = new FigmaAPIClient(env.FIGMA_TOKEN);
        this.extractor = new FigmaDesignExtractor(env.FIGMA_TOKEN);
        this.generator = new FigmaCodeGenerator();
        this.fileSystem = new FileSystemManager();
    }

    /**
     * 모든 페이지 디자인 추출 및 코드 생성
     */
    async generateAllPages(): Promise<void> {
        try {
            console.log('🚀 Starting Figma integration process...');

            // 플랫폼 파일에서 페이지들 추출
            const platformFileKey = FIGMA_CONFIG.files.platform;
            const pageNodeIds = Object.values(FIGMA_CONFIG.pageNodes.pages);
            
            console.log('📄 Extracting page designs from Figma...');
            const pageDesigns = await this.extractor.extractPageDesigns(platformFileKey, pageNodeIds);

            // 각 페이지별로 코드 생성
            for (const pageDesign of pageDesigns) {
                await this.generateLayoutIntegratedPage(pageDesign);
            }

            console.log('✅ Figma integration completed successfully!');
        } catch (error) {
            console.error('❌ Figma integration failed:', error);
            throw error;
        }
    }

    /**
     * 레이아웃 통합 페이지 콘텐츠 생성
     * @param pageDesign 페이지 디자인 설정
     * @param layoutType 레이아웃 타입
     * @param pageConfig 기존 페이지 설정 (선택사항)
     */
    async generateLayoutIntegratedPage(
        pageDesign: PageDesignConfig, 
        pageConfig?: { id: string; title: string; layout?: LayoutType }
    ): Promise<void> {
        try {
            const { pageName } = pageDesign;
            console.log(`📝 Generating layout-integrated content for ${pageName}...`);

            // Figma 디자인을 페이지 콘텐츠로 변환
            const figmaContent: PageContentConfig = {
                pageName: pageDesign.pageName,
                pageId: pageDesign.pageName.toLowerCase(),
                components: pageDesign.components,
                contentStyles: {
                    colors: this.extractContentColors(pageDesign),
                    spacing: this.extractContentSpacing(pageDesign),
                    typography: this.extractContentTypography(pageDesign)
                }
            };

            // 기존 페이지 설정과 통합 (있는 경우)
            const finalContent = pageConfig 
                ? PageTemplateManager.integrateWithExistingPage(pageConfig, figmaContent)
                : figmaContent; // 피그마 콘텐츠를 직접 사용

            // 페이지 콘텐츠 코드 생성
            const contentCode = this.generator.generatePageContent(finalContent);
            
            // TypeScript 타입 정의 생성
            const typeDefinitions = this.generator.generateTypeDefinitions(pageDesign);

            // 파일 저장 경로 결정 (기존 구조에 맞게)
            const fileName = this.toKebabCase(pageName);
            const contentPath = `src/pages/${fileName}/${this.toPascalCase(pageName)}.tsx`;
            const typesPath = `src/pages/${fileName}/${this.toPascalCase(pageName)}.types.ts`;

            // 디렉토리 생성 및 파일 저장
            await this.saveGeneratedFiles(contentPath, contentCode, typesPath, typeDefinitions);

            console.log(`✅ Generated layout-integrated content for ${pageName} successfully`);
        } catch (error) {
            console.error(`❌ Failed to generate layout-integrated content for ${pageDesign.pageName}:`, error);
            throw error;
        }
    }


    /**
     * 라이브러리 컴포넌트 추출
     */
    async extractLibraryComponents(): Promise<void> {
        try {
            console.log('📚 Extracting library components...');

            const libraryFileKey = FIGMA_CONFIG.files.library;
            const libraryNodeId = FIGMA_CONFIG.pageNodes.libraryComponents;

            // 라이브러리 컴포넌트 정보 가져오기
            const fileData = await this.client.getFileNodes(libraryFileKey, [libraryNodeId]);
            const libraryNode = fileData.nodes[libraryNodeId]?.document;

            if (libraryNode && libraryNode.children) {
                console.log(`Found ${libraryNode.children.length} library components`);
                
                // 각 컴포넌트별로 처리
                for (const componentNode of libraryNode.children) {
                    await this.processLibraryComponent(componentNode as FigmaNode & {name: string, id: string});
                }
            }

            console.log('✅ Library components extraction completed');
        } catch (error) {
            console.error('❌ Library components extraction failed:', error);
            throw error;
        }
    }

    /**
     * 라이브러리 컴포넌트 처리
     * @param componentNode 컴포넌트 노드
     */
    private async processLibraryComponent(componentNode: FigmaNode & {name: string, id: string}): Promise<void> {
        try {
            const componentName = componentNode.name;
            console.log(`🔧 Processing library component: ${componentName}`);

            // 컴포넌트 타입 결정
            const componentType = this.determineComponentType(componentName);
            if (!componentType) {
                console.log(`⚠️  Unknown component type for: ${componentName}`);
                return;
            }

            // 컴포넌트 속성 추출
            const properties = this.extractComponentProperties(componentNode);

            // 컴포넌트 코드 생성
            const componentCode = this.generateLibraryComponentCode(componentName, componentType, properties);

            // 파일 저장
            const fileName = this.toKebabCase(componentName);
            const filePath = `src/components/generated/${fileName}.tsx`;
            await this.saveFile(filePath, componentCode);

            console.log(`✅ Generated library component: ${componentName}`);
        } catch (error) {
            console.error(`❌ Failed to process library component ${componentNode.name}:`, error);
        }
    }

    /**
     * 컴포넌트 타입 결정
     * @param componentName 컴포넌트 이름
     * @returns 컴포넌트 타입
     */
    private determineComponentType(componentName: string): string | null {
        const name = componentName.toLowerCase();
        
        for (const [type, keywords] of Object.entries(FIGMA_CONFIG.componentTypes)) {
            if (keywords.some(keyword => name.includes(keyword.toLowerCase()))) {
                return type;
            }
        }
        
        return null;
    }

    /**
     * 컴포넌트 속성 추출
     * @param componentNode 컴포넌트 노드
     * @returns 컴포넌트 속성
     */
    private extractComponentProperties(componentNode: FigmaNode): ComponentProperties {
        const properties: ComponentProperties = {};

        // 기본 속성들 추출
        if (componentNode.absoluteBoundingBox) {
            properties.width = componentNode.absoluteBoundingBox.width;
            properties.height = componentNode.absoluteBoundingBox.height;
        }

        if (componentNode.fills && componentNode.fills.length > 0) {
            properties.backgroundColor = this.extractColor(componentNode.fills[0]);
        }

        if (componentNode.cornerRadius !== undefined) {
            properties.borderRadius = componentNode.cornerRadius;
        }

        return properties;
    }

    /**
     * 라이브러리 컴포넌트 코드 생성
     * @param componentName 컴포넌트 이름
     * @param componentType 컴포넌트 타입
     * @param properties 컴포넌트 속성
     * @returns 컴포넌트 코드
     */
    private generateLibraryComponentCode(
        componentName: string, 
        componentType: string, 
        properties: ComponentProperties
    ): string {
        const pascalName = this.toPascalCase(componentName);
        const muiComponent = FIGMA_CONFIG.muiMapping[componentType] || 'Box';

        const sxProps = Object.entries(properties)
            .map(([key, value]) => {
                if (typeof value === 'string') {
                    return `${key}: '${value}'`;
                }
                return `${key}: ${value}`;
            })
            .join(',\n            ');

        return `import React from 'react';
import { ${muiComponent } } from '@mui/material';

export interface ${pascalName}Props {
    // Add component-specific props here
}

export const ${pascalName}: React.FC<${pascalName}Props> = (props) => {
    return (
        <${muiComponent}
            sx={{
                ${sxProps}
            }}
            {...props}
        >
            {/* Component content */}
        </${muiComponent}>
    );
};`;
    }

    /**
     * 색상 추출
     * @param fill Fill 객체
     * @returns 색상 문자열
     */
    private extractColor(fill: FigmaFill): string {
        if (fill.type === 'SOLID' && fill.color) {
            const { r, g, b, a = 1 } = fill.color;
            const red = Math.round(r * 255);
            const green = Math.round(g * 255);
            const blue = Math.round(b * 255);
            
            if (a < 1) {
                return `rgba(${red}, ${green}, ${blue}, ${a})`;
            }
            
            return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
        }
        
        return '#000000';
    }

    /**
     * 생성된 파일들 저장
     * @param componentPath 컴포넌트 파일 경로
     * @param componentCode 컴포넌트 코드
     * @param typesPath 타입 파일 경로
     * @param typeDefinitions 타입 정의
     */
    private async saveGeneratedFiles(
        componentPath: string, 
        componentCode: string, 
        typesPath: string, 
        typeDefinitions: string
    ): Promise<void> {
        try {
            // 디렉토리 생성
            const componentDir = this.fileSystem.getDirectoryPath(componentPath);
            const typesDir = this.fileSystem.getDirectoryPath(typesPath);
            
            await this.fileSystem.createDirectory(componentDir);
            await this.fileSystem.createDirectory(typesDir);

            // 파일 저장
            await this.fileSystem.saveFile(componentPath, componentCode);
            await this.fileSystem.saveFile(typesPath, typeDefinitions);
        } catch (error) {
            handleFigmaError(error, `saveGeneratedFiles(${componentPath}, ${typesPath})`);
        }
    }

    /**
     * 파일 저장
     * @param filePath 파일 경로
     * @param content 파일 내용
     */
    private async saveFile(filePath: string, content: string): Promise<void> {
        try {
            await this.fileSystem.saveFile(filePath, content);
        } catch (error) {
            handleFigmaError(error, `saveFile(${filePath})`);
        }
    }

    /**
     * 디렉토리 생성
     * @param dirPath 디렉토리 경로
     */
    private async createDirectory(dirPath: string): Promise<void> {
        try {
            await this.fileSystem.createDirectory(dirPath);
        } catch (error) {
            handleFigmaError(error, `createDirectory(${dirPath})`);
        }
    }

    /**
     * 문자열을 kebab-case로 변환
     * @param str 입력 문자열
     * @returns kebab-case 문자열
     */
    private toKebabCase(str: string): string {
        return str
            .split(/[\s\-_]+/)
            .map(word => word.toLowerCase())
            .join('-');
    }

    /**
     * 콘텐츠 색상 추출
     * @param pageDesign 페이지 디자인 설정
     * @returns 콘텐츠 색상 설정
     */
    private extractContentColors(pageDesign: PageDesignConfig): Record<string, string> {
        const colors: Record<string, string> = {};
        
        // 테마에서 색상 추출
        if (pageDesign.theme?.colors) {
            Object.entries(pageDesign.theme.colors).forEach(([key, value]) => {
                colors[key] = value;
            });
        }
        
        // 기본 색상 설정
        if (!colors.contentBackground) colors.contentBackground = 'transparent';
        if (!colors.contentText) colors.contentText = 'inherit';
        if (!colors.accentColor) colors.accentColor = 'primary.main';
        
        return colors;
    }

    /**
     * 콘텐츠 간격 추출
     * @param pageDesign 페이지 디자인 설정
     * @returns 콘텐츠 간격 설정
     */
    private extractContentSpacing(pageDesign: PageDesignConfig): Record<string, string> {
        const spacing: Record<string, string> = {};
        
        // 레이아웃에서 간격 추출
        if (pageDesign.layout?.spacing !== undefined) {
            spacing.componentGap = `${pageDesign.layout.spacing}px`;
        }
        
        // 테마에서 간격 추출
        if (pageDesign.theme?.spacing) {
            Object.entries(pageDesign.theme.spacing).forEach(([key, value]) => {
                spacing[key] = `${value}px`;
            });
        }
        
        // 기본 간격 설정
        if (!spacing.contentPadding) spacing.contentPadding = '24px';
        if (!spacing.sectionGap) spacing.sectionGap = '32px';
        if (!spacing.componentGap) spacing.componentGap = '16px';
        
        return spacing;
    }

    /**
     * 콘텐츠 타이포그래피 추출
     * @param pageDesign 페이지 디자인 설정
     * @returns 콘텐츠 타이포그래피 설정
     */
    private extractContentTypography(pageDesign: PageDesignConfig): Record<string, TypographyConfig> {
        const typography: Record<string, TypographyConfig> = {};
        
        // 테마에서 타이포그래피 추출
        if (pageDesign.theme?.typography) {
            Object.entries(pageDesign.theme.typography).forEach(([key, config]) => {
                typography[key] = {
                    fontFamily: config.fontFamily || 'inherit',
                    fontSize: config.fontSize || 16,
                    fontWeight: config.fontWeight || 400,
                    lineHeight: config.lineHeight || 1.5,
                    letterSpacing: config.letterSpacing || 0
                };
            });
        }
        
        // 기본 타이포그래피 설정
        if (!typography.pageTitle) {
            typography.pageTitle = {
                fontFamily: 'inherit',
                fontSize: 24,
                fontWeight: 600,
                lineHeight: 1.2
            };
        }
        
        if (!typography.bodyText) {
            typography.bodyText = {
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.5
            };
        }
        
        return typography;
    }

    /**
     * 문자열을 PascalCase로 변환
     * @param str 입력 문자열
     * @returns PascalCase 문자열
     */
    /**
     * 레이아웃 컴포넌트 연동 (기존 컴포넌트와 피그마 디자인 동기화)
     * @param pageDesign 페이지 디자인 설정
     */
    async syncLayoutComponents(pageDesign: PageDesignConfig): Promise<void> {
        try {
            console.log(`🔄 Syncing layout components for ${pageDesign.pageName}...`);

            // 레이아웃 컴포넌트 추출 (페이지 노드에서)
            const pageNode = await this.getPageNode(pageDesign.pageId);
            const layoutComponents = this.extractor.extractLayoutComponents(pageNode);
            
            // 각 레이아웃 컴포넌트별로 처리
            for (const [componentType, componentDesign] of Object.entries(layoutComponents)) {
                if (componentDesign) {
                    await this.syncLayoutComponent(componentType, componentDesign);
                }
            }

            console.log(`✅ Layout components synced successfully`);
        } catch (error) {
            console.error('Failed to sync layout components:', error);
            throw error;
        }
    }

    /**
     * 페이지 노드 가져오기
     * @param pageId 페이지 ID
     * @returns 페이지 노드
     */
    private async getPageNode(pageId: string): Promise<FigmaNode> {
        const platformFileKey = FIGMA_CONFIG.files.platform;
        const fileData = await this.client.getFileNodes(platformFileKey, [pageId]);
        const node = fileData.nodes[pageId]?.document;
        
        if (!node) {
            throw new Error(`Page node not found: ${pageId}`);
        }
        
        return node;
    }

    /**
     * 개별 레이아웃 컴포넌트 동기화
     * @param componentType 컴포넌트 타입
     * @param componentDesign 컴포넌트 디자인
     */
    private async syncLayoutComponent(componentType: string, componentDesign: ComponentDesignConfig): Promise<void> {
        const componentPath = this.getLayoutComponentPath(componentType);
        
        if (await this.fileSystem.fileExists(componentPath)) {
            console.log(`📝 Updating existing ${componentType} component...`);
            
            // 기존 컴포넌트 업데이트 (스타일만)
            const styleUpdates = this.generateStyleUpdates(componentDesign);
            await this.updateComponentStyles(componentPath, styleUpdates);
        } else {
            console.log(`🆕 Creating new ${componentType} component...`);
            
            // 새 컴포넌트 생성
            const componentCode = this.generator.generatePageContent({
                pageName: componentType,
                pageId: componentType.toLowerCase(),
                components: [componentDesign],
                contentStyles: {
                    colors: {},
                    spacing: {},
                    typography: {}
                }
            });
            await this.fileSystem.saveFile(componentPath, componentCode);
        }
    }

    /**
     * 레이아웃 컴포넌트 경로 가져오기
     * @param componentType 컴포넌트 타입
     * @returns 컴포넌트 파일 경로
     */
    private getLayoutComponentPath(componentType: string): string {
        const componentName = this.toPascalCase(componentType);
        return `src/layouts/${componentName}.tsx`;
    }

    /**
     * 스타일 업데이트 생성
     * @param componentDesign 컴포넌트 디자인
     * @returns 스타일 업데이트 코드
     */
    private generateStyleUpdates(componentDesign: ComponentDesignConfig): string {
        // 피그마 디자인에서 스타일 정보 추출하여 기존 컴포넌트에 적용
        return JSON.stringify(componentDesign.properties, null, 2);
    }

    /**
     * 컴포넌트 스타일 업데이트
     * @param componentPath 컴포넌트 파일 경로
     * @param styleUpdates 스타일 업데이트 코드
     */
    private async updateComponentStyles(componentPath: string, styleUpdates: string): Promise<void> {
        // 기존 컴포넌트 파일 읽기
        await this.fileSystem.readFile(componentPath);
        
        // 스타일 부분만 업데이트 (복잡한 로직 필요)
        // TODO: 실제 구현 시 기존 컴포넌트 구조를 유지하면서 스타일만 업데이트
        console.log(`Style updates for ${componentPath}:`, styleUpdates);
    }

    private toPascalCase(str: string): string {
        return str
            .split(/[\s\-_]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }
}
