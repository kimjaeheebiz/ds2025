import { useLocation } from 'react-router-dom';
import {
    getPageMetadata,
    getBrowserTitle,
    getPageKeyFromPath,
    APP_INFO,
    type PAGE_METADATA,
} from '@/config';

type PageKey = keyof typeof PAGE_METADATA;

export interface UsePageMetadataOptions {
    pageKey?: PageKey;
    customTitle?: string;
}

export const usePageMetadata = ({ pageKey, customTitle }: UsePageMetadataOptions = {}) => {
    const location = useLocation();

    // URL에서 페이지 키 추출
    const detectedPageKey = getPageKeyFromPath(location.pathname);
    const finalPageKey = pageKey || detectedPageKey;

    // 페이지 메타데이터 가져오기
    const pageMetadata = finalPageKey ? getPageMetadata(finalPageKey) : null;

    // 최종 타이틀 결정
    const finalTitle = customTitle || pageMetadata?.title || APP_INFO.name;

    return {
        pageKey: finalPageKey,
        title: finalTitle,
        browserTitle: finalPageKey ? getBrowserTitle(finalPageKey) : APP_INFO.name,
        metadata: pageMetadata,
    };
};
