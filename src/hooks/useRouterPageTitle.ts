import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getBrowserTitle, getPageKeyFromPath } from '@/config';

// 라우터 기반 자동 페이지 제목 관리 훅
export const useRouterPageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const pageKey = getPageKeyFromPath(location.pathname);

        if (pageKey) {
            const browserTitle = getBrowserTitle(pageKey);
            document.title = browserTitle;
        }
    }, [location.pathname]);

    return {
        pathname: location.pathname,
        pageKey: getPageKeyFromPath(location.pathname),
    };
};
