import * as React from 'react';
import { cn } from '../lib/utils';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({ label, value, delta, className, children }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2', className)}>
      <p className="text-label text-neutral-500">{label}</p>
      <p className="text-display text-neutral-900">{value}</p>
      {delta !== undefined && (
        <span className={cn(
          'text-caption font-medium',
          delta >= 0 ? 'text-success-dark' : 'text-error-dark'
        )}>
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
        </span>
      )}
      {children}
    </Card>
  );
}
