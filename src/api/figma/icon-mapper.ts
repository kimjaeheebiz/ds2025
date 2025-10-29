/**
 * Figma 아이콘 인스턴스명을 MUI Icon 컴포넌트로 매핑
 * 
 * Figma에서는 아이콘을 INSTANCE_SWAP으로 관리하며, 아이콘의 컴포넌트 ID를 제공합니다.
 * 이 ID를 통해 아이콘 인스턴스명(name)을 가져와 MUI Icon 컴포넌트 이름으로 매핑합니다.
 */

export interface IconMapping {
    figmaIconName: string; // Figma 아이콘 인스턴스명 (예: "AddFilled", "StarBorderFilled")
    muiIconName: string; // MUI Icon 컴포넌트 이름 (예: "Add", "StarBorder")
}

/**
 * Figma 아이콘 인스턴스명 → MUI Icon 매핑
 * 
 * 주의: Figma Button의 Start Icon, End Icon을 선택할 때 나타나는 아이콘 인스턴스명을 매핑해야 합니다.
 * 
 * 매핑 규칙:
 * - Figma의 아이콘 인스턴스명은 대소문자를 구분합니다 (예: "AddFilled", "StarBorderFilled")
 * - MUI Icon 컴포넌트명과 일치하도록 매핑합니다 (예: "Add", "StarBorder")
 */
const ICON_NAME_MAPPINGS: IconMapping[] = [
    // MUI Icon 기본 매핑 (Figma 아이콘 인스턴스명 → MUI Icon 컴포넌트명)
    // 참고: https://mui.com/material-ui/material-icons/
    { figmaIconName: 'AddFilled', muiIconName: 'Add' },
    { figmaIconName: 'Add', muiIconName: 'Add' },
    { figmaIconName: 'StarBorderFilled', muiIconName: 'StarBorder' },
    { figmaIconName: 'StarBorder', muiIconName: 'StarBorder' },
    { figmaIconName: 'DeleteFilled', muiIconName: 'Delete' },
    { figmaIconName: 'Delete', muiIconName: 'Delete' },
    { figmaIconName: 'ChevronLeftFilled', muiIconName: 'ChevronLeft' },
    { figmaIconName: 'ChevronLeft', muiIconName: 'ChevronLeft' },
    { figmaIconName: 'ChevronRightFilled', muiIconName: 'ChevronRight' },
    { figmaIconName: 'ChevronRight', muiIconName: 'ChevronRight' },
    { figmaIconName: 'SettingsFilled', muiIconName: 'Settings' },
    { figmaIconName: 'Settings', muiIconName: 'Settings' },
    { figmaIconName: 'EditFilled', muiIconName: 'Edit' },
    { figmaIconName: 'Edit', muiIconName: 'Edit' },
    { figmaIconName: 'SearchFilled', muiIconName: 'Search' },
    { figmaIconName: 'Search', muiIconName: 'Search' },
    { figmaIconName: 'SaveFilled', muiIconName: 'Save' },
    { figmaIconName: 'Save', muiIconName: 'Save' },
    { figmaIconName: 'CloseFilled', muiIconName: 'Close' },
    { figmaIconName: 'Close', muiIconName: 'Close' },
    { figmaIconName: 'DownloadFilled', muiIconName: 'Download' },
    { figmaIconName: 'Download', muiIconName: 'Download' },
    { figmaIconName: 'UploadFilled', muiIconName: 'Upload' },
    { figmaIconName: 'Upload', muiIconName: 'Upload' },
    { figmaIconName: 'HomeFilled', muiIconName: 'Home' },
    { figmaIconName: 'Home', muiIconName: 'Home' },
    { figmaIconName: 'AccountCircleFilled', muiIconName: 'AccountCircle' },
    { figmaIconName: 'AccountCircle', muiIconName: 'AccountCircle' },
    { figmaIconName: 'EmailFilled', muiIconName: 'Email' },
    { figmaIconName: 'Email', muiIconName: 'Email' },
    { figmaIconName: 'PhoneFilled', muiIconName: 'Phone' },
    { figmaIconName: 'Phone', muiIconName: 'Phone' },
    { figmaIconName: 'MoreVertFilled', muiIconName: 'MoreVert' },
    { figmaIconName: 'MoreVert', muiIconName: 'MoreVert' },
    { figmaIconName: 'MoreVertIcon', muiIconName: 'MoreVert' },
    { figmaIconName: 'MenuFilled', muiIconName: 'Menu' },
    { figmaIconName: 'Menu', muiIconName: 'Menu' },
    { figmaIconName: 'ArrowBackFilled', muiIconName: 'ArrowBack' },
    { figmaIconName: 'ArrowBack', muiIconName: 'ArrowBack' },
    { figmaIconName: 'ArrowForwardFilled', muiIconName: 'ArrowForward' },
    { figmaIconName: 'ArrowForward', muiIconName: 'ArrowForward' },
    { figmaIconName: 'CheckFilled', muiIconName: 'Check' },
    { figmaIconName: 'Check', muiIconName: 'Check' },
    { figmaIconName: 'ClearFilled', muiIconName: 'Clear' },
    { figmaIconName: 'Clear', muiIconName: 'Clear' },
    { figmaIconName: 'ExpandMoreFilled', muiIconName: 'ExpandMore' },
    { figmaIconName: 'ExpandMore', muiIconName: 'ExpandMore' },
    { figmaIconName: 'ExpandLessFilled', muiIconName: 'ExpandLess' },
    { figmaIconName: 'ExpandLess', muiIconName: 'ExpandLess' },
    { figmaIconName: 'MailOutlineFilled', muiIconName: 'Email' },
    { figmaIconName: 'MailOutline', muiIconName: 'Email' },
];

/**
 * Figma 아이콘 인스턴스명으로 MUI Icon 이름 가져오기
 * 
 * 아이콘 이름으로 매핑 (대부분의 경우)
 */
export function getMuiIconName(figmaComponentIdOrName: string, iconName?: string): string {
    // 1. 아이콘 인스턴스명으로 매핑 시도
    if (iconName) {
        const nameMapping = ICON_NAME_MAPPINGS.find(m => 
            m.figmaIconName.toLowerCase() === iconName.toLowerCase()
        );
        if (nameMapping) {
            return nameMapping.muiIconName;
        }
    }
    
    // 2. 기본값
    console.warn(`⚠️ 아이콘 매핑 없음: ${iconName || figmaComponentIdOrName}, 기본 Add 사용`);
    return 'Add';
}

/**
 * 아이콘이 있는지 확인 (startIcon, endIcon, actionIcon 포함)
 */
export function hasIcon(properties: Record<string, any>): boolean {
    return !!(
        properties.startIconComponentId ||
        properties.endIconComponentId ||
        properties.actionIconComponentId ||
        properties.startIcon ||
        properties.endIcon ||
        properties.actionIcon ||
        properties.actionIconName
    );
}

/**
 * 필요한 아이콘 이름 목록 가져오기
 */
export function getRequiredIconNames(properties: Record<string, any>): string[] {
    const icons = new Set<string>();
    
    // ✅ 실제로 사용되는 경우에만 import 추가
    if (properties.startIcon === true && properties.startIconComponentId) {
        icons.add(getMuiIconName(properties.startIconComponentId, properties.startIconName));
    } else if (properties.startIcon === true) {
        icons.add('Add'); // 기본 아이콘
    }
    
    if (properties.endIcon === true && properties.endIconComponentId) {
        icons.add(getMuiIconName(properties.endIconComponentId, properties.endIconName));
    } else if (properties.endIcon === true) {
        icons.add('Settings'); // 기본 아이콘
    }
    
    // ✅ CardHeader의 actionIcon 처리 추가
    if (properties.actionIconComponentId || properties.actionIconName) {
        const iconName = getMuiIconName(properties.actionIconComponentId || '', properties.actionIconName);
        icons.add(iconName);
    }
    
    return Array.from(icons);
}

