import * as React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sunken' | 'elevated';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-4',
        variant === 'default' && 'bg-white shadow-card border border-neutral-100',
        variant === 'sunken' && 'bg-neutral-50 border border-neutral-200',
        variant === 'elevated' && 'bg-white shadow-card-lg',
        className
      )}
      {...props}
    />
  );
}
