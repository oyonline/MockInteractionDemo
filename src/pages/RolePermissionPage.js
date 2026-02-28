/**
 * 角色与权限页：左侧角色列表 + 顶部 Tabs + 功能权限（模块树列 + 权限矩阵表格），
 * 勾选联动、保存/重置，数据走 rolePermissionService + localStorage。
 * 样式对齐后台截图；角色用户/字段权限/数据权限为骨架页。
 */

import React, { useEffect, useState, useMemo } from 'react';
import { rolePermissionService } from '../services/system';

const TABS = [
  { key: 'users', label: '角色用户' },
  { key: 'function', label: '功能权限' },
  { key: 'field', label: '字段权限' },
  { key: 'data', label: '数据权限' },
];

const FIELD_STORAGE_KEY = 'ecommerce:system:roleFieldPermissions';
const DATA_STORAGE_KEY = 'ecommerce:system:roleDataPermissions';

function RolePermissionPage() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleSearch, setRoleSearch] = useState('');
  const [meta, setMeta] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [activeTab, setActiveTab] = useState('function');
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  // 角色用户 Tab：模拟用户列表
  const [roleUsers, setRoleUsers] = useState([]);
  const [roleUserSearch, setRoleUserSearch] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // 字段权限 Tab
  const [fieldMeta, setFieldMeta] = useState(null);
  const [fieldPerms, setFieldPerms] = useState({});

  // 数据权限 Tab
  const [dataMeta, setDataMeta] = useState(null);
  const [dataSubTab, setDataSubTab] = useState('sku');
  const [dataScope, setDataScope] = useState('self');
  const [dataPerms, setDataPerms] = useState({});

  const loadRoles = () => {
    setRoles(rolePermissionService.getRoles());
  };

  const loadMeta = () => {
    setMeta(rolePermissionService.getPermissionMeta());
    setFieldMeta(rolePermissionService.getFieldPermissionMeta?.() ?? null);
    setDataMeta(rolePermissionService.getDataPermissionMeta?.() ?? null);
  };

  useEffect(() => {
    loadRoles();
    loadMeta();
  }, []);

  useEffect(() => {
    if (!selectedRoleId) {
      setPermissions({});
      return;
    }
    setPermissions(rolePermissionService.getRolePermissions(selectedRoleId));
  }, [selectedRoleId]);

  useEffect(() => {
    if (!selectedRoleId || !fieldMeta) return;
    try {
      const raw = window.localStorage.getItem(FIELD_STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      setFieldPerms(all[selectedRoleId] || {});
    } catch {
      setFieldPerms({});
    }
  }, [selectedRoleId, fieldMeta]);

  useEffect(() => {
    if (!selectedRoleId || !dataMeta) return;
    try {
      const raw = window.localStorage.getItem(DATA_STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      setDataPerms(all[selectedRoleId] || {});
    } catch {
      setDataPerms({});
    }
  }, [selectedRoleId, dataMeta]);

  // 角色用户： mock 几条
  useEffect(() => {
    if (activeTab === 'users' && selectedRoleId) {
      setRoleUsers([
        { id: 'ru1', username: 'zhangsan', realName: '张三', phone: '13800138000' },
        { id: 'ru2', username: 'lisi', realName: '李四', phone: '13800138001' },
        { id: 'ru3', username: 'wangwu', realName: '王五', phone: '13800138002' },
      ]);
    } else {
      setRoleUsers([]);
    }
    setSelectedUserIds([]);
  }, [activeTab, selectedRoleId]);

  const filteredRoles = useMemo(() => {
    const kw = (roleSearch || '').trim().toLowerCase();
    if (!kw) return roles;
    return roles.filter((r) => (r.name || '').toLowerCase().includes(kw));
  }, [roles, roleSearch]);

  const filteredRoleUsers = useMemo(() => {
    const kw = (roleUserSearch || '').trim().toLowerCase();
    if (!kw) return roleUsers;
    return roleUsers.filter(
      (u) =>
        (u.username || '').toLowerCase().includes(kw) ||
        (u.realName || '').toLowerCase().includes(kw)
    );
  }, [roleUsers, roleUserSearch]);

  const flatRows = meta?.flatRows || [];
  const actionColumns = meta?.actionColumns || [];
  const modules = meta?.modules || [];

  const setCell = (rowId, actionId, value) => {
    setPermissions((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[rowId]) next[rowId] = {};
      next[rowId][actionId] = !!value;
      return next;
    });
  };

  const getCell = (rowId, actionId) => !!permissions[rowId]?.[actionId];

  const setRowAll = (rowId, value) => {
    actionColumns.forEach((col) => setCell(rowId, col.id, value));
  };

  const setColumnAll = (actionId, value) => {
    flatRows.forEach((row) => setCell(row.id, actionId, value));
  };

  const setModuleAll = (moduleId, actionId, value) => {
    flatRows.filter((r) => r.moduleId === moduleId).forEach((row) => setCell(row.id, actionId, value));
  };

  const isRowAllChecked = (rowId) =>
    actionColumns.length > 0 && actionColumns.every((col) => getCell(rowId, col.id));
  const isRowSomeChecked = (rowId) => actionColumns.some((col) => getCell(rowId, col.id));
  const isModuleRowAllChecked = (moduleId) => {
    const rows = flatRows.filter((r) => r.moduleId === moduleId);
    return rows.length > 0 && rows.every((r) => isRowAllChecked(r.id));
  };

  const handleRowCheckbox = (rowId, row) => {
    let next;
    if (row.isGroup && row.moduleId) {
      next = !isModuleRowAllChecked(row.moduleId);
      flatRows.filter((r) => r.moduleId === row.moduleId).forEach((r) => setRowAll(r.id, next));
    } else {
      next = !isRowAllChecked(rowId);
      setRowAll(rowId, next);
    }
  };

  const handleSave = () => {
    if (!selectedRoleId) return;
    rolePermissionService.updateRolePermissions(selectedRoleId, permissions);
    window.alert('保存成功');
  };

  const handleReset = () => {
    if (!selectedRoleId) return;
    setPermissions(rolePermissionService.getRolePermissions(selectedRoleId));
    window.alert('已重置为上次保存状态');
  };

  const handleRefresh = () => {
    loadRoles();
    loadMeta();
    if (selectedRoleId) setPermissions(rolePermissionService.getRolePermissions(selectedRoleId));
  };

  const handleAddRole = () => {
    const name = (newRoleName || '').trim();
    if (!name) return window.alert('请输入角色名称');
    rolePermissionService.createRole(name);
    setShowAddModal(false);
    setNewRoleName('');
    loadRoles();
  };

  const handleRemoveRoleUser = (u) => {
    if (!window.confirm(`确定移除用户「${u.realName || u.username}」？`)) return;
    setRoleUsers((prev) => prev.filter((x) => x.id !== u.id));
  };

  const handleSaveFieldPermission = () => {
    if (!selectedRoleId) return;
    try {
      const raw = window.localStorage.getItem(FIELD_STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[selectedRoleId] = fieldPerms;
      window.localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(all));
    } catch {}
    window.alert('已保存');
  };

  const handleSaveDataPermission = () => {
    if (!selectedRoleId) return;
    try {
      const raw = window.localStorage.getItem(DATA_STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[selectedRoleId] = { scope: dataScope, perms: dataPerms };
      window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(all));
    } catch {}
    window.alert('已保存');
  };

  const setFieldPerm = (fieldId, optionId) => {
    setFieldPerms((prev) => ({ ...prev, [fieldId]: optionId }));
  };

  const setDataPerm = (functionId, value) => {
    setDataPerms((prev) => ({ ...prev, [functionId]: value }));
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50 p-5">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-xl font-semibold text-gray-800">角色</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 active:bg-gray-200 shadow-sm"
            title="刷新"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 active:bg-gray-200 shadow-sm"
            title="新增"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-1 gap-5 min-h-0">
        {/* 左侧：角色栏 */}
        <div className="w-[280px] flex-shrink-0 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200">
            <span className="text-base font-medium text-gray-800">角色</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleRefresh}
                className="p-1.5 rounded text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                title="刷新"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 rounded text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                title="帮助"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="p-1.5 rounded text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                title="新增"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              placeholder="搜索角色"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredRoles.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRoleId(r.id)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer border-b border-gray-100 ${
                  selectedRoleId === r.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm truncate flex-1">{r.name}</span>
                {selectedRoleId === r.id && (
                  <button type="button" className="p-0.5 rounded hover:bg-blue-100 text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-6 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                    </svg>
                  </button>
                )}
                {r.preset && (
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200 flex-shrink-0">
                    预设
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增角色
            </button>
          </div>
        </div>

        {/* 右侧：Tabs + 内容 */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 px-4 pt-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === t.key
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0 p-4">
            {/* 功能权限 Tab */}
            {activeTab === 'function' && (
              <>
                {!selectedRoleId ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    请先选择左侧角色
                  </div>
                ) : (
                  <div className="flex flex-1 min-h-0 flex flex-col">
                    <div className="flex flex-1 min-h-0 overflow-hidden">
                      <div className="w-[180px] flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
                        {modules.map((mod) => (
                          <div
                            key={mod.id}
                            onClick={() => setSelectedModuleId(mod.id)}
                            className={`relative flex items-center px-3 py-2.5 text-sm cursor-pointer ${
                              selectedModuleId === mod.id
                                ? 'text-blue-600 font-medium bg-blue-50'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {selectedModuleId === mod.id && (
                              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600" />
                            )}
                            <span className="pl-1">{mod.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 min-w-0 overflow-auto border border-gray-200 rounded-lg bg-white">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                              <th className="text-left px-3 py-2.5 font-medium text-gray-600 w-[200px] min-w-[200px] border-r border-gray-200">
                                功能点
                              </th>
                              {actionColumns.map((col) => (
                                <th
                                  key={col.id}
                                  className="px-2 py-2.5 font-medium text-gray-600 text-center whitespace-nowrap w-20 border-r border-gray-200 last:border-r-0"
                                >
                                  <label className="flex items-center justify-center gap-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={
                                        flatRows.length > 0 &&
                                        flatRows.every((row) => getCell(row.id, col.id))
                                      }
                                      onChange={(e) => setColumnAll(col.id, e.target.checked)}
                                      className="rounded border-gray-300 text-blue-600"
                                    />
                                    {col.label}
                                  </label>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {flatRows.map((row) => (
                              <tr
                                key={row.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 ${
                                  row.isGroup ? 'bg-gray-100 font-medium' : ''
                                }`}
                              >
                                <td className="px-3 py-2 text-gray-800 align-middle border-r border-gray-200">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={
                                        row.isGroup
                                          ? isModuleRowAllChecked(row.moduleId)
                                          : isRowAllChecked(row.id)
                                      }
                                      ref={(el) => {
                                        if (el && !row.isGroup)
                                          el.indeterminate =
                                            isRowSomeChecked(row.id) && !isRowAllChecked(row.id);
                                      }}
                                      onChange={() => handleRowCheckbox(row.id, row)}
                                      className="rounded border-gray-300 text-blue-600"
                                    />
                                    <span style={{ paddingLeft: row.level * 16 }}>{row.name}</span>
                                  </label>
                                </td>
                                {actionColumns.map((col) => (
                                  <td
                                    key={col.id}
                                    className="px-2 py-2 text-center align-middle border-r border-gray-200 last:border-r-0"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={getCell(row.id, col.id)}
                                      onChange={(e) => {
                                        if (row.isGroup && row.moduleId) {
                                          setModuleAll(row.moduleId, col.id, e.target.checked);
                                        } else {
                                          setCell(row.id, col.id, e.target.checked);
                                        }
                                      }}
                                      className="rounded border-gray-300 text-blue-600"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {selectedRoleId && (
                      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                        >
                          重置
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          保存
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 角色用户 Tab */}
            {activeTab === 'users' && (
              <div className="flex flex-col h-full min-h-0">
                {!selectedRoleId ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    请先选择左侧角色
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4 mb-4 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          添加用户
                        </button>
                        <button
                          type="button"
                          disabled={selectedUserIds.length === 0}
                          className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          批量移除
                        </button>
                      </div>
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-64">
                        <input
                          type="text"
                          value={roleUserSearch}
                          onChange={(e) => setRoleUserSearch(e.target.value)}
                          placeholder="用户名、真实姓名"
                          className="flex-1 px-3 py-2 text-sm focus:outline-none"
                        />
                        <span className="p-2 text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-auto border border-gray-200 rounded-lg">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <th className="w-10 px-2 py-2.5 border-r border-gray-200">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={
                                  filteredRoleUsers.length > 0 &&
                                  selectedUserIds.length === filteredRoleUsers.length
                                }
                                onChange={(e) => {
                                  if (e.target.checked)
                                    setSelectedUserIds(filteredRoleUsers.map((u) => u.id));
                                  else setSelectedUserIds([]);
                                }}
                              />
                            </th>
                            <th className="text-left px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200">
                              用户名
                            </th>
                            <th className="text-left px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200">
                              真实姓名
                            </th>
                            <th className="text-left px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200">
                              手机号
                            </th>
                            <th className="text-left px-3 py-2.5 font-medium text-gray-600">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRoleUsers.map((u) => (
                            <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-2 py-2 border-r border-gray-200">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300"
                                  checked={selectedUserIds.includes(u.id)}
                                  onChange={(e) => {
                                    if (e.target.checked)
                                      setSelectedUserIds((prev) => [...prev, u.id]);
                                    else setSelectedUserIds((prev) => prev.filter((id) => id !== u.id));
                                  }}
                                />
                              </td>
                              <td className="px-3 py-2 border-r border-gray-200">{u.username}</td>
                              <td className="px-3 py-2 border-r border-gray-200">{u.realName}</td>
                              <td className="px-3 py-2 border-r border-gray-200">{u.phone}</td>
                              <td className="px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRoleUser(u)}
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  移除
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 字段权限 Tab */}
            {activeTab === 'field' && (
              <div className="flex flex-col h-full min-h-0">
                {!selectedRoleId ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    请先选择左侧角色
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-h-0 overflow-auto border border-gray-200 rounded-lg">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <th className="text-left px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200">
                              字段
                            </th>
                            {(fieldMeta?.options || []).map((opt) => (
                              <th
                                key={opt.id}
                                className="text-center px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
                              >
                                {opt.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(fieldMeta?.fields || []).map((f) => (
                            <tr key={f.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-3 py-2 border-r border-gray-200">{f.name}</td>
                              {(fieldMeta?.options || []).map((opt) => (
                                <td
                                  key={opt.id}
                                  className="px-3 py-2 text-center border-r border-gray-200 last:border-r-0"
                                >
                                  <input
                                    type="radio"
                                    name={`field_${f.id}`}
                                    checked={(fieldPerms[f.id] || 'visible') === opt.id}
                                    onChange={() => setFieldPerm(f.id, opt.id)}
                                    className="text-blue-600"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end pt-4 mt-4">
                      <button
                        type="button"
                        onClick={handleSaveFieldPermission}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        保存
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 数据权限 Tab */}
            {activeTab === 'data' && (
              <div className="flex flex-col h-full min-h-0">
                {!selectedRoleId ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    请先选择左侧角色
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-4 flex-shrink-0">
                      {(dataMeta?.subTabs || []).map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setDataSubTab(t.key)}
                          className={`px-3 py-1.5 text-sm rounded-md border ${
                            dataSubTab === t.key
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 min-h-0 overflow-auto space-y-4">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-3">
                          设置该角色下用户可查看的数据范围，权限人可见表示仅能查看自己负责的数据。
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-sm text-gray-700">权限人可见</span>
                          <select
                            value={dataScope}
                            onChange={(e) => setDataScope(e.target.value)}
                            className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {(dataMeta?.scopeOptions || []).map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2 border border-gray-200 rounded bg-gray-100 px-3 py-2 text-sm text-gray-500 min-w-[200px]">
                            <span>部门选择框</span>
                            <button type="button" className="text-gray-400 hover:text-gray-600">
                              添加部门
                            </button>
                            <button type="button" className="text-gray-400 hover:text-gray-600">
                              清空
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="搜索部门"
                            className="border border-gray-200 rounded px-2 py-1 text-sm w-32 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200">
                                模块
                              </th>
                              <th className="text-left px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200">
                                功能
                              </th>
                              <th className="text-center px-3 py-2.5 font-medium text-gray-600 border-r border-gray-200">
                                全部可见
                              </th>
                              <th className="text-center px-3 py-2.5 font-medium text-gray-600">
                                权限人可见
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(dataMeta?.rows || []).map((r) => (
                              <tr key={r.functionId} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-3 py-2 border-r border-gray-200">{r.moduleName}</td>
                                <td className="px-3 py-2 border-r border-gray-200">{r.functionName}</td>
                                <td className="px-3 py-2 text-center border-r border-gray-200">
                                  <input
                                    type="radio"
                                    name={`data_${r.functionId}`}
                                    checked={(dataPerms[r.functionId] || 'all') === 'all'}
                                    onChange={() => setDataPerm(r.functionId, 'all')}
                                    className="text-blue-600"
                                  />
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <input
                                    type="radio"
                                    name={`data_${r.functionId}`}
                                    checked={(dataPerms[r.functionId] || 'all') === 'scope'}
                                    onChange={() => setDataPerm(r.functionId, 'scope')}
                                    className="text-blue-600"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 mt-4 flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleSaveDataPermission}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        保存
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 新增角色 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowAddModal(false)}
            aria-hidden
          />
          <div className="relative bg-white rounded-lg shadow-xl w-[400px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">新增角色</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">角色名称</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="请输入角色名称"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="h-8 px-4 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddRole}
                className="h-8 px-4 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolePermissionPage;
