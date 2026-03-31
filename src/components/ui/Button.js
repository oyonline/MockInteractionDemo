import React from 'react';
import cn from '../../utils/cn';

const SIZE_STYLES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

const VARIANT_STYLES = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus:ring-brand-100',
  secondary: 'border border-border bg-white text-text-muted hover:bg-surface-subtle focus:ring-brand-100',
  danger: 'bg-danger-600 text-white shadow-sm hover:bg-danger-700 focus:ring-danger-100',
  ghost: 'bg-transparent text-text-muted hover:bg-surface-subtle focus:ring-brand-100',
};

export const getButtonClassName = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  fullWidth = false,
} = {}) =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-4',
    SIZE_STYLES[size] || SIZE_STYLES.md,
    VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
    fullWidth && 'w-full',
    disabled && 'pointer-events-none opacity-50',
    className
  );

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  disabled = false,
  fullWidth = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={getButtonClassName({ variant, size, disabled, className, fullWidth })}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-4 w-4'} />}
      {children}
    </button>
  );
}
