/** localStorage 封装：统一序列化/反序列化、schemaVersion 校验、get/set/remove/clearByPrefix。 */

const SCHEMA_VERSION = 1;

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

/**
 * @param {string} key
 * @returns {any} 解析后的 data，版本不符或不存在返回 null
 */
export function get(key) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const raw = window.localStorage.getItem(key);
  return parse(raw);
}

/**
 * @param {string} key
 * @param {any} data
 */
export function set(key, data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(key, JSON.stringify(wrap(data)));
}

/**
 * @param {string} key
 */
export function remove(key) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.removeItem(key);
}

/**
 * 删除所有以 prefix 开头的 key（用于开发阶段一键重置）。
 * @param {string} prefix 例如 'ecommerce:settings:'
 */
export function clearByPrefix(prefix) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(prefix)) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
}
