/**
 * 物流类型规则（选渠规则）列表页：统计、筛选、表格、ActionBar、新增/编辑/导入/导出、分页。
 */

import React, { useState, useEffect, useCallback } from 'react';
import { logisticsService } from '../../services';
import ActionBar from '../../components/ActionBar';
import TablePagination from '../../components/TablePagination';

const PAGE_SIZE = 10;

function formatDateTime(str) {
  if (!str) return '-';
  return String(str).slice(0, 19).replace('T', ' ');
}

function statusBadge(s) {
  const map = { enabled: 'bg-green-100 text-green-700', disabled: 'bg-gray-100 text-gray-600' };
  return <span className={`px-2 py-0.5 rounded text-xs ${map[s] || 'bg-gray-100'}`}>{s === 'enabled' ? '启用' : '禁用'}</span>;
}

function approvalBadge(a) {
  const map = { draft: 'bg-gray-100 text-gray-600', pending: 'bg-amber-100 text-amber-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
  const text = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' }[a] || a;
  return <span className={`px-2 py-0.5 rounded text-xs ${map[a] || 'bg-gray-100'}`}>{text}</span>;
}

function countriesDisplay(row) {
  const c = row.conditions?.countries || row.countries;
  return Array.isArray(c) ? c.join(', ') : '-';
}

function LogisticsRoutingRuleListPage({ onOpenDetail }) {
  const [filters, setFilters] = useState({ keyword: '', status: '', approvalStatus: '' });
  const [page, setPage] = useState(1);
  const [listData, setListData] = useState({ list: [], total: 0 });
  const [stats, setStats] = useState({ total: 0, enabled: 0, pending: 0 });
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState({ name: '', countriesStr: '', weight: 0, status: 'enabled', taxIncluded: 'any', channelIds: [] });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const channelList = logisticsService.channels.list({ page: 1, pageSize: 99999 }).list;

  const loadList = useCallback(() => {
    setListData(logisticsService.routingRules.list({ keyword: filters.keyword, status: filters.status, approvalStatus: filters.approvalStatus, page, pageSize: PAGE_SIZE }));
  }, [filters.keyword, filters.status, filters.approvalStatus, page]);

  const loadStats = useCallback(() => {
    const all = logisticsService.routingRules.list({ page: 1, pageSize: 99999 });
    const enabled = logisticsService.routingRules.list({ status: 'enabled', page: 1, pageSize: 1 }).total;
    const pending = logisticsService.routingRules.list({ approvalStatus: 'pending', page: 1, pageSize: 1 }).total;
    setStats({ total: all.total, enabled, pending });
  }, []);

  useEffect(() => { loadList(); loadStats(); }, [loadList, loadStats]);

  const totalPages = Math.max(1, Math.ceil(listData.total / PAGE_SIZE));

  const openDetail = (row) => {
    onOpenDetail && onOpenDetail({ id: `rr-${row.id}`, name: `路由规则-${row.name}`, path: `/logistics/rules/routing/${row.id}`, data: { id: row.id } });
  };

  const openCreate = () => {
    setEditingRow(null);
    setForm({ name: '', countriesStr: '', weight: 0, status: 'enabled', taxIncluded: 'any', channelIds: [] });
    setShowFormModal(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    const countries = row.conditions?.countries || row.countries || [];
    const channelIds = (row.channels || []).map((c) => (typeof c === 'object' ? c.channelId : c));
    setForm({
      name: row.name || '',
      countriesStr: Array.isArray(countries) ? countries.join(', ') : '',
      weight: row.weight ?? 0,
      status: row.status || 'enabled',
      taxIncluded: row.conditions?.taxIncluded || 'any',
      channelIds: channelIds.filter(Boolean),
    });
    setShowFormModal(true);
  };

  const saveForm = () => {
    const countries = form.countriesStr.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
    if (countries.length === 0) {
      window.alert('国家至少填 1 个（逗号分隔）');
      return;
    }
    const channels = form.channelIds.map((cid) => ({ channelId: cid, channelPriority: 0 }));
    const payload = {
      name: form.name.trim(),
      conditions: { countries, taxIncluded: form.taxIncluded },
      weight: Number(form.weight) || 0,
      status: form.status,
      channels,
    };
    if (editingRow) {
      const res = logisticsService.routingRules.update(editingRow.id, payload);
      if (res && res.ok === false) {
        window.alert(res.message || '保存失败');
        return;
      }
      window.alert('已保存');
    } else {
      const res = logisticsService.routingRules.create(payload);
      if (res && res.ok === false) {
        window.alert(res.message || '新增失败');
        return;
      }
      window.alert('已新增');
    }
    setShowFormModal(false);
    loadList();
    loadStats();
  };

  const handleSubmit = (row) => {
    const res = logisticsService.routingRules.submit(row.id);
    if (res && res.ok === false) { window.alert(res.message || '提交失败'); return; }
    window.alert('已提交审批');
    loadList();
    loadStats();
  };

  const handleRemove = (row) => {
    if (!window.confirm(`确定删除规则「${row.name}」？`)) return;
    logisticsService.routingRules.remove(row.id);
    loadList();
    loadStats();
  };

  const handleExport = () => {
    const res = logisticsService.routingRules.list({ keyword: filters.keyword, status: filters.status, approvalStatus: filters.approvalStatus, page: 1, pageSize: 99999 });
    const blob = new Blob([JSON.stringify(res.list, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `物流类型规则_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = () => {
    let arr;
    try { arr = JSON.parse(importText || '[]'); if (!Array.isArray(arr)) throw new Error(); } catch (e) { window.alert('请输入合法 JSON 数组'); return; }
    let created = 0, updated = 0;
    arr.forEach((item) => {
      const id = item.id;
      const existing = id ? logisticsService.routingRules.get(id) : null;
      if (existing) {
        const res = logisticsService.routingRules.update(id, { ...item, id: undefined });
        if (res && res.ok === false) window.alert(res.message);
        else updated++;
      } else {
        const res = logisticsService.routingRules.create(item);
        if (res && res.ok === false) window.alert(res.message);
        else created++;
      }
    });
    setShowImportModal(false);
    setImportText('');
    window.alert(`导入完成：新增 ${created} 条，更新 ${updated} 条`);
    loadList();
    loadStats();
  };

  const toggleChannel = (channelId) => {
    setForm((f) => ({
      ...f,
      channelIds: f.channelIds.includes(channelId) ? f.channelIds.filter((id) => id !== channelId) : [...f.channelIds, channelId],
    }));
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">物流类型规则</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"><p className="text-sm text-gray-500">总数</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"><p className="text-sm text-gray-500">启用</p><p className="text-2xl font-bold text-green-600">{stats.enabled}</p></div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"><p className="text-sm text-gray-500">待审批</p><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input type="text" placeholder="名称" value={filters.keyword} onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">全部状态</option><option value="enabled">启用</option><option value="disabled">禁用</option>
          </select>
          <select value={filters.approvalStatus} onChange={(e) => { setFilters((f) => ({ ...f, approvalStatus: e.target.value })); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">全部审批状态</option><option value="draft">草稿</option><option value="pending">待审批</option><option value="approved">已通过</option><option value="rejected">已驳回</option>
          </select>
          <button type="button" onClick={() => { setPage(1); loadList(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">查询</button>
          <button type="button" onClick={() => setFilters({ keyword: '', status: '', approvalStatus: '' })} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">重置</button>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">新增规则</button>
          <button type="button" onClick={handleExport} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">导出</button>
          <button type="button" onClick={() => setShowImportModal(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">导入</button>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-gray-200">
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-50 sticky top-0 z-[1]">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">国家</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">权重</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">审批状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.list.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => openDetail(row)} className="text-blue-600 hover:underline text-left font-medium">{row.name}</button>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{countriesDisplay(row)}</td>
                  <td className="px-4 py-3 text-gray-700">{row.weight ?? '-'}</td>
                  <td className="px-4 py-3">{statusBadge(row.status)}</td>
                  <td className="px-4 py-3">{approvalBadge(row.approvalStatus)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(row.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <ActionBar
                      primary={{ label: '详情', onClick: () => openDetail(row) }}
                      more={[
                        { label: '编辑', onClick: () => openEdit(row) },
                        { label: '提交审批', onClick: () => handleSubmit(row), disabled: row.approvalStatus !== 'draft' && row.approvalStatus !== 'rejected' },
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
        <TablePagination currentPage={page} totalPages={totalPages} total={listData.total} onPageChange={setPage} itemName="条" />
      </div>
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFormModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[520px] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{editingRow ? '编辑规则' : '新增规则'}</h2>
            <div className="space-y-3">
              <div><label className="block text-sm text-gray-700 mb-1">名称 *</label><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="规则名称" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">国家 *（逗号分隔）</label><textarea value={form.countriesStr} onChange={(e) => setForm((f) => ({ ...f, countriesStr: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="US, DE, GB" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">权重</label><input type="number" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">状态</label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="enabled">启用</option><option value="disabled">禁用</option></select></div>
              <div><label className="block text-sm text-gray-700 mb-1">含税</label><select value={form.taxIncluded} onChange={(e) => setForm((f) => ({ ...f, taxIncluded: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="any">任意</option><option value="true">是</option><option value="false">否</option></select></div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">输出渠道（从基础资料选择）</label>
                <div className="border border-gray-200 rounded p-2 max-h-40 overflow-y-auto space-y-1">
                  {channelList.map((ch) => (
                    <label key={ch.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.channelIds.includes(ch.id)} onChange={() => toggleChannel(ch.id)} />
                      <span className="text-sm">{ch.name} ({ch.code})</span>
                    </label>
                  ))}
                  {channelList.length === 0 && <span className="text-sm text-gray-500">暂无渠道，请先在基础资料维护</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
              <button type="button" onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowImportModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[560px] p-6 max-h-[90vh] overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold mb-2">导入</h2>
            <p className="text-sm text-gray-500 mb-3">粘贴 JSON 数组，同 id 更新，否则新增。渠道 ID 须存在。</p>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={12} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono overflow-auto" />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowImportModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
              <button type="button" onClick={handleImport} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">导入</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogisticsRoutingRuleListPage;
