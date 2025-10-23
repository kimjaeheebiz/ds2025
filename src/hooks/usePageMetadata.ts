import { useLocation } from 'react-router-dom';
import { getPageMetadata, getBrowserTitle, findRouteByUrl, APP_INFO } from '@/config';

export interface UsePageMetadataOptions {
    pageId?: string;
    customTitle?: string;
}

export const usePageMetadata = ({ pageId, customTitle }: UsePageMetadataOptions = {}) => {
    const location = useLocation();

    // URL에서 라우트 정보 가져오기
    const currentRoute = findRouteByUrl(location.pathname);
    const finalPageId = pageId || currentRoute?.id;

    // 페이지 메타데이터 가져오기
    const pageMetadata = finalPageId ? getPageMetadata(finalPageId) : null;

    // 최종 타이틀 결정
    const finalTitle = customTitle || pageMetadata?.title || APP_INFO.name;

    return {
        pageId: finalPageId,
        title: finalTitle,
        browserTitle: finalPageId ? getBrowserTitle(finalPageId) : APP_INFO.name,
        metadata: pageMetadata,
    };
};
