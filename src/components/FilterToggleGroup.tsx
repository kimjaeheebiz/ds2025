import React from 'react';
import { ToggleButtonGroup, ToggleButton, Chip } from '@mui/material';

export interface FilterOption {
    value: string;
    label: string;
    count: number;
}

export interface FilterToggleGroupProps {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    size?: 'small' | 'medium' | 'large';
    ariaLabel?: string;
}

export const FilterToggleGroup: React.FC<FilterToggleGroupProps> = ({
    options,
    value,
    onChange,
    size = 'small',
    ariaLabel = '테이블 필터',
}) => {
    const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        if (newValue !== null) {
            onChange(newValue);
        }
    };

    return (
        <ToggleButtonGroup exclusive value={value} onChange={handleChange} aria-label={ariaLabel} size={size}>
            {options.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={{ gap: 1 }}>
                    {option.label}
                    <Chip label={option.count} size="small" />
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};
