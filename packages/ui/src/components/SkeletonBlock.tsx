import * as React from 'react';
import { cn } from '../lib/utils';

interface SkeletonBlockProps {
  className?: string;
  width?: string;
  height?: string;
}

export function SkeletonBlock({ className, width, height }: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
        className
      )}
      style={{ width, height }}
    />
  );
}
