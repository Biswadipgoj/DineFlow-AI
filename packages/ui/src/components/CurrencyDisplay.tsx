import * as React from 'react';
import { toRupees } from '@dinenovaai/utils/money';

interface CurrencyDisplayProps {
  paise: number;
  className?: string;
}

export function CurrencyDisplay({ paise, className }: CurrencyDisplayProps) {
  return <span className={className}>{toRupees(paise)}</span>;
}
