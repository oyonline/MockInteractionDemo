/** 系统日志页：列表/筛选/分页/查看详情/清空/重置，数据走 settingsLog service。 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, RotateCcw, Trash2, Eye } from 'lucide-react';
import { settingsLog } from '../../services/settings';
import TablePagination from '../../components/TablePagination';
import { confirm } from '../../components/ui/ConfirmDialog';

const PAGE_SIZE = 10;

function formatTime(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoStr;
  }
}

const SettingsLogPage = () => {
  const [filters, setFilters] = useState({ keyword: '', module: '', result: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState({ list: [], total: 0 });
  const [detailItem, setDetailItem] = useState(null);

  const loadList = useCallback((pageOverride) => {
    const page = pageOverride !== undefined ? pageOverride : currentPage;
    const res = settingsLog.list({
      keyword: filters.keyword,
      module: filters.module || undefined,
      result: filters.result || undefined,
      page,
      pageSize: PAGE_SIZE,
    });
    setListData(res);
  }, [filters.keyword, filters.module, filters.result, currentPage]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleClear = async () => {
    const ok = await confirm({
      title: '确认清空',
      description: '确定清空所有日志？',
      confirmText: '清空',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    settingsLog.clear();
    setCurrentPage(1);
    loadList(1);
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: '确认重置',
      description: '确定重置为初始 mock 数据？当前日志将被覆盖。',
      confirmText: '重置',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    settingsLog.reset();
    setCurrentPage(1);
    loadList(1);
  };

  const resetFilters = () => {
    setFilters({ keyword: '', module: '', result: '' });
    setCurrentPage(1);
  };

  const openDetail = (item) => {
    const full = settingsLog.get(item.id);
    setDetailItem(full || item);
  };

  const totalPages = Math.max(1, Math.ceil(listData.total / PAGE_SIZE));

  const moduleOptions = ['settings-sync', 'settings-scheduler', 'settings-params', 'settings-log'];

  return (
    <div className="flex flex-col h-full">
      {/* 顶部标题卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">系统日志</h1>
            <p className="text-sm text-gray-500 mt-1">同步、定时任务、参数变更等操作记录，支持筛选与查看详情。</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              清空日志
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              重置数据
            </button>
          </div>
        </div>
      </div>

      {/* 筛选区 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索 message / module / action"
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.module}
            onChange={(e) => setFilters((f) => ({ ...f, module: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部 module</option>
            {moduleOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={filters.result}
            onChange={(e) => setFilters((f) => ({ ...f, result: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部 result</option>
            <option value="success">success</option>
            <option value="fail">fail</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            重置筛选
          </button>
        </div>
      </div>

      {/* 表格区 */}
      <div className="flex-1 min-h-0 overflow-auto flex flex-col bg-white rounded-lg shadow-sm">
        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-40">time</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">module</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">action</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-24">result</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">message</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">暂无日志</td>
                </tr>
              ) : (
                listData.list.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-gray-600 text-xs">{formatTime(row.time)}</td>
                    <td className="py-2 px-4 text-gray-700 font-mono text-xs">{row.module}</td>
                    <td className="py-2 px-4 text-gray-700">{row.action}</td>
                    <td className="py-2 px-4">
                      <span className={row.result === 'success' ? 'text-green-600' : 'text-red-600'}>
                        {row.result}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-gray-700 max-w-xs truncate" title={row.message}>{row.message}</td>
                    <td className="py-2 px-4">
                      <button
                        type="button"
                        onClick={() => openDetail(row)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        查看
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={listData.total}
          onPageChange={setCurrentPage}
          itemName="条"
        />
      </div>

      {/* 详情 Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDetailItem(null)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[520px] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">日志详情</h2>
              <button type="button" onClick={() => setDetailItem(null)} className="p-1 rounded hover:bg-gray-100 text-gray-500">×</button>
            </div>
            <div className="p-6 overflow-auto flex-1 min-h-0 space-y-3 text-sm">
              <div><span className="text-gray-500">time:</span> {formatTime(detailItem.time)}</div>
              <div><span className="text-gray-500">module:</span> {detailItem.module}</div>
              <div><span className="text-gray-500">action:</span> {detailItem.action}</div>
              <div><span className="text-gray-500">result:</span> <span className={detailItem.result === 'success' ? 'text-green-600' : 'text-red-600'}>{detailItem.result}</span></div>
              <div><span className="text-gray-500">operator:</span> {detailItem.operator}</div>
              <div><span className="text-gray-500">message:</span> {detailItem.message}</div>
              <div>
                <span className="text-gray-500 block mb-1">detail:</span>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-48 border border-gray-200">
                  {typeof detailItem.detail === 'object'
                    ? JSON.stringify(detailItem.detail, null, 2)
                    : String(detailItem.detail ?? '')}
                </pre>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50">
              <button type="button" onClick={() => setDetailItem(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsLogPage;
