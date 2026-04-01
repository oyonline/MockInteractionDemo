/** 系统模块 service：用户管理与角色权限统一走 mock + localStorage 封装。 */

import * as storage from '../utils/storage';
import {
  SYSTEM_USERS,
  SYSTEM_ROLES,
  SYSTEM_ROLE_PERMISSIONS,
  SYSTEM_ROLE_FIELD_PERMISSIONS,
  SYSTEM_ROLE_DATA_PERMISSIONS,
} from '../utils/storageKeys';
import {
  getMockUserList,
  getMockUserMeta,
  getMockRoleList,
  getMockPermissionMeta,
  getMockInitialRolePermissions,
  getMockFieldPermissionMeta,
  getMockDataPermissionMeta,
} from '../mock';

const DEFAULT_PERMISSIONS = {
  roles: [],
  stores: [],
  warehouses: [],
  accounts1688: [],
  plans: [],
  mailboxes: [],
};

const ROLE_NAME_ALIASES = {
  role_admin: ['管理员', '系统管理员'],
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function toStatusValue(s) {
  if (s === 'enabled' || s === 'disabled') return s;
  if (s === '启用') return 'enabled';
  if (s === '禁用') return 'disabled';
  return 'enabled';
}

function normalizeText(v) {
  return String(v ?? '').trim().toLowerCase();
}

function splitRoleText(value) {
  return String(value || '')
    .split(/[、,，/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeRolesData(list) {
  const defaults = getMockRoleList();
  const currentList = Array.isArray(list) ? list : [];
  const currentById = new Map(currentList.filter((item) => item && item.id).map((item) => [item.id, item]));
  const merged = defaults.map((item) => ({
    ...item,
    ...(currentById.get(item.id) || {}),
    name: item.name,
    preset: item.preset,
  }));

  currentList.forEach((item) => {
    if (!item || !item.id) return;
    if (defaults.some((base) => base.id === item.id)) return;
    merged.push({ ...item });
  });

  return merged;
}

function getRolesData() {
  let list = storage.get(SYSTEM_ROLES);
  if (list == null || !Array.isArray(list)) {
    list = getMockRoleList();
  }
  const normalized = normalizeRolesData(list);
  if (JSON.stringify(normalized) !== JSON.stringify(list)) {
    storage.set(SYSTEM_ROLES, normalized);
  }
  return normalized;
}

function setRolesData(list) {
  storage.set(SYSTEM_ROLES, normalizeRolesData(list));
}

function getRoleById(roleId) {
  return getRolesData().find((item) => item.id === roleId) || null;
}

function getAllRoleNames(role) {
  const names = [role?.name, ...(ROLE_NAME_ALIASES[role?.id] || [])].filter(Boolean);
  return Array.from(new Set(names));
}

function findRoleByValue(value) {
  const normalizedValue = normalizeText(value);
  if (!normalizedValue) return null;
  return (
    getRolesData().find((role) => {
      if (normalizeText(role.id) === normalizedValue) return true;
      return getAllRoleNames(role).some((name) => normalizeText(name) === normalizedValue);
    }) || null
  );
}

function normalizeRoleIds(values) {
  const ids = [];
  const seen = new Set();
  [].concat(values || []).forEach((value) => {
    const role = findRoleByValue(value);
    const nextId = role?.id || String(value || '').trim();
    if (!nextId || seen.has(nextId)) return;
    seen.add(nextId);
    ids.push(nextId);
  });
  return ids;
}

function getRoleNamesByIds(roleIds) {
  return normalizeRoleIds(roleIds)
    .map((roleId) => getRoleById(roleId)?.name || roleId)
    .filter(Boolean);
}

function normalizeUserPermissions(user) {
  const currentPermissions =
    user.permissions && typeof user.permissions === 'object'
      ? { ...DEFAULT_PERMISSIONS, ...clone(user.permissions) }
      : { ...DEFAULT_PERMISSIONS };
  const fallbackRoleIds = splitRoleText(user.roles);
  const roleIds = normalizeRoleIds(currentPermissions.roles.length > 0 ? currentPermissions.roles : fallbackRoleIds);
  currentPermissions.roles = roleIds;
  if (!currentPermissions.stores.length && user.storeId) currentPermissions.stores = [user.storeId];
  if (!currentPermissions.warehouses.length && user.warehouseId) currentPermissions.warehouses = [user.warehouseId];
  if (!currentPermissions.accounts1688.length && user.account1688Id) currentPermissions.accounts1688 = [user.account1688Id];
  return currentPermissions;
}

function syncUserRoleState(user) {
  const permissions = normalizeUserPermissions(user);
  const roleNames = getRoleNamesByIds(permissions.roles);
  const primaryRoleId = permissions.roles[0] || '';
  const primaryRole = getRoleById(primaryRoleId);
  return {
    ...user,
    permissions,
    roles: roleNames.join('、'),
    roleId: primaryRoleId,
    roleName: primaryRole?.name || roleNames[0] || '',
  };
}

function getNormalizedUserMeta() {
  const mockMeta = getMockUserMeta();
  return {
    ...mockMeta,
    roles: getRolesData().map((role) => ({
      id: role.id,
      name: role.name,
      isPreset: !!role.preset,
    })),
  };
}

function normalizeUser(user, meta) {
  const next = { ...user };
  next.status = toStatusValue(next.status);
  if (next.mobile && !next.phone) next.phone = next.mobile;
  if (next.keywordField && next.keywordField === 'mobile') next.keywordField = 'phone';
  if (!next.deptId && next.department && meta && Array.isArray(meta.depts)) {
    const dept = meta.depts.find((item) => item.name === next.department);
    if (dept) next.deptId = dept.id;
  }
  if (next.deptId && (!next.department || next.department === '')) {
    const dept = meta && Array.isArray(meta.depts) ? meta.depts.find((item) => item.id === next.deptId) : null;
    if (dept) next.department = dept.name;
  }
  return syncUserRoleState(next);
}

function getUsersData() {
  const meta = getNormalizedUserMeta();
  let list = storage.get(SYSTEM_USERS);
  if (list == null || !Array.isArray(list)) {
    list = getMockUserList();
  }
  const normalized = list.map((item) => normalizeUser(item, meta));
  if (JSON.stringify(normalized) !== JSON.stringify(list)) {
    storage.set(SYSTEM_USERS, normalized);
  }
  return normalized;
}

function setUsersData(list) {
  const meta = getNormalizedUserMeta();
  storage.set(
    SYSTEM_USERS,
    list.map((item) => normalizeUser(item, meta))
  );
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

function getPermissionsData() {
  let data = storage.get(SYSTEM_ROLE_PERMISSIONS);
  if (data == null || typeof data !== 'object') {
    data = getMockInitialRolePermissions();
  }
  const next = { ...getMockInitialRolePermissions(), ...data };
  if (JSON.stringify(next) !== JSON.stringify(data)) {
    storage.set(SYSTEM_ROLE_PERMISSIONS, next);
  }
  return next;
}

function setPermissionsData(data) {
  storage.set(SYSTEM_ROLE_PERMISSIONS, data);
}

function getFieldPermissionsData() {
  const data = storage.get(SYSTEM_ROLE_FIELD_PERMISSIONS);
  return data && typeof data === 'object' ? data : {};
}

function setFieldPermissionsData(data) {
  storage.set(SYSTEM_ROLE_FIELD_PERMISSIONS, data);
}

function getDataPermissionsData() {
  const data = storage.get(SYSTEM_ROLE_DATA_PERMISSIONS);
  return data && typeof data === 'object' ? data : {};
}

function setDataPermissionsData(data) {
  storage.set(SYSTEM_ROLE_DATA_PERMISSIONS, data);
}

function buildEmptyRolePermissions() {
  const meta = getMockPermissionMeta();
  const empty = {};
  (meta.flatRows || []).forEach((row) => {
    empty[row.id] = {};
    (meta.actionColumns || []).forEach((col) => {
      empty[row.id][col.id] = false;
    });
  });
  return empty;
}

function getDefaultFieldPermissions() {
  const meta = getMockFieldPermissionMeta();
  return (meta.fields || []).reduce((acc, field) => {
    acc[field.id] = 'visible';
    return acc;
  }, {});
}

function getDefaultDataPermissionState() {
  const meta = getMockDataPermissionMeta();
  return {
    scope: meta.scopeOptions?.[0]?.id || 'self',
    perms: (meta.rows || []).reduce((acc, row) => {
      acc[row.functionId] = 'all';
      return acc;
    }, {}),
  };
}

function getNormalizedRoleUsers(roleId) {
  return getUsersData()
    .filter((user) => user.permissions?.roles?.includes(roleId))
    .map((user) => ({
      id: user.id,
      username: user.username,
      realName: user.realName,
      phone: user.phone,
      email: user.email,
      department: user.department,
    }));
}

export const userService = {
  /** 页面下拉元数据继续来自 mock/service，本次不引入真实接口。 */
  getMeta() {
    return getNormalizedUserMeta();
  },

  getUserById(id) {
    return getUsersData().find((item) => item.id === id) || null;
  },

  updateUser(id, patch) {
    const nextPatch = { ...patch };
    if (nextPatch.permissions && typeof nextPatch.permissions === 'object') {
      nextPatch.permissions = { ...DEFAULT_PERMISSIONS, ...clone(nextPatch.permissions) };
    }
    return this.update(id, nextPatch);
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

    const tf = timeField === 'createdAt' ? 'createdAt' : 'lastLoginAt';
    const from = String(dateFrom || '').trim();
    const to = String(dateTo || '').trim();
    if (from || to) {
      data = data.filter((item) => inDateRange(getDateKeyFromDatetime(item[tf]), from, to));
    }

    if (status) {
      const targetStatus = toStatusValue(status);
      data = data.filter((item) => item.status === targetStatus);
    }

    if (role) {
      const roleIds = normalizeRoleIds([role]);
      data = data.filter((item) => roleIds.some((roleId) => item.permissions?.roles?.includes(roleId)));
    }

    if (storeId) data = data.filter((item) => String(item.storeId || '') === String(storeId));
    if (warehouseId) data = data.filter((item) => String(item.warehouseId || '') === String(warehouseId));
    if (account1688Id) data = data.filter((item) => String(item.account1688Id || '') === String(account1688Id));
    if (deptId) data = data.filter((item) => String(item.deptId || '') === String(deptId));

    const kf = normalizeKeywordField(keywordField);
    const exact = Array.isArray(exactList) ? exactList : [];
    const exactNormalized = exact.map((item) => normalizeText(item)).filter(Boolean);
    if (exactNormalized.length > 0) {
      const values = new Set(exactNormalized);
      data = data.filter((item) => values.has(normalizeText(item[kf])));
    } else {
      const normalizedKeyword = normalizeText(keyword);
      if (normalizedKeyword) {
        data = data.filter((item) => normalizeText(item[kf]).includes(normalizedKeyword));
      }
    }

    if (sortBy) {
      data.sort((a, b) => {
        const av = a[sortBy] || '';
        const bv = b[sortBy] || '';
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortOrder === 'desc' ? -cmp : cmp;
      });
    }

    const total = data.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const list = data.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  create(payload) {
    const meta = getNormalizedUserMeta();
    const list = getUsersData().slice();
    const id = 'u' + Date.now();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const deptId =
      payload.deptId ||
      (payload.department ? meta.depts.find((dept) => dept.name === payload.department)?.id || '' : '');
    const deptName = deptId
      ? meta.depts.find((dept) => dept.id === deptId)?.name || payload.department || ''
      : payload.department || '';
    const roleIds = normalizeRoleIds([payload.roles]);

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
      roles: getRoleNamesByIds(roleIds).join('、'),
      permissionSummary: String(payload.permissionSummary ?? '').trim(),
      loginCount: 0,
      lastLoginAt: null,
      lastLoginIp: null,
      thirdPartyAuth: payload.thirdPartyAuth ?? null,
      permissions: { ...DEFAULT_PERMISSIONS, roles: roleIds },
    };
    list.push(user);
    setUsersData(list);
    return user;
  },

  update(id, patch) {
    const meta = getNormalizedUserMeta();
    const list = getUsersData().slice();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const current = list[index];
    const next = {
      ...current,
      ...patch,
      permissions:
        patch.permissions && typeof patch.permissions === 'object'
          ? { ...DEFAULT_PERMISSIONS, ...clone(patch.permissions) }
          : current.permissions,
    };

    if (patch.status != null) next.status = toStatusValue(patch.status);

    if (patch.deptId != null && patch.deptId !== '') {
      const dept = meta.depts.find((item) => item.id === patch.deptId);
      if (dept) next.department = dept.name;
    } else if (patch.department != null && patch.department !== '') {
      const dept = meta.depts.find((item) => item.name === patch.department);
      if (dept) next.deptId = dept.id;
    }

    if (patch.roles != null && (!patch.permissions || typeof patch.permissions !== 'object')) {
      next.permissions = {
        ...DEFAULT_PERMISSIONS,
        ...(current.permissions || {}),
        roles: normalizeRoleIds([patch.roles]),
      };
    }

    list[index] = syncUserRoleState(next);
    setUsersData(list);
    return list[index];
  },

  updateStatus(id, status) {
    return this.update(id, { status: toStatusValue(status) });
  },

  remove(id) {
    setUsersData(getUsersData().filter((item) => item.id !== id));
  },

  resetPassword(id, newPassword) {
    return this.update(id, {});
  },

  batchOperate({ ids, action }) {
    const list = getUsersData().slice();
    if (action === 'delete') {
      setUsersData(list.filter((item) => !ids.includes(item.id)));
      return;
    }

    const nextStatus = action === 'enable' ? 'enabled' : 'disabled';
    list.forEach((item) => {
      if (ids.includes(item.id)) item.status = nextStatus;
    });
    setUsersData(list);
  },

  handover({ fromUserId, toUserId, scope }) {
    return { fromUserId, toUserId, scope };
  },

  reset() {
    setUsersData(getMockUserList());
  },
};

export const rolePermissionService = {
  getRoles() {
    return getRolesData().map((item) => ({ ...item }));
  },

  createRole(name) {
    const list = getRolesData().slice();
    const nextRole = { id: 'role_' + Date.now(), name: String(name || '').trim(), preset: false };
    list.push(nextRole);
    setRolesData(list);
    return { ...nextRole };
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
    const rolePermissions = data[roleId];
    return rolePermissions && typeof rolePermissions === 'object' ? clone(rolePermissions) : buildEmptyRolePermissions();
  },

  updateRolePermissions(roleId, permissions) {
    const next = { ...getPermissionsData(), [roleId]: clone(permissions) };
    setPermissionsData(next);
    return this.getRolePermissions(roleId);
  },

  getRoleUsers(roleId) {
    return getNormalizedRoleUsers(roleId);
  },

  removeRoleUsers(roleId, userIds) {
    const list = getUsersData().slice();
    let changed = false;
    list.forEach((user, index) => {
      if (!userIds.includes(user.id)) return;
      if (!user.permissions?.roles?.includes(roleId)) return;
      changed = true;
      const nextRoleIds = user.permissions.roles.filter((item) => item !== roleId);
      list[index] = syncUserRoleState({
        ...user,
        permissions: {
          ...DEFAULT_PERMISSIONS,
          ...clone(user.permissions),
          roles: nextRoleIds,
        },
      });
    });
    if (changed) setUsersData(list);
    return this.getRoleUsers(roleId);
  },

  getFieldPermissions(roleId) {
    const all = getFieldPermissionsData();
    return {
      ...getDefaultFieldPermissions(),
      ...(all[roleId] || {}),
    };
  },

  updateFieldPermissions(roleId, permissions) {
    const all = getFieldPermissionsData();
    all[roleId] = { ...getDefaultFieldPermissions(), ...clone(permissions) };
    setFieldPermissionsData(all);
    return this.getFieldPermissions(roleId);
  },

  getDataPermissions(roleId) {
    const all = getDataPermissionsData();
    const current = all[roleId] || {};
    const defaults = getDefaultDataPermissionState();
    return {
      scope: current.scope || defaults.scope,
      perms: { ...defaults.perms, ...(current.perms || {}) },
    };
  },

  updateDataPermissions(roleId, payload) {
    const all = getDataPermissionsData();
    const defaults = getDefaultDataPermissionState();
    all[roleId] = {
      scope: payload?.scope || defaults.scope,
      perms: { ...defaults.perms, ...(payload?.perms || {}) },
    };
    setDataPermissionsData(all);
    return this.getDataPermissions(roleId);
  },
};
