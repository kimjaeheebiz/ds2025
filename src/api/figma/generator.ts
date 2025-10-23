import {
    PageDesignConfig,
    ComponentDesignConfig,
    LayoutConfig,
    ComponentProperties,
    PageComponentConfig,
    PageStyleTokens,
} from './types';
import { PageContentConfig } from './pageTemplateManager';
import { FIGMA_CONFIG } from './config';
import * as prettier from 'prettier';

export class FigmaCodeGenerator {
    /**
     * 전체 페이지 컴포넌트 코드 생성 (기존 구조에 맞게)
     * @param contentConfig 페이지 콘텐츠 설정
     * @returns React 컴포넌트 코드
     */
    async generatePageContent(contentConfig: PageContentConfig): Promise<string> {
        const { pageName, components } = contentConfig;

        const componentName = this.toPascalCase(pageName);
        const imports = this.generateImports(components);
        const pageCode = this.generatePageCode(componentName, components);

        const rawCode = `${imports}

${pageCode}`;

        // Prettier로 포맷팅
        return await this.formatCode(rawCode);
    }

    /**
     * 전체 페이지 컴포넌트 코드 생성
     * @param componentName 컴포넌트 이름
     * @param components 컴포넌트 배열
     * @returns 전체 페이지 컴포넌트 코드
     */
    private generatePageCode(componentName: string, components: ComponentDesignConfig[]): string {
        const componentJSX = this.generateComponentsJSX(components);
        const pageName = componentName.toLowerCase();

        // 페이지별 특수 import 추가
        const pageSpecificImports = this.generatePageSpecificImports(pageName);

        // 기본 padding 사용 (MUI spacing 변수)
        const paddingValue = 3; // spacing(3) = 24px

        return `${pageSpecificImports}

export const ${componentName}: React.FC = () => {
    return (
        <Box
            sx={{
                p: ${paddingValue},
                minHeight: '100%',
            }}
        >
            ${componentJSX}
        </Box>
    );
};`;
    }

    /**
     * 페이지 컴포넌트 코드 생성 (레거시 지원)
     * @param pageConfig 페이지 컴포넌트 설정
     * @returns React 컴포넌트 코드
     */
    generatePageComponent(pageConfig: PageComponentConfig): string {
        const { pageName, components, layout, styles } = pageConfig;
        
        const componentName = this.toPascalCase(pageName);
        const imports = this.generateImports(components);
        const componentCode = this.generateComponentCode(componentName, components, layout);
        const pageStyles = this.generatePageStyles(styles);

        return `${imports}

${componentCode}

${pageStyles}`;
    }

    /**
     * 페이지별 스타일 생성 (기존 테마와 충돌 방지) - 레거시 지원
     * @param styles 페이지 스타일 토큰
     * @returns 페이지 스타일 코드
     */
    generatePageStyles(styles: PageStyleTokens): string {
        const { colors, spacing, typography, layout } = styles;

        const colorStyles = Object.entries(colors)
            .map(([key, value]) => `    ${key}: '${value}',`)
            .join('\n');

        const spacingStyles = Object.entries(spacing)
            .map(([key, value]) => `    ${key}: '${value}',`)
            .join('\n');

        const typographyStyles = Object.entries(typography)
            .map(([key, config]) => {
                return `    ${key}: {
        fontFamily: '${config.fontFamily || 'inherit'}',
        fontSize: '${config.fontSize || '16px'}',
        fontWeight: ${config.fontWeight || 400},
        lineHeight: ${config.lineHeight || 1.5},
        letterSpacing: '${config.letterSpacing || '0px'}'
        },`;
            })
            .join('\n');

        return `// 페이지별 스타일 정의 (기존 테마와 충돌 방지)
export const pageStyles = {
    colors: {
${colorStyles}
    },
    spacing: {
${spacingStyles}
    },
    typography: {
${typographyStyles}
    },
    layout: {
        container: {
            maxWidth: '${layout.container?.maxWidth || '1200px'}',
            padding: '${layout.container?.padding || '16px'}'
        },
        grid: {
            columns: ${layout.grid?.columns || 12},
            gap: '${layout.grid?.gap || '16px'}'
        }
    }
};`;
    }

    /**
     * 컴포넌트 코드 생성
     * @param componentName 컴포넌트 이름
     * @param components 컴포넌트 배열
     * @param layout 레이아웃 설정
     * @returns 컴포넌트 코드
     */
    private generateComponentCode(
        componentName: string, 
        components: ComponentDesignConfig[], 
        layout: LayoutConfig,
    ): string {
        const jsxElements = components.map((component) => this.generateComponentJSX(component)).join('\n        ');

        return `export const ${componentName} = () => {
    return (
        <Box sx={{
            display: '${layout.containerType}',
            flexDirection: '${layout.direction}',
            gap: ${layout.spacing},
            padding: ${
                layout.padding
                    ? `${layout.padding.top}px ${layout.padding.right}px ${layout.padding.bottom}px ${layout.padding.left}px`
                    : '0px'
            }
        }}>
            ${jsxElements}
        </Box>
    );
};`;
    }

    /**
     * 여러 컴포넌트 JSX 생성
     * @param components 컴포넌트 배열
     * @returns JSX 코드
     */
    private generateComponentsJSX(components: ComponentDesignConfig[]): string {
        if (components.length === 0) {
            return '            {/* No components defined */}';
        }

        return components.map((component) => this.generateComponentJSX(component)).join('\n\n');
    }

    /**
     * 컴포넌트 JSX 생성
     * @param component 컴포넌트 설정
     * @returns JSX 문자열
     */
    private generateComponentJSX(component: ComponentDesignConfig): string {
        const { componentType, properties } = component;

        // 테이블 컴포넌트는 특별 처리
        if (componentType === 'table') {
            return this.generateTableJSX(component);
        }

        const muiComponent = FIGMA_CONFIG.muiMapping[componentType] || 'Box';
        
        const sxProps = this.generateSXProps(properties, componentType);
        const componentProps = this.generateComponentProps(componentType, properties);

        // sx 속성이 있으면 포함, 없으면 제거
        const sxAttribute = sxProps ? `sx={${sxProps}}` : '';

        return `<${muiComponent}
            ${componentProps}
            ${sxAttribute}
        >
            ${this.generateComponentContent(componentType, properties)}
        </${muiComponent}>`;
    }

    /**
     * SX 속성 생성 (최적화된 버전)
     * @param properties 컴포넌트 속성
     * @returns SX 속성 문자열 또는 null (빈 객체인 경우)
     */
    private generateSXProps(properties: ComponentProperties, componentType: string): string | null {
        const sxProps: string[] = [];

        // width는 hug 또는 fill 설정이 아닌 경우에만 추가
        if (properties.width && properties.width !== 'fill' && properties.width !== 'hug') {
            sxProps.push(`width: '${properties.width}px'`);
        }

        // height는 hug 또는 fill 설정이 아닌 경우에만 추가
        if (properties.height && properties.height !== 'fill' && properties.height !== 'hug') {
            sxProps.push(`height: '${properties.height}px'`);
        }

            // 색상 속성 처리 (스타일 이름 우선, 텍스트는 color, 배경은 backgroundColor)
            if (properties.colorStyle) {
                // 피그마 스타일 이름을 디자인 토큰으로 변환
                const designToken = this.mapFigmaStyleToDesignToken(properties.colorStyle);
                if (componentType === 'typography') {
                    sxProps.push(`color: '${designToken}'`);
                } else {
                    sxProps.push(`backgroundColor: '${designToken}'`);
                }
            } else if (properties.backgroundColor && properties.backgroundColor !== 'transparent' && !properties.colorStyle) {
                // 스타일 이름이 없는 경우 기본 색상 사용
                if (componentType === 'typography') {
                    sxProps.push(`color: '${properties.backgroundColor}'`);
                } else {
                    sxProps.push(`backgroundColor: '${properties.backgroundColor}'`);
                }
            }

        if (properties.borderColor) sxProps.push(`borderColor: '${properties.borderColor}'`);
        if (properties.borderWidth) sxProps.push(`borderWidth: '${properties.borderWidth}px'`);
        if (properties.borderRadius) sxProps.push(`borderRadius: '${properties.borderRadius}px'`);
        if (properties.opacity) sxProps.push(`opacity: ${properties.opacity}`);

        // gap은 변수 기반으로 처리
        if (properties.gap) {
            const gapValue = this.mapSpacingToVariable(properties.gap);
            sxProps.push(`gap: ${gapValue}`);
        }

        if (properties.justifyContent) sxProps.push(`justifyContent: '${properties.justifyContent}'`);
        if (properties.alignItems) sxProps.push(`alignItems: '${properties.alignItems}'`);

        // 속성이 없으면 null 반환 (sx 속성 자체를 제거)
        if (sxProps.length === 0) {
            return null;
        }

        return `{
            ${sxProps.join(',\n            ')}
        }`;
    }

    /**
     * 컴포넌트별 속성 생성
     * @param componentType 컴포넌트 타입
     * @param properties 컴포넌트 속성
     * @returns 컴포넌트 속성 문자열
     */
    private generateComponentProps(componentType: string, properties: ComponentProperties): string {
        const props: string[] = [];
        const muiProps = FIGMA_CONFIG.muiProps[componentType];

        // 컴포넌트별 특수 처리 (기존 소스 기반)
        switch (componentType) {
            case 'button':
                if (properties.text) props.push(`children="${properties.text}"`);
                if (properties.variant && muiProps?.variants?.includes(properties.variant)) {
                    props.push(`variant="${properties.variant}"`);
                }
                if (properties.size && muiProps?.sizes?.includes(properties.size)) {
                    props.push(`size="${properties.size}"`);
                }
                break;
            case 'textField':
                if (properties.text) props.push(`placeholder="${properties.text}"`);
                if (properties.variant && muiProps?.variants?.includes(properties.variant)) {
                    props.push(`variant="${properties.variant}"`);
                }
                if (properties.size && muiProps?.sizes?.includes(properties.size)) {
                    props.push(`size="${properties.size}"`);
                }
                break;
            case 'table':
                if (properties.size && muiProps?.sizes?.includes(properties.size)) {
                    props.push(`size="${properties.size}"`);
                }
                break;
            case 'card':
                if (properties.elevation !== undefined && muiProps?.elevations?.includes(properties.elevation)) {
                    props.push(`elevation={${properties.elevation}}`);
                }
                break;
            case 'chip':
                if (properties.label) props.push(`label="${properties.label}"`);
                if (properties.variant && muiProps?.variants?.includes(properties.variant)) {
                    props.push(`variant="${properties.variant}"`);
                }
                if (properties.color && muiProps?.colors?.includes(properties.color)) {
                    props.push(`color="${properties.color}"`);
                }
                if (properties.size && muiProps?.sizes?.includes(properties.size)) {
                    props.push(`size="${properties.size}"`);
                }
                break;
            case 'typography': {
                // Typography 컴포넌트의 경우 variant가 있을 때만 추가
                const typographyVariant = (properties as { typography?: { variant?: string } }).typography?.variant;
                if (typographyVariant) {
                    props.push(`variant="${typographyVariant}"`);
                }
                break;
        }
        }

        return props.length > 0 ? ` ${props.join(' ')}` : '';
    }

    /**
     * spacing 값을 변수로 매핑
     * @param spacingValue spacing 값
     * @returns 변수 기반 spacing 값
     */
    private mapSpacingToVariable(spacingValue: number | string): string {
        const spacingMap: Record<number, number> = {
            8: 1, // 8px = spacing(1)
            16: 2, // 16px = spacing(2)
            24: 3, // 24px = spacing(3)
            32: 4, // 32px = spacing(4)
            40: 5, // 40px = spacing(5)
            48: 6, // 48px = spacing(6)
        };

        const numericValue = typeof spacingValue === 'string' ? parseInt(spacingValue) : spacingValue;
        const mappedValue = spacingMap[numericValue];

        return mappedValue ? `${mappedValue}` : `'${numericValue}px'`;
    }

    /**
     * 컴포넌트 내용 생성
     * @param componentType 컴포넌트 타입
     * @param properties 컴포넌트 속성
     * @returns 컴포넌트 내용 문자열
     */
    private generateComponentContent(componentType: string, properties: ComponentProperties): string {
        switch (componentType) {
            case 'table':
                return `{/* Table content will be generated based on data */}`;
            case 'card':
                return `{/* Card content will be generated based on design */}`;
            case 'navigation':
                return `{/* Navigation items will be generated based on menu structure */}`;
            case 'typography':
                // Typography 컴포넌트인 경우 텍스트만 반환 (HTML 태그 이스케이프)
                return properties.text ? this.escapeHtml(properties.text) : '';
            default:
                return properties.text ? this.escapeHtml(properties.text) : '';
        }
    }

    /**
     * HTML 태그를 이스케이프하여 JSX에서 안전하게 사용할 수 있도록 함
     * @param text 원본 텍스트
     * @returns 이스케이프된 텍스트
     */
    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Import 문 생성
     * @param components 컴포넌트 배열
     * @returns Import 문 문자열
     */
    private generateImports(components: ComponentDesignConfig[]): string {
        const imports = new Set<string>();

        // 기본 MUI 컴포넌트들
        imports.add('Box');
        
        // 컴포넌트별 필요한 임포트 추가
        components.forEach((component) => {
            const muiComponent = FIGMA_CONFIG.muiMapping[component.componentType];
            if (muiComponent) {
                imports.add(muiComponent);

                // 테이블 컴포넌트의 경우 하위 컴포넌트들도 추가
                if (component.componentType === 'table') {
                    const tableProps = FIGMA_CONFIG.muiProps.table;
                    if (tableProps?.subComponents) {
                        tableProps.subComponents.forEach((subComp) => imports.add(subComp));
                    }
                    imports.add('Paper');
                }

                // 카드 컴포넌트의 경우 하위 컴포넌트들도 추가
                if (component.componentType === 'card') {
                    const cardProps = FIGMA_CONFIG.muiProps.card;
                    if (cardProps?.subComponents) {
                        cardProps.subComponents.forEach((subComp) => imports.add(subComp));
                    }
                }
            }
        });

        const importsList = Array.from(imports).join(', ');
        return `import React from 'react';
import { ${importsList} } from '@mui/material';`;
    }

    /**
     * 컴포넌트 이름을 유효한 JavaScript 식별자로 정리
     * @param name 원본 컴포넌트 이름
     * @param componentType 컴포넌트 타입
     * @param index 인덱스 (중복 시 사용)
     * @returns 유효한 컴포넌트 이름
     */
    private sanitizeComponentName(name: string, componentType: string, index: number): string {
        const sanitized = this.toPascalCase(name);
        
        // 빈 문자열이거나 유효하지 않은 경우 컴포넌트 타입 기반으로 생성
        if (!sanitized || sanitized.length === 0) {
            return `${this.toPascalCase(componentType)}${index + 1}`;
        }
        
        return sanitized;
    }


    /**
     * 피그마 스타일 이름을 디자인 토큰으로 매핑
     * @param figmaStyleName 피그마 스타일 이름
     * @returns 디자인 토큰 이름
     */
    private mapFigmaStyleToDesignToken(figmaStyleName: string): string {
        // 피그마 스타일 이름을 MUI 테마 토큰으로 변환
        // 이미 올바른 형태인 경우 그대로 반환 (primary.light)
        // 슬래시가 있는 경우 점으로 변환 (text/secondary -> text.secondary)
        return figmaStyleName.includes('/') ? figmaStyleName.replace(/\//g, '.') : figmaStyleName;
    }

    /**
     * 문자열을 PascalCase로 변환
     * @param str 입력 문자열
     * @returns PascalCase 문자열
     */
    private toPascalCase(str: string): string {
        return str
            .replace(/[<>]/g, '') // < > 문자 제거
            .replace(/[^a-zA-Z0-9\s\-_]/g, '') // 한글 등 유효하지 않은 문자 제거
            .split(/[\s\-_]+/)
            .filter(word => word.length > 0) // 빈 문자열 제거
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * 피그마 이름을 유효한 JavaScript 식별자로 변환
     * @param name 피그마에서 추출된 이름
     * @returns 유효한 JavaScript 식별자
     */
    private sanitizePropertyName(name: string): string {
        return (
            name
                // < > 제거
                .replace(/[<>]/g, '')
                // 하이픈을 camelCase로 변환
                .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
                // 숫자로 시작하는 경우 앞에 문자 추가
                .replace(/^(\d)/, 'item$1')
                // 특수문자 제거
                .replace(/[^a-zA-Z0-9_]/g, '') ||
            // 빈 문자열인 경우 기본값
            'item'
        );
    }

    /**
     * TypeScript 타입 정의 생성 (기존 데이터 타입 고려)
     * @param pageDesign 페이지 디자인 설정
     * @returns TypeScript 타입 정의
     */
    async generateTypeDefinitions(pageDesign: PageDesignConfig): Promise<string> {
        const { pageName, components } = pageDesign;
        const componentName = this.toPascalCase(pageName);

        // 페이지별 특수 타입 정의
        const pageSpecificTypes = this.generatePageSpecificTypes(pageName);

        const usedNames = new Set<string>();
        const componentTypes = components
            .map((component, index) => {
                const componentName = this.sanitizeComponentName(component.componentName, component.componentType, index);
                
                // 중복된 이름 방지
                let finalName = componentName;
                let counter = 1;
                while (usedNames.has(finalName)) {
                    finalName = `${componentName}${counter}`;
                    counter++;
                }
                usedNames.add(finalName);
                
                return `export type ${finalName}Props = object;`;
            })
            .join('\n\n');

        const rawTypeCode = `// Generated types for ${componentName}
// Note: Basic data types (User, etc.) are defined in @/data

${pageSpecificTypes}

${componentTypes}

export type ${componentName}Props = object;`;

        // Prettier로 포맷팅
        return await this.formatCode(rawTypeCode);
    }

    /**
     * 페이지별 특수 import 생성
     * @param pageName 페이지 이름
     * @returns 페이지별 import 문
     */
    private generatePageSpecificImports(pageName: string): string {
        const lowerPageName = pageName.toLowerCase();

        switch (lowerPageName) {
            case 'users':
                return `// Import API functions and types
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/users';
import { UsersPageState, UsersTableProps, UsersApiResponse } from './${this.toPascalCase(pageName)}.types';`;

            case 'project':
                return `// Import API functions and types
import { fetchProjects, createProject, updateProject } from '@/api/projects';
import { ProjectPageState, ProjectCardProps, ProjectApiResponse } from './${this.toPascalCase(pageName)}.types';`;

            case 'dashboard':
                return `// Import API functions and types
import { fetchDashboardStats } from '@/api/dashboard';
import { DashboardStats, DashboardChartProps } from './${this.toPascalCase(pageName)}.types';`;

            default:
                return `// Import page-specific types
import { ${this.toPascalCase(pageName)}PageState } from './${this.toPascalCase(pageName)}.types';`;
        }
    }
    /**
     * 페이지별 특수 타입 생성 (실제 프로젝트 구조 고려)
     * @param pageName 페이지 이름
     * @returns 페이지별 타입 정의
     */
    private generatePageSpecificTypes(pageName: string): string {
        const lowerPageName = pageName.toLowerCase();

        switch (lowerPageName) {
            case 'users':
                return `// Import global User type
import { User } from '@/types';

// Page-specific types for Users
export interface UsersPageState {
    selectedFilter: 'all' | 'user' | 'admin';
    searchKeyword: string;
    isLoading: boolean;
    error: string | null;
}

export interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: number) => void;
    isLoading: boolean;
}

export interface UsersFilterProps {
    selectedFilter: 'all' | 'user' | 'admin';
    onFilterChange: (filter: 'all' | 'user' | 'admin') => void;
}

export interface UsersSearchProps {
    searchKeyword: string;
    onSearchChange: (keyword: string) => void;
}

// API 관련 타입
export interface UsersApiResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateUserRequest {
    name: string;
    id: string;
    department: string;
    permission: 'user' | 'admin';
}`;

            case 'project':
                return `// Import global Project type
import { Project } from '@/types';

// Page-specific types for Project
export interface ProjectPageState {
    selectedProject: string | null;
    viewMode: 'list' | 'grid';
    isLoading: boolean;
    error: string | null;
}

export interface ProjectCardProps {
    project: Project;
    onSelect: (projectId: string) => void;
    onEdit: (project: Project) => void;
}

// API 관련 타입
export interface ProjectApiResponse {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
}`;

            default:
                return `// Page-specific types for ${this.toPascalCase(pageName)}
export interface ${this.toPascalCase(pageName)}PageState {
    isLoading: boolean;
    error: string | null;
    // Add page-specific state types here
}`;
        }
    }
    /**
     * 테이블 컴포넌트 코드 생성 (동적 컬럼 지원)
     * @param component 테이블 컴포넌트 설정
     * @returns 테이블 JSX 코드
     */
    private generateTableJSX(component: ComponentDesignConfig): string {
        const { componentName } = component;
        const tableName = this.toPascalCase(componentName);

        // 테이블 컬럼 정보 추출
        const columns = this.extractTableColumns(component);

        const columnCells = columns
            .map((col) => {
                const cellContent =
                    col.key === 'index' ? 'index + 1' : `this.renderCellValue(row[${col.key}], ${JSON.stringify(col)})`;
                return `<TableCell>
                        {${cellContent}}
                    </TableCell>`;
            })
            .join('\n                    ');

        return `<TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="${tableName} table">
        <TableHead>
            <TableRow>
                ${columns
                    .map(
                        (col) => `<TableCell key="${col.key}" sx={{ fontWeight: 'bold' }}>
                    ${col.label}
                </TableCell>`,
                    )
                    .join('\n                ')}
            </TableRow>
        </TableHead>
        <TableBody>
            {data.map((row, index) => (
                <TableRow key={row.seq || index} hover>
                    ${columnCells}
                </TableRow>
            ))}
        </TableBody>
    </Table>
</TableContainer>`;
    }

    /**
     * 테이블 컬럼 정보 추출
     * @param component 테이블 컴포넌트
     * @returns 컬럼 배열
     */
    private extractTableColumns(component: ComponentDesignConfig): Array<{ key: string; label: string; type: string }> {
        // 피그마 구조에 맞게 테이블 컬럼 정보 추출
        const { properties } = component;

        // 피그마에서 추출된 컬럼 정보가 있다면 사용
        if (properties.columns && Array.isArray(properties.columns)) {
            return properties.columns.map((col: { key?: string; label?: string; type?: string }) => ({
                key: col.key || '',
                label: col.label || '',
                type: col.type || 'text',
            }));
        }

        // 기본 컬럼 설정 (피그마 구조 반영)
        return [
            { key: 'index', label: '번호', type: 'index' },
            { key: 'id', label: '이메일', type: 'email' },
            { key: 'name', label: '이름', type: 'text' },
            { key: 'department', label: '소속', type: 'text' },
            { key: 'permission', label: '권한', type: 'permission' },
            { key: 'status', label: '상태', type: 'status' },
            { key: 'regdate', label: '가입일', type: 'date' },
            { key: 'last_login', label: '최근 로그인', type: 'date' },
        ];
    }

    /**
     * 테이블 설정 생성
     * @param columns 컬럼 배열
     * @returns 테이블 설정 코드
     */
    private generateTableConfig(columns: Array<{ key: string; label: string; type: string }>): string {
        return `const tableConfig = {
    columns: [
        ${columns
            .map(
                (col) => `{
            key: '${col.key}',
            label: '${col.label}',
            type: '${col.type}',
            sortable: true,
            filterable: true
        }`,
            )
            .join(',\n        ')}
    ],
    pagination: true,
    sorting: true,
    filtering: true
};`;
    }

    /**
     * 컴포넌트 Props 타입 생성
     * @param component 컴포넌트 설정
     * @returns Props 타입 문자열
     */
    private generateComponentPropsType(component: ComponentDesignConfig): string {
        const { componentType } = component;
        const props: string[] = [];

        switch (componentType) {
            case 'button':
                props.push('variant?: "contained" | "outlined" | "text"');
                props.push('size?: "small" | "medium" | "large"');
                props.push('onClick?: () => void');
                break;
            case 'input':
                props.push('value?: string');
                props.push('onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void');
                props.push('placeholder?: string');
                break;
            case 'table':
                props.push('data: User[]'); // 전역 타입 사용
                props.push('columns: TableColumn<User>[]'); // 전역 타입 사용
                props.push('onEdit?: (user: User) => void');
                props.push('onDelete?: (userId: number) => void');
                props.push('isLoading?: boolean');
                break;
        }

        return props.join(';\n    ');
    }

    /**
     * 테이블 셀 값 렌더링
     * @param value 셀 값
     * @param column 컬럼 정보
     * @returns 렌더링된 값
     */
    private renderCellValue(value: unknown, column: { key: string; label: string; type: string }): string {
        switch (column.type) {
            case 'status':
                return `{value === 'active' ? '활성' : '중지'}`;
            case 'permission':
                return `{value === 'admin' ? '시스템관리자' : '일반사용자'}`;
            case 'boolean':
                return `{value === 'Y' || value === true ? '예' : '아니오'}`;
            case 'date':
                return `{new Date(value).toLocaleDateString()}`;
            case 'email':
                return `{value}`;
            default:
                return `{value}`;
        }
    }

    /**
     * 기존 코드와 피그마 디자인 병합 (하이브리드 접근법)
     * @param existingCode 기존 컴포넌트 코드
     * @param figmaComponents 피그마에서 추출된 컴포넌트 정보
     * @returns 병합된 컴포넌트 코드
     */
    public mergeWithExistingCode(
        existingCode: string,
        figmaComponents: {
            table?: ComponentDesignConfig;
            buttons?: ComponentDesignConfig[];
            inputs?: ComponentDesignConfig[];
            filters?: ComponentDesignConfig[];
            layout?: {
                spacing: number;
                padding: number;
                direction: 'row' | 'column';
            };
        },
    ): string {
        // 기존 코드에서 주요 부분 추출
        const existingImports = this.extractImports(existingCode);
        const existingLogic = this.extractLogic(existingCode);
        const existingJSX = this.extractJSX(existingCode);

        // 피그마 스타일 적용
        const mergedJSX = this.applyFigmaStyles(existingJSX, figmaComponents);

        // 병합된 코드 생성
        return `${existingImports}

${existingLogic}

export const Users = () => {
    ${this.extractStateAndLogic(existingCode)}
    
    return (
        ${mergedJSX}
    );
};
`;
    }

    /**
     * 기존 코드에서 임포트 추출
     */
    private extractImports(code: string): string {
        const importRegex = /import.*?from.*?;[\s\n]*/g;
        const imports = code.match(importRegex) || [];
        return imports.join('\n');
    }

    /**
     * 기존 코드에서 로직 추출
     */
    private extractLogic(code: string): string {
        // useState, useMemo 등의 로직 추출
        const logicRegex = /(const \[.*?\] = React\.useState.*?;[\s\n]*|const .*? = React\.useMemo.*?;[\s\n]*)/g;
        const logic = code.match(logicRegex) || [];
        return logic.join('\n');
    }

    /**
     * 기존 코드에서 JSX 추출
     */
    private extractJSX(code: string): string {
        const jsxMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*}\s*;?\s*$/);
        return jsxMatch ? jsxMatch[1].trim() : '';
    }

    /**
     * 기존 코드에서 상태와 로직 추출
     */
    private extractStateAndLogic(code: string): string {
        const functionMatch = code.match(/export const Users = \(\) => \{([\s\S]*?)return/);
        if (functionMatch) {
            return functionMatch[1].trim();
        }
        return '';
    }

    /**
     * 피그마 스타일을 기존 JSX에 적용
     */
    private applyFigmaStyles(
        existingJSX: string,
        figmaComponents: {
            table?: ComponentDesignConfig;
            buttons?: ComponentDesignConfig[];
            inputs?: ComponentDesignConfig[];
            filters?: ComponentDesignConfig[];
            layout?: {
                spacing: number;
                padding: number;
                direction: 'row' | 'column';
            };
        },
    ): string {
        let mergedJSX = existingJSX;

        // 레이아웃 스타일 적용
        if (figmaComponents.layout) {
            const layoutStyle = `sx={{ 
                p: ${figmaComponents.layout.padding}, 
                display: 'flex', 
                flexDirection: '${figmaComponents.layout.direction}', 
                gap: ${figmaComponents.layout.spacing} 
            }}`;

            // 기존 Box에 스타일 적용
            mergedJSX = mergedJSX.replace(/<Box[^>]*>/, `<Box ${layoutStyle}>`);
        }

        return mergedJSX;
    }

    /**
     * Prettier를 사용하여 코드 포맷팅
     * @param code 원본 코드
     * @returns 포맷팅된 코드
     */
    private async formatCode(code: string): Promise<string> {
        try {
            // Prettier의 format 메서드가 비동기적으로 작동
            const formatted = await prettier.format(code, {
                parser: 'typescript',
                semi: true,
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'es5',
                printWidth: 100,
                arrowParens: 'avoid',
                endOfLine: 'lf',
            });
            
            console.log('✅ Prettier 포맷팅 성공');
            return formatted;
        } catch (error) {
            console.warn('⚠️ Prettier 포맷팅 실패, 원본 코드 반환:', error);
            return code;
        }
    }
}
