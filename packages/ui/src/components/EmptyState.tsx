import * as React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  heading: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, heading, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-neutral-400">{icon}</div>}
      <h3 className="text-h3 text-neutral-800 mb-2">{heading}</h3>
      {description && <p className="text-body text-neutral-500 mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
