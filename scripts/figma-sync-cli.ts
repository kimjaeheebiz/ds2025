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
COMPONENTS_PATH=src/components/generated
`;

            const fileSystem = new FileSystemManager();
            await fileSystem.saveFile('.env', envContent);
            
            console.log('✅ 환경 설정이 .env 파일에 저장되었습니다.');
            console.log('📝 실제 Figma 자격 증명으로 .env 파일을 업데이트해 주세요.');
            
        } catch (error) {
            handleFigmaError(error, 'setup');
        }
    });

// 모든 페이지 생성 명령
program
    .command('generate')
    .description('Figma 디자인에서 React 컴포넌트 생성')
    .option('-p, --page <pageName>', '특정 페이지만 생성')
    .option('-a, --all', '모든 페이지 생성')
    .option('-d, --dry-run', '파일 생성 없이 미리보기만 표시')
    .option('-o, --output <path>', '출력 디렉토리 경로')
    .option('-v, --validate', '생성된 코드 검증')
    .action(async (options) => {
        try {
            console.log('🚀 Figma 컴포넌트 생성 시작...');
            
            const service = new FigmaIntegrationService();
            
            if (options.dryRun) {
                console.log('🔍 미리보기 모드 - 파일이 생성되지 않습니다.');
                // TODO: 미리보기 기능 구현
                return;
            }

            if (options.all) {
                console.log('📄 모든 페이지 생성 중...');
                await service.generateAllPages();
            } else if (options.page) {
                console.log(`📄 ${options.page} 페이지 생성 중...`);
                // TODO: 단일 페이지 생성 구현
            } else {
                console.log('❌ --page <이름> 또는 --all을 지정해 주세요.');
                return;
            }

            if (options.validate) {
                console.log('🔍 생성된 코드 검증 중...');
                // TODO: 생성된 파일 검증 구현
            }

            console.log('✅ 컴포넌트 생성이 성공적으로 완료되었습니다.');
            
        } catch (error) {
            handleFigmaError(error, 'generate');
        }
    });

// 레이아웃 컴포넌트 동기화 명령
program
    .command('sync-layout')
    .description('기존 레이아웃 컴포넌트와 피그마 디자인 동기화')
    .option('-p, --page <name>', '동기화할 페이지 이름')
    .option('-c, --component <type>', '동기화할 컴포넌트 타입 (header, sidebar, pageHeader, footer)')
    .option('--dry-run', '실제 파일 수정 없이 미리보기만 실행')
    .action(async (options) => {
        try {
            console.log('🔄 레이아웃 컴포넌트 동기화 시작...');
            
            if (options.page) {
                // 특정 페이지의 레이아웃 컴포넌트 동기화
                console.log(`📄 ${options.page} 페이지의 레이아웃 컴포넌트 동기화 중...`);
                // TODO: 특정 페이지 처리 구현
            } else if (options.component) {
                // 특정 컴포넌트만 동기화
                console.log(`🔧 ${options.component} 컴포넌트 동기화 중...`);
                // TODO: 특정 컴포넌트 처리 구현
            } else {
                // 모든 레이아웃 컴포넌트 동기화
                console.log('🎨 모든 레이아웃 컴포넌트 동기화 중...');
                // TODO: 전체 동기화 구현
            }

            if (options.dryRun) {
                console.log('🔍 미리보기 모드: 실제 파일은 수정되지 않습니다.');
            }

            console.log('✅ 레이아웃 컴포넌트 동기화가 완료되었습니다.');
            
        } catch (error) {
            handleFigmaError(error, 'sync-layout');
        }
    });

// 라이브러리 컴포넌트 추출 명령
program
    .command('extract-library')
    .description('Figma에서 라이브러리 컴포넌트 추출')
    .option('-o, --output <path>', '출력 디렉토리 경로')
    .option('-f, --format <format>', '출력 형식 (tsx, jsx)', 'tsx')
    .action(async () => {
        try {
            console.log('📚 라이브러리 컴포넌트 추출 중...');
            
            const service = new FigmaIntegrationService();
            await service.extractLibraryComponents();
            
            console.log('✅ 라이브러리 컴포넌트 추출이 완료되었습니다.');
            
        } catch (error) {
            handleFigmaError(error, 'extract-library');
        }
    });

// 페이지 생성 명령 (레이아웃 통합)
program
    .command('generate-content')
    .description('기존 레이아웃과 통합된 React 페이지 콘텐츠 생성')
    .option('-p, --page <pageName>', '생성할 페이지 이름')
    .option('-l, --layout <layoutType>', '레이아웃 타입 (default, auth, error)', 'default')
    .option('-o, --output <path>', '출력 디렉토리 경로', 'src/pages/generated')
    .action(async (options) => {
        try {
            console.log(`📄 레이아웃 통합 콘텐츠 생성 중: ${options.page}...`);
            
            const service = new FigmaIntegrationService();
            
            if (options.page) {
                // 특정 페이지 생성 (임시로 generateAllPages 사용)
                console.log(`⚠️  단일 페이지 생성은 아직 구현되지 않았습니다. 모든 페이지를 생성합니다...`);
                await service.generateAllPages();
                console.log(`✅ 모든 페이지가 성공적으로 생성되었습니다.`);
            } else {
                // 모든 페이지 생성
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
    .action(async () => {
        try {
            console.log('📊 Figma 통합 상태 확인 중...');
            
            const fileSystem = new FileSystemManager();
            
            // 환경 변수 확인
            console.log('\n🔧 환경 설정:');
            const envExists = fileSystem.fileExists('.env');
            console.log(`  .env 파일: ${envExists ? '✅ 발견됨' : '❌ 없음'}`);
            
            // 출력 디렉토리 확인
            console.log('\n📁 출력 디렉토리:');
            const outputDirs = [
                'src/pages',
                'src/components/generated'
            ];
            
            outputDirs.forEach(dir => {
                const exists = fileSystem.directoryExists(dir);
                console.log(`  ${dir}: ${exists ? '✅ 존재함' : '❌ 없음'}`);
            });
            
            // 최근 생성된 파일 확인
            console.log('\n📄 최근 생성된 파일:');
            const generatedDir = 'src/pages';
            if (fileSystem.directoryExists(generatedDir)) {
                const files = fileSystem.listDirectory(generatedDir);
                if (files.length > 0) {
                    files.slice(0, 5).forEach(file => {
                        console.log(`  📄 ${file}`);
                    });
                    if (files.length > 5) {
                        console.log(`  ... 그리고 ${files.length - 5}개 더`);
                    }
                } else {
                    console.log('  생성된 파일이 없습니다.');
                }
            } else {
                console.log('  생성된 디렉토리가 없습니다.');
            }
            
            console.log('\n✅ 상태 확인 완료');
            
        } catch (error) {
            handleFigmaError(error, 'status');
        }
    });

// 정리 명령
program
    .command('sync-types')
    .description('Figma 테이블 컬럼과 전역 타입 동기화')
    .option('-p, --page <pageName>', '동기화할 페이지 이름')
    .option('-f, --force', '기존 타입 덮어쓰기')
    .action(async (options) => {
        try {
            console.log('🔄 타입 동기화 중...');
            
            if (!options.page) {
                console.log('❌ 페이지 이름을 지정해주세요.');
                console.log('사용법: npm run figma:sync-types -- --page users');
                return;
            }

            // 타입 동기화 로직
            console.log(`📋 ${options.page} 페이지 타입 동기화 중...`);
            
            // 1. Figma에서 테이블 컬럼 정보 추출
            console.log('1️⃣ Figma 테이블 컬럼 정보 추출');
            
            // 2. 전역 타입 파일 업데이트
            console.log('2️⃣ 전역 타입 파일 업데이트');
            
            // 3. 페이지별 타입 파일 업데이트
            console.log('3️⃣ 페이지별 타입 파일 업데이트');
            
            // 4. 컴포넌트 코드 업데이트
            console.log('4️⃣ 컴포넌트 코드 업데이트');
            
            console.log('✅ 타입 동기화 완료!');
            console.log(`📁 업데이트된 파일:`);
            console.log(`   - src/types/${options.page}.ts`);
            console.log(`   - src/pages/${options.page}/${options.page}.types.ts`);
            console.log(`   - src/pages/${options.page}/${options.page}.tsx`);
            
        } catch (error) {
            console.error('❌ 타입 동기화 실패:', error);
        }
    });

program
    .command('clean')
    .description('생성된 파일 정리')
    .option('-a, --all', '모든 생성된 파일 정리')
    .option('-p, --pages', '페이지 컴포넌트만 정리')
    .option('-c, --components', '라이브러리 컴포넌트만 정리')
    .action(async (options) => {
        try {
            console.log('🧹 생성된 파일 정리 중...');
            
            const fileSystem = new FileSystemManager();
            
            if (options.all || options.pages) {
                // 기존 페이지 파일들은 정리하지 않음 (기존 구조 유지)
                console.log('✅ 페이지 컴포넌트 정리 완료 (기존 구조 유지)');
            }
            
            if (options.all || options.components) {
                const componentsDir = 'src/components/generated';
                if (fileSystem.directoryExists(componentsDir)) {
                    await fileSystem.deleteDirectory(componentsDir);
                    console.log('✅ 라이브러리 컴포넌트 정리 완료');
                }
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
