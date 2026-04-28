/**
 * 物流商档案列表页：统计卡片、筛选、表格、ActionBar、新增/编辑/导入/导出、分页。
 * 数据走 logisticsService，行操作用 ActionBar（Portal）避免 overflow 裁剪。
 */

import React, { useState, useEffect, useCallback } from 'react';
import { logisticsService } from '../../services';
import ActionBar from '../../components/ActionBar';
import TablePagination from '../../components/TablePagination';
import { toast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';

const PAGE_SIZE = 10;

function formatDateTime(str) {
  if (!str) return '-';
  const s = String(str).slice(0, 19);
  return s.replace('T', ' ');
}

function statusBadge(status) {
  const map = { enabled: 'bg-green-100 text-green-700', disabled: 'bg-gray-100 text-gray-600' };
  const text = status === 'enabled' ? '启用' : '禁用';
  return <span className={`px-2 py-0.5 rounded text-xs ${map[status] || 'bg-gray-100'}`}>{text}</span>;
}

function approvalBadge(approvalStatus) {
  const map = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const text = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' }[approvalStatus] || approvalStatus;
  return <span className={`px-2 py-0.5 rounded text-xs ${map[approvalStatus] || 'bg-gray-100'}`}>{text}</span>;
}

function LogisticsVendorListPage({ onOpenDetail }) {
  const [filters, setFilters] = useState({ keyword: '', status: '', approvalStatus: '' });
  const [page, setPage] = useState(1);
  const [listData, setListData] = useState({ list: [], total: 0 });
  const [stats, setStats] = useState({ total: 0, enabled: 0, pending: 0 });
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', shortName: '', status: 'enabled' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const loadList = useCallback(() => {
    const res = logisticsService.vendors.list({
      keyword: filters.keyword,
      status: filters.status,
      approvalStatus: filters.approvalStatus,
      page,
      pageSize: PAGE_SIZE,
    });
    setListData(res);
  }, [filters.keyword, filters.status, filters.approvalStatus, page]);

  const loadStats = useCallback(() => {
    const all = logisticsService.vendors.list({ page: 1, pageSize: 99999 });
    const total = all.total;
    const enabled = logisticsService.vendors.list({ status: 'enabled', page: 1, pageSize: 1 }).total;
    const pending = logisticsService.vendors.list({ approvalStatus: 'pending', page: 1, pageSize: 1 }).total;
    setStats({ total, enabled, pending });
  }, []);

  useEffect(() => {
    loadList();
    loadStats();
  }, [loadList, loadStats]);

  const totalPages = Math.max(1, Math.ceil(listData.total / PAGE_SIZE));

  const openDetail = (row) => {
    if (onOpenDetail) {
      onOpenDetail({
        id: `vendor-${row.id}`,
        name: `物流商-${row.name}`,
        path: `/logistics/vendors/${row.id}`,
        data: { id: row.id },
      });
    }
  };

  const openCreate = () => {
    setEditingVendor(null);
    setForm({ code: '', name: '', shortName: '', status: 'enabled' });
    setShowFormModal(true);
  };

  const openEdit = (row) => {
    setEditingVendor(row);
    setForm({
      code: row.code || '',
      name: row.name || '',
      shortName: row.shortName || '',
      status: row.status || 'enabled',
    });
    setShowFormModal(true);
  };

  const saveForm = () => {
    const { code, name, shortName, status } = form;
    if (!name?.trim()) {
      toast.warning('请填写物流商名称');
      return;
    }
    if (editingVendor) {
      logisticsService.vendors.update(editingVendor.id, { code: code.trim(), name: name.trim(), shortName: shortName.trim(), status });
      toast.success('已保存');
    } else {
      logisticsService.vendors.create({ code: code.trim(), name: name.trim(), shortName: shortName.trim(), status });
      toast.success('已新增');
    }
    setShowFormModal(false);
    loadList();
    loadStats();
  };

  const handleSubmit = (row) => {
    const res = logisticsService.vendors.submit(row.id);
    if (res && res.ok === false) {
      toast.error(res.message || '提交失败');
      return;
    }
    toast.success('已提交审批');
    loadList();
    loadStats();
  };

  const handleRemove = async (row) => {
    const ok = await confirm({
      title: '确认删除',
      description: `确定删除物流商「${row.name}」？`,
      confirmText: '删除',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    const res = logisticsService.vendors.remove(row.id);
    if (res && res.ok === false) {
      toast.error(res.message || '删除失败');
      return;
    }
    loadList();
    loadStats();
  };

  const handleExport = () => {
    const res = logisticsService.vendors.list({ keyword: filters.keyword, status: filters.status, approvalStatus: filters.approvalStatus, page: 1, pageSize: 99999 });
    const blob = new Blob([JSON.stringify(res.list, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `物流商档案_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = () => {
    let arr;
    try {
      arr = JSON.parse(importText || '[]');
      if (!Array.isArray(arr)) throw new Error('需为数组');
    } catch (e) {
      toast.warning('请输入合法 JSON 数组');
      return;
    }
    let created = 0;
    let updated = 0;
    arr.forEach((item) => {
      const id = item.id;
      const existing = id ? logisticsService.vendors.get(id) : null;
      if (existing) {
        logisticsService.vendors.update(id, { ...item, id: undefined });
        updated++;
      } else {
        logisticsService.vendors.create(item);
        created++;
      }
    });
    setShowImportModal(false);
    setImportText('');
    toast.success(`导入完成：新增 ${created} 条，更新 ${updated} 条`);
    loadList();
    loadStats();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">物流商档案</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-500">总数</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-500">启用</p>
          <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-500">待审批</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
      </div>

      {/* 筛选 + 主按钮 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="编码/名称/简称"
            value={filters.keyword}
            onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.status}
            onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="enabled">启用</option>
            <option value="disabled">禁用</option>
          </select>
          <select
            value={filters.approvalStatus}
            onChange={(e) => { setFilters((f) => ({ ...f, approvalStatus: e.target.value })); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部审批状态</option>
            <option value="draft">草稿</option>
            <option value="pending">待审批</option>
            <option value="approved">已通过</option>
            <option value="rejected">已驳回</option>
          </select>
          <button
            type="button"
            onClick={() => { setPage(1); loadList(); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            查询
          </button>
          <button
            type="button"
            onClick={() => setFilters({ keyword: '', status: '', approvalStatus: '' })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            重置
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            新增物流商
          </button>
          <button type="button" onClick={handleExport} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            导出
          </button>
          <button type="button" onClick={() => setShowImportModal(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            导入
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-gray-200">
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 sticky top-0 z-[1]">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">物流商编码</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">物流商名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">审批状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.list.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-800">{row.code}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openDetail(row)}
                      className="text-blue-600 hover:underline text-left font-medium"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="px-4 py-3">{statusBadge(row.status)}</td>
                  <td className="px-4 py-3">{approvalBadge(row.approvalStatus)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(row.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <ActionBar
                      primary={{ label: '详情', onClick: () => openDetail(row) }}
                      more={[
                        { label: '编辑', onClick: () => openEdit(row) },
                        {
                          label: '提交审批',
                          onClick: () => handleSubmit(row),
                          disabled: row.approvalStatus !== 'draft' && row.approvalStatus !== 'rejected',
                        },
                        { label: '删除', danger: true, onClick: () => handleRemove(row) },
                      ]}
                      moreLabel="操作"
                      moreIcon={<span className="ml-0.5">▾</span>}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          total={listData.total}
          onPageChange={setPage}
          itemName="家"
        />
      </div>

      {/* 新增/编辑 Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFormModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[440px] p-6">
            <h2 className="text-lg font-semibold mb-4">{editingVendor ? '编辑物流商' : '新增物流商'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">编码</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="可选"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="物流商名称"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">简称</label>
                <input
                  type="text"
                  value={form.shortName}
                  onChange={(e) => setForm((f) => ({ ...f, shortName: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="可选"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">状态</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="enabled">启用</option>
                  <option value="disabled">禁用</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                取消
              </button>
              <button type="button" onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 导入 Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowImportModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[560px] p-6 max-h-[90vh] overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold mb-2">导入</h2>
            <p className="text-sm text-gray-500 mb-3">粘贴 JSON 数组，同 id 更新，否则新增。</p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={12}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono overflow-auto"
              placeholder="[{ &quot;id&quot;: &quot;vendor_001&quot;, &quot;code&quot;: &quot;V0001&quot;, ... }]"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowImportModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                取消
              </button>
              <button type="button" onClick={handleImport} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogisticsVendorListPage;
