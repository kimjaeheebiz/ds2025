/**
 * Figma 아이콘 인스턴스명을 MUI Icon 컴포넌트로 변환
 * 
 * 규칙:
 * - 이름에서 Filled 접미사만 제거 (예: PersonFilled → Person)
 * - 그 외는 대소문자 그대로 사용 (예: AccountCircleOutlined → AccountCircleOutlined)
 * - 매핑 불가 시 null 반환 (아이콘 생성하지 않음)
 */
export function getMuiIconName(figmaComponentIdOrName: string, iconName?: string): string | null {
    if (!iconName) {
        return null;
    }

    // 이름 정규화: 꺾쇠 제거, trim (대소문자 그대로 유지)
    let normalized = iconName.replace(/[<>]/g, '').trim();
    
    // 공백/슬래시가 포함된 경우 마지막 토큰만 사용 (예: "Icon/SettingsOutlined" → "SettingsOutlined")
    if (normalized.includes('/') || normalized.includes(' ')) {
        const tokens = normalized.split(/[\s/]+/);
        const lastToken = tokens[tokens.length - 1];
        if (lastToken && /^[A-Z]/.test(lastToken)) {
            normalized = lastToken;
        }
    }
    
    // Icon 컨테이너 이름은 제외
    if (normalized === 'Icon' || normalized === '<Icon>') {
        return null;
    }
    
    // Filled로 끝나면 Filled만 제거
    if (normalized.endsWith('Filled')) {
        const withoutFilled = normalized.replace(/Filled$/, '');
        if (withoutFilled && /^[A-Z]/.test(withoutFilled)) {
            return withoutFilled;
        }
    }
    
    // 그 외는 PascalCase면 그대로 사용
    if (normalized && /^[A-Z]/.test(normalized)) {
        return normalized;
    }
    
    // 매핑 불가 시 null 반환 (아이콘 생성하지 않음)
    return null;
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
        properties.actionIconName ||
        // Avatar, IconButton 등 커스텀 아이콘 필드 지원
        (properties as any).__avatarIconName ||
        (properties as any).__iconButtonIconName
    );
}

/**
 * 필요한 아이콘 이름 목록 가져오기
 */
export function getRequiredIconNames(properties: Record<string, any>): string[] {
    const icons = new Set<string>();
    
    // ✅ 실제로 사용되는 경우에만 import 추가
    if (properties.startIcon === true && properties.startIconComponentId) {
        const iconName = getMuiIconName(properties.startIconComponentId, properties.startIconName);
        if (iconName) {
            icons.add(iconName);
        }
    }
    
    if (properties.endIcon === true && properties.endIconComponentId) {
        const iconName = getMuiIconName(properties.endIconComponentId, properties.endIconName);
        if (iconName) {
            icons.add(iconName);
        }
    }
    
    // ✅ CardHeader의 actionIcon 처리 추가
    if (properties.actionIconComponentId || properties.actionIconName) {
        const iconName = getMuiIconName(properties.actionIconComponentId || '', properties.actionIconName);
        if (iconName) {
            icons.add(iconName);
        }
    }
    
    // ✅ Avatar의 아이콘 처리 추가
    if (properties.__avatarIconName) {
        icons.add(properties.__avatarIconName);
    }
    
    // ✅ IconButton의 아이콘 처리 추가
    if (properties.__iconButtonIconName) {
        icons.add(properties.__iconButtonIconName);
    }
    
    return Array.from(icons);
}

