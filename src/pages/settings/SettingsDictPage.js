/** 数据字典页：左侧字典类型列表 + 右侧字典项表格，CRUD/启停/级联删除，数据走 settingsDict，写系统日志。 */

import React, { useState, useCallback, useEffect } from 'react';
import { Plus, RotateCcw, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import { settingsDict } from '../../services/settings';
import TablePagination from '../../components/TablePagination';
import ActionBar from '../../components/ActionBar';
import { toast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';

const PAGE_SIZE = 10;

const SettingsDictPage = () => {
  const [typeKeyword, setTypeKeyword] = useState('');
  const [typesList, setTypesList] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [itemKeyword, setItemKeyword] = useState('');
  const [itemStatus, setItemStatus] = useState('');
  const [itemPage, setItemPage] = useState(1);
  const [itemsList, setItemsList] = useState([]);
  const [itemsTotal, setItemsTotal] = useState(0);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [typeForm, setTypeForm] = useState({ typeCode: '', typeName: '' });
  const [typeFormError, setTypeFormError] = useState('');

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({ label: '', value: '', sort: 100 });
  const [itemFormError, setItemFormError] = useState('');

  const loadTypes = useCallback(() => {
    const res = settingsDict.listTypes({ keyword: typeKeyword, status: '' });
    setTypesList(res.list);
  }, [typeKeyword]);

  const loadItems = useCallback(() => {
    if (!selectedTypeId) {
      setItemsList([]);
      setItemsTotal(0);
      return;
    }
    const res = settingsDict.listItems({
      typeId: selectedTypeId,
      keyword: itemKeyword,
      status: itemStatus || undefined,
      page: itemPage,
      pageSize: PAGE_SIZE,
    });
    setItemsList(res.list);
    setItemsTotal(res.total);
  }, [selectedTypeId, itemKeyword, itemStatus, itemPage]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const selectedType = selectedTypeId ? settingsDict.getType(selectedTypeId) : null;
  const selectedTypeDisabled = selectedType && selectedType.status === 'disabled';

  const openTypeCreate = () => {
    setTypeForm({ typeCode: '', typeName: '' });
    setTypeFormError('');
    setEditingTypeId(null);
    setShowTypeModal(true);
  };

  const openTypeEdit = (t) => {
    setTypeForm({ typeCode: t.typeCode || '', typeName: t.typeName || '' });
    setTypeFormError('');
    setEditingTypeId(t.id);
    setShowTypeModal(true);
  };

  const saveType = () => {
    const code = typeForm.typeCode.trim();
    const name = typeForm.typeName.trim();
    if (!code) {
      setTypeFormError('typeCode 必填');
      return;
    }
    if (!name) {
      setTypeFormError('typeName 必填');
      return;
    }
    if (editingTypeId) {
      const updated = settingsDict.updateType(editingTypeId, { typeCode: code, typeName: name });
      if (!updated) {
        setTypeFormError('typeCode 已存在');
        return;
      }
    } else {
      const created = settingsDict.createType({ typeCode: code, typeName: name });
      if (!created) {
        setTypeFormError('typeCode 已存在');
        return;
      }
    }
    setShowTypeModal(false);
    loadTypes();
    toast.success('保存成功');
  };

  const handleRemoveType = async (t) => {
    const { total } = settingsDict.listItems({ typeId: t.id });
    const ok = await confirm({
      title: '确认删除',
      description: `确定删除类型「${t.typeName}」？将级联删除 ${total} 个字典项。`,
      confirmText: '删除',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    settingsDict.removeType(t.id);
    if (selectedTypeId === t.id) setSelectedTypeId(null);
    loadTypes();
    loadItems();
    toast.success('已删除');
  };

  const handleToggleType = (t) => {
    settingsDict.toggleType(t.id);
    loadTypes();
    if (selectedTypeId === t.id) loadItems();
    toast.success(t.status === 'enabled' ? '已停用' : '已启用');
  };

  const openItemCreate = () => {
    if (selectedTypeDisabled) {
      toast.warning('当前类型已停用，无法新增字典项');
      return;
    }
    setItemForm({ label: '', value: '', sort: 100 });
    setItemFormError('');
    setEditingItemId(null);
    setShowItemModal(true);
  };

  const openItemEdit = (item) => {
    if (selectedTypeDisabled) {
      toast.warning('当前类型已停用，无法编辑');
      return;
    }
    setItemForm({ label: item.label || '', value: item.value || '', sort: item.sort != null ? item.sort : 100 });
    setItemFormError('');
    setEditingItemId(item.id);
    setShowItemModal(true);
  };

  const saveItem = () => {
    const label = itemForm.label.trim();
    const value = itemForm.value.trim();
    if (!label) {
      setItemFormError('label 必填');
      return;
    }
    if (!value) {
      setItemFormError('value 必填');
      return;
    }
    if (editingItemId) {
      const updated = settingsDict.updateItem(editingItemId, { label, value, sort: itemForm.sort });
      if (!updated) {
        setItemFormError('value 在同类型下已存在');
        return;
      }
    } else {
      const created = settingsDict.createItem({ typeId: selectedTypeId, label, value, sort: itemForm.sort });
      if (!created) {
        setItemFormError('value 在同类型下已存在');
        return;
      }
    }
    setShowItemModal(false);
    loadItems();
    toast.success('保存成功');
  };

  const handleRemoveItem = async (item) => {
    const ok = await confirm({
      title: '确认删除',
      description: `确定删除字典项「${item.label}」？`,
      confirmText: '删除',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    settingsDict.removeItem(item.id);
    loadItems();
    toast.success('已删除');
  };

  const handleToggleItem = (item) => {
    if (selectedTypeDisabled) {
      toast.warning('当前类型已停用，无法操作');
      return;
    }
    settingsDict.toggleItem(item.id);
    loadItems();
    toast.success(item.status === 'enabled' ? '已停用' : '已启用');
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: '确认重置',
      description: '确定重置为初始 mock 数据？当前数据将被覆盖。',
      confirmText: '重置',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    settingsDict.reset();
    setSelectedTypeId(null);
    loadTypes();
    setItemsList([]);
    setItemsTotal(0);
    setItemPage(1);
    toast.success('已重置');
  };

  const totalPages = Math.max(1, Math.ceil(itemsTotal / PAGE_SIZE));

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex gap-4 flex-1 min-h-0 p-6">
        {/* 左侧：字典类型 */}
        <div className="w-[360px] flex-shrink-0 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">字典类型</h2>
            <button type="button" onClick={openTypeCreate} className="inline-flex items-center gap-1 h-8 px-3 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="搜索 typeName / typeCode"
              value={typeKeyword}
              onChange={(e) => setTypeKeyword(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            {typesList.map((t) => (
              <div
                key={t.id}
                className={`flex items-center justify-between gap-2 px-3 py-2 border-b cursor-pointer ${selectedTypeId === t.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedTypeId(t.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-800 truncate">{t.typeName}</div>
                  <div className="text-xs text-gray-500 font-mono truncate">{t.typeCode}</div>
                  <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-xs ${t.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {t.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => openTypeEdit(t)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="编辑">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleToggleType(t)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded" title={t.status === 'enabled' ? '停用' : '启用'}>
                    {t.status === 'enabled' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                  </button>
                  <button type="button" onClick={() => handleRemoveType(t)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="删除">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：字典项 */}
        <div className="flex-1 min-w-0 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
          {!selectedTypeId ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">请选择一个字典类型</div>
          ) : (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  字典项（{selectedType ? selectedType.typeName : ''} / {selectedType ? selectedType.typeCode : ''}）
                  {selectedTypeDisabled && <span className="ml-2 text-amber-600 text-sm">已停用</span>}
                </h2>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={openItemCreate} disabled={selectedTypeDisabled} className="inline-flex items-center gap-1 h-8 px-3 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Plus className="w-4 h-4" />
                    新增
                  </button>
                  <button type="button" onClick={handleReset} className="inline-flex items-center gap-1 h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    <RotateCcw className="w-4 h-4" />
                    重置数据
                  </button>
                </div>
              </div>
              <div className="p-4 border-b flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="搜索 label / value"
                  value={itemKeyword}
                  onChange={(e) => setItemKeyword(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select value={itemStatus} onChange={(e) => setItemStatus(e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">全部状态</option>
                  <option value="enabled">enabled</option>
                  <option value="disabled">disabled</option>
                </select>
                <button type="button" onClick={() => { setItemKeyword(''); setItemStatus(''); setItemPage(1); }} className="px-2 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  重置筛选
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-auto flex flex-col">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-2 px-3 border-b font-medium text-gray-700">label</th>
                      <th className="text-left py-2 px-3 border-b font-medium text-gray-700">value</th>
                      <th className="text-left py-2 px-3 border-b font-medium text-gray-700 w-20">status</th>
                      <th className="text-left py-2 px-3 border-b font-medium text-gray-700 w-16">sort</th>
                      <th className="text-left py-2 px-3 border-b font-medium text-gray-700 w-36">updatedAt</th>
                      <th className="text-left py-2 px-3 border-b font-medium text-gray-700 w-[200px] min-w-[200px] text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsList.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-800">{item.label}</td>
                        <td className="py-2 px-3 text-gray-600 font-mono text-xs">{item.value}</td>
                        <td className="py-2 px-3">
                          <span className={item.status === 'enabled' ? 'text-green-600' : 'text-gray-500'}>{item.status}</span>
                        </td>
                        <td className="py-2 px-3 text-gray-600">{item.sort}</td>
                        <td className="py-2 px-3 text-gray-500 text-xs">{item.updatedAt}</td>
                        <td className="py-2 px-3 w-[200px] min-w-[200px] align-top">
                          <ActionBar
                            primary={{ label: '编辑', onClick: () => openItemEdit(item), disabled: selectedTypeDisabled, iconText: <Edit2 className="w-3.5 h-3.5" /> }}
                            secondary={{ label: item.status === 'enabled' ? '停用' : '启用', onClick: () => handleToggleItem(item), disabled: selectedTypeDisabled, iconText: item.status === 'enabled' ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" /> }}
                            more={[{ label: '删除', onClick: () => handleRemoveItem(item), disabled: selectedTypeDisabled, danger: true }]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TablePagination currentPage={itemPage} totalPages={totalPages} total={itemsTotal} onPageChange={setItemPage} itemName="条" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 类型 Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowTypeModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[400px] p-6">
            <h3 className="text-lg font-semibold mb-4">{editingTypeId ? '编辑字典类型' : '新增字典类型'}</h3>
            {typeFormError && <p className="text-sm text-red-600 mb-2">{typeFormError}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">typeCode *</label>
                <input
                  type="text"
                  value={typeForm.typeCode}
                  onChange={(e) => setTypeForm((f) => ({ ...f, typeCode: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="order_status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">typeName *</label>
                <input
                  type="text"
                  value={typeForm.typeName}
                  onChange={(e) => setTypeForm((f) => ({ ...f, typeName: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="订单状态"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowTypeModal(false)} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-100">取消</button>
              <button type="button" onClick={saveType} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 字典项 Modal */}
      {showItemModal && selectedTypeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowItemModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[400px] p-6">
            <h3 className="text-lg font-semibold mb-4">{editingItemId ? '编辑字典项' : '新增字典项'}</h3>
            {itemFormError && <p className="text-sm text-red-600 mb-2">{itemFormError}</p>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">label *</label>
                <input
                  type="text"
                  value={itemForm.label}
                  onChange={(e) => setItemForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="显示名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">value *</label>
                <input
                  type="text"
                  value={itemForm.value}
                  onChange={(e) => setItemForm((f) => ({ ...f, value: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="存储值"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">sort</label>
                <input
                  type="number"
                  value={itemForm.sort}
                  onChange={(e) => setItemForm((f) => ({ ...f, sort: parseInt(e.target.value, 10) || 100 }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowItemModal(false)} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-100">取消</button>
              <button type="button" onClick={saveItem} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDictPage;
