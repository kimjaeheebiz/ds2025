import { createBrowserRouter } from 'react-router-dom';
import { DefaultLayout, AuthLayout, ErrorLayout } from '@/layouts';
import { Home, Workspace, Login, Signup, Components } from '@/pages';
import { Depth1_2 } from '@/pages/depth1/depth1_2/Depth1_2';
import { Depth1_1_1 } from '@/pages/depth1/depth1_1/depth1_1_1/Depth1_1_1';
import { Depth1_1_2 } from '@/pages/depth1/depth1_1/depth1_1_2/Depth1_1_2';
import { getFolderPaths } from '@/constants/app-config';

// 폴더형 메뉴 경로들 (404 처리용)
const folderPaths = getFolderPaths();

export const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'workspace',
                element: <Workspace />,
            },
            {
                path: 'depth1/depth1_1/depth1_1_1',
                element: <Depth1_1_1 />,
            },
            {
                path: 'depth1/depth1_1/depth1_1_2',
                element: <Depth1_1_2 />,
            },
            {
                path: 'depth1/depth1_2',
                element: <Depth1_2 />,
            },
            {
                path: 'components',
                element: <Components />,
            },
        ],
    },
    // 폴더형 메뉴 경로들을 독립적인 404로 처리
    ...folderPaths.map((folderPath) => ({
        path: folderPath,
        element: <ErrorLayout />,
    })),
    {
        path: '/login',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: '/signup',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Signup />,
            },
        ],
    },
    {
        path: '/404',
        element: <ErrorLayout />,
    },
    {
        path: '/500',
        element: <ErrorLayout statusCode={500} title="Server Error" />,
    },
    {
        path: '*',
        element: <ErrorLayout />,
    },
]);
