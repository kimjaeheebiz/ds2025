// 피그마 API 설정
export const FIGMA_CONFIG = {
    // 파일 키들 (URL에서 추출)
    files: {
        // HT_Library_v1.0_202509
        library: 'CWOwFrmmFuWyMPaeYT0g9Y',
        // HT_Agent_Platform_v1.0_202509
        platform: '4JimwjlTDViUIcsE1LBryC'
    },
    
    // 페이지별 노드 ID 매핑
    pageNodes: {
        // 브랜딩 레이아웃 (HT_Agent_Platform_v1.0_202509)
        branding: '0-1',
        // Project 페이지 (HT_Agent_Platform_v1.0_202509)
        project: '166-6455',
        // Users 페이지 (HT_Agent_Platform_v1.0_202509)
        users: '598-3722',
        // 컴포넌트 모음 (HT_Agent_Platform_v1.0_202509)
        components: '286-6314',
        // 라이브러리 컴포넌트 (HT_Library_v1.0_202509)
        libraryComponents: '13761-1677'
    },

    // 컴포넌트 타입별 매핑
    componentTypes: {
        button: ['button', 'btn', 'Button'],
        input: ['input', 'textfield', 'TextField', 'Input'],
        table: ['table', 'Table', 'DataGrid'],
        card: ['card', 'Card', 'Paper'],
        navigation: ['nav', 'menu', 'Navigation', 'Menu'],
        layout: ['layout', 'container', 'Layout', 'Container'],
        chip: ['chip', 'Chip', 'Badge'],
        dialog: ['dialog', 'modal', 'Dialog', 'Modal'],
        form: ['form', 'Form'],
        list: ['list', 'List'],
        tabs: ['tabs', 'Tabs', 'Tab']
    },

    // MUI 컴포넌트 매핑
    muiMapping: {
        button: 'Button',
        input: 'TextField',
        table: 'Table',
        card: 'Card',
        navigation: 'Navigation',
        layout: 'Box',
        chip: 'Chip',
        dialog: 'Dialog',
        form: 'FormControl',
        list: 'List',
        tabs: 'Tabs'
    },

    // 강화된 MUI 컴포넌트 매핑
    enhancedMuiMapping: {
        button: {
            component: 'Button',
            variants: ['contained', 'outlined', 'text'],
            sizes: ['small', 'medium', 'large'],
            props: {
                contained: { variant: 'contained' },
                outlined: { variant: 'outlined' },
                text: { variant: 'text' },
                small: { size: 'small' },
                medium: { size: 'medium' },
                large: { size: 'large' }
            }
        },
        input: {
            component: 'TextField',
            variants: ['outlined', 'filled', 'standard'],
            types: ['text', 'password', 'email', 'number', 'tel', 'url'],
            props: {
                outlined: { variant: 'outlined' },
                filled: { variant: 'filled' },
                standard: { variant: 'standard' },
                text: { type: 'text' },
                password: { type: 'password' },
                email: { type: 'email' },
                number: { type: 'number' },
                tel: { type: 'tel' },
                url: { type: 'url' }
            }
        },
        table: {
            component: 'Table',
            subComponents: ['TableHead', 'TableBody', 'TableRow', 'TableCell', 'TableContainer'],
            props: {
                size: ['small', 'medium'],
                stickyHeader: true
            }
        },
        card: {
            component: 'Card',
            subComponents: ['CardContent', 'CardActions', 'CardHeader', 'CardMedia'],
            props: {
                elevation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            }
        },
        navigation: {
            component: 'AppBar',
            subComponents: ['Toolbar', 'Typography', 'IconButton', 'Menu', 'MenuItem'],
            variants: ['elevation', 'outlined'],
            props: {
                elevation: [0, 1, 2, 3, 4],
                position: ['fixed', 'absolute', 'sticky', 'static', 'relative']
            }
        },
        layout: {
            component: 'Box',
            displayTypes: ['flex', 'block', 'inline', 'inline-block', 'grid'],
            props: {
                flex: { display: 'flex' },
                block: { display: 'block' },
                inline: { display: 'inline' },
                'inline-block': { display: 'inline-block' },
                grid: { display: 'grid' }
            }
        },
        chip: {
            component: 'Chip',
            variants: ['filled', 'outlined'],
            colors: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
            sizes: ['small', 'medium'],
            props: {
                filled: { variant: 'filled' },
                outlined: { variant: 'outlined' },
                small: { size: 'small' },
                medium: { size: 'medium' }
            }
        },
        dialog: {
            component: 'Dialog',
            subComponents: ['DialogTitle', 'DialogContent', 'DialogActions'],
            props: {
                maxWidth: ['xs', 'sm', 'md', 'lg', 'xl', false],
                fullWidth: true,
                fullScreen: true
            }
        },
        form: {
            component: 'FormControl',
            subComponents: ['FormLabel', 'FormHelperText', 'FormGroup'],
            variants: ['standard', 'outlined', 'filled'],
            props: {
                standard: { variant: 'standard' },
                outlined: { variant: 'outlined' },
                filled: { variant: 'filled' }
            }
        },
        list: {
            component: 'List',
            subComponents: ['ListItem', 'ListItemText', 'ListItemIcon', 'ListItemButton'],
            props: {
                dense: true,
                disablePadding: true
            }
        },
        tabs: {
            component: 'Tabs',
            subComponents: ['Tab', 'TabPanel'],
            variants: ['standard', 'scrollable', 'fullWidth'],
            orientations: ['horizontal', 'vertical'],
            props: {
                standard: { variant: 'standard' },
                scrollable: { variant: 'scrollable' },
                fullWidth: { variant: 'fullWidth' },
                horizontal: { orientation: 'horizontal' },
                vertical: { orientation: 'vertical' }
            }
        },
        // 추가 컴포넌트들
        avatar: {
            component: 'Avatar',
            variants: ['circular', 'rounded', 'square'],
            sizes: ['small', 'medium', 'large'],
            props: {
                circular: { variant: 'circular' },
                rounded: { variant: 'rounded' },
                square: { variant: 'square' }
            }
        },
        badge: {
            component: 'Badge',
            colors: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
            variants: ['standard', 'dot'],
            props: {
                standard: { variant: 'standard' },
                dot: { variant: 'dot' }
            }
        },
        checkbox: {
            component: 'Checkbox',
            colors: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
            sizes: ['small', 'medium'],
            props: {
                small: { size: 'small' },
                medium: { size: 'medium' }
            }
        },
        radio: {
            component: 'Radio',
            colors: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
            sizes: ['small', 'medium'],
            props: {
                small: { size: 'small' },
                medium: { size: 'medium' }
            }
        },
        switch: {
            component: 'Switch',
            colors: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
            sizes: ['small', 'medium'],
            props: {
                small: { size: 'small' },
                medium: { size: 'medium' }
            }
        },
        slider: {
            component: 'Slider',
            orientations: ['horizontal', 'vertical'],
            colors: ['primary', 'secondary'],
            props: {
                horizontal: { orientation: 'horizontal' },
                vertical: { orientation: 'vertical' }
            }
        },
        select: {
            component: 'Select',
            variants: ['standard', 'outlined', 'filled'],
            props: {
                standard: { variant: 'standard' },
                outlined: { variant: 'outlined' },
                filled: { variant: 'filled' }
            }
        },
        menu: {
            component: 'Menu',
            props: {
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                },
                transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                }
            }
        },
        snackbar: {
            component: 'Snackbar',
            positions: ['top', 'bottom'],
            props: {
                top: { anchorOrigin: { vertical: 'top', horizontal: 'center' } },
                bottom: { anchorOrigin: { vertical: 'bottom', horizontal: 'center' } }
            }
        },
        alert: {
            component: 'Alert',
            variants: ['filled', 'outlined', 'standard'],
            severities: ['error', 'warning', 'info', 'success'],
            props: {
                filled: { variant: 'filled' },
                outlined: { variant: 'outlined' },
                standard: { variant: 'standard' }
            }
        },
        progress: {
            component: 'LinearProgress',
            variants: ['determinate', 'indeterminate', 'buffer', 'query'],
            colors: ['primary', 'secondary'],
            props: {
                determinate: { variant: 'determinate' },
                indeterminate: { variant: 'indeterminate' },
                buffer: { variant: 'buffer' },
                query: { variant: 'query' }
            }
        },
        stepper: {
            component: 'Stepper',
            orientations: ['horizontal', 'vertical'],
            props: {
                horizontal: { orientation: 'horizontal' },
                vertical: { orientation: 'vertical' }
            }
        },
        accordion: {
            component: 'Accordion',
            variants: ['elevation', 'outlined'],
            props: {
                elevation: { variant: 'elevation' },
                outlined: { variant: 'outlined' }
            }
        },
        breadcrumbs: {
            component: 'Breadcrumbs',
            separators: ['/', '>', '-', '•'],
            props: {
                '/': { separator: '/' },
                '>': { separator: '>' },
                '-': { separator: '-' },
                '•': { separator: '•' }
            }
        },
        pagination: {
            component: 'Pagination',
            variants: ['outlined', 'text'],
            colors: ['primary', 'secondary'],
            props: {
                outlined: { variant: 'outlined' },
                text: { variant: 'text' }
            }
        },
        rating: {
            component: 'Rating',
            sizes: ['small', 'medium', 'large'],
            props: {
                small: { size: 'small' },
                medium: { size: 'medium' },
                large: { size: 'large' }
            }
        },
        skeleton: {
            component: 'Skeleton',
            variants: ['text', 'rectangular', 'circular'],
            animations: ['pulse', 'wave', false],
            props: {
                text: { variant: 'text' },
                rectangular: { variant: 'rectangular' },
                circular: { variant: 'circular' }
            }
        },
        tooltip: {
            component: 'Tooltip',
            placements: ['bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top'],
            props: {
                'bottom-end': { placement: 'bottom-end' },
                'bottom-start': { placement: 'bottom-start' },
                'bottom': { placement: 'bottom' },
                'left-end': { placement: 'left-end' },
                'left-start': { placement: 'left-start' },
                'left': { placement: 'left' },
                'right-end': { placement: 'right-end' },
                'right-start': { placement: 'right-start' },
                'right': { placement: 'right' },
                'top-end': { placement: 'top-end' },
                'top-start': { placement: 'top-start' },
                'top': { placement: 'top' }
            }
        }
    },

    // 디자인 토큰 매핑
    designTokens: {
        colors: {
            primary: 'primary',
            secondary: 'secondary',
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info',
            background: 'background',
            surface: 'surface',
            text: 'text'
        },
        typography: {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            body1: 'body1',
            body2: 'body2',
            caption: 'caption',
            button: 'button',
            overline: 'overline'
        },
        spacing: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            xxl: 48
        },
        borderRadius: {
            none: 0,
            sm: 4,
            md: 8,
            lg: 12,
            xl: 16,
            round: '50%'
        }
    },

    // API 설정
    api: {
        baseURL: 'https://api.figma.com/v1',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000
    }
} as const;

// 환경 변수 타입
export interface FigmaEnvironment {
    FIGMA_TOKEN: string;
    FIGMA_FILE_LIBRARY: string;
    FIGMA_FILE_PLATFORM: string;
}

// 환경 변수 검증
export const validateFigmaEnvironment = (): FigmaEnvironment => {
    const token = process.env.FIGMA_TOKEN;
    const libraryFile = process.env.FIGMA_FILE_LIBRARY;
    const platformFile = process.env.FIGMA_FILE_PLATFORM;

    if (!token) {
        throw new Error('FIGMA_TOKEN environment variable is required');
    }

    if (!libraryFile) {
        throw new Error('FIGMA_FILE_LIBRARY environment variable is required');
    }

    if (!platformFile) {
        throw new Error('FIGMA_FILE_PLATFORM environment variable is required');
    }

    return {
        FIGMA_TOKEN: token,
        FIGMA_FILE_LIBRARY: libraryFile,
        FIGMA_FILE_PLATFORM: platformFile
    };
};
