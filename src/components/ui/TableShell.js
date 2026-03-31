import React from 'react';
import cn from '../../utils/cn';
import Card from './Card';

export default function TableShell({
  toolbar,
  children,
  pagination,
  emptyState,
  minWidth,
  className,
  bodyClassName,
}) {
  return (
    <Card className={cn('min-h-0 overflow-hidden', className)}>
      {toolbar && <div className="border-b border-border bg-surface px-4 py-4">{toolbar}</div>}
      <div className={cn('min-h-0 overflow-x-auto', bodyClassName)}>
        <div className="w-full" style={minWidth ? { minWidth } : undefined}>
          {children}
        </div>
        {emptyState}
      </div>
      {pagination}
    </Card>
  );
}
