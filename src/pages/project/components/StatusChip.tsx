import React from 'react';
import { Chip, ChipProps } from '@mui/material';

// ===== 타입 정의 =====
export type WorkflowStatus = 'active' | 'inactive' | 'stop';

type Props = {
    status?: string;
} & Omit<ChipProps, 'label' | 'color'>;

// ===== 내부 유틸리티 =====

// 타입 가드: status가 유효한 WorkflowStatus인지 확인
function isWorkflowStatus(status: unknown): status is WorkflowStatus {
    return (
        typeof status === 'string' &&
        (status === 'active' || status === 'inactive' || status === 'stop')
    );
}

const STATUS_LABEL: Record<WorkflowStatus, string> = {
    active: '활성',
    inactive: '비활성',
    stop: '중지',
};

const STATUS_COLOR: Record<WorkflowStatus, ChipProps['color']> = {
    active: 'success',
    inactive: 'default',
    stop: 'error',
};

const getStatusLabel = (status?: string): string => {
    if (isWorkflowStatus(status)) {
        return STATUS_LABEL[status];
    }
    return status ?? STATUS_LABEL.inactive;
};

const getStatusColor = (status?: string): ChipProps['color'] => {
    if (isWorkflowStatus(status)) {
        return STATUS_COLOR[status];
    }
    return 'default';
};

// ===== 컴포넌트 =====

export const StatusChip: React.FC<Props> = ({ status, size = 'small', ...rest }) => {
    return (
        <Chip 
            label={getStatusLabel(status)} 
            color={getStatusColor(status)} 
            size={size} 
            {...rest} 
        />
    );
};
