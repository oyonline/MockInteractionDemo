/** 用户管理页：仅升级“筛选与搜索”体验，数据走 userService（mock + localStorage）。 */

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, List, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { userService } from '../../services/system';
import TablePagination from '../../components/TablePagination';
import ActionBar from '../../components/ActionBar';
import UserEditPage from './UserEditPage';
import { toast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';

const PAGE_SIZE = 10;

const DEFAULT_DRAFT = {
  timeField: 'lastLoginAt',
  dateFrom: '',
  dateTo: '',
  status: '',
  role: '',
  keywordField: 'realName',
  keyword: '',
};

const DEFAULT_MORE = { storeId: '', warehouseId: '', account1688Id: '', deptId: '' };

const DEFAULT_QUERY = {
  ...DEFAULT_DRAFT,
  ...DEFAULT_MORE,
  exactList: [],
  page: 1,
  pageSize: PAGE_SIZE,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

function statusText(status) {
  return status === 'disabled' ? '禁用' : '启用';
}

function keywordFieldLabel(f) {
  if (f === 'username') return '用户名';
  if (f === 'mobile') return '手机号';
  if (f === 'email') return '邮箱';
  return '真实姓名';
}

function parseExactText(text) {
  const lines = String(text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const uniq = [];
  const set = new Set();
  for (const s of lines) {
    if (set.has(s)) continue;
    set.add(s);
    uniq.push(s);
    if (uniq.length >= 20) break;
  }
  return uniq;
}

function UserManagementPage() {
  const [meta, setMeta] = useState({ roles: [], depts: [], stores: [], warehouses: [], accounts1688: [] });
  const [draft, setDraft] = useState({ ...DEFAULT_DRAFT });
  const [appliedQuery, setAppliedQuery] = useState({ ...DEFAULT_QUERY });
  const [moreDraft, setMoreDraft] = useState({ ...DEFAULT_MORE });

  const [listData, setListData] = useState({ list: [], total: 0 });
  const [selectedIds, setSelectedIds] = useState([]);

  const [dateError, setDateError] = useState('');

  const [exactOpen, setExactOpen] = useState(false);
  const [exactText, setExactText] = useState('');
  const exactRef = useRef(null);

  const [moreOpen, setMoreOpen] = useState(false);

  // 下面 CRUD/弹窗保持原有行为
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ username: '', realName: '', phone: '', email: '', department: '', roles: '', status: 'enabled' });
  const [userFormError, setUserFormError] = useState('');

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdUser, setPwdUser] = useState(null);
  const [pwdForm, setPwdForm] = useState({ newPassword: '', confirmPassword: '' });
  const [pwdFormError, setPwdFormError] = useState('');

  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [handoverForm, setHandoverForm] = useState({ fromUserId: '', toUserId: '', scope: '全部' });

  const [confirmState, setConfirmState] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    setMeta(userService.getMeta());
  }, []);

  useEffect(() => {
    setListData(userService.list(appliedQuery));
  }, [appliedQuery]);

  useEffect(() => {
    if (!exactOpen) return;
    const onDoc = (e) => {
      if (exactRef.current && exactRef.current.contains(e.target)) return;
      setExactOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [exactOpen]);

  const applySearch = () => {
    const from = String(draft.dateFrom || '').trim();
    const to = String(draft.dateTo || '').trim();
    if (from && to && from > to) {
      setDateError('开始日期不能晚于结束日期');
      return;
    }
    setDateError('');
    setAppliedQuery((q) => ({
      ...q,
      ...draft,
      dateFrom: from,
      dateTo: to,
      keyword: String(draft.keyword || '').trim(),
      exactList: [],
      page: 1,
    }));
  };

  const applyExactSearch = () => {
    const from = String(draft.dateFrom || '').trim();
    const to = String(draft.dateTo || '').trim();
    if (from && to && from > to) {
      setDateError('开始日期不能晚于结束日期');
      return;
    }
    setDateError('');
    setAppliedQuery((q) => ({
      ...q,
      ...draft,
      dateFrom: from,
      dateTo: to,
      keyword: '',
      exactList: parseExactText(exactText),
      page: 1,
    }));
    setDraft((d) => ({ ...d, keyword: '' }));
    setExactOpen(false);
  };

  const clearExact = () => {
    setExactText('');
    if (appliedQuery.exactList && appliedQuery.exactList.length > 0) {
      setAppliedQuery((q) => ({ ...q, exactList: [], page: 1 }));
    }
  };

  const openMore = () => {
    setMoreDraft({ storeId: appliedQuery.storeId || '', warehouseId: appliedQuery.warehouseId || '', account1688Id: appliedQuery.account1688Id || '', deptId: appliedQuery.deptId || '' });
    setMoreOpen(true);
  };

  const applyMore = () => {
    setAppliedQuery((q) => ({ ...q, ...moreDraft, page: 1 }));
    setMoreOpen(false);
  };

  const resetAll = () => {
    setDraft({ ...DEFAULT_DRAFT });
    setMoreDraft({ ...DEFAULT_MORE });
    setExactText('');
    setExactOpen(false);
    setMoreOpen(false);
    setDateError('');
    setAppliedQuery({ ...DEFAULT_QUERY });
  };

  const toggleSort = (field) => {
    setAppliedQuery((q) => {
      const nextOrder = q.sortBy === field ? (q.sortOrder === 'desc' ? 'asc' : 'desc') : q.sortOrder;
      return { ...q, sortBy: field, sortOrder: nextOrder, page: 1 };
    });
  };

  const toggleSelectAll = (checked) => {
    if (checked) setSelectedIds(listData.list.map((u) => u.id));
    else setSelectedIds([]);
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({ username: '', realName: '', phone: '', email: '', department: '', roles: '', status: 'enabled' });
    setUserFormError('');
    setShowUserModal(true);
  };
  const openEditUser = (user) => {
    setEditUserId(user.id);
  };
  const saveUser = () => {
    const un = userForm.username.trim();
    const rn = userForm.realName.trim();
    if (!un) return setUserFormError('用户名必填');
    if (!rn) return setUserFormError('真实姓名必填');
    const payload = {
      username: un,
      realName: rn,
      phone: userForm.phone.trim(),
      email: userForm.email.trim(),
      department: userForm.department.trim(),
      roles: userForm.roles.trim(),
      status: userForm.status,
    };
    if (editingUser) {
      userService.update(editingUser.id, payload);
      toast.success('保存成功');
    } else {
      userService.create(payload);
      toast.success('新增成功');
    }
    setShowUserModal(false);
    setAppliedQuery((q) => ({ ...q }));
  };

  const openPwdModal = (user) => {
    setPwdUser(user);
    setPwdForm({ newPassword: '', confirmPassword: '' });
    setPwdFormError('');
    setShowPwdModal(true);
  };
  const savePwd = () => {
    if (!pwdForm.newPassword.trim()) return setPwdFormError('请输入新密码');
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return setPwdFormError('两次密码不一致');
    userService.resetPassword(pwdUser.id, pwdForm.newPassword);
    toast.success('密码已重置');
    setShowPwdModal(false);
  };

  const handleStatus = (user, nextStatus) => {
    setConfirmState(null);
    userService.updateStatus(user.id, nextStatus);
    setAppliedQuery((q) => ({ ...q }));
    toast.success(nextStatus === 'enabled' ? '已启用' : '已禁用');
  };
  const handleRemove = (user) => {
    setConfirmState(null);
    userService.remove(user.id);
    setAppliedQuery((q) => ({ ...q }));
    toast.success('已删除');
  };
  const runConfirm = () => {
    if (!confirmState) return;
    const { row, action } = confirmState;
    if (action === 'remove') handleRemove(row);
    else if (action === 'enable') handleStatus(row, 'enabled');
    else if (action === 'disable') handleStatus(row, 'disabled');
    setConfirmState(null);
  };

  const batchAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (action === 'delete') {
      const ok = await confirm({
        title: '确认批量删除',
        description: `确定删除选中的 ${selectedIds.length} 个用户？`,
        confirmText: '删除',
        cancelText: '取消',
        danger: true,
      });
      if (!ok) return;
    } else {
      const ok = await confirm({
        title: '确认批量操作',
        description: `确定对选中的 ${selectedIds.length} 个用户执行${action === 'enable' ? '启用' : '禁用'}？`,
        confirmText: '确认',
        cancelText: '取消',
      });
      if (!ok) return;
    }
    userService.batchOperate({ ids: selectedIds, action: action === 'delete' ? 'delete' : action === 'enable' ? 'enable' : 'disable' });
    setSelectedIds([]);
    setAppliedQuery((q) => ({ ...q }));
    toast.success('操作成功');
  };

  const submitHandover = () => {
    if (!handoverForm.fromUserId || !handoverForm.toUserId) {
      toast.warning('请选择交接人与接收人');
      return;
    }
    userService.handover({ fromUserId: handoverForm.fromUserId, toUserId: handoverForm.toUserId, scope: handoverForm.scope });
    setShowHandoverModal(false);
    toast.success('负责人交接已提交');
  };

  const totalPages = Math.max(1, Math.ceil(listData.total / PAGE_SIZE));
  const allUserList = userService.list({ page: 1, pageSize: 9999 }).list;

  if (editUserId) {
    return (
      <UserEditPage
        userId={editUserId}
        onBack={() => {
          setEditUserId(null);
          setAppliedQuery((q) => ({ ...q }));
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 顶部两行：筛选条 + 工具栏 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        {/* 第1行：筛选条 */}
        <div className="flex flex-wrap items-center gap-3" ref={exactRef}>
          <div className="flex items-center gap-2">
            <select value={draft.timeField} onChange={(e) => setDraft((d) => ({ ...d, timeField: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="lastLoginAt">登录时间</option>
              <option value="createdAt">创建时间</option>
            </select>
            <input type="date" value={draft.dateFrom} onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-gray-400">-</span>
            <input type="date" value={draft.dateTo} onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <select value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">全部状态</option>
            <option value="enabled">启用</option>
            <option value="disabled">禁用</option>
          </select>

          <select value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">全部角色</option>
            {meta.roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 flex-1 min-w-[320px] justify-end relative">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white w-full max-w-[520px]">
              <select value={draft.keywordField} onChange={(e) => setDraft((d) => ({ ...d, keywordField: e.target.value }))} className="h-9 px-3 text-sm bg-gray-50 border-r border-gray-200 focus:outline-none">
                <option value="username">用户名</option>
                <option value="realName">真实姓名</option>
                <option value="mobile">手机号</option>
                <option value="email">邮箱</option>
              </select>
              <input
                type="text"
                value={draft.keyword}
                onChange={(e) => setDraft((d) => ({ ...d, keyword: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') applySearch(); }}
                placeholder={`请输入${keywordFieldLabel(draft.keywordField)}，支持模糊搜索`}
                className="flex-1 h-9 px-3 text-sm focus:outline-none"
              />
              <button type="button" onClick={applySearch} className="h-9 px-3 text-sm text-gray-700 hover:bg-gray-50" title="搜索">
                <Search className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setExactOpen((v) => !v)} className={`h-9 px-3 text-sm text-gray-700 hover:bg-gray-50 border-l border-gray-200 ${exactOpen ? 'bg-gray-50' : ''}`} title="精确搜索">
                <List className="w-4 h-4" />
              </button>
            </div>

            {exactOpen && (
              <div className="absolute right-0 top-full mt-2 z-20 w-[360px] bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <div className="text-sm text-gray-700 font-medium">精确搜索</div>
                <div className="text-xs text-gray-500 mt-1">精确搜索，一行一项，最多支持20项（作用字段：{keywordFieldLabel(draft.keywordField)}）</div>
                <textarea value={exactText} onChange={(e) => setExactText(e.target.value)} rows={6} className="w-full mt-3 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" />
                <div className="flex justify-end gap-2 mt-3">
                  <button type="button" onClick={clearExact} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50">清空</button>
                  <button type="button" onClick={() => setExactOpen(false)} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50">关闭</button>
                  <button type="button" onClick={applyExactSearch} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">搜索</button>
                </div>
              </div>
            )}
          </div>

          <button type="button" onClick={openMore} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" />
            更多筛选
          </button>
          <button type="button" onClick={resetAll} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">重置</button>
        </div>
        {dateError && <div className="text-sm text-red-600 mt-2">{dateError}</div>}

        {/* 第2行：工具栏（原有无需改） */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">用户管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理系统用户、角色与权限，支持批量操作与负责人交接。</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={openAddUser} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              添加用户
            </button>
            <details className="relative">
              <summary className={`list-none cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} title={selectedIds.length === 0 ? '请先选择用户' : ''}>
                批量 <ChevronDown className="w-4 h-4" />
              </summary>
              <div className="absolute right-0 top-full mt-1 z-10 min-w-[140px] py-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button type="button" onClick={() => batchAction('enable')} disabled={selectedIds.length === 0} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">批量启用</button>
                <button type="button" onClick={() => batchAction('disable')} disabled={selectedIds.length === 0} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">批量禁用</button>
                <button type="button" onClick={() => batchAction('delete')} disabled={selectedIds.length === 0} className="w-full text-left px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50">批量删除</button>
              </div>
            </details>
            <button type="button" onClick={() => { setHandoverForm({ fromUserId: '', toUserId: '', scope: '全部' }); setShowHandoverModal(true); }} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
              负责人交接
            </button>
          </div>
        </div>
      </div>

      {/* 更多筛选 Drawer（草稿态：取消不生效，搜索才应用） */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setMoreOpen(false)} aria-hidden />
          <div className="w-[360px] bg-white h-full shadow-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">更多筛选</h2>
              <button type="button" onClick={() => setMoreOpen(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 flex-1 overflow-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">店铺</label>
                <select value={moreDraft.storeId} onChange={(e) => setMoreDraft((m) => ({ ...m, storeId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">全部</option>
                  {meta.stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">仓库</label>
                <select value={moreDraft.warehouseId} onChange={(e) => setMoreDraft((m) => ({ ...m, warehouseId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">全部</option>
                  {meta.warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">1688账号</label>
                <select value={moreDraft.account1688Id} onChange={(e) => setMoreDraft((m) => ({ ...m, account1688Id: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">全部</option>
                  {meta.accounts1688.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                <select value={moreDraft.deptId} onChange={(e) => setMoreDraft((m) => ({ ...m, deptId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">全部</option>
                  {meta.depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <button type="button" onClick={() => setMoreOpen(false)} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50">取消</button>
              <button type="button" onClick={applyMore} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">搜索</button>
            </div>
          </div>
        </div>
      )}

      {/* 表格 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-sm min-w-[1600px] border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-[1]">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium text-gray-600 w-10">
                  <input
                    type="checkbox"
                    checked={listData.list.length > 0 && selectedIds.length === listData.list.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">用户名</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">真实姓名</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">手机号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">邮箱</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap w-20">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">部门</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap cursor-pointer" onClick={() => toggleSort('createdAt')}>
                  创建时间 {appliedQuery.sortBy === 'createdAt' && (appliedQuery.sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap max-w-[120px]">角色</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap max-w-[140px]">关联权限</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap w-20">登录次数</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">最近登录时间</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">最近登录IP</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">第三方授权</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap w-[500px] min-w-[500px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {listData.list.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-800">{row.username || '-'}</td>
                  <td className="px-4 py-2 text-gray-800">{row.realName || '-'}</td>
                  <td className="px-4 py-2 text-gray-600">{row.phone || '-'}</td>
                  <td className="px-4 py-2 text-gray-600 truncate max-w-[140px]" title={row.email}>{row.email || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs ${row.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {row.status ? statusText(row.status) : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{row.department || '-'}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{row.createdAt || '-'}</td>
                  <td className="px-4 py-2 text-gray-600 truncate max-w-[120px]" title={row.roles}>{row.roles || '-'}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs truncate max-w-[140px]" title={row.permissionSummary}>{row.permissionSummary || '-'}</td>
                  <td className="px-4 py-2 text-gray-600">{row.loginCount != null ? row.loginCount : '-'}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{row.lastLoginAt || '-'}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs font-mono">{row.lastLoginIp || '-'}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{row.thirdPartyAuth || '-'}</td>
                  <td className="px-4 py-2 w-[500px] min-w-[500px] align-top relative">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap relative" onClick={(e) => confirmState && confirmState.row.id === row.id && e.stopPropagation()}>
                      <ActionBar
                        primary={{ label: '编辑', onClick: () => openEditUser(row) }}
                        moreLabel="操作"
                        moreIcon={<ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                        more={[
                          row.status === 'enabled'
                            ? { label: '禁用', onClick: () => setConfirmState({ row, action: 'disable' }) }
                            : { label: '启用', onClick: () => setConfirmState({ row, action: 'enable' }) },
                          { label: '删除', danger: true, onClick: () => setConfirmState({ row, action: 'remove' }) },
                          { label: '重置密码', onClick: () => openPwdModal(row) },
                        ]}
                      />
                      {confirmState && confirmState.row.id === row.id && (
                        <div className="absolute right-4 mt-1 z-20 py-2 px-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm">
                          <p className="text-gray-700 mb-2">
                            {confirmState.action === 'remove' ? '确定删除该用户？' : confirmState.action === 'enable' ? '确定启用？' : '确定禁用？'}
                          </p>
                          <div className="flex gap-2">
                            <button type="button" onClick={runConfirm} className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">确定</button>
                            <button type="button" onClick={() => setConfirmState(null)} className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">取消</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination currentPage={appliedQuery.page} totalPages={totalPages} total={listData.total} onPageChange={(p) => setAppliedQuery((q) => ({ ...q, page: p }))} itemName="个用户" />
      </div>

      {/* 新增/编辑用户 Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowUserModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[480px] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editingUser ? '编辑用户' : '新增用户'}</h2>
              <button type="button" onClick={() => setShowUserModal(false)} className="p-1 rounded hover:bg-gray-100">×</button>
            </div>
            <div className="p-6 overflow-auto flex-1">
              {userFormError && <p className="text-sm text-red-600 mb-2">{userFormError}</p>}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名 *</label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm((f) => ({ ...f, username: e.target.value }))}
                    disabled={!!editingUser}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100"
                    placeholder="登录账号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">真实姓名 *</label>
                  <input
                    type="text"
                    value={userForm.realName}
                    onChange={(e) => setUserForm((f) => ({ ...f, realName: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="手机号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="text"
                    value={userForm.email}
                    onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="邮箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                  <select
                    value={userForm.department}
                    onChange={(e) => setUserForm((f) => ({ ...f, department: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">请选择</option>
                    {meta.depts.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                  <select
                    value={userForm.roles}
                    onChange={(e) => setUserForm((f) => ({ ...f, roles: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">请选择</option>
                    {meta.roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="enabled">启用</option>
                    <option value="disabled">禁用</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 border-t">
              <button type="button" onClick={() => setShowUserModal(false)} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-100">取消</button>
              <button type="button" onClick={saveUser} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 重置密码 Modal */}
      {showPwdModal && pwdUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowPwdModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[400px] p-6">
            <h2 className="text-lg font-semibold mb-4">重置密码 - {pwdUser.realName || pwdUser.username}</h2>
            {pwdFormError && <p className="text-sm text-red-600 mb-2">{pwdFormError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码 *</label>
                <input
                  type="password"
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm((f) => ({ ...f, newPassword: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="请输入新密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码 *</label>
                <input
                  type="password"
                  value={pwdForm.confirmPassword}
                  onChange={(e) => setPwdForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="再次输入新密码"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowPwdModal(false)} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-100">取消</button>
              <button type="button" onClick={savePwd} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 负责人交接 Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowHandoverModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[440px] p-6">
            <h2 className="text-lg font-semibold mb-4">负责人交接</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">交接人</label>
                <select
                  value={handoverForm.fromUserId}
                  onChange={(e) => setHandoverForm((f) => ({ ...f, fromUserId: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">请选择</option>
                  {allUserList.map((u) => (
                    <option key={u.id} value={u.id}>{u.realName || u.username}（{u.username}）</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">接收人</label>
                <select
                  value={handoverForm.toUserId}
                  onChange={(e) => setHandoverForm((f) => ({ ...f, toUserId: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">请选择</option>
                  {allUserList.map((u) => (
                    <option key={u.id} value={u.id}>{u.realName || u.username}（{u.username}）</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">交接范围</label>
                <select
                  value={handoverForm.scope}
                  onChange={(e) => setHandoverForm((f) => ({ ...f, scope: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="全部">全部</option>
                  <option value="仅店铺">仅店铺</option>
                  <option value="仅仓库">仅仓库</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowHandoverModal(false)} className="h-8 px-3 text-sm border border-gray-300 rounded hover:bg-gray-100">取消</button>
              <button type="button" onClick={submitHandover} className="h-8 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">提交</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementPage;
