/** 系统设置 service：params/dict/log 等，内部读 mock 或 localStorage，页面仅调用本层。 */

import * as storage from '../utils/storage';
import { SETTINGS_PARAMS, SETTINGS_LOG, SETTINGS_SYNC, SETTINGS_SCHEDULER, SETTINGS_DICT, SETTINGS_BASIC, SETTINGS_ENUM } from '../utils/storageKeys';
import { getMockParamsList, getMockLogList, getMockSyncList, getMockSchedulerList, getMockDictData, getMockBasicConfig, getMockEnumRules } from '../mock';

function now() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

/** 读取 params 列表：优先 storage，为空则用 mock 初始化并写入。 */
function getParamsData() {
  let list = storage.get(SETTINGS_PARAMS);
  if (list == null || !Array.isArray(list)) {
    list = getMockParamsList();
    storage.set(SETTINGS_PARAMS, list);
  }
  return list;
}

/** 写入 params 列表。 */
function setParamsData(list) {
  storage.set(SETTINGS_PARAMS, list);
}

export const settingsParams = {
  /**
   * @param {{ keyword?: string, status?: string, page?: number, pageSize?: number }} query
   * @returns {{ list: any[], total: number }}
   */
  list(query = {}) {
    const { keyword = '', status = '', page = 1, pageSize = 10 } = query;
    const data = getParamsData();
    let filtered = data;
    const kw = String(keyword).trim().toLowerCase();
    if (kw) {
      filtered = filtered.filter(
        (item) =>
          (item.key && item.key.toLowerCase().includes(kw)) ||
          (item.value && String(item.value).toLowerCase().includes(kw)) ||
          (item.desc && item.desc.toLowerCase().includes(kw)) ||
          (item.group && item.group.toLowerCase().includes(kw))
      );
    }
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }
    const total = filtered.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const list = filtered.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  /**
   * @param {string} id
   * @returns {any | null}
   */
  get(id) {
    const data = getParamsData();
    return data.find((item) => item.id === id) ?? null;
  },

  /**
   * @param {{ group?: string, key: string, value: string, desc?: string, status?: string }} payload
   * @returns {any} 新创建的对象
   */
  create(payload) {
    const data = getParamsData();
    const id = 'p' + Date.now();
    const updatedAt = now();
    const item = {
      id,
      group: payload.group ?? 'general',
      key: payload.key ?? '',
      value: payload.value ?? '',
      desc: payload.desc ?? '',
      status: payload.status ?? 'enabled',
      updatedAt,
    };
    data.push(item);
    setParamsData(data);
    return item;
  },

  /**
   * @param {string} id
   * @param {Partial<{ group: string, key: string, value: string, desc: string, status: string }>} patch
   * @returns {any} 更新后的对象，未找到返回 null
   */
  update(id, patch) {
    const data = getParamsData();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...data[index], ...patch, updatedAt: now() };
    data[index] = updated;
    setParamsData(data);
    return updated;
  },

  /**
   * @param {string} id
   */
  remove(id) {
    const data = getParamsData().filter((item) => item.id !== id);
    setParamsData(data);
  },

  /** 清空 SETTINGS_PARAMS 并用 mock 回填（开发阶段用）。 */
  reset() {
    storage.remove(SETTINGS_PARAMS);
    const list = getMockParamsList();
    storage.set(SETTINGS_PARAMS, list);
  },
};

// --------------- settingsLog ---------------
function getLogData() {
  let list = storage.get(SETTINGS_LOG);
  if (list == null || !Array.isArray(list)) {
    list = getMockLogList();
    storage.set(SETTINGS_LOG, list);
  }
  return list;
}

function setLogData(list) {
  storage.set(SETTINGS_LOG, list);
}

export const settingsLog = {
  /**
   * @param {{ keyword?: string, module?: string, result?: string, page?: number, pageSize?: number }} query
   * @returns {{ list: any[], total: number }}
   */
  list(query = {}) {
    const { keyword = '', module: mod = '', result: res = '', page = 1, pageSize = 10 } = query;
    let data = getLogData().slice();
    const kw = String(keyword).trim().toLowerCase();
    if (kw) {
      data = data.filter(
        (item) =>
          (item.message && item.message.toLowerCase().includes(kw)) ||
          (item.module && item.module.toLowerCase().includes(kw)) ||
          (item.action && item.action.toLowerCase().includes(kw))
      );
    }
    if (mod) data = data.filter((item) => item.module === mod);
    if (res) data = data.filter((item) => item.result === res);
    data.sort((a, b) => (b.time || '').localeCompare(a.time || ''));
    const total = data.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const list = data.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  get(id) {
    const data = getLogData();
    return data.find((item) => item.id === id) ?? null;
  },

  /**
   * 追加一条日志（供 sync/scheduler 等写日志）。自动生成 id、time，默认 operator='system'。
   * @param {{ module: string, action: string, result: 'success'|'fail', operator?: string, message: string, detail?: object }} entryPartial
   * @returns {any} 新写入的条目
   */
  append(entryPartial) {
    const list = getLogData().slice();
    const id = 'log' + Date.now();
    const time = new Date().toISOString();
    const entry = {
      id,
      time,
      module: entryPartial.module ?? '',
      action: entryPartial.action ?? '',
      result: entryPartial.result ?? 'success',
      operator: entryPartial.operator ?? 'system',
      message: entryPartial.message ?? '',
      detail: entryPartial.detail != null ? entryPartial.detail : {},
    };
    list.unshift(entry);
    setLogData(list);
    return entry;
  },

  /** 清空日志（写入空数组）。 */
  clear() {
    setLogData([]);
  },

  /** 回填 mock 初始数据。 */
  reset() {
    const list = getMockLogList();
    storage.set(SETTINGS_LOG, list);
  },
};

// --------------- settingsSync ---------------
function getSyncData() {
  let list = storage.get(SETTINGS_SYNC);
  if (list == null || !Array.isArray(list)) {
    list = getMockSyncList();
    storage.set(SETTINGS_SYNC, list);
  }
  return list;
}

function setSyncData(list) {
  storage.set(SETTINGS_SYNC, list);
}

export const settingsSync = {
  /**
   * @param {{ keyword?: string, page?: number, pageSize?: number }} query
   * @returns {{ list: any[], total: number }}
   */
  list(query = {}) {
    const { keyword = '', page = 1, pageSize = 10 } = query;
    let data = getSyncData().slice();
    const kw = String(keyword).trim().toLowerCase();
    if (kw) {
      data = data.filter((item) => {
        const resultStr = item.lastResult == null ? '' : typeof item.lastResult === 'string' ? item.lastResult : (item.lastResult.summary || '');
        return (item.name && item.name.toLowerCase().includes(kw)) || (item.endpoint && item.endpoint.toLowerCase().includes(kw)) || resultStr.toLowerCase().includes(kw);
      });
    }
    const total = data.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const list = data.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  get(id) {
    const data = getSyncData();
    return data.find((item) => item.id === id) ?? null;
  },

  /**
   * 执行一次同步（模拟）：先置 running 写回，延迟后随机 success/partial/timeout/error，更新 job 并写日志。
   * @param {string} id - 任务 id
   * @param {{ retryMode?: 'failed'|'all', isRetry?: boolean }} [options] - retryMode 默认 'failed'；isRetry 为 true 时日志 message 含失败项/全量重试
   * @returns {Promise<any>} 更新后的 job
   */
  runSync(id, options = {}) {
    const retryMode = options.retryMode === 'all' ? 'all' : 'failed';
    const isRetry = options.isRetry === true;
    const list = getSyncData().slice();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return Promise.reject(new Error('任务不存在'));
    const job = list[index];
    job.status = 'running';
    setSyncData(list);

    const roll = Math.random();
    const isTimeout = roll >= 0.85 && roll < 0.95;
    const isError = roll >= 0.95;
    const isPartial = roll >= 0.7 && roll < 0.85;
    const delayMs = isTimeout ? 1500 + Math.floor(Math.random() * 1500) : 300 + Math.floor(Math.random() * 500);

    return new Promise((resolve) => {
      setTimeout(() => {
        const lastRunAt = new Date().toISOString();
        const total = 50 + Math.floor(Math.random() * 151);
        let status;
        let lastResult;

        if (isTimeout) {
          status = 'fail';
          lastResult = { type: 'timeout', summary: '请求超时，部分商品未能同步成功', errorCode: 'TIMEOUT', retryable: true };
        } else if (isError) {
          status = 'fail';
          const codes = ['NETWORK', 'VALIDATION', 'UNKNOWN'];
          lastResult = { type: 'error', summary: '同步失败（' + codes[Math.floor(Math.random() * 3)] + '）', errorCode: codes[Math.floor(Math.random() * 3)], retryable: true };
        } else if (isPartial) {
          status = 'success';
          const fail = 1 + Math.min(9, Math.floor(Math.random() * (total * 0.2)));
          const success = total - fail;
          const details = [];
          for (let i = 0; i < Math.min(fail, 5); i++) details.push('SKU ' + (10000 + i) + '：请求超时');
          if (fail > 5) details.push('SKU 10005：校验失败');
          lastResult = { type: 'partial', summary: '部分商品未能同步成功', stats: { total, success, fail }, details, retryable: true };
        } else {
          status = 'success';
          lastResult = { type: 'success', summary: '同步成功', stats: { total, success: total, fail: 0 } };
        }

        const data2 = getSyncData().slice();
        const idx = data2.findIndex((item) => item.id === id);
        if (idx !== -1) {
          data2[idx].status = status;
          data2[idx].lastRunAt = lastRunAt;
          data2[idx].durationMs = delayMs;
          data2[idx].lastResult = lastResult;
          setSyncData(data2);
        }
        const updated = data2[idx] || job;

        const logResult = status === 'success' ? 'success' : 'fail';
        const retrySuffix = isRetry ? (retryMode === 'failed' ? '（失败项重试）' : '（全量重试）') : '';
        let message;
        if (lastResult.type === 'success') message = `接口同步成功：${job.name}${retrySuffix}`;
        else if (lastResult.type === 'partial') message = `接口同步部分成功：${job.name}${retrySuffix}（成功 ${lastResult.stats.success} / 失败 ${lastResult.stats.fail}）`;
        else if (lastResult.type === 'timeout') message = `接口同步超时：${job.name}（部分数据未同步）${retrySuffix}`;
        else message = `接口同步失败：${job.name}（${lastResult.errorCode || 'UNKNOWN'}）${retrySuffix}`;

        settingsLog.append({
          module: 'settings-sync',
          action: 'sync',
          result: logResult,
          message,
          detail: { jobId: id, name: job.name, endpoint: job.endpoint, type: lastResult.type, stats: lastResult.stats, errorCode: lastResult.errorCode, durationMs: delayMs, retryMode: isRetry ? retryMode : undefined },
        });
        resolve(updated);
      }, delayMs);
    });
  },

  /** 回填 mock 初始数据。 */
  reset() {
    const list = getMockSyncList();
    storage.set(SETTINGS_SYNC, list);
  },
};

// --------------- settingsScheduler ---------------
function getSchedulerData() {
  let list = storage.get(SETTINGS_SCHEDULER);
  if (list == null || !Array.isArray(list)) {
    list = getMockSchedulerList();
    storage.set(SETTINGS_SCHEDULER, list);
  }
  return list;
}

function setSchedulerData(list) {
  storage.set(SETTINGS_SCHEDULER, list);
}

export const settingsScheduler = {
  list(query = {}) {
    const { keyword = '', page = 1, pageSize = 10 } = query;
    let data = getSchedulerData().slice();
    const kw = String(keyword).trim().toLowerCase();
    if (kw) {
      data = data.filter((item) => {
        const resultStr = item.lastResult == null ? '' : typeof item.lastResult === 'string' ? item.lastResult : (item.lastResult.summary || '');
        return (item.name && item.name.toLowerCase().includes(kw)) || (item.cron && item.cron.toLowerCase().includes(kw)) || resultStr.toLowerCase().includes(kw);
      });
    }
    const total = data.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const list = data.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  get(id) {
    const data = getSchedulerData();
    return data.find((item) => item.id === id) ?? null;
  },

  /** 启用/停用切换；running 时不操作。 */
  toggle(id) {
    const list = getSchedulerData().slice();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    const task = list[idx];
    if (task.status === 'running') return task;
    const next = task.status === 'enabled' ? 'disabled' : 'enabled';
    task.status = next;
    setSchedulerData(list);
    settingsLog.append({
      module: 'settings-scheduler',
      action: 'toggle',
      result: 'success',
      message: next === 'enabled' ? `任务启用：${task.name}` : `任务停用：${task.name}`,
      detail: { taskId: id, name: task.name, cron: task.cron, status: next },
    });
    return task;
  },

  /**
   * 立即执行（模拟）：先置 running，延迟后随机结果，更新任务并写日志。
   * @param {string} id
   * @returns {Promise<any>}
   */
  run(id) {
    const list = getSchedulerData().slice();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) return Promise.reject(new Error('任务不存在'));
    const task = list[idx];
    const previousStatus = task.status === 'enabled' ? 'enabled' : 'disabled';
    task.status = 'running';
    setSchedulerData(list);

    const roll = Math.random();
    const isTimeout = roll >= 0.85 && roll < 0.95;
    const isError = roll >= 0.95;
    const isPartial = roll >= 0.7 && roll < 0.85;
    const delayMs = isTimeout ? 1500 + Math.floor(Math.random() * 1500) : 300 + Math.floor(Math.random() * 500);

    return new Promise((resolve) => {
      setTimeout(() => {
        const lastRunAt = new Date().toISOString();
        const nextRunAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
        const total = 50 + Math.floor(Math.random() * 151);
        let lastResult;

        if (isTimeout) {
          lastResult = { type: 'timeout', summary: '执行超时', errorCode: 'TIMEOUT', retryable: true };
        } else if (isError) {
          const codes = ['NETWORK', 'UNKNOWN'];
          lastResult = { type: 'error', summary: '执行失败（' + codes[Math.floor(Math.random() * 2)] + '）', errorCode: codes[Math.floor(Math.random() * 2)], retryable: true };
        } else if (isPartial) {
          const fail = 1 + Math.min(9, Math.floor(Math.random() * (total * 0.2)));
          lastResult = { type: 'partial', summary: '部分成功', stats: { total, success: total - fail, fail }, details: ['项 10001：超时'], retryable: true };
        } else {
          lastResult = { type: 'success', summary: '执行成功', stats: { total, success: total, fail: 0 } };
        }

        const data2 = getSchedulerData().slice();
        const i = data2.findIndex((item) => item.id === id);
        if (i !== -1) {
          data2[i].status = previousStatus;
          data2[i].lastRunAt = lastRunAt;
          data2[i].nextRunAt = nextRunAt;
          data2[i].durationMs = delayMs;
          data2[i].lastResult = lastResult;
          setSchedulerData(data2);
        }
        const updated = data2[i] || task;

        const logResult = lastResult.type === 'success' ? 'success' : 'fail';
        let message;
        if (lastResult.type === 'success') message = `定时任务执行成功：${task.name}`;
        else if (lastResult.type === 'partial') message = `定时任务部分成功：${task.name}（成功 ${lastResult.stats.success} / 失败 ${lastResult.stats.fail}）`;
        else if (lastResult.type === 'timeout') message = `定时任务执行超时：${task.name}`;
        else message = `定时任务执行失败：${task.name}（${lastResult.errorCode || 'UNKNOWN'}）`;

        settingsLog.append({
          module: 'settings-scheduler',
          action: 'run',
          result: logResult,
          message,
          detail: { taskId: id, name: task.name, cron: task.cron, type: lastResult.type, stats: lastResult.stats, errorCode: lastResult.errorCode, durationMs: delayMs },
        });
        resolve(updated);
      }, delayMs);
    });
  },

  reset() {
    const list = getMockSchedulerList();
    storage.set(SETTINGS_SCHEDULER, list);
  },
};

// --------------- settingsDict ---------------
function getDictData() {
  let data = storage.get(SETTINGS_DICT);
  if (data == null || !data.types || !data.items) {
    data = getMockDictData();
    storage.set(SETTINGS_DICT, data);
  }
  return data;
}

function setDictData(data) {
  storage.set(SETTINGS_DICT, data);
}

export const settingsDict = {
  listTypes(query = {}) {
    const { keyword = '', status = '' } = query;
    const { types } = getDictData();
    let list = types.slice();
    const kw = String(keyword).trim().toLowerCase();
    if (kw) {
      list = list.filter(
        (t) => (t.typeCode && t.typeCode.toLowerCase().includes(kw)) || (t.typeName && t.typeName.toLowerCase().includes(kw))
      );
    }
    if (status) list = list.filter((t) => t.status === status);
    return { list, total: list.length };
  },

  getType(id) {
    const { types } = getDictData();
    return types.find((t) => t.id === id) ?? null;
  },

  listItems(query = {}) {
    const { typeId, keyword = '', status = '', page = 1, pageSize = 10 } = query;
    const { items } = getDictData();
    let list = typeId ? items.filter((i) => i.typeId === typeId) : [];
    const kw = String(keyword).trim().toLowerCase();
    if (kw) {
      list = list.filter((i) => (i.value && i.value.toLowerCase().includes(kw)) || (i.label && i.label.toLowerCase().includes(kw)));
    }
    if (status) list = list.filter((i) => i.status === status);
    list.sort((a, b) => (a.sort != null && b.sort != null ? a.sort - b.sort : 0) || (a.id || '').localeCompare(b.id || ''));
    const total = list.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    list = list.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  createType(payload) {
    const data = getDictData();
    const types = data.types.slice();
    const code = String(payload.typeCode || '').trim();
    if (!code) return null;
    if (types.some((t) => t.typeCode === code)) return null;
    const typeName = String(payload.typeName || '').trim() || code;
    const id = 'dt' + Date.now();
    const updatedAt = now();
    const type = { id, typeCode: code, typeName, status: payload.status === 'disabled' ? 'disabled' : 'enabled', updatedAt };
    types.push(type);
    setDictData({ ...data, types });
    settingsLog.append({ module: 'settings-dict', action: 'createType', result: 'success', message: `新增字典类型：${typeName}（${code}）`, detail: { typeId: id, typeCode: code, typeName } });
    return type;
  },

  updateType(id, patch) {
    const data = getDictData();
    const types = data.types.slice();
    const idx = types.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const code = patch.typeCode != null ? String(patch.typeCode).trim() : types[idx].typeCode;
    if (code && types.some((t) => t.id !== id && t.typeCode === code)) return null;
    const updated = { ...types[idx], ...patch, typeCode: code || types[idx].typeCode, typeName: patch.typeName != null ? String(patch.typeName).trim() : types[idx].typeName, updatedAt: now() };
    types[idx] = updated;
    setDictData({ ...data, types });
    settingsLog.append({ module: 'settings-dict', action: 'updateType', result: 'success', message: `更新字典类型：${updated.typeName}`, detail: { typeId: id, typeCode: updated.typeCode } });
    return updated;
  },

  removeType(id) {
    const data = getDictData();
    const types = data.types.filter((t) => t.id !== id);
    const items = data.items.filter((i) => i.typeId !== id);
    const deletedCount = data.items.length - items.length;
    setDictData({ types, items });
    const t = data.types.find((x) => x.id === id);
    settingsLog.append({ module: 'settings-dict', action: 'removeType', result: 'success', message: `删除字典类型：${t ? t.typeName : id}（级联删除 ${deletedCount} 个字典项）`, detail: { typeId: id, typeCode: t && t.typeCode, deletedItems: deletedCount } });
    return deletedCount;
  },

  toggleType(id) {
    const data = getDictData();
    const types = data.types.slice();
    const idx = types.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const next = types[idx].status === 'enabled' ? 'disabled' : 'enabled';
    types[idx] = { ...types[idx], status: next, updatedAt: now() };
    setDictData({ ...data, types });
    settingsLog.append({ module: 'settings-dict', action: 'toggleType', result: 'success', message: `${next === 'enabled' ? '启用' : '停用'}字典类型：${types[idx].typeName}`, detail: { typeId: id, typeCode: types[idx].typeCode, status: next } });
    return types[idx];
  },

  createItem(payload) {
    const data = getDictData();
    const items = data.items.slice();
    const typeId = payload.typeId;
    const value = String(payload.value || '').trim();
    const label = String(payload.label || '').trim();
    if (!typeId || !value || !label) return null;
    if (items.some((i) => i.typeId === typeId && i.value === value)) return null;
    const id = 'di' + Date.now();
    const updatedAt = now();
    const item = { id, typeId, value, label, status: payload.status === 'disabled' ? 'disabled' : 'enabled', sort: payload.sort != null ? payload.sort : 100, updatedAt };
    items.push(item);
    setDictData({ ...data, items });
    const t = data.types.find((x) => x.id === typeId);
    settingsLog.append({ module: 'settings-dict', action: 'createItem', result: 'success', message: `新增字典项：${label}（${value}）`, detail: { typeId, typeCode: t && t.typeCode, itemId: id } });
    return item;
  },

  updateItem(id, patch) {
    const data = getDictData();
    const items = data.items.slice();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const typeId = items[idx].typeId;
    const value = patch.value != null ? String(patch.value).trim() : items[idx].value;
    if (value && items.some((i) => i.typeId === typeId && i.value === value && i.id !== id)) return null;
    const updated = { ...items[idx], ...patch, value: value || items[idx].value, label: patch.label != null ? String(patch.label).trim() : items[idx].label, updatedAt: now() };
    items[idx] = updated;
    setDictData({ ...data, items });
    settingsLog.append({ module: 'settings-dict', action: 'updateItem', result: 'success', message: `更新字典项：${updated.label}`, detail: { typeId, itemId: id } });
    return updated;
  },

  removeItem(id) {
    const data = getDictData();
    const items = data.items.filter((i) => i.id !== id);
    const removed = data.items.find((i) => i.id === id);
    setDictData({ ...data, items });
    settingsLog.append({ module: 'settings-dict', action: 'removeItem', result: 'success', message: `删除字典项：${removed ? removed.label : id}`, detail: { typeId: removed && removed.typeId, itemId: id } });
    return removed;
  },

  toggleItem(id) {
    const data = getDictData();
    const items = data.items.slice();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const next = items[idx].status === 'enabled' ? 'disabled' : 'enabled';
    items[idx] = { ...items[idx], status: next, updatedAt: now() };
    setDictData({ ...data, items });
    settingsLog.append({ module: 'settings-dict', action: 'toggleItem', result: 'success', message: `${next === 'enabled' ? '启用' : '停用'}字典项：${items[idx].label}`, detail: { typeId: items[idx].typeId, itemId: id, status: next } });
    return items[idx];
  },

  reset() {
    const data = getMockDictData();
    storage.set(SETTINGS_DICT, data);
  },
};

// --------------- settingsBasic ---------------
function getBasicData() {
  let list = storage.get(SETTINGS_BASIC);
  if (list == null || !Array.isArray(list)) {
    list = getMockBasicConfig();
    storage.set(SETTINGS_BASIC, list);
  }
  return list;
}

function setBasicData(list) {
  storage.set(SETTINGS_BASIC, list);
}

export const settingsBasic = {
  get() {
    return getBasicData().map((item) => ({ ...item, options: item.options ? item.options.slice() : undefined }));
  },

  save(list) {
    const prev = getBasicData();
    const prevByKey = {};
    prev.forEach((p) => { prevByKey[p.key] = p; });
    const changedKeys = [];
    const updated = list.map((item) => {
      const next = { ...item, updatedAt: now() };
      if (prevByKey[item.key] && JSON.stringify(prevByKey[item.key].value) !== JSON.stringify(item.value)) {
        changedKeys.push(item.key);
      }
      return next;
    });
    setBasicData(updated);
    settingsLog.append({
      module: 'settings-basic',
      action: 'save',
      result: 'success',
      message: '基础配置已保存',
      detail: { changedKeys },
    });
  },

  reset() {
    const list = getMockBasicConfig();
    setBasicData(list);
    settingsLog.append({
      module: 'settings-basic',
      action: 'reset',
      result: 'success',
      message: '基础配置已恢复默认',
    });
  },
};

// --------------- settingsEnum ---------------
function getEnumData() {
  let list = storage.get(SETTINGS_ENUM);
  if (list == null || !Array.isArray(list)) {
    list = getMockEnumRules();
    storage.set(SETTINGS_ENUM, list);
  }
  return list;
}

function setEnumData(list) {
  storage.set(SETTINGS_ENUM, list);
}

export const settingsEnum = {
  list(query = {}) {
    const { keyword = '', status = '', targetTypeCode = '', page = 1, pageSize = 10 } = query;
    let data = getEnumData().slice();
    const kw = String(keyword).trim().toLowerCase();
    if (kw) {
      data = data.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(kw)) ||
          (r.targetTypeCode && r.targetTypeCode.toLowerCase().includes(kw)) ||
          (r.expression && r.expression.toLowerCase().includes(kw))
      );
    }
    if (status) data = data.filter((r) => r.status === status);
    if (targetTypeCode) data = data.filter((r) => r.targetTypeCode === targetTypeCode);
    data.sort((a, b) => (a.priority != null ? a.priority : 0) - (b.priority != null ? b.priority : 0));
    const total = data.length;
    const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
    const list = data.slice(start, start + Math.max(1, pageSize));
    return { list, total };
  },

  get(id) {
    const data = getEnumData();
    return data.find((r) => r.id === id) ?? null;
  },

  create(payload) {
    const list = getEnumData().slice();
    const maxPriority = list.length ? Math.max(...list.map((r) => r.priority != null ? r.priority : 0)) : 0;
    const id = 'er' + Date.now();
    const updatedAt = now();
    const rule = {
      id,
      name: String(payload.name ?? '').trim(),
      targetTypeCode: String(payload.targetTypeCode ?? '').trim(),
      status: payload.status === 'disabled' ? 'disabled' : 'enabled',
      priority: payload.priority != null ? payload.priority : maxPriority + 10,
      expression: String(payload.expression ?? '').trim(),
      desc: payload.desc != null ? String(payload.desc).trim() : '',
      updatedAt,
    };
    list.push(rule);
    list.sort((a, b) => (a.priority != null ? a.priority : 0) - (b.priority != null ? b.priority : 0));
    setEnumData(list);
    settingsLog.append({ module: 'settings-enum', action: 'create', result: 'success', message: `新增规则：${rule.name}`, detail: { ruleId: id, targetTypeCode: rule.targetTypeCode } });
    return rule;
  },

  update(id, patch) {
    const list = getEnumData().slice();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...patch, updatedAt: now() };
    list[idx] = updated;
    setEnumData(list);
    settingsLog.append({ module: 'settings-enum', action: 'update', result: 'success', message: `更新规则：${updated.name}`, detail: { ruleId: id, targetTypeCode: updated.targetTypeCode } });
    return updated;
  },

  remove(id) {
    const list = getEnumData().slice();
    const rule = list.find((r) => r.id === id);
    const next = list.filter((r) => r.id !== id);
    setEnumData(next);
    settingsLog.append({ module: 'settings-enum', action: 'remove', result: 'success', message: `删除规则：${rule ? rule.name : id}`, detail: { ruleId: id } });
    return rule;
  },

  toggle(id) {
    const list = getEnumData().slice();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const next = list[idx].status === 'enabled' ? 'disabled' : 'enabled';
    list[idx] = { ...list[idx], status: next, updatedAt: now() };
    setEnumData(list);
    settingsLog.append({ module: 'settings-enum', action: 'toggle', result: 'success', message: `${next === 'enabled' ? '启用' : '停用'}规则：${list[idx].name}`, detail: { ruleId: id, status: next } });
    return list[idx];
  },

  move(id, direction) {
    const list = getEnumData().slice();
    list.sort((a, b) => (a.priority != null ? a.priority : 0) - (b.priority != null ? b.priority : 0));
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    if (direction === 'up' && idx === 0) return list[idx];
    if (direction === 'down' && idx === list.length - 1) return list[idx];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];
    list.forEach((r, i) => { r.priority = (i + 1) * 10; r.updatedAt = now(); });
    setEnumData(list);
    settingsLog.append({ module: 'settings-enum', action: 'move', result: 'success', message: `规则顺序调整：${list[swapIdx].name} ${direction === 'up' ? '上移' : '下移'}`, detail: { ruleId: id, direction } });
    return list[swapIdx];
  },

  reset() {
    const list = getMockEnumRules();
    setEnumData(list);
    settingsLog.append({ module: 'settings-enum', action: 'reset', result: 'success', message: '枚举规则已恢复默认' });
  },
};
