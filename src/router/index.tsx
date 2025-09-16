import { createBrowserRouter } from 'react-router-dom';
import { generateAllRoutes } from '@/utils/route-generator';

// 페이지 설정에서 자동 생성된 라우트 사용
export const router = createBrowserRouter(generateAllRoutes());
