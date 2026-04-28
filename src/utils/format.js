/**
 * 通用格式化工具：金额 / 数字 / 百分比 / 日期时间 / 相对时间。
 * 异常值统一返回 '-'。不引入新依赖；时间相对值用原生 Date 计算。
 *
 * 用法：
 *   import { formatMoney, formatNumber, formatPercent, formatDateTime, formatRelativeTime } from 'utils/format';
 *   formatMoney(1234567.89, 'USD')   // "$1,234,567.89"
 *   formatNumber(1234567)             // "1,234,567"
 *   formatPercent(0.235)              // "23.5%"
 *   formatDateTime('2026-04-27T10:30:00+08:00')   // "2026-04-27 18:30"
 *   formatRelativeTime(new Date(Date.now() - 7200000))  // "2 小时前"
 */

const FALLBACK = '-';

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return NaN;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : NaN;
};

const toDate = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value : null;
  }
  // 数字（毫秒时间戳；< 1e12 视为秒级）
  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isFinite(d.getTime()) ? d : null;
  }
  if (typeof value === 'string') {
    // 兼容 'YYYY-MM-DD HH:mm:ss' 形式（部分浏览器对带空格的日期解析不稳）
    const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)
      ? value.replace(' ', 'T')
      : value;
    const d = new Date(normalized);
    return Number.isFinite(d.getTime()) ? d : null;
  }
  return null;
};

const CURRENCY_SYMBOLS = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  HKD: 'HK$',
  AUD: 'A$',
  CAD: 'C$',
};

/**
 * 金额格式化：千分位 + 两位小数 + 货币符号
 * formatMoney(1234567.89, 'USD') → "$1,234,567.89"
 * formatMoney(null) → "-"
 */
export function formatMoney(amount, currency = 'CNY') {
  const n = toNumber(amount);
  if (Number.isNaN(n)) return FALLBACK;
  const symbol = CURRENCY_SYMBOLS[currency] || (currency ? `${currency} ` : '¥');
  const fixed = n.toFixed(2);
  const negative = fixed.startsWith('-');
  const absFixed = negative ? fixed.slice(1) : fixed;
  const [int, dec] = absFixed.split('.');
  const intWithComma = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}${symbol}${intWithComma}.${dec}`;
}

/**
 * 数字格式化：千分位
 * formatNumber(1234567) → "1,234,567"
 * formatNumber(1234.567) → "1,234.567"
 */
export function formatNumber(value) {
  const n = toNumber(value);
  if (Number.isNaN(n)) return FALLBACK;
  if (Number.isInteger(n)) return n.toLocaleString('zh-CN');
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 });
}

/**
 * 百分比格式化：约定入参为小数（0.235 表示 23.5%）。
 * 若绝对值 > 1，视为已经是百分位，不再 *100。
 * formatPercent(0.235) → "23.5%"
 * formatPercent(0.235, 2) → "23.50%"
 * formatPercent(85, 1) → "85.0%"  // 已经是百分位
 */
export function formatPercent(value, digits = 1) {
  const n = toNumber(value);
  if (Number.isNaN(n)) return FALLBACK;
  const pct = Math.abs(n) <= 1 ? n * 100 : n;
  const safeDigits = Number.isFinite(digits) && digits >= 0 ? digits : 1;
  return `${pct.toFixed(safeDigits)}%`;
}

/**
 * 绝对时间：YYYY-MM-DD HH:mm（默认）或 YYYY-MM-DD HH:mm:ss
 * formatDateTime('2026-04-27T10:30:00+08:00') → "2026-04-27 18:30"
 * formatDateTime(null) → "-"
 */
export function formatDateTime(value, withSeconds = false) {
  const d = toDate(value);
  if (!d) return FALLBACK;
  const pad = (n) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return withSeconds ? `${y}-${M}-${D} ${h}:${m}:${s}` : `${y}-${M}-${D} ${h}:${m}`;
}

/**
 * 仅日期：YYYY-MM-DD
 * formatDate('2026-04-27T10:30:00+08:00') → "2026-04-27"
 */
export function formatDate(value) {
  const d = toDate(value);
  if (!d) return FALLBACK;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 相对时间：
 *   < 1 分钟  → "刚刚"
 *   < 1 小时  → "x 分钟前"
 *   < 24 小时 → "x 小时前"
 *   < 30 天   → "x 天前"
 *   超过 30 天 → 落回 YYYY-MM-DD
 *   未来时间   → 落回 YYYY-MM-DD HH:mm
 */
export function formatRelativeTime(value) {
  const d = toDate(value);
  if (!d) return FALLBACK;
  const diff = Date.now() - d.getTime();
  if (diff < 0) return formatDateTime(d);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '刚刚';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  return formatDate(d);
}

const formatters = {
  formatMoney,
  formatNumber,
  formatPercent,
  formatDateTime,
  formatDate,
  formatRelativeTime,
};

export default formatters;
