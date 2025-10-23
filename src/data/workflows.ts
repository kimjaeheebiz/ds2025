// 샘플 프로젝트 워크플로우 데이터
import { Workflow } from '@/types';

export const sampleWorkflows: Workflow[] = [
    {
        seq: 3,
        id: '9883cac00b48462cb9f997f64d1d6726',
        name: '사내 복지 검색 에이전트',
        description: '사내 복지 제도 검색을 위한 AI 에이전트',
        user_id: 'admin@hecto.co.kr',
        user_name: '홍길동',
        status: 'active',
        isFavorite: true,
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-20T14:22:00Z',
    },
    {
        seq: 2,
        id: 'a1b2c3d4e5f6789012345678901234567',
        name: '고객 문의 자동 응답 시스템',
        description: '고객 문의에 대한 자동 응답을 제공하는 워크플로우',
        user_id: 'hectodata@hecto.co.kr',
        user_name: '이순신',
        status: 'inactive',
        isFavorite: false,
        created_at: '2024-01-10T11:15:00Z',
        updated_at: '2024-01-18T16:45:00Z',
    },
    {
        seq: 1,
        id: 'f9e8d7c6b5a4321098765432109876543',
        name: '데이터 분석 자동화',
        description: '일일 데이터 분석 및 리포트 생성 자동화',
        user_id: 'admin@hecto.co.kr',
        user_name: '홍길동',
        status: 'stop',
        isFavorite: false,
        created_at: '2024-01-05T08:20:00Z',
        updated_at: '2024-01-19T10:30:00Z',
    },
];
