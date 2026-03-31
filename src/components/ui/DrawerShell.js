import React from 'react';
import { X } from 'lucide-react';
import cn from '../../utils/cn';

const WIDTH_STYLES = {
  md: 'w-[480px] max-w-[calc(100vw-32px)]',
  lg: 'w-[640px] max-w-[calc(100vw-32px)]',
  xl: 'w-[720px] max-w-[calc(100vw-32px)]',
};

export default function DrawerShell({
  open,
  title,
  subtitle,
  width = 'lg',
  onClose,
  children,
  footer,
  headerActions,
  contentClassName,
  className,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative flex h-full flex-col overflow-hidden border-l border-border bg-surface shadow-elevated animate-drawer-in',
          WIDTH_STYLES[width] || WIDTH_STYLES.lg,
          className
        )}
      >
        <div className="sticky top-0 z-10 border-b border-border bg-surface/95 px-6 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-text">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-text-subtle transition-colors hover:bg-surface-subtle hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className={cn('flex-1 overflow-auto px-6 py-6', contentClassName)}>{children}</div>
        {footer && <div className="border-t border-border bg-surface-subtle px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
