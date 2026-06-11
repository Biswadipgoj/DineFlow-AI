import * as React from 'react';
import { cn } from '../lib/utils';

interface StatusDotProps {
  status: 'green' | 'amber' | 'red';
  animate?: boolean;
  className?: string;
}

export function StatusDot({ status, animate = true, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        'inline-block h-2.5 w-2.5 rounded-full',
        status === 'green' && 'bg-success',
        status === 'amber' && 'bg-warning',
        status === 'red' && 'bg-error',
        animate && 'animate-pulse-ring',
        className
      )}
    />
  );
}
