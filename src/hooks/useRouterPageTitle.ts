import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getBrowserTitle, findRouteByUrl } from '@/config';

// 라우터 기반 자동 페이지 제목 관리 훅
export const useRouterPageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const currentRoute = findRouteByUrl(location.pathname);
        if (currentRoute) {
            const browserTitle = getBrowserTitle(currentRoute.id);
            document.title = browserTitle;
        }
    }, [location.pathname]);

    return {
        pathname: location.pathname,
        pageId: findRouteByUrl(location.pathname)?.id,
    };
};
