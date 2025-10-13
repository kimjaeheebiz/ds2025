import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getPageKeyFromPath, PAGES, PageNode, isPageNode, isFolderNode } from '@/config';
import { useMemo } from 'react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pageKey = getPageKeyFromPath(location.pathname);

  const generateBreadcrumbs = () => {
    const list: Array<{ label: string; path: string; isLast: boolean; key: string; isClickable: boolean }> = [
      { label: 'Home', path: '/', isLast: pageKey === 'home', key: 'home', isClickable: pageKey !== 'home' },
    ];

    if (pageKey && pageKey !== 'home') {
      const keyParts = pageKey.split('.');
      let currentLevel: Record<string, PageNode> = PAGES;

      for (let i = 0; i < keyParts.length; i++) {
        const isLast = i === keyParts.length - 1;
        const currentKey = keyParts.slice(0, i + 1).join('.');

        // 현재 레벨에서 key로 탐색
        const node = Object.values(currentLevel).find(
          (child): child is PageNode => isPageNode(child) && child.key === currentKey,
        );
        if (!node) break;

        if (!isLast && isFolderNode(node)) {
          const nodePath = (node as PageNode & { path?: string }).path;
          list.push({
            label: node.title,
            path: nodePath ?? '#',
            isLast: false,
            key: `${currentKey}-parent`,
            isClickable: !!nodePath,
          });
          currentLevel = node.children;
        } else {
          const nodePath = (node as PageNode & { path?: string }).path;
          list.push({
            label: node.title,
            path: nodePath ?? location.pathname,
            isLast: true,
            key: currentKey,
            isClickable: !!nodePath && !isLast,
          });
        }
      }
    }
    return list;
  };

  const breadcrumbs = useMemo(generateBreadcrumbs, [pageKey, location.pathname]);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
      {breadcrumbs.map((bc) =>
        bc.isLast ? (
          <Typography
            key={bc.key}
            variant="body2"
            sx={{ color: 'text.primary' }}
            aria-current="page"
          >
            {bc.label}
          </Typography>
        ) : bc.isClickable ? (
          <Link
            key={bc.key}
            component={RouterLink}
            to={bc.path}
            underline="hover"
            color="inherit"
          >
            {bc.label}
          </Link>
        ) : (
          <Typography key={bc.key} variant="body2" sx={{ color: 'text.secondary' }}>
            {bc.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
};