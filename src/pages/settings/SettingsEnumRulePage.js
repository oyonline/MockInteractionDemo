/** 枚举与规则页：规则列表/筛选/新增/编辑/删除/启停/上移下移，数据走 settingsEnum，写系统日志。 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, Plus, RotateCcw, Edit2, Power, PowerOff } from 'lucide-react';
import { settingsEnum } from '../../services/settings';
import TablePagination from '../../components/TablePagination';
import ActionBar from '../../components/ActionBar';

const PAGE_SIZE = 10;

/** 目标字典下拉（写死常用 typeCode），不读 dict service */
const TARGET_TYPE_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'logistics_shipping_way', label: 'logistics_shipping_way（物流方式）' },
  { value: 'logistics_restricted_type', label: 'logistics_restricted_type（限制类型）' },
  { value: 'logistics_charge_unit', label: 'logistics_charge_unit（计费单位）' },
  { value: 'sales_order_type', label: 'sales_order_type（订单类型）' },
];

const SettingsEnumRulePage = () => {
  const [filters, setFilters] = useState({ keyword: '', status: '', targetTypeCode: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState({ list: [], total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', targetTypeCode: '', priority: 10, expression: '', desc: '' });
  const [formError, setFormError] = useState('');

  const loadList = useCallback((pageOverride) => {
    const page = pageOverride !== undefined ? pageOverride : currentPage;
    const res = settingsEnum.list({
      keyword: filters.keyword,
      status: filters.status || undefined,
      targetTypeCode: filters.targetTypeCode || undefined,
      page,
      pageSize: PAGE_SIZE,
    });
    setListData(res);
  }, [filters.keyword, filters.status, filters.targetTypeCode, currentPage]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const openCreate = () => {
    const all = settingsEnum.list({ page: 1, pageSize: 9999 });
    const maxP = all.list.length ? Math.max(...all.list.map((r) => r.priority != null ? r.priority : 0)) : 0;
    setForm({ name: '', targetTypeCode: 'logistics_shipping_way', priority: maxP + 10, expression: '', desc: '' });
    setFormError('');
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setForm({
      name: row.name ?? '',
      targetTypeCode: row.targetTypeCode ?? '',
      priority: row.priority != null ? row.priority : 10,
      expression: row.expression ?? '',
      desc: row.desc ?? '',
    });
    setFormError('');
    setEditingId(row.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormError('');
  };

  const validateForm = () => {
    const name = String(form.name).trim();
    const targetTypeCode = String(form.targetTypeCode).trim();
    const expression = String(form.expression).trim();
    if (!name) {
      setFormError('name 必填');
      return false;
    }
    if (!targetTypeCode) {
      setFormError('targetTypeCode 必填');
      return false;
    }
    if (!expression) {
      setFormError('expression 必填');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const payload = {
      name: form.name.trim(),
      targetTypeCode: form.targetTypeCode.trim(),
      priority: typeof form.priority === 'number' ? form.priority : parseInt(form.priority, 10) || 10,
      expression: form.expression.trim(),
      desc: form.desc.trim(),
    };
    if (editingId) {
      settingsEnum.update(editingId, payload);
      window.alert('保存成功');
    } else {
      settingsEnum.create(payload);
      window.alert('新增成功');
    }
    closeModal();
    loadList();
  };

  const handleRemove = (row) => {
    if (!window.confirm(`确定删除规则「${row.name}」？`)) return;
    settingsEnum.remove(row.id);
    loadList();
    window.alert('已删除');
  };

  const handleToggle = (row) => {
    settingsEnum.toggle(row.id);
    loadList();
    window.alert(row.status === 'enabled' ? '已停用' : '已启用');
  };

  const handleMove = (row, direction) => {
    settingsEnum.move(row.id, direction);
    loadList();
  };

  const handleReset = () => {
    if (!window.confirm('确定重置为初始 mock 数据？当前规则将被覆盖。')) return;
    settingsEnum.reset();
    setCurrentPage(1);
    loadList(1);
    window.alert('已重置');
  };

  const resetFilters = () => {
    setFilters({ keyword: '', status: '', targetTypeCode: '' });
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(listData.total / PAGE_SIZE));

  /** 当前筛选下的全量列表（按 priority 排序），用于上移/下移边界判断 */
  const fullFilteredList = settingsEnum.list({
    keyword: filters.keyword,
    status: filters.status || undefined,
    targetTypeCode: filters.targetTypeCode || undefined,
    page: 1,
    pageSize: 9999,
  }).list;

  return (
    <div className="flex flex-col h-full">
      {/* 顶部标题卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">枚举与规则</h1>
            <p className="text-sm text-gray-500 mt-1">按目标字典类型配置规则与优先级，用于策略推荐与校验。</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              新增规则
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
              placeholder="搜索 name / targetTypeCode / expression"
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="enabled">enabled</option>
            <option value="disabled">disabled</option>
          </select>
          <select
            value={filters.targetTypeCode}
            onChange={(e) => setFilters((f) => ({ ...f, targetTypeCode: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[220px]"
          >
            {TARGET_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button type="button" onClick={resetFilters} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
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
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-20">priority</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">name</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700">targetTypeCode</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-24">status</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-40">updatedAt</th>
                <th className="text-left py-3 px-4 border-b font-medium text-gray-700 w-[320px] min-w-[320px] text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">暂无规则</td>
                </tr>
              ) : (
                listData.list.map((row) => {
                  const idx = fullFilteredList.findIndex((r) => r.id === row.id);
                  const canUp = idx > 0;
                  const canDown = idx >= 0 && idx < fullFilteredList.length - 1;
                  return (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-700 font-mono">{row.priority}</td>
                      <td className="py-2 px-4 text-gray-800 font-medium">{row.name}</td>
                      <td className="py-2 px-4 text-gray-600 font-mono text-xs">{row.targetTypeCode}</td>
                      <td className="py-2 px-4">
                        <span className={row.status === 'enabled' ? 'text-green-600' : 'text-gray-500'}>{row.status}</span>
                      </td>
                      <td className="py-2 px-4 text-gray-500 text-xs">{row.updatedAt}</td>
                      <td className="py-2 px-4 w-[320px] min-w-[320px] align-top">
                        <ActionBar
                          primary={{ label: '编辑', onClick: () => openEdit(row), iconText: <Edit2 className="w-3.5 h-3.5" /> }}
                          secondary={{ label: row.status === 'enabled' ? '停用' : '启用', onClick: () => handleToggle(row), iconText: row.status === 'enabled' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" /> }}
                          more={[
                            { label: '上移', onClick: () => handleMove(row, 'up'), disabled: !canUp },
                            { label: '下移', onClick: () => handleMove(row, 'down'), disabled: !canDown },
                            { label: '删除', onClick: () => handleRemove(row), danger: true },
                          ]}
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

      {/* 新增/编辑 Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[480px] max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{editingId ? '编辑规则' : '新增规则'}</h2>
              <button type="button" onClick={closeModal} className="p-1 rounded hover:bg-gray-100 text-gray-500">×</button>
            </div>
            <div className="px-6 py-4 overflow-auto flex-1 min-h-0 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="规则名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">targetTypeCode *</label>
                <select
                  value={form.targetTypeCode}
                  onChange={(e) => setForm((f) => ({ ...f, targetTypeCode: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {TARGET_TYPE_OPTIONS.filter((o) => o.value).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">priority</label>
                <input
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: parseInt(e.target.value, 10) || 10 }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[120px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">expression *</label>
                <textarea
                  value={form.expression}
                  onChange={(e) => setForm((f) => ({ ...f, expression: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="策略表达式（多行）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">desc</label>
                <input
                  type="text"
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="可选说明"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t">
              <button type="button" onClick={closeModal} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-100">取消</button>
              <button type="button" onClick={handleSave} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsEnumRulePage;
