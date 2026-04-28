/** 编辑用户信息页：左栏用户信息表单 + 右栏权限/资源 Tabs 多列勾选，纯前端原型（userService + localStorage）。 */

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { userService } from '../../services/system';
import { toast } from '../../components/ui/Toast';

const TABS = [
  { key: 'roles', label: '角色' },
  { key: 'stores', label: '全平台店铺' },
  { key: 'warehouses', label: '仓库' },
];

const DEFAULT_PERMISSIONS = { roles: [], stores: [], warehouses: [], accounts1688: [], plans: [], mailboxes: [] };

function UserEditPage({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [meta, setMeta] = useState(null);
  const [form, setForm] = useState({ realName: '', phone: '', email: '', deptId: '', department: '' });
  const [permissions, setPermissions] = useState({ ...DEFAULT_PERMISSIONS });
  const [activeTab, setActiveTab] = useState('roles');
  const [formError, setFormError] = useState('');
  const [expandAll, setExpandAll] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const u = userService.getUserById(userId);
    const m = userService.getMeta();
    setMeta(m);
    if (u) {
      setUser(u);
      setForm({
        realName: u.realName || '',
        phone: u.phone || u.mobile || '',
        email: u.email || '',
        deptId: u.deptId || '',
        department: u.department || '',
      });
      setPermissions({
        ...DEFAULT_PERMISSIONS,
        ...(u.permissions && typeof u.permissions === 'object' ? u.permissions : {}),
      });
    }
  }, [userId]);

  const handleSave = () => {
    const rn = (form.realName || '').trim();
    if (!rn) {
      setFormError('真实姓名为必填项');
      return;
    }
    setFormError('');
    const patch = {
      realName: rn,
      phone: (form.phone || '').trim(),
      email: (form.email || '').trim(),
      deptId: form.deptId || '',
      department: (form.department || '').trim(),
      permissions: { ...permissions },
    };
    userService.updateUser(userId, patch);
    toast.success('已保存');
    if (onBack) onBack();
  };

  const togglePerm = (key, id) => {
    setPermissions((prev) => {
      const arr = prev[key] || [];
      const set = new Set(arr);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, [key]: Array.from(set) };
    });
  };

  if (!user || !meta) {
    return (
      <div className="flex items-center justify-center min-h-[320px] text-gray-500">
        加载中…
      </div>
    );
  }

  const list = meta[activeTab] || [];
  const selectedIds = new Set(permissions[activeTab] || []);

  return (
    <div className="flex flex-col h-full min-h-0">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">编辑用户信息</h1>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* 左栏：用户信息 */}
        <div className="w-[400px] flex-shrink-0 flex flex-col min-h-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-blue-600 rounded" />
              <span className="font-medium text-gray-800">用户信息</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={user.username || ''}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">* 真实姓名</label>
                <input
                  type="text"
                  value={form.realName}
                  onChange={(e) => setForm((f) => ({ ...f, realName: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入真实姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="手机号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="邮箱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                <select
                  value={form.deptId}
                  onChange={(e) => {
                    const d = meta.depts.find((x) => x.id === e.target.value);
                    setForm((f) => ({
                      ...f,
                      deptId: e.target.value,
                      department: d ? d.name : '',
                    }));
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择</option>
                  {(meta.depts || []).map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 右栏：Tabs + 多列勾选 */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 px-6">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === t.key
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">
                {activeTab === 'roles' ? '全部角色' : activeTab === 'stores' ? '全部店铺' : '全部仓库'}
              </span>
              <button
                type="button"
                onClick={() => setExpandAll((v) => !v)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
                title={expandAll ? '折叠' : '展开'}
              >
                {expandAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-4">
              {(expandAll ? list : list).map((item) => {
                const id = item.id;
                const checked = selectedIds.has(id);
                const label = item.name || id;
                return (
                  <label
                    key={id}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePerm(activeTab, id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className="max-w-[180px] truncate text-sm text-gray-700 group-hover:text-gray-900"
                      title={label}
                    >
                      {label}
                    </span>
                    {item.isPreset && (
                      <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200 flex-shrink-0">
                        预设
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onBack}
            className="h-8 px-4 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-8 px-4 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserEditPage;
