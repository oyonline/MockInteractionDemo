/** 系统模块 service：用户管理等，内部读 mock 或 localStorage，页面仅调用本层。 */

import * as storage from '../utils/storage';
import { SYSTEM_USERS, SYSTEM_ROLES, SYSTEM_ROLE_PERMISSIONS } from '../utils/storageKeys';
import { getMockUserList, getMockUserMeta, getMockRoleList, getMockPermissionMeta, getMockInitialRolePermissions, getMockFieldPermissionMeta, getMockDataPermissionMeta } from '../mock';

const DEFAULT_PERMISSIONS = {
  roles: [],
  stores: [],
  warehouses: [],
  accounts1688: [],
  plans: [],
  mailboxes: [],
};

function toStatusValue(s) {
  if (s === 'enabled' || s === 'disabled') return s;
  if (s === '启用') return 'enabled';
  if (s === '禁用') return 'disabled';
  return 'enabled';
}

function normalizeUser(u, meta) {
  const next = { ...u };
  next.status = toStatusValue(next.status);
  if (next.mobile && !next.phone) next.phone = next.mobile;
  if (next.keywordField && next.keywordField === 'mobile') next.keywordField = 'phone';
  if (!next.deptId && next.department && meta && Array.isArray(meta.depts)) {
    const d = meta.depts.find((x) => x.name === next.department);
    if (d) next.deptId = d.id;
  }
  if (next.deptId && (!next.department || next.department === '')) {
    const d = meta && Array.isArray(meta.depts) ? meta.depts.find((x) => x.id === next.deptId) : null;
    if (d) next.department = d.name;
  }
  return next;
}

function getUsersData() {
  const meta = getMockUserMeta();
  let list = storage.get(SYSTEM_USERS);
  if (list == null || !Array.isArray(list)) {
    list = getMockUserList();
    storage.set(SYSTEM_USERS, list);
  }
  const normalized = list.map((u) => normalizeUser(u, meta));
  // 若存在历史值（启用/禁用）或缺字段，回写一次（最小成本保证后续筛选一致）
  const changed = normalized.some((u, idx) => JSON.stringify(u) !== JSON.stringify(list[idx]));
  if (changed) storage.set(SYSTEM_USERS, normalized);
  return normalized;
}

function setUsersData(list) {
  storage.set(SYSTEM_USERS, list);
}

function getDateKeyFromDatetime(dt) {
  if (!dt || typeof dt !== 'string') return '';
  return dt.length >= 10 ? dt.slice(0, 10) : '';
}

function inDateRange(dateKey, from, to) {
  if (!from && !to) return true;
  if (!dateKey) return false;
  if (from && dateKey < from) return false;
  if (to && dateKey > to) return false;
  return true;
}

function normalizeKeywordField(f) {
  if (f === 'mobile' || f === 'phone') return 'phone';
  if (f === 'username' || f === 'realName' || f === 'email') return f;
  return 'realName';
}

function normalizeText(v) {
  return String(v ?? '').trim().toLowerCase();
}

export const userService = {
  /** 页面下拉选项等元数据（roles/stores/warehouses/accounts1688/depts/plans） */
  getMeta() {
    return getMockUserMeta();
  },

  /** 按 id 获取单用户，用于编辑页；缺省 permissions 时从旧字段迁移 */
  getUserById(id) {
    const meta = getMockUserMeta();
    const list = getUsersData().slice();
    const u = list.find((x) => x.id === id);
    if (!u) return null;
    const normalized = normalizeUser({ ...u }, meta);
    let permissions = normalized.permissions;
    if (!permissions || typeof permissions !== 'object') {
      permissions = { ...DEFAULT_PERMISSIONS };
      if (normalized.roles) permissions.roles = [].concat(normalized.roles).filter(Boolean);
      if (normalized.storeId) permissions.stores = [normalized.storeId];
      if (normalized.warehouseId) permissions.warehouses = [normalized.warehouseId];
      if (normalized.account1688Id) permissions.accounts1688 = [normalized.account1688Id];
    }
    return { ...normalized, permissions };
  },

  /** 更新用户基础信息与权限勾选（编辑页保存） */
  updateUser(id, patch) {
    const p = { ...patch };
    if (p.permissions && typeof p.permissions === 'object') {
      p.permissions = { ...DEFAULT_PERMISSIONS, ...p.permissions };
    }
    return this.update(id, p);
  },

  list(query = {}) {
    const {
      timeField = 'lastLoginAt',
      dateFrom = '',
      dateTo = '',
      status = '',
      role = '',
      keywordField = 'realName',
      keyword = '',
      exactList,
      storeId = '',
      warehouseId = '',
      account1688Id = '',
      deptId = '',
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    let data = getUsersData().slice();

    // 1) 时间区间
    const tf = timeField === 'createdAt' ? 'createdAt' : 'lastLoginAt';
    const from = String(dateFrom || '').trim();
    const to = String(dateTo || '').trim();
    if (from || to) {
      data = data.filter((u) => inDateRange(getDateKeyFromDatetime(u[tf]), from, to));
    }

    // 2) 状态
    if (status) {
      const st = toStatusValue(status);
      data = data.filter((u) => u.status === st);
    }

    // 3) 角色
    if (role) data = data.filter((u) => String(u.roles || '') === String(role));

    // 4) 更多筛选
    if (storeId) data = data.filter((u) => String(u.storeId || '') === String(storeId));
    if (warehouseId) data = data.filter((u) => String(u.warehouseId || '') === String(warehouseId));
    if (account1688Id) data = data.filter((u) => String(u.account1688Id || '') === String(account1688Id));
    if (deptId) data = data.filter((u) => String(u.deptId || '') === String(deptId));

    // 5) 关键词 / 精确
    const kf = normalizeKeywordField(keywordField);
    const exact = Array.isArray(exactList) ? exactList : [];
    const exactNormalized = exact.map((x) => normalizeText(x)).filter(Boolean);
    if (exactNormalized.length > 0) {
      const set = new Set(exactNormalized);
      data = data.filter((u) => set.has(normalizeText(u[kf])));
    } else {
      const kw = normalizeText(keyword);
      if (kw) {
        data = data.filter((u) => normalizeText(u[kf]).includes(kw));
      }
    }

    // 6) 排序
    if (sortBy) {
      data.sort((a, b) => {
        const av = a[sortBy] || '';
        const bv = b[sortBy] || '';
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortOrder === 'desc' ? -cmp : cmp;
      });
    }

    // 7) 分页
    const total = data.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const list = data.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  create(payload) {
    const meta = getMockUserMeta();
    const list = getUsersData().slice();
    const id = 'u' + Date.now();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const deptId = payload.deptId || (payload.department ? (meta.depts.find((d) => d.name === payload.department)?.id || '') : '');
    const deptName = deptId ? (meta.depts.find((d) => d.id === deptId)?.name || payload.department || '') : (payload.department || '');

    const user = {
      id,
      username: String(payload.username ?? '').trim(),
      realName: String(payload.realName ?? '').trim(),
      phone: String(payload.phone ?? '').trim(),
      email: String(payload.email ?? '').trim(),
      status: toStatusValue(payload.status),
      deptId: deptId || '',
      department: String(deptName ?? '').trim(),
      storeId: String(payload.storeId ?? '').trim(),
      warehouseId: String(payload.warehouseId ?? '').trim(),
      account1688Id: payload.account1688Id ?? '',
      createdAt: now,
      roles: String(payload.roles ?? '').trim(),
      permissionSummary: String(payload.permissionSummary ?? '').trim(),
      loginCount: 0,
      lastLoginAt: null,
      lastLoginIp: null,
      thirdPartyAuth: payload.thirdPartyAuth ?? null,
    };
    list.push(user);
    setUsersData(list);
    return user;
  },

  update(id, patch) {
    const meta = getMockUserMeta();
    const list = getUsersData().slice();
    const idx = list.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const next = { ...list[idx], ...patch };
    if (patch.status != null) next.status = toStatusValue(patch.status);

    // deptId/department 双向补齐（不强制页面改表单字段）
    if (patch.deptId != null && patch.deptId !== '') {
      const d = meta.depts.find((x) => x.id === patch.deptId);
      if (d) next.department = d.name;
    } else if (patch.department != null && patch.department !== '') {
      const d = meta.depts.find((x) => x.name === patch.department);
      if (d) next.deptId = d.id;
    }

    list[idx] = next;
    setUsersData(list);
    return next;
  },

  updateStatus(id, status) {
    return this.update(id, { status: toStatusValue(status) });
  },

  remove(id) {
    const list = getUsersData().filter((u) => u.id !== id);
    setUsersData(list);
  },

  resetPassword(id, newPassword) {
    // 原型只记录，不落库密码
    return this.update(id, {});
  },

  batchOperate({ ids, action }) {
    const list = getUsersData().slice();
    if (action === 'delete') {
      const next = list.filter((u) => !ids.includes(u.id));
      setUsersData(next);
      return;
    }
    const st = action === 'enable' ? 'enabled' : 'disabled';
    list.forEach((u) => {
      if (ids.includes(u.id)) u.status = st;
    });
    setUsersData(list);
  },

  handover({ fromUserId, toUserId, scope }) {
    // 原型：仅逻辑存在，可写日志或 toast
  },

  reset() {
    const list = getMockUserList();
    setUsersData(list);
  },
};

// ---------- 角色与权限 ----------
function getRolesData() {
  let list = storage.get(SYSTEM_ROLES);
  if (list == null || !Array.isArray(list)) {
    list = getMockRoleList();
    storage.set(SYSTEM_ROLES, list);
  }
  return list;
}

function setRolesData(list) {
  storage.set(SYSTEM_ROLES, list);
}

function getPermissionsData() {
  let data = storage.get(SYSTEM_ROLE_PERMISSIONS);
  if (data == null || typeof data !== 'object') {
    data = getMockInitialRolePermissions();
    storage.set(SYSTEM_ROLE_PERMISSIONS, data);
  }
  return data;
}

function setPermissionsData(data) {
  storage.set(SYSTEM_ROLE_PERMISSIONS, data);
}

export const rolePermissionService = {
  getRoles() {
    return getRolesData().map((r) => ({ ...r }));
  },

  createRole(name) {
    const list = getRolesData().slice();
    const id = 'role_' + Date.now();
    list.push({ id, name: String(name || '').trim(), preset: false });
    setRolesData(list);
    return list[list.length - 1];
  },

  getPermissionMeta() {
    return getMockPermissionMeta();
  },

  getFieldPermissionMeta() {
    return getMockFieldPermissionMeta();
  },

  getDataPermissionMeta() {
    return getMockDataPermissionMeta();
  },

  getRolePermissions(roleId) {
    const data = getPermissionsData();
    const rolePerms = data[roleId];
    if (rolePerms && typeof rolePerms === 'object') return JSON.parse(JSON.stringify(rolePerms));
    const meta = getMockPermissionMeta();
    const empty = {};
    (meta.flatRows || []).forEach((row) => {
      empty[row.id] = {};
      (meta.actionColumns || []).forEach((col) => {
        empty[row.id][col.id] = false;
      });
    });
    return empty;
  },

  updateRolePermissions(roleId, permissions) {
    const data = getPermissionsData();
    const next = { ...data, [roleId]: permissions };
    setPermissionsData(next);
  },
};
