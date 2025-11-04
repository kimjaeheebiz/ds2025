import { ComponentMapping } from './types/PropertyMapper';
import { FigmaNode, ComponentProperties } from '../types';
import { findMappingByFigmaName } from './index';

/**
 * MUI TableContainer 컴포넌트 매핑
 */
export const TableContainerMapping: ComponentMapping = {
    figmaNames: ['<TableContainer>'] as const,
    muiName: 'TableContainer',
    
    // MUI API: https://mui.com/material-ui/api/table-container/
    // TableContainer는 기본적으로 component, sx만 지원
    // elevation과 variant는 component={Paper}일 때만 의미가 있음
    muiProps: {
        // component
        component: {
            type: 'string',
        },
        // elevation (component={Paper}일 때만 사용)
        elevation: {
            type: 'union-number',
        },
        // variant (component={Paper}일 때만 사용)
        variant: {
            type: 'union',
            values: ['elevation', 'outlined'] as const,
        },
    },
    
    excludeFromSx: [
        'width',
        'borderColor',
        'borderWidth',
        'borderRadius', // variant="outlined"일 때 Paper가 자동으로 처리하므로 제외
    ],
    
    // 하위 컴포넌트 import 목록
    // TableContainer 구조: TableContainer > Table
    subComponents: [
        'Table', 'Paper' // Paper는 component prop으로 사용될 수 있음
    ],
    
    // ✅ TableContainer 노드가 Paper 인스턴스인 경우 처리 (Paper 인스턴스를 TableContainer로 이름 변경한 경우)
    extractProperties: async (node: FigmaNode, extractor?: any): Promise<ComponentProperties> => {
        const properties: ComponentProperties = {};
        
        console.log(`🔍 [TableContainer] extractProperties 호출: ${node.name}`);
        
        // 방법 1: 노드 자체가 Paper 인스턴스인 경우 (componentProperties에 Paper 속성이 있음)
        const nodeProps = (node as any).componentProperties || {};
        const hasPaperProperties = Object.keys(nodeProps).some(key => 
            key.toLowerCase() === 'variant' || key.toLowerCase() === 'elevation'
        );
        
        if (hasPaperProperties || node.type === 'INSTANCE') {
            console.log(`✅ [TableContainer] 노드가 Paper 인스턴스로 판단됨`);
            // component prop에 Paper 설정
            properties.component = 'Paper';
            
            // Paper 매핑을 찾아서 variant, elevation 추출
            const paperMapping = findMappingByFigmaName('<Paper>');
            
            // Variant 속성 추출
            if (paperMapping?.muiProps?.variant) {
                const variantDef = paperMapping.muiProps.variant;
                let variantValue: any = undefined;
                
                // componentProperties에서 직접 추출
                const matchingKey = Object.keys(nodeProps).find(
                    key => key.toLowerCase() === 'variant'
                );
                
                if (matchingKey) {
                    const propData = nodeProps[matchingKey];
                    if (propData && typeof propData === 'object' && 'value' in propData) {
                        variantValue = propData.value;
                    } else if (propData !== undefined) {
                        variantValue = propData;
                    }
                }
                
                if (variantValue) {
                    const normalized = variantDef.transform 
                        ? variantDef.transform(variantValue)
                        : (typeof variantValue === 'string' ? variantValue.toLowerCase() : variantValue);
                    
                    if (variantDef.values?.includes(normalized as any)) {
                        properties.variant = normalized;
                    }
                }
            }
            
            // Elevation 속성 추출
            if (paperMapping?.muiProps?.elevation) {
                const elevationDef = paperMapping.muiProps.elevation;
                let elevationValue: any = undefined;
                
                // componentProperties에서 직접 추출
                const matchingKey = Object.keys(nodeProps).find(
                    key => key.toLowerCase() === 'elevation'
                );
                
                if (matchingKey) {
                    const propData = nodeProps[matchingKey];
                    if (propData && typeof propData === 'object' && 'value' in propData) {
                        elevationValue = propData.value;
                    } else if (propData !== undefined) {
                        elevationValue = propData;
                    }
                }
                
                if (elevationValue !== undefined && elevationValue !== null) {
                    const finalValue = elevationDef.transform 
                        ? elevationDef.transform(elevationValue)
                        : (typeof elevationValue === 'number' 
                            ? elevationValue 
                            : parseInt(String(elevationValue)));
                    
                    if (!isNaN(finalValue as number)) {
                        properties.elevation = finalValue as number;
                    }
                }
            }
            
            console.log(`✅ [TableContainer] Paper 인스턴스 속성 추출 완료:`, properties);
        } 
        // 방법 2: 자식 노드에서 Paper를 찾는 경우 (기존 로직 유지)
        else if (node.children && node.children.length > 0) {
            const paperNode = node.children.find(child => 
                child.name === '<Paper>' || 
                child.name.toLowerCase().includes('paper')
            );
            
            if (paperNode) {
                console.log(`✅ [TableContainer] Paper 자식 노드 발견: ${paperNode.name}`);
                properties.component = 'Paper';
                
                const paperMapping = findMappingByFigmaName('<Paper>');
                const paperProps = (paperNode as any).componentProperties || {};
                
                // Variant 속성 추출
                if (paperMapping?.muiProps?.variant) {
                    const variantDef = paperMapping.muiProps.variant;
                    const matchingKey = Object.keys(paperProps).find(
                        key => key.toLowerCase() === 'variant'
                    );
                    
                    if (matchingKey) {
                        const propData = paperProps[matchingKey];
                        const variantValue = propData && typeof propData === 'object' && 'value' in propData
                            ? propData.value
                            : propData;
                        
                        if (variantValue) {
                            const normalized = typeof variantValue === 'string' 
                                ? variantValue.toLowerCase() 
                                : variantValue;
                            if (variantDef.values?.includes(normalized as any)) {
                                properties.variant = normalized;
                            }
                        }
                    }
                }
                
                // Elevation 속성 추출
                if (paperMapping?.muiProps?.elevation) {
                    const elevationDef = paperMapping.muiProps.elevation;
                    const matchingKey = Object.keys(paperProps).find(
                        key => key.toLowerCase() === 'elevation'
                    );
                    
                    if (matchingKey) {
                        const propData = paperProps[matchingKey];
                        const elevationValue = propData && typeof propData === 'object' && 'value' in propData
                            ? propData.value
                            : propData;
                        
                        if (elevationValue !== undefined && elevationValue !== null) {
                            const finalValue = typeof elevationValue === 'number'
                                ? elevationValue
                                : parseInt(String(elevationValue));
                            if (!isNaN(finalValue)) {
                                properties.elevation = finalValue;
                            }
                        }
                    }
                }
            }
        }
        
        console.log(`📤 [TableContainer] extractProperties 반환:`, properties);
        return properties;
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TableContainer${props}${sxAttribute}>
            ${content}
        </TableContainer>`;
    },
};

