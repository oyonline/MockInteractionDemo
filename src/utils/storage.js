/** localStorage 封装：统一序列化/反序列化、schemaVersion 校验、get/set/remove/clearByPrefix。
 *
 *  set 内部捕获 QuotaExceededError（容量满），自动按优先级清理后重试一次；
 *  仍失败则 console.warn 并丢弃，不抛出。get/remove 也用 try-catch 兜底，避免页面崩溃。
 *  保持原有 API 兼容：get / set / remove / clearByPrefix 调用方式不变。
 */

const SCHEMA_VERSION = 1;

/** 容量满时按以下顺序清理 key 前缀：先清最不重要的演示性数据。 */
const CLEANUP_PRIORITY_PREFIXES = [
  'ecommerce:audit-log',       // 审计日志（最不重要）
  'ecommerce:demo:',           // 演示态临时数据
  'ecommerce:notifications',   // 通知列表
  'ecommerce:session:',        // 临时 session 状态
];

function wrap(data) {
  return { schemaVersion: SCHEMA_VERSION, data };
}

function parse(raw) {
  if (raw == null || raw === '') return null;
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj.schemaVersion === 'number' && obj.schemaVersion === SCHEMA_VERSION) {
      return obj.data;
    }
    return null;
  } catch {
    return null;
  }
}

function isQuotaError(err) {
  if (!err) return false;
  const code = err.code;
  const name = err.name;
  // 不同浏览器对配额错误的命名不一
  return (
    code === 22 ||
    code === 1014 ||
    name === 'QuotaExceededError' ||
    name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );
}

function listKeysWithPrefix(prefix) {
  const keys = [];
  if (typeof window === 'undefined' || !window.localStorage) return keys;
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(prefix)) keys.push(k);
  }
  return keys;
}

/** 按 CLEANUP_PRIORITY_PREFIXES 顺序删，命中一档就返回 true。 */
function cleanupForQuota() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  for (const prefix of CLEANUP_PRIORITY_PREFIXES) {
    const keys = listKeysWithPrefix(prefix);
    if (keys.length > 0) {
      keys.forEach((k) => {
        try {
          window.localStorage.removeItem(k);
        } catch {
          /* ignore single-key removal failure */
        }
      });
      return true;
    }
  }
  return false;
}

/**
 * 读取 localStorage 中的业务数据，自动反序列化并做版本校验。
 * @param {string} key
 * @returns {any} 解析后的 data；版本不符 / 不存在 / 解析失败 → null
 */
export function get(key) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return parse(raw);
  } catch (err) {
    console.warn('[storage.get] 失败:', key, err);
    return null;
  }
}

/**
 * 写入 localStorage（包 schemaVersion）。
 * 遇 QuotaExceededError 时按优先级清理后重试一次；仍失败则 warn + 丢弃，不抛出。
 * @param {string} key
 * @param {any} data
 */
export function set(key, data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  let payload;
  try {
    payload = JSON.stringify(wrap(data));
  } catch (err) {
    console.warn('[storage.set] 序列化失败:', key, err);
    return;
  }

  try {
    window.localStorage.setItem(key, payload);
    return;
  } catch (err) {
    if (!isQuotaError(err)) {
      console.warn('[storage.set] 写入失败（非配额）:', key, err);
      return;
    }
    // 配额错误：按优先级清理，再重试一次
    const cleaned = cleanupForQuota();
    if (!cleaned) {
      console.warn('[storage.set] 配额超限且无可清理项，本次写入已丢弃:', key);
      return;
    }
    try {
      window.localStorage.setItem(key, payload);
    } catch (err2) {
      console.warn('[storage.set] 配额清理重试后仍失败，本次写入已丢弃:', key, err2);
    }
  }
}

/**
 * 删除单个 key。
 * @param {string} key
 */
export function remove(key) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn('[storage.remove] 失败:', key, err);
  }
}

/**
 * 删除所有以 prefix 开头的 key（用于开发阶段一键重置）。
 * @param {string} prefix 例如 'ecommerce:settings:'
 */
export function clearByPrefix(prefix) {
  const keys = listKeysWithPrefix(prefix);
  keys.forEach((k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* ignore single-key removal failure */
    }
  });
}
