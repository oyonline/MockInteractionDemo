/** 定时任务页：列表/筛选/启用停用/立即执行/查看结果/重试，数据走 settingsScheduler，执行与启停写系统日志。 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, RotateCcw, RefreshCw, FileText, Eye, Copy } from 'lucide-react';
import { settingsScheduler } from '../../services/settings';
import TablePagination from '../../components/TablePagination';
import ActionBar from '../../components/ActionBar';
import { toast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';

const PAGE_SIZE = 10;
const DETAILS_MAX = 20;

function formatTime(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoStr;
  }
}

function getResultSummary(lastResult) {
  if (lastResult == null || lastResult === '') return '-';
  return typeof lastResult === 'string' ? lastResult : (lastResult.summary || lastResult.type || '-');
}

function getResultType(row) {
  if (!row.lastResult) return null;
  if (typeof row.lastResult === 'string') return 'success';
  return row.lastResult.type || 'success';
}

function isRetryable(row) {
  if (!row.lastResult || row.lastResult === '') return false;
  if (typeof row.lastResult === 'object' && row.lastResult.retryable) return true;
  return ['partial', 'timeout', 'error'].includes(getResultType(row));
}

function getStats(row) {
  if (!row.lastResult || typeof row.lastResult !== 'object' || !row.lastResult.stats) return null;
  return row.lastResult.stats;
}

function copyResultText(row) {
  const summary = getResultSummary(row.lastResult);
  let text = summary;
  if (row.lastResult && typeof row.lastResult === 'object' && Array.isArray(row.lastResult.details) && row.lastResult.details.length > 0) {
    text += '\n' + row.lastResult.details.slice(0, DETAILS_MAX).join('\n');
    if (row.lastResult.details.length > DETAILS_MAX) text += '\n（仅展示前' + DETAILS_MAX + '条）';
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast.success('已复制到剪贴板')).catch(() => toast.error('复制失败'));
  } else {
    window.prompt('复制以下内容', text);
  }
}

const SettingsSchedulerPage = ({ onOpenTab }) => {
  const [filters, setFilters] = useState({ keyword: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState({ list: [], total: 0 });
  const [runningId, setRunningId] = useState(null);
  const [resultDetailRow, setResultDetailRow] = useState(null);

  const loadList = useCallback((pageOverride) => {
    const page = pageOverride !== undefined ? pageOverride : currentPage;
    const res = settingsScheduler.list({ keyword: filters.keyword, page, pageSize: PAGE_SIZE });
    setListData(res);
  }, [filters.keyword, currentPage]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleToggle = (id) => {
    settingsScheduler.toggle(id);
    loadList();
  };

  const handleRun = (id) => {
    setRunningId(id);
    setResultDetailRow(null);
    settingsScheduler.run(id).then((task) => {
      loadList();
      setRunningId(null);
      toast.info(getResultSummary(task.lastResult));
    }).catch(() => {
      setRunningId(null);
    });
  };

  const handleRetry = (row) => {
    setResultDetailRow(null);
    handleRun(row.id);
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: '确认重置',
      description: '确定重置为初始 mock 数据？当前任务状态将被覆盖。',
      confirmText: '重置',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    settingsScheduler.reset();
    setCurrentPage(1);
    loadList(1);
  };

  const openLogTab = () => {
    if (onOpenTab) {
      onOpenTab({ id: 'settings-log-' + Date.now(), name: '系统日志', path: '/settings/log' });
    } else {
      toast.info('请从侧栏进入「系统设置 → 系统日志」查看记录。');
    }
  };

  const resetFilters = () => {
    setFilters({ keyword: '' });
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(listData.total / PAGE_SIZE));
  const hasResult = (row) => (row.lastResult != null && row.lastResult !== '') || row.lastRunAt != null;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">定时任务</h1>
            <p className="text-sm text-gray-500 mt-1">管理定时执行任务，支持启用/停用与立即执行，执行结果写入系统日志。</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={openLogTab} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
              <FileText className="w-4 h-4" />
              查看日志
            </button>
            <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
              <RotateCcw className="w-4 h-4" />
              重置数据
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索 name / cron"
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button type="button" onClick={resetFilters} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            重置筛选
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto flex flex-col bg-white rounded-lg shadow-sm">
        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">name</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">cron</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-24">status</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-40">lastRunAt</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-40">nextRunAt</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-20">durationMs</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">lastResult</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-[240px] min-w-[240px] text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.list.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">暂无定时任务</td>
                </tr>
              ) : (
                listData.list.map((row) => {
                  const resultType = getResultType(row);
                  const isRunning = row.status === 'running' || runningId === row.id;
                  return (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-800 font-medium">{row.name}</td>
                      <td className="py-2 px-4 text-gray-600 font-mono text-xs">{row.cron}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          row.status === 'running' ? 'bg-amber-100 text-amber-800' :
                          row.status === 'enabled' ? 'bg-green-100 text-green-800' :
                          row.status === 'disabled' ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {row.status === 'running' && <RefreshCw className="w-3 h-3 animate-spin" />}
                          {row.status === 'running' ? '执行中…' : row.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-gray-600 text-xs">{formatTime(row.lastRunAt)}</td>
                      <td className="py-2 px-4 text-gray-600 text-xs">{formatTime(row.nextRunAt)}</td>
                      <td className="py-2 px-4 text-gray-600">{row.durationMs != null ? row.durationMs + ' ms' : '-'}</td>
                      <td className="py-2 px-4 max-w-xs">
                        <span className={`truncate block ${
                          resultType === 'success' ? 'text-green-700' :
                          resultType === 'partial' ? 'text-amber-700' :
                          resultType === 'timeout' || resultType === 'error' ? 'text-red-700' : 'text-gray-700'
                        }`} title={getResultSummary(row.lastResult)}>
                          {getResultSummary(row.lastResult)}
                        </span>
                      </td>
                      <td className="py-2 px-4 w-[240px] min-w-[240px] align-top">
                        <ActionBar
                          primary={isRunning
                            ? { label: '执行中…', disabled: true, className: 'inline-flex items-center justify-center whitespace-nowrap gap-1 h-8 px-3 text-sm rounded bg-blue-600 text-white opacity-50 cursor-not-allowed', iconText: <RefreshCw className="w-3.5 h-3.5 animate-spin" /> }
                            : isRetryable(row)
                              ? { label: '重试', onClick: () => handleRetry(row), className: 'inline-flex items-center justify-center whitespace-nowrap gap-1 h-8 px-3 text-sm rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed', iconText: <RefreshCw className="w-3.5 h-3.5" /> }
                              : { label: '立即执行', onClick: () => handleRun(row.id), className: 'inline-flex items-center justify-center whitespace-nowrap gap-1 h-8 px-3 text-sm rounded bg-blue-600 text-white hover:bg-blue-700', iconText: <RefreshCw className="w-3.5 h-3.5" /> }
                          }
                          secondary={!isRunning && hasResult(row) ? { label: '查看结果', onClick: () => setResultDetailRow(row), iconText: <Eye className="w-3.5 h-3.5" /> } : undefined}
                          more={!isRunning ? [{ label: row.status === 'enabled' ? '停用' : '启用', onClick: () => handleToggle(row.id) }] : []}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <TablePagination currentPage={currentPage} totalPages={totalPages} total={listData.total} onPageChange={setCurrentPage} itemName="条" />
      </div>

      {resultDetailRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setResultDetailRow(null)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[480px] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">执行结果详情</h2>
              <button type="button" onClick={() => setResultDetailRow(null)} className="p-1 rounded hover:bg-gray-100 text-gray-500">×</button>
            </div>
            <div className="p-6 overflow-auto flex-1 min-h-0 space-y-4 text-sm">
              {getStats(resultDetailRow) && (
                <div className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div><span className="text-gray-500 text-xs">总数</span><p className="font-medium text-gray-800">{getStats(resultDetailRow).total}</p></div>
                  <div><span className="text-gray-500 text-xs">成功</span><p className="font-medium text-green-700">{getStats(resultDetailRow).success}</p></div>
                  <div><span className="text-gray-500 text-xs">失败</span><p className="font-medium text-red-700">{getStats(resultDetailRow).fail || 0}</p></div>
                  <div><span className="text-gray-500 text-xs">失败率</span><p className="font-medium text-gray-800">{getStats(resultDetailRow).total ? ((getStats(resultDetailRow).fail || 0) / getStats(resultDetailRow).total * 100).toFixed(1) : 0}%</p></div>
                </div>
              )}
              <div>
                <span className="text-gray-500 block mb-1">摘要</span>
                <p className="text-gray-800">{getResultSummary(resultDetailRow.lastResult)}</p>
              </div>
              {resultDetailRow.lastResult && typeof resultDetailRow.lastResult === 'object' && Array.isArray(resultDetailRow.lastResult.details) && resultDetailRow.lastResult.details.length > 0 && (
                <div>
                  <span className="text-gray-500 block mb-1">失败明细（最多展示 {DETAILS_MAX} 条）</span>
                  <ul className="list-disc pl-5 space-y-0.5 text-gray-700 max-h-40 overflow-auto">
                    {resultDetailRow.lastResult.details.slice(0, DETAILS_MAX).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                  {resultDetailRow.lastResult.details.length > DETAILS_MAX && (
                    <p className="text-gray-400 text-xs mt-1">仅展示前 {DETAILS_MAX} 条</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-6 py-4 border-t bg-gray-50">
              <button type="button" onClick={() => copyResultText(resultDetailRow)} className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">
                <Copy className="w-4 h-4" />
                复制错误信息
              </button>
              <div className="flex flex-row flex-wrap items-center gap-2 justify-end">
                {isRetryable(resultDetailRow) && (
                  <button type="button" onClick={() => handleRetry(resultDetailRow)} className="h-8 px-3 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                    重试
                  </button>
                )}
                <button type="button" onClick={() => setResultDetailRow(null)} className="h-8 px-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">关闭</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSchedulerPage;
