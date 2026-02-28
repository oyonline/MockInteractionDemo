/** 参数设置页：列表/搜索/分页/新增/编辑/删除/启用停用/重置，数据走 settingsParams service。 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, Plus, RotateCcw, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import { settingsParams } from '../../services/settings';
import TablePagination from '../../components/TablePagination';

const PAGE_SIZE = 10;

const SettingsParamsPage = () => {
  const [filters, setFilters] = useState({ keyword: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState({ list: [], total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ group: '', key: '', value: '', desc: '', status: 'enabled' });
  const [formError, setFormError] = useState('');

  const loadList = useCallback((pageOverride) => {
    const page = pageOverride !== undefined ? pageOverride : currentPage;
    const res = settingsParams.list({
      keyword: filters.keyword,
      status: filters.status,
      page,
      pageSize: PAGE_SIZE,
    });
    setListData(res);
  }, [filters.keyword, filters.status, currentPage]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const openCreate = () => {
    setForm({ group: 'general', key: '', value: '', desc: '', status: 'enabled' });
    setFormError('');
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      group: item.group ?? 'general',
      key: item.key ?? '',
      value: item.value ?? '',
      desc: item.desc ?? '',
      status: item.status ?? 'enabled',
    });
    setFormError('');
    setEditingId(item.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormError('');
  };

  const validateForm = () => {
    const key = String(form.key).trim();
    const value = String(form.value).trim();
    if (!key) {
      setFormError('key 必填');
      return false;
    }
    if (!value) {
      setFormError('value 必填');
      return false;
    }
    const all = settingsParams.list({ page: 1, pageSize: 10000 });
    const exists = all.list.some((i) => i.key === key && i.id !== editingId);
    if (exists) {
      setFormError('key 已存在');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const payload = {
      group: form.group.trim() || 'general',
      key: form.key.trim(),
      value: form.value.trim(),
      desc: form.desc.trim(),
      status: form.status,
    };
    if (editingId) {
      settingsParams.update(editingId, payload);
    } else {
      settingsParams.create(payload);
    }
    closeModal();
    loadList();
  };

  const handleRemove = (item) => {
    if (!window.confirm(`确定删除参数 "${item.key}"？`)) return;
    settingsParams.remove(item.id);
    loadList();
  };

  const toggleStatus = (item) => {
    const next = item.status === 'enabled' ? 'disabled' : 'enabled';
    settingsParams.update(item.id, { status: next });
    loadList();
  };

  const handleReset = () => {
    if (!window.confirm('确定重置为初始 mock 数据？当前数据将被覆盖。')) return;
    settingsParams.reset();
    setCurrentPage(1);
    loadList(1);
  };

  const resetFilters = () => {
    setFilters({ keyword: '', status: '' });
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(listData.total / PAGE_SIZE));

  return (
    <div className="flex flex-col h-full">
      {/* 顶部标题卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">参数设置</h1>
            <p className="text-sm text-gray-500 mt-1">系统参数 key/value 配置，支持按分组与状态筛选。</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              新增
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
              placeholder="搜索 key/value/desc"
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="enabled">enabled</option>
            <option value="disabled">disabled</option>
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
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">group</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">key</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">value</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">status</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">updatedAt</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-40">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.list.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-700">{row.group}</td>
                  <td className="py-2 px-4 text-gray-800 font-mono text-xs">{row.key}</td>
                  <td className="py-2 px-4 text-gray-700 max-w-xs truncate" title={row.value}>{row.value}</td>
                  <td className="py-2 px-4">
                    <span className={row.status === 'enabled' ? 'text-green-600' : 'text-gray-500'}>{row.status}</span>
                  </td>
                  <td className="py-2 px-4 text-gray-500 text-xs">{row.updatedAt}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="编辑"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(row)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                        title={row.status === 'enabled' ? '停用' : '启用'}
                      >
                        {row.status === 'enabled' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(row)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* 新增/编辑 Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[440px] max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{editingId ? '编辑参数' : '新增参数'}</h2>
              <button type="button" onClick={closeModal} className="p-1 rounded hover:bg-gray-100 text-gray-500">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">group</label>
                <input
                  type="text"
                  value={form.group}
                  onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="general"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">key <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.key}
                  onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="param_key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">value <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">desc</label>
                <input
                  type="text"
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="说明"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="enabled">enabled</option>
                  <option value="disabled">disabled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">
                取消
              </button>
              <button type="button" onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsParamsPage;
