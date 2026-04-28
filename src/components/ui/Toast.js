/** 通用 Toast：右上角弹出 / 自动消失 / 多条堆叠 / 手动关闭 / imperative API。
 *
 *  用法：
 *    1. 在 App 顶层渲染 <ToastContainer />（仅一次，组件已挂在 src/App.js 根节点）
 *    2. 任何页面：
 *         import { toast } from '../../components/ui/Toast';
 *         toast.success('已保存');
 *         toast.error('操作失败');
 *         toast.warning('请确认参数');
 *         toast.info('演示功能');
 *
 *  配置项：toast.success(message, { title?, duration? })
 *    - title?: string         可选标题；不传则只显示一行 message
 *    - duration?: number      毫秒；0 表示不自动消失（手动关闭）。默认 3000ms
 *
 *  实现要点：
 *    - 模块级 listener 集合，无需 React Context；调用方零依赖注入
 *    - ToastContainer 仅在有内容时才渲染，关闭即卸载
 *    - 容器 pointer-events-none，不阻塞页面交互；单条 ToastItem 自身 pointer-events-auto
 */

import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import cn from '../../utils/cn';

const DEFAULT_DURATION = 3000;
const listeners = new Set();
let counter = 0;

function emit(item) {
  const fullItem = {
    id: ++counter,
    type: 'info',
    message: '',
    duration: DEFAULT_DURATION,
    ...item,
  };
  listeners.forEach((fn) => fn(fullItem));
  return fullItem.id;
}

/** imperative API。可在任何模块（含 service 层）直接调用，无需 React Context。 */
export const toast = {
  success: (message, opts = {}) => emit({ ...opts, type: 'success', message }),
  error: (message, opts = {}) => emit({ ...opts, type: 'error', message }),
  warning: (message, opts = {}) => emit({ ...opts, type: 'warning', message }),
  info: (message, opts = {}) => emit({ ...opts, type: 'info', message }),
};

const ICON_MAP = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TONE_MAP = {
  success: { bar: 'bg-success-600', icon: 'text-success-600' },
  error: { bar: 'bg-danger-600', icon: 'text-danger-600' },
  warning: { bar: 'bg-warning-600', icon: 'text-warning-600' },
  info: { bar: 'bg-brand-600', icon: 'text-brand-600' },
};

function ToastItem({ item, onClose }) {
  useEffect(() => {
    if (!item.duration || item.duration <= 0) return undefined;
    const timer = window.setTimeout(() => onClose(item.id), item.duration);
    return () => window.clearTimeout(timer);
  }, [item.id, item.duration, onClose]);

  const tone = TONE_MAP[item.type] || TONE_MAP.info;
  const Icon = ICON_MAP[item.type] || Info;

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-[320px] items-start gap-2 rounded-xl border border-border bg-surface py-3 pl-1 pr-3 shadow-elevated',
        'animate-modal-in'
      )}
      role="status"
    >
      <div className={cn('w-1 self-stretch rounded', tone.bar)} aria-hidden="true" />
      <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', tone.icon)} aria-hidden="true" />
      <div className="min-w-0 flex-1 pt-0.5">
        {item.title && <p className="text-sm font-semibold text-text">{item.title}</p>}
        <p className={cn('break-words text-sm', item.title ? 'mt-0.5 text-text-muted' : 'text-text')}>
          {item.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onClose(item.id)}
        className="mt-0.5 rounded p-1 text-text-subtle transition-colors hover:bg-surface-subtle hover:text-text"
        aria-label="关闭"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [items, setItems] = useState([]);

  const handleClose = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const handler = (item) => {
      setItems((prev) => [...prev, item]);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-toast flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {items.map((item) => (
        <ToastItem key={item.id} item={item} onClose={handleClose} />
      ))}
    </div>
  );
}

export default ToastContainer;
