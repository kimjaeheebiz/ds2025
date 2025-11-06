import * as fs from 'fs';
import * as path from 'path';
import { FigmaFileSystemError } from './errors';

/**
 * 파일 시스템 유틸리티 클래스
 */
export class FileSystemManager {
    /**
     * 디렉토리 생성 (재귀적)
     * @param dirPath 생성할 디렉토리 경로
     */
    async createDirectory(dirPath: string): Promise<void> {
        try {
            const normalizedPath = path.normalize(dirPath);

            // 디렉토리가 이미 존재하는지 확인
            if (fs.existsSync(normalizedPath)) {
                const stats = fs.statSync(normalizedPath);
                if (!stats.isDirectory()) {
                    throw new FigmaFileSystemError(
                        `Path exists but is not a directory: ${normalizedPath}`,
                        normalizedPath,
                        'createDirectory',
                    );
                }
                return;
            }

            // 부모 디렉토리 생성
            const parentDir = path.dirname(normalizedPath);
            if (!fs.existsSync(parentDir)) {
                await this.createDirectory(parentDir);
            }

            // 디렉토리 생성
            fs.mkdirSync(normalizedPath, { recursive: true });
            console.log(`📁 Created directory: ${normalizedPath}`);
        } catch (error) {
            if (error instanceof FigmaFileSystemError) {
                throw error;
            }
            throw new FigmaFileSystemError(`Failed to create directory: ${error}`, dirPath, 'createDirectory');
        }
    }

    /**
     * 파일 저장
     * @param filePath 저장할 파일 경로
     * @param content 파일 내용
     * @param encoding 인코딩 (기본값: utf8)
     */
    async saveFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<void> {
        try {
            const normalizedPath = path.normalize(filePath);

            // 디렉토리가 존재하지 않으면 생성
            const dirPath = path.dirname(normalizedPath);
            if (!fs.existsSync(dirPath)) {
                await this.createDirectory(dirPath);
            }

            // 파일 저장
            fs.writeFileSync(normalizedPath, content, { encoding });
            console.log(`💾 Saved file: ${normalizedPath}`);
        } catch (error) {
            throw new FigmaFileSystemError(`Failed to save file: ${error}`, filePath, 'saveFile');
        }
    }

    /**
     * 파일 읽기
     * @param filePath 읽을 파일 경로
     * @param encoding 인코딩 (기본값: utf8)
     * @returns 파일 내용
     */
    async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
        try {
            const normalizedPath = path.normalize(filePath);

            if (!fs.existsSync(normalizedPath)) {
                throw new FigmaFileSystemError(`File not found: ${normalizedPath}`, normalizedPath, 'readFile');
            }

            return fs.readFileSync(normalizedPath, { encoding });
        } catch (error) {
            if (error instanceof FigmaFileSystemError) {
                throw error;
            }
            throw new FigmaFileSystemError(`Failed to read file: ${error}`, filePath, 'readFile');
        }
    }

    /**
     * 파일 존재 여부 확인
     * @param filePath 확인할 파일 경로
     * @returns 파일 존재 여부
     */
    fileExists(filePath: string): boolean {
        try {
            const normalizedPath = path.normalize(filePath);
            return fs.existsSync(normalizedPath);
        } catch {
            return false;
        }
    }

    /**
     * 디렉토리 존재 여부 확인
     * @param dirPath 확인할 디렉토리 경로
     * @returns 디렉토리 존재 여부
     */
    directoryExists(dirPath: string): boolean {
        try {
            const normalizedPath = path.normalize(dirPath);
            return fs.existsSync(normalizedPath) && fs.statSync(normalizedPath).isDirectory();
        } catch {
            return false;
        }
    }

    /**
     * 파일 삭제
     * @param filePath 삭제할 파일 경로
     */
    async deleteFile(filePath: string): Promise<void> {
        try {
            const normalizedPath = path.normalize(filePath);

            if (!fs.existsSync(normalizedPath)) {
                console.log(`⚠️  File does not exist: ${normalizedPath}`);
                return;
            }

            fs.unlinkSync(normalizedPath);
            console.log(`🗑️  Deleted file: ${normalizedPath}`);
        } catch (error) {
            throw new FigmaFileSystemError(`Failed to delete file: ${error}`, filePath, 'deleteFile');
        }
    }

    /**
     * 디렉토리 삭제 (재귀적)
     * @param dirPath 삭제할 디렉토리 경로
     */
    async deleteDirectory(dirPath: string): Promise<void> {
        try {
            const normalizedPath = path.normalize(dirPath);

            if (!fs.existsSync(normalizedPath)) {
                console.log(`⚠️  Directory does not exist: ${normalizedPath}`);
                return;
            }

            const stats = fs.statSync(normalizedPath);
            if (!stats.isDirectory()) {
                throw new FigmaFileSystemError(
                    `Path is not a directory: ${normalizedPath}`,
                    normalizedPath,
                    'deleteDirectory',
                );
            }

            fs.rmSync(normalizedPath, { recursive: true, force: true });
            console.log(`🗑️  Deleted directory: ${normalizedPath}`);
        } catch (error) {
            if (error instanceof FigmaFileSystemError) {
                throw error;
            }
            throw new FigmaFileSystemError(`Failed to delete directory: ${error}`, dirPath, 'deleteDirectory');
        }
    }

    /**
     * 디렉토리 내용 나열
     * @param dirPath 나열할 디렉토리 경로
     * @returns 파일 및 디렉토리 이름 배열
     */
    listDirectory(dirPath: string): string[] {
        try {
            const normalizedPath = path.normalize(dirPath);

            if (!fs.existsSync(normalizedPath)) {
                throw new FigmaFileSystemError(
                    `Directory not found: ${normalizedPath}`,
                    normalizedPath,
                    'listDirectory',
                );
            }

            return fs.readdirSync(normalizedPath);
        } catch (error) {
            if (error instanceof FigmaFileSystemError) {
                throw error;
            }
            throw new FigmaFileSystemError(`Failed to list directory: ${error}`, dirPath, 'listDirectory');
        }
    }

    /**
     * 파일 정보 가져오기
     * @param filePath 파일 경로
     * @returns 파일 통계 정보
     */
    getFileStats(filePath: string): fs.Stats {
        try {
            const normalizedPath = path.normalize(filePath);

            if (!fs.existsSync(normalizedPath)) {
                throw new FigmaFileSystemError(`File not found: ${normalizedPath}`, normalizedPath, 'getFileStats');
            }

            return fs.statSync(normalizedPath);
        } catch (error) {
            if (error instanceof FigmaFileSystemError) {
                throw error;
            }
            throw new FigmaFileSystemError(`Failed to get file stats: ${error}`, filePath, 'getFileStats');
        }
    }

    /**
     * 파일 복사
     * @param sourcePath 원본 파일 경로
     * @param destPath 대상 파일 경로
     */
    async copyFile(sourcePath: string, destPath: string): Promise<void> {
        try {
            const normalizedSourcePath = path.normalize(sourcePath);
            const normalizedDestPath = path.normalize(destPath);

            if (!fs.existsSync(normalizedSourcePath)) {
                throw new FigmaFileSystemError(
                    `Source file not found: ${normalizedSourcePath}`,
                    normalizedSourcePath,
                    'copyFile',
                );
            }

            // 대상 디렉토리 생성
            const destDir = path.dirname(normalizedDestPath);
            if (!fs.existsSync(destDir)) {
                await this.createDirectory(destDir);
            }

            fs.copyFileSync(normalizedSourcePath, normalizedDestPath);
            console.log(`📋 Copied file: ${normalizedSourcePath} -> ${normalizedDestPath}`);
        } catch (error) {
            if (error instanceof FigmaFileSystemError) {
                throw error;
            }
            throw new FigmaFileSystemError(`Failed to copy file: ${error}`, `${sourcePath} -> ${destPath}`, 'copyFile');
        }
    }

    /**
     * 경로 정규화
     * @param filePath 정규화할 경로
     * @returns 정규화된 경로
     */
    normalizePath(filePath: string): string {
        return path.normalize(filePath);
    }

    /**
     * 경로 결합
     * @param paths 결합할 경로들
     * @returns 결합된 경로
     */
    joinPath(...paths: string[]): string {
        return path.join(...paths);
    }

    /**
     * 파일 확장자 추출
     * @param filePath 파일 경로
     * @returns 확장자
     */
    getFileExtension(filePath: string): string {
        return path.extname(filePath);
    }

    /**
     * 파일명 추출 (확장자 제외)
     * @param filePath 파일 경로
     * @returns 파일명
     */
    getFileName(filePath: string): string {
        return path.basename(filePath, path.extname(filePath));
    }

    /**
     * 디렉토리 경로 추출
     * @param filePath 파일 경로
     * @returns 디렉토리 경로
     */
    getDirectoryPath(filePath: string): string {
        return path.dirname(filePath);
    }
}
