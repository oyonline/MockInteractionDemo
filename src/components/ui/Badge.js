import React from 'react';
import cn from '../../utils/cn';

const TONE_STYLES = {
  neutral: 'border-border bg-surface-subtle text-text-muted',
  primary: 'border-brand-100 bg-brand-50 text-brand-700',
  success: 'border-success-100 bg-success-50 text-success-700',
  warning: 'border-warning-100 bg-warning-50 text-warning-700',
  danger: 'border-danger-100 bg-danger-50 text-danger-700',
};

export default function Badge({ children, tone = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        TONE_STYLES[tone] || TONE_STYLES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
