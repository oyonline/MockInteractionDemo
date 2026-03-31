/** 通用分页 UI：与 SupplierListPage 底部分页条样式一致，用于列表页「共 N 条」+ 上一页/下一页。 */

import React from 'react';
import Button from './ui/Button';

/**
 * @param {number} currentPage - 当前页（从 1 开始）
 * @param {number} totalPages - 总页数
 * @param {number} total - 总条数（用于展示「共 N 条」）
 * @param {(page: number) => void} onPageChange - 页码变化回调
 * @param {string} [itemName='条'] - 单位名称，如「条」或「家供应商」
 */
function TablePagination({ currentPage, totalPages, total, onPageChange, itemName = '条' }) {
  if (totalPages < 1) totalPages = 1;

  return (
    <div className="flex items-center justify-between border-t border-border bg-surface-subtle px-4 py-4">
      <div className="text-sm text-text-muted">
        共 <span className="font-semibold text-text">{total}</span> {itemName}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            上一页
          </Button>
          <span className="text-sm text-text-muted">
            {currentPage} / {totalPages}
          </span>
          <Button variant="secondary" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}

export default TablePagination;
