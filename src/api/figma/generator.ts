import { PageDesignConfig, ComponentDesignConfig, LayoutConfig, ComponentProperties, PageComponentConfig, PageStyleTokens } from './types';
import { PageContentConfig } from './pageTemplateManager';
import { FIGMA_CONFIG } from './config';

export class FigmaCodeGenerator {
    /**
     * 전체 페이지 컴포넌트 코드 생성 (기존 구조에 맞게)
     * @param contentConfig 페이지 콘텐츠 설정
     * @returns React 컴포넌트 코드
     */
    generatePageContent(contentConfig: PageContentConfig): string {
        const { pageName, components, contentStyles } = contentConfig;
        
        const componentName = this.toPascalCase(pageName);
        const imports = this.generateImports(components);
        const pageCode = this.generatePageCode(componentName, components, contentStyles);
        const contentStylesCode = this.generateContentStyles(contentStyles);

        return `${imports}

${pageCode}

${contentStylesCode}`;
    }

    /**
     * 전체 페이지 컴포넌트 코드 생성
     * @param componentName 컴포넌트 이름
     * @param components 컴포넌트 배열
     * @param contentStyles 콘텐츠 스타일
     * @returns 전체 페이지 컴포넌트 코드
     */
    private generatePageCode(componentName: string, components: ComponentDesignConfig[], contentStyles: PageContentConfig['contentStyles']): string {
        const componentJSX = this.generateComponentsJSX(components);
        const pageName = componentName.toLowerCase();
        
        // 페이지별 특수 import 추가
        const pageSpecificImports = this.generatePageSpecificImports(pageName);
        
        return `${pageSpecificImports}

export const ${componentName}: React.FC = () => {
    return (
        <Box
            sx={{
                p: '${contentStyles.spacing.contentPadding}',
                backgroundColor: '${contentStyles.colors.contentBackground}',
                color: '${contentStyles.colors.contentText}',
                minHeight: '100%',
            }}
        >
            ${componentJSX}
        </Box>
    );
};`;
    }

    /**
     * 콘텐츠 스타일 생성
     * @param contentStyles 콘텐츠 스타일 설정
     * @returns 콘텐츠 스타일 코드
     */
    generateContentStyles(contentStyles: PageContentConfig['contentStyles']): string {
        const { colors, spacing, typography } = contentStyles;
        
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
        fontSize: ${config.fontSize || 16},
        fontWeight: ${config.fontWeight || 400},
        lineHeight: ${config.lineHeight || 1.5},
        letterSpacing: '${config.letterSpacing || '0px'}',
        textAlign: '${config.textAlign || 'left'}'
    },`;
            })
            .join('\n');

        return `// 페이지 콘텐츠 스타일 정의 (기존 레이아웃과 통합)
export const contentStyles = {
    colors: {
${colorStyles}
    },
    spacing: {
${spacingStyles}
    },
    typography: {
${typographyStyles}
    }
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
        layout: LayoutConfig
    ): string {
        const jsxElements = components.map(component => 
            this.generateComponentJSX(component)
        ).join('\n        ');

        return `export const ${componentName} = () => {
    return (
        <Box sx={{
            display: '${layout.containerType}',
            flexDirection: '${layout.direction}',
            gap: ${layout.spacing},
            padding: ${layout.padding ? 
                `${layout.padding.top}px ${layout.padding.right}px ${layout.padding.bottom}px ${layout.padding.left}px` : 
                '0px'
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
        
        return components.map(component => this.generateComponentJSX(component)).join('\n\n');
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
        
        const sxProps = this.generateSXProps(properties);
        const componentProps = this.generateComponentProps(componentType, properties);

        return `<${muiComponent}
            ${componentProps}
            sx={${sxProps}}
        >
            ${this.generateComponentContent(componentType, properties)}
        </${muiComponent}>`;
    }

    /**
     * SX 속성 생성
     * @param properties 컴포넌트 속성
     * @returns SX 속성 문자열
     */
    private generateSXProps(properties: ComponentProperties): string {
        const sxProps: string[] = [];

        if (properties.width) sxProps.push(`width: ${properties.width}px`);
        if (properties.height) sxProps.push(`height: ${properties.height}px`);
        if (properties.backgroundColor) sxProps.push(`backgroundColor: '${properties.backgroundColor}'`);
        if (properties.borderColor) sxProps.push(`borderColor: '${properties.borderColor}'`);
        if (properties.borderWidth) sxProps.push(`borderWidth: ${properties.borderWidth}px`);
        if (properties.borderRadius) sxProps.push(`borderRadius: ${properties.borderRadius}px`);
        if (properties.opacity) sxProps.push(`opacity: ${properties.opacity}`);
        if (properties.gap) sxProps.push(`gap: ${properties.gap}px`);
        if (properties.justifyContent) sxProps.push(`justifyContent: '${properties.justifyContent}'`);
        if (properties.alignItems) sxProps.push(`alignItems: '${properties.alignItems}'`);

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
        const enhancedMapping = FIGMA_CONFIG.enhancedMuiMapping[componentType];

        if (enhancedMapping) {
            // 기본 props 추가
            if (enhancedMapping.props) {
                Object.entries(enhancedMapping.props).forEach(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        // 객체 형태의 props 처리
                        const propString = Object.entries(value)
                            .map(([k, v]) => `${k}: '${v}'`)
                            .join(', ');
                        props.push(`${key}={${propString}}`);
                    } else {
                        props.push(`${key}="${value}"`);
                    }
                });
            }

            // 컴포넌트별 특수 처리
            switch (componentType) {
                case 'button':
                    if (properties.text) props.push(`children="${properties.text}"`);
                    if (properties.color) {
                        const color = this.mapColorToMUI(properties.color);
                        if (color) props.push(`color="${color}"`);
                    }
                    break;
                case 'input':
                    if (properties.text) props.push(`placeholder="${properties.text}"`);
                    if (properties.type) props.push(`type="${properties.type}"`);
                    break;
                case 'card':
                    if (properties.elevation !== undefined) {
                        props.push(`elevation={${properties.elevation}}`);
                    }
                    break;
                case 'chip':
                    if (properties.label) props.push(`label="${properties.label}"`);
                    if (properties.color) {
                        const color = this.mapColorToMUI(properties.color);
                        if (color) props.push(`color="${color}"`);
                    }
                    break;
                case 'alert':
                    if (properties.severity) props.push(`severity="${properties.severity}"`);
                    break;
                case 'avatar':
                    if (properties.src) props.push(`src="${properties.src}"`);
                    if (properties.alt) props.push(`alt="${properties.alt}"`);
                    break;
                case 'badge':
                    if (properties.badgeContent) props.push(`badgeContent={${properties.badgeContent}}`);
                    break;
            }
        } else {
            // 기본 매핑 사용 (하위 호환성)
            switch (componentType) {
                case 'button':
                    props.push('variant="contained"');
                    if (properties.text) props.push(`children="${properties.text}"`);
                    break;
                case 'input':
                    props.push('variant="outlined"');
                    if (properties.text) props.push(`placeholder="${properties.text}"`);
                    break;
                case 'table':
                    props.push('size="small"');
                    break;
                case 'card':
                    props.push('elevation={1}');
                    break;
            }
        }

        return props.join('\n            ');
    }

    /**
     * 색상을 MUI 색상으로 매핑
     */
    private mapColorToMUI(color: string): string | null {
        const colorMap: Record<string, string> = {
            'primary': 'primary',
            'secondary': 'secondary',
            'error': 'error',
            'warning': 'warning',
            'info': 'info',
            'success': 'success',
            'default': 'default'
        };

        return colorMap[color.toLowerCase()] || null;
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
            default:
                return properties.text ? `"${properties.text}"` : '';
        }
    }

    /**
     * Import 문 생성
     * @param components 컴포넌트 배열
     * @returns Import 문 문자열
     */
    private generateImports(components: ComponentDesignConfig[]): string {
        const muiComponents = new Set<string>();
        const subComponents = new Set<string>();
        
        components.forEach(component => {
            const enhancedMapping = FIGMA_CONFIG.enhancedMuiMapping[component.componentType];
            
            if (enhancedMapping) {
                // 메인 컴포넌트 추가
                muiComponents.add(enhancedMapping.component);
                
                // 서브 컴포넌트 추가
                if ('subComponents' in enhancedMapping && enhancedMapping.subComponents) {
                    enhancedMapping.subComponents.forEach(subComp => {
                        subComponents.add(subComp);
                    });
                }
            } else {
                // 기본 매핑 사용
                const muiComponent = FIGMA_CONFIG.muiMapping[component.componentType];
                if (muiComponent) {
                    muiComponents.add(muiComponent);
                }
            }
        });

        // Box는 항상 포함
        muiComponents.add('Box');
        
        // 테이블 컴포넌트가 있으면 테이블 관련 컴포넌트 추가
        const hasTable = components.some(comp => comp.componentType === 'table');
        if (hasTable) {
            muiComponents.add('Table');
            muiComponents.add('TableBody');
            muiComponents.add('TableCell');
            muiComponents.add('TableContainer');
            muiComponents.add('TableHead');
            muiComponents.add('TableRow');
            muiComponents.add('Paper');
        }

        // 모든 컴포넌트 합치기
        const allComponents = Array.from(muiComponents).concat(Array.from(subComponents));
        const imports = allComponents.join(', ');
        
        return `import React from 'react';
import { ${imports} } from '@mui/material';`;
    }

    /**
     * 문자열을 PascalCase로 변환
     * @param str 입력 문자열
     * @returns PascalCase 문자열
     */
    private toPascalCase(str: string): string {
        return str
            .split(/[\s\-_]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * TypeScript 타입 정의 생성 (기존 데이터 타입 고려)
     * @param pageDesign 페이지 디자인 설정
     * @returns TypeScript 타입 정의
     */
    generateTypeDefinitions(pageDesign: PageDesignConfig): string {
        const { pageName, components } = pageDesign;
        const componentName = this.toPascalCase(pageName);

        // 페이지별 특수 타입 정의
        const pageSpecificTypes = this.generatePageSpecificTypes(pageName);
        
        const componentTypes = components.map(component => {
            const propsType = this.generateComponentPropsType(component);
            return `export interface ${this.toPascalCase(component.componentName)}Props {
    ${propsType}
}`;
        }).join('\n\n');

        return `// Generated types for ${componentName}
// Note: Basic data types (User, etc.) are defined in @/data

${pageSpecificTypes}

${componentTypes}

export interface ${componentName}Props {
    // Add page-specific props here
}`;
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
    selectedFilter: 'all' | 'generalUser' | 'systemAdmin';
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
    selectedFilter: 'all' | 'generalUser' | 'systemAdmin';
    onFilterChange: (filter: 'all' | 'generalUser' | 'systemAdmin') => void;
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
    email: string;
    department: string;
    permission: 'generalUser' | 'systemAdmin';
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
        
        const columnCells = columns.map(col => {
            const cellContent = col.key === 'index' ? 'index + 1' : `this.renderCellValue(row[${col.key}], ${JSON.stringify(col)})`;
            return `<TableCell>
                        {${cellContent}}
                    </TableCell>`;
        }).join('\n                    ');
        
        return `<TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="${tableName} table">
        <TableHead>
            <TableRow>
                ${columns.map(col => `<TableCell key="${col.key}" sx={{ fontWeight: 'bold' }}>
                    ${col.label}
                </TableCell>`).join('\n                ')}
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
    private extractTableColumns(component: ComponentDesignConfig): Array<{key: string, label: string, type: string}> {
        // Figma에서 테이블 헤더 정보 추출
        const { properties } = component;
        
        // 기본 컬럼 설정 (실제로는 Figma에서 추출)
        const defaultColumns = [
            { key: 'index', label: '번호', type: 'index' }, // 테이블 순번
            { key: 'id', label: '이메일', type: 'email' },
            { key: 'name', label: '이름', type: 'text' },
            { key: 'department', label: '소속', type: 'text' },
            { key: 'permission', label: '권한', type: 'permission' },
            { key: 'status', label: '상태', type: 'status' },
            { key: 'regdate', label: '가입일', type: 'date' },
            { key: 'last_login', label: '최근 로그인', type: 'date' },
        ];

        // properties에서 컬럼 정보가 있다면 사용
        if (properties.columns && Array.isArray(properties.columns)) {
            return properties.columns.map((col: {key?: string, label?: string, type?: string, name?: string}) => ({
                key: col.key || col.name?.toLowerCase() || '',
                label: col.label || col.name || '',
                type: col.type || 'text'
            }));
        }

        return defaultColumns;
    }

    /**
     * 테이블 설정 생성
     * @param columns 컬럼 배열
     * @returns 테이블 설정 코드
     */
    private generateTableConfig(columns: Array<{key: string, label: string, type: string}>): string {
        return `const tableConfig = {
    columns: [
        ${columns.map(col => `{
            key: '${col.key}',
            label: '${col.label}',
            type: '${col.type}',
            sortable: true,
            filterable: true
        }`).join(',\n        ')}
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
    private renderCellValue(value: unknown, column: {key: string, label: string, type: string}): string {
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
}
