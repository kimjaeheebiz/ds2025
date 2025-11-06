/**
 * Figma API 관련 커스텀 에러 클래스들
 */

export class FigmaAPIError extends Error {
    public readonly fileKey?: string;
    public readonly statusCode?: number;
    public readonly originalError?: Error;

    constructor(message: string, fileKey?: string, statusCode?: number, originalError?: Error) {
        super(message);
        this.name = 'FigmaAPIError';
        this.fileKey = fileKey;
        this.statusCode = statusCode;
        this.originalError = originalError;
    }
}

export class FigmaTokenError extends Error {
    constructor(message: string = 'Invalid or missing Figma token') {
        super(message);
        this.name = 'FigmaTokenError';
    }
}

export class FigmaFileNotFoundError extends FigmaAPIError {
    constructor(fileKey: string) {
        super(`Figma file not found: ${fileKey}`, fileKey, 404);
        this.name = 'FigmaFileNotFoundError';
    }
}

export class FigmaNodeNotFoundError extends FigmaAPIError {
    constructor(nodeId: string, fileKey: string) {
        super(`Figma node not found: ${nodeId} in file ${fileKey}`, fileKey);
        this.name = 'FigmaNodeNotFoundError';
    }
}

export class FigmaRateLimitError extends FigmaAPIError {
    constructor(fileKey?: string) {
        super('Figma API rate limit exceeded', fileKey, 429);
        this.name = 'FigmaRateLimitError';
    }
}

export class FigmaNetworkError extends FigmaAPIError {
    constructor(message: string, originalError?: Error) {
        super(`Network error: ${message}`, undefined, undefined, originalError);
        this.name = 'FigmaNetworkError';
    }
}

export class FigmaCodeGenerationError extends Error {
    public readonly componentName?: string;
    public readonly componentType?: string;

    constructor(message: string, componentName?: string, componentType?: string) {
        super(message);
        this.name = 'FigmaCodeGenerationError';
        this.componentName = componentName;
        this.componentType = componentType;
    }
}

export class FigmaFileSystemError extends Error {
    public readonly filePath?: string;
    public readonly operation?: string;

    constructor(message: string, filePath?: string, operation?: string) {
        super(message);
        this.name = 'FigmaFileSystemError';
        this.filePath = filePath;
        this.operation = operation;
    }
}

export class FigmaValidationError extends Error {
    public readonly validationErrors: string[];

    constructor(message: string, validationErrors: string[] = []) {
        super(message);
        this.name = 'FigmaValidationError';
        this.validationErrors = validationErrors;
    }
}

/**
 * 에러 타입 가드 함수들
 */
export const isFigmaAPIError = (error: unknown): error is FigmaAPIError => {
    return error instanceof FigmaAPIError;
};

export const isFigmaTokenError = (error: unknown): error is FigmaTokenError => {
    return error instanceof FigmaTokenError;
};

export const isFigmaFileNotFoundError = (error: unknown): error is FigmaFileNotFoundError => {
    return error instanceof FigmaFileNotFoundError;
};

export const isFigmaNodeNotFoundError = (error: unknown): error is FigmaNodeNotFoundError => {
    return error instanceof FigmaNodeNotFoundError;
};

export const isFigmaRateLimitError = (error: unknown): error is FigmaRateLimitError => {
    return error instanceof FigmaRateLimitError;
};

export const isFigmaNetworkError = (error: unknown): error is FigmaNetworkError => {
    return error instanceof FigmaNetworkError;
};

export const isFigmaCodeGenerationError = (error: unknown): error is FigmaCodeGenerationError => {
    return error instanceof FigmaCodeGenerationError;
};

export const isFigmaFileSystemError = (error: unknown): error is FigmaFileSystemError => {
    return error instanceof FigmaFileSystemError;
};

export const isFigmaValidationError = (error: unknown): error is FigmaValidationError => {
    return error instanceof FigmaValidationError;
};

/**
 * 에러 처리 유틸리티 함수들
 */
export const handleFigmaError = (error: unknown, context?: string): never => {
    if (isFigmaAPIError(error)) {
        console.error(`Figma API Error${context ? ` in ${context}` : ''}:`, {
            message: error.message,
            fileKey: error.fileKey,
            statusCode: error.statusCode,
            originalError: error.originalError,
        });
        throw error;
    }

    if (isFigmaNetworkError(error)) {
        console.error(`Figma Network Error${context ? ` in ${context}` : ''}:`, {
            message: error.message,
            originalError: error.originalError,
        });
        throw error;
    }

    if (isFigmaCodeGenerationError(error)) {
        console.error(`Figma Code Generation Error${context ? ` in ${context}` : ''}:`, {
            message: error.message,
            componentName: error.componentName,
            componentType: error.componentType,
        });
        throw error;
    }

    if (isFigmaFileSystemError(error)) {
        console.error(`Figma File System Error${context ? ` in ${context}` : ''}:`, {
            message: error.message,
            filePath: error.filePath,
            operation: error.operation,
        });
        throw error;
    }

    // 알 수 없는 에러
    console.error(`Unknown Error${context ? ` in ${context}` : ''}:`, error);
    throw new Error(`Unknown error occurred${context ? ` in ${context}` : ''}: ${error}`);
};

export const retryWithBackoff = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
): Promise<T> => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            if (attempt === maxRetries) {
                break;
            }

            // Rate limit 에러인 경우 더 긴 대기
            if (isFigmaRateLimitError(error)) {
                const delay = baseDelay * Math.pow(2, attempt) * 2;
                console.log(`Rate limit hit, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError!;
};
