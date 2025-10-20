// User 타입 정의
export interface User {
    seq: number;
    name: string;
    email: string;
    permission: string;
    status: 'active' | 'stop';
    department: string;
    registrationDate: string;
    lastLogin: string;
}

// 사용자 데이터
export const sampleUsers: User[] = [
    {
        seq: 2,
        email: 'hectodata@hecto.co.kr',
        name: '이순신',
        permission: 'generalUser',
        status: 'stop',
        department: '(주)헥토데이터',
        registrationDate: '2025.01.01',
        lastLogin: '2025.01.01',
    },
    {
        seq: 1,
        email: 'hectodata@hecto.co.kr',
        name: '홍길동',
        status: 'active',
        department: '(주)헥토',
        permission: 'systemAdmin',
        registrationDate: '2025.01.01',
        lastLogin: '2025.01.02',
    },
];

