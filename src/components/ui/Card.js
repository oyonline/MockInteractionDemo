import React from 'react';
import cn from '../../utils/cn';

const PADDING_STYLES = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({
  children,
  className,
  padding = 'none',
  interactive = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-border bg-surface shadow-panel',
        PADDING_STYLES[padding] || PADDING_STYLES.none,
        interactive && 'cursor-pointer transition-all hover:border-border-strong hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}
