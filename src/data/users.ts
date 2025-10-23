// 사용자 데이터
import { User } from '@/types';

export const sampleUsers: User[] = [
    {
        seq: 2,
        id: 'hectodata@hecto.co.kr', // 이메일 아이디
        name: '이순신',
        department: '(주)헥토데이터',
        permission: 'user',
        status: 'stop',
        regdate: '2025.01.01',
        moddate: '2025.01.01',
        last_login: '2025.01.01',
    },
    {
        seq: 1,
        id: 'admin@hecto.co.kr', // 이메일 아이디
        name: '홍길동',
        department: '(주)헥토',
        permission: 'admin',
        status: 'active',
        regdate: '2025.01.01',
        moddate: '2025.01.02',
        last_login: '2025.01.02',
    },
];
