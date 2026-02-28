/** 通用分页 UI：与 SupplierListPage 底部分页条样式一致，用于列表页「共 N 条」+ 上一页/下一页。 */

import React from 'react';

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
    <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        共 <span className="font-semibold text-gray-800">{total}</span> {itemName}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}

export default TablePagination;
