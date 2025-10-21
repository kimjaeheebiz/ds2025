#!/usr/bin/env tsx

import { FigmaIntegrationService } from '../src/api/figma';
import { validateFigmaEnvironment } from '../src/api/figma/config';

/**
 * 피그마 통합 스크립트
 * 
 * 사용법:
 * npm run figma:sync                    # 모든 페이지 동기화
 * npm run figma:sync -- --pages        # 페이지만 동기화
 * npm run figma:sync -- --library      # 라이브러리만 동기화
 * npm run figma:sync -- --help         # 도움말 표시
 */

async function main() {
    try {
        console.log('🎨 Figma Integration Script');
        console.log('========================');

        // 환경 변수 검증
        console.log('🔍 Validating environment...');
        validateFigmaEnvironment();
        console.log('✅ Environment validation passed');

        // 서비스 초기화
        const figmaService = new FigmaIntegrationService();

        // 명령행 인수 파싱
        const args = process.argv.slice(2);
        const command = args[0] || 'all';

        switch (command) {
            case '--pages':
            case 'pages':
                console.log('📄 Syncing pages only...');
                await figmaService.generateAllPages();
                break;

            case '--library':
            case 'library':
                console.log('📚 Syncing library components only...');
                await figmaService.extractLibraryComponents();
                break;

            case '--help':
            case 'help':
                showHelp();
                break;

            case '--all':
            case 'all':
            default:
                console.log('🚀 Full sync (pages + library)...');
                await figmaService.generateAllPages();
                await figmaService.extractLibraryComponents();
                break;
        }

        console.log('🎉 Figma integration completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('💥 Figma integration failed:');
        console.error(error);
        process.exit(1);
    }
}

function showHelp() {
    console.log(`
Figma Integration Script

Usage:
  npm run figma:sync [command]

Commands:
  --pages, pages      Sync pages only
  --library, library  Sync library components only  
  --all, all         Full sync (pages + library) [default]
  --help, help       Show this help message

Environment Variables Required:
  FIGMA_TOKEN              Your Figma Personal Access Token
  FIGMA_FILE_LIBRARY       Figma library file key
  FIGMA_FILE_PLATFORM      Figma platform file key

Examples:
  npm run figma:sync
  npm run figma:sync -- --pages
  npm run figma:sync -- --library
  npm run figma:sync -- --help
`);
}

// 스크립트 실행
if (require.main === module) {
    main();
}
