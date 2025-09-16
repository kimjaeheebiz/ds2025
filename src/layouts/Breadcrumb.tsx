import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getPageKeyFromPath, PAGES } from '@/constants/app-config';

export const Breadcrumb = () => {
    const location = useLocation();
    const pageKey = getPageKeyFromPath(location.pathname);

    const generateBreadcrumbs = () => {
        const breadcrumbs: Array<{ label: string; path: string; isLast: boolean }> = [
            { label: '홈', path: '/', isLast: pageKey === 'home' },
        ];

        if (pageKey && pageKey !== 'home') {
            const keyParts = pageKey.split('.');
            let currentLevel: any = PAGES;

            for (let i = 0; i < keyParts.length; i++) {
                const part = keyParts[i];
                const isLast = i === keyParts.length - 1;

                if (i === 0) {
                    const page = currentLevel[part];
                    if (page && 'title' in page) {
                        if ('children' in page && page.children) {
                            breadcrumbs.push({ label: page.title, path: '#', isLast: false });
                            currentLevel = page.children;
                        } else {
                            breadcrumbs.push({
                                label: page.title,
                                path: location.pathname,
                                isLast: true,
                            });
                        }
                    }
                } else {
                    const currentKey = keyParts.slice(0, i + 1).join('.');
                    const childPage = Object.values(currentLevel).find((child: any) => child.key === currentKey);

                    if (childPage && typeof childPage === 'object' && 'title' in childPage) {
                        if ('children' in childPage && childPage.children) {
                            breadcrumbs.push({
                                label: childPage.title as string,
                                path: '#',
                                isLast: false,
                            });
                            currentLevel = childPage.children;
                        } else {
                            breadcrumbs.push({
                                label: childPage.title as string,
                                path: location.pathname,
                                isLast: true,
                            });
                        }
                    }
                }
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
            {breadcrumbs.map((breadcrumb, index) =>
                breadcrumb.isLast ? (
                    <Typography key={index} variant="body2" sx={{ color: 'text.primary' }}>
                        {breadcrumb.label}
                    </Typography>
                ) : breadcrumb.path === '#' ? (
                    <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                        {breadcrumb.label}
                    </Typography>
                ) : (
                    <Link key={index} component={RouterLink} to={breadcrumb.path} underline="hover" color="inherit">
                        {breadcrumb.label}
                    </Link>
                ),
            )}
        </Breadcrumbs>
    );
};
