import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export type WorkflowStatus = 'active' | 'inactive' | 'stop';

export const STATUS_LABEL: Record<WorkflowStatus, string> = {
    active: '활성',
    inactive: '비활성',
    stop: '중지',
};

export const STATUS_COLOR: Record<WorkflowStatus, 'success' | 'default' | 'error'> = {
    active: 'success',
    inactive: 'default',
    stop: 'error',
};

export const getStatusLabel = (status?: string): string => {
    const key = (status as WorkflowStatus) ?? 'inactive';
    return STATUS_LABEL[key] ?? (status ?? '');
};

export const getStatusColor = (status?: string): 'success' | 'default' | 'error' => {
    const key = (status as WorkflowStatus) ?? 'inactive';
    return STATUS_COLOR[key] ?? 'default';
};

type Props = {
    status?: string;
} & Omit<ChipProps, 'label' | 'color'>;

export const StatusChip: React.FC<Props> = ({ status, size = 'small', ...rest }) => {
    return (
        <Chip label={getStatusLabel(status)} color={getStatusColor(status) as any} size={size} {...rest} />
    );
};


