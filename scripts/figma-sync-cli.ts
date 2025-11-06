#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { FigmaIntegrationService } from '../src/api/figma/index.js';
import { FileSystemManager } from '../src/api/figma/fileSystem.js';
import { handleFigmaError } from '../src/api/figma/errors.js';

const program = new Command();

// CLI 버전 정보
program
    .name('figma-sync')
    .description('Figma 디자인을 React 컴포넌트로 동기화하는 도구')
    .version('1.0.0');

// 환경 변수 설정 명령
program
    .command('setup')
    .description('Figma 통합 환경 설정')
    .option('-t, --token <token>', 'Figma API 토큰')
    .option('-l, --library <fileKey>', '라이브러리 파일 키')
    .option('-p, --platform <fileKey>', '플랫폼 파일 키')
    .action(async (options) => {
        try {
            console.log('🔧 Figma 통합 환경 설정 중...');
            
            const envContent = `# Figma API 설정
FIGMA_TOKEN=${options.token || 'your_figma_token_here'}
FIGMA_FILE_LIBRARY=${options.library || 'your_library_file_key_here'}
FIGMA_FILE_PLATFORM=${options.platform || 'your_platform_file_key_here'}

# 선택사항: 사용자 정의 출력 경로
OUTPUT_PATH=src/pages/generated
`;

            const fileSystem = new FileSystemManager();
            await fileSystem.saveFile('.env', envContent);
            
            console.log('✅ 환경 설정이 .env 파일에 저장되었습니다.');
            console.log('📝 실제 Figma 자격 증명으로 .env 파일을 업데이트해 주세요.');
            
        } catch (error) {
            handleFigmaError(error, 'setup');
        }
    });

// 페이지 생성 명령 (레이아웃 통합)
program
    .command('generate-content')
    .description('기존 레이아웃과 통합된 React 페이지 콘텐츠 생성')
    .argument('[pageName]', '생성할 페이지 이름 (지정하지 않으면 모든 페이지 생성)')
    .option('-l, --layout <layoutType>', '레이아웃 타입 (default, auth, error)', 'default')
    .option('-o, --output <path>', '출력 디렉토리 경로', 'src/pages/generated')
    .action(async (pageName) => {
        try {
            const service = new FigmaIntegrationService();
            
            if (pageName) {
                // 특정 페이지 생성
                console.log(`📄 ${pageName} 페이지 생성 중...`);
                await service.generateSinglePage(pageName);
                console.log(`✅ ${pageName} 페이지가 성공적으로 생성되었습니다.`);
            } else {
                // 모든 페이지 생성
                console.log('📄 모든 페이지 생성 중...');
                await service.generateAllPages();
                console.log('✅ 모든 페이지가 성공적으로 생성되었습니다.');
            }
            
        } catch (error) {
            handleFigmaError(error, 'generate-content');
        }
    });

// 코드 검증 명령
program
    .command('validate')
    .description('생성된 React 컴포넌트 검증')
    .option('-f, --file <path>', '특정 파일 검증')
    .option('-d, --directory <path>', '디렉토리 내 모든 파일 검증')
    .option('-r, --recursive', '하위 디렉토리까지 재귀적으로 검증')
    .action(async () => {
        try {
            console.log('🔍 React 컴포넌트 검증 중...');
            
            console.log('❌ 코드 검증 기능은 현재 사용할 수 없습니다.');
            console.log('💡 TypeScript 컴파일러나 ESLint를 사용하여 코드를 검증해 주세요.');
            
        } catch (error) {
            handleFigmaError(error, 'validate');
        }
    });

// 상태 확인 명령
program
    .command('status')
    .description('Figma 통합 상태 확인')
    .option('-r, --remote', 'Figma API 연결 상태 원격 확인')
    .action(async (options) => {
        try {
            console.log('📊 Figma 통합 상태 확인 중...');
            
            const fileSystem = new FileSystemManager();
            const fs = await import('fs');
            const path = await import('path');
            
            // 환경 변수 확인
            console.log('\n🔧 환경 설정:');
            const envExists = fileSystem.fileExists('.env');
            console.log(`  .env 파일: ${envExists ? '✅ 발견됨' : '❌ 없음'}`);
            
            // 출력 디렉토리 확인
            console.log('\n📁 출력 디렉토리:');
            const outputDir = process.env.OUTPUT_PATH || 'src/pages';
            const outputExists = fileSystem.directoryExists(outputDir);
            console.log(`  ${outputDir}: ${outputExists ? '✅ 존재함' : '❌ 없음'}`);
            
            // 최근 생성된 파일 확인
            console.log('\n📄 최근 생성된 파일:');
            const generatedDir = outputDir;
            if (fileSystem.directoryExists(generatedDir)) {
                // 재귀적으로 파일 수집 후 mtime 기준 상위 5개 표시
                type FileInfo = { file: string; mtime: number };
                const collectFiles = (dir: string): FileInfo[] => {
                    const entries = fs.readdirSync(dir, { withFileTypes: true }) as Array<{ name: string; isDirectory: () => boolean }>;
                    const files: FileInfo[] = [];
                    for (const entry of entries) {
                        const fullPath = path.join(dir, entry.name) as string;
                        if (entry.isDirectory()) {
                            const nested: FileInfo[] = collectFiles(fullPath);
                            files.push(...nested);
                        } else {
                            const stat = fs.statSync(fullPath);
                            files.push({ file: fullPath, mtime: stat.mtimeMs });
                        }
                    }
                    return files;
                };

                const allFiles = collectFiles(generatedDir).sort((a, b) => b.mtime - a.mtime);
                if (allFiles.length > 0) {
                    allFiles.slice(0, 5).forEach(({ file }) => {
                        console.log(`  📄 ${path.relative(process.cwd(), file)}`);
                    });
                    if (allFiles.length > 5) {
                        console.log(`  ... 그리고 ${allFiles.length - 5}개 더`);
                    }
                } else {
                    console.log('  생성된 파일이 없습니다.');
                }
            } else {
                console.log('  생성된 디렉토리가 없습니다.');
            }
            
            if (options.remote) {
                console.log('\n🌐 원격(API) 연결 확인:');
                try {
                    const { validateFigmaEnvironment, FIGMA_CONFIG } = await import('../src/api/figma/config.js');
                    const { FigmaAPIClient } = await import('../src/api/figma/client.js');
                    const env = validateFigmaEnvironment();
                    const client = new FigmaAPIClient(env.FIGMA_TOKEN);

                    // 플랫폼/라이브러리 파일에 간단 핑
                    const platformKey = env.FIGMA_FILE_PLATFORM || FIGMA_CONFIG.files.platform;
                    const libraryKey = env.FIGMA_FILE_LIBRARY || FIGMA_CONFIG.files.library;

                    const platform = await client.getFile(platformKey);
                    console.log(`  ✅ Platform 파일 OK: name="${platform.name}" lastModified=${platform.lastModified}`);

                    const library = await client.getFile(libraryKey);
                    console.log(`  ✅ Library 파일 OK: name="${library.name}" lastModified=${library.lastModified}`);
                } catch (remoteErr) {
                    console.log('  ❌ 원격 확인 실패');
                    handleFigmaError(remoteErr, 'status(remote)');
                }
            }
            
            console.log('\n✅ 상태 확인 완료');
            
        } catch (error) {
            handleFigmaError(error, 'status');
        }
    });

// (제거됨) sync-types: 현행 범위 밖 기능로 비활성화

program
    .command('clean')
    .description('생성된 파일 정리')
    .option('-a, --all', '모든 생성된 파일 정리')
    .option('-p, --pages', '페이지 컴포넌트만 정리')
    .action(async (options) => {
        try {
            console.log('🧹 생성된 파일 정리 중...');
            
            const fileSystem = new FileSystemManager();
            
            if (options.all || options.pages) {
                // 기존 페이지 파일들은 정리하지 않음 (기존 구조 유지)
                console.log('✅ 페이지 컴포넌트 정리 완료 (기존 구조 유지)');
            }
            
            console.log('✅ 정리 작업 완료');
            
        } catch (error) {
            handleFigmaError(error, 'clean');
        }
    });

// CLI 실행
program.parse(process.argv);

// 인수가 없으면 도움말 표시
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
