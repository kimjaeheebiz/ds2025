// 피그마 API 설정
export const FIGMA_CONFIG = {
    // 파일 키들 (URL에서 추출)
    files: {
        // HT_Library_v1.0_202509
        library: 'CWOwFrmmFuWyMPaeYT0g9Y',
        // HT_Agent_Platform_v1.0_202509
        platform: '4JimwjlTDViUIcsE1LBryC',
    },

    // 페이지별 노드 ID 매핑
    pageNodes: {
        // Layout Templates (참조용 프레임)
        layoutTemplates: {
            default: '469:7679',
            // auth: '0:3',
            // error: '0:4',
        },

        // Layout Instances (페이지 실제 사용)
        layoutInstances: {
            default: '469:3583',
            // auth: '0:5',
            // error: '0:6',
        },

        // Pages (Frame)
        pages: {
            project: '166:6455',
            users: '598:3722',
            // components: '286:6314',
            test: '860:6675',
        },

        // Library Components
        libraryComponents: '13761:1677',
    },

    // 피그마 프레임/컴포넌트 매핑 (기존 소스 구조 기반)
    figmaMapping: {
        // 레이아웃 영역
        layout: {
            mainContent: ['MainContent'],
            mainArea: ['MainArea'],
            main: ['Main'],
        },

        // 컴포넌트 인스턴스
        components: {
            header: ['<Header>'],
            sidebar: ['<Sidebar>'],
            pageHeader: ['<PageHeader>'],
            drawer: ['<Drawer>'],
            submenu: ['<Submenu>', 'Submenu'],
            content: ['Content'],
            controlArea: ['ControlArea'],
        },

        // MUI 컴포넌트 (기존 소스에서 사용하는 것들)
        muiComponents: {
            button: ['<Button>'],
            textField: ['<TextField>', '<Input>'],
            table: ['<Table>', '<DataGrid>'],
            card: ['<Card>', '<Paper>'],
            chip: ['<Chip>', '<Badge>'],
            typography: ['<Typography>'],
        },
    },

    // MUI 컴포넌트 매핑 (기존 소스 기반)
    muiMapping: {
        // 레이아웃
        layout: 'Box',
        submenu: 'Box',
        content: 'Box',
        controlArea: 'Box',

        // 폼 컴포넌트
        button: 'Button',
        textField: 'TextField',

        // 데이터 표시
        table: 'Table',
        card: 'Card',
        chip: 'Chip',
        typography: 'Typography',
    },

    // MUI 컴포넌트 속성 매핑 (기존 소스 기반)
    muiProps: {
        button: {
            variants: ['contained', 'outlined', 'text'],
            sizes: ['small', 'medium', 'large'],
        },
        textField: {
            variants: ['outlined', 'filled', 'standard'],
            sizes: ['small', 'medium'],
        },
        table: {
            sizes: ['small', 'medium'],
            subComponents: ['TableHead', 'TableBody', 'TableRow', 'TableCell', 'TableContainer'],
        },
        card: {
            elevations: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            subComponents: ['CardContent', 'CardActions', 'CardHeader', 'CardMedia'],
        },
        chip: {
            variants: ['filled', 'outlined'],
            colors: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
            sizes: ['small', 'medium'],
        },
        typography: {
            variants: [
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'subtitle1',
                'subtitle2',
                'body1',
                'body2',
                'caption',
                'overline',
            ],
            colors: ['initial', 'inherit', 'primary', 'secondary', 'textPrimary', 'textSecondary', 'error'],
        },
    },

    // 스타일 매핑 (기존 소스 기반)
    styleMapping: {
        // 색상 (기존 소스에서 사용하는 것들)
        colors: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],

        // 타이포그래피 (기존 소스에서 사용하는 것들)
        typography: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption'],

        // 간격 (기존 소스에서 사용하는 것들)
        spacing: [1, 2, 3, 4, 8, 16, 24, 32],

        // 테두리 반경 (기존 소스에서 사용하는 것들)
        borderRadius: [0, 4, 8, 12, 16],
    },

    // API 설정
    api: {
        baseURL: 'https://api.figma.com/v1',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000,
    },
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
        FIGMA_FILE_PLATFORM: platformFile,
    };
};
