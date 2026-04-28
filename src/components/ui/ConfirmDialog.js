/** 通用 ConfirmDialog：基于 ModalShell + Button 的确认弹窗。
 *
 *  两种用法：
 *
 *  1) 组件式（需要把 open / onConfirm / onCancel 自己管起来）
 *     import ConfirmDialog from '../../components/ui/ConfirmDialog';
 *     <ConfirmDialog
 *        open={open}
 *        title="确认删除"
 *        description={`确定删除「${row.name}」？此操作不可恢复。`}
 *        danger
 *        confirmText="删除"
 *        cancelText="取消"
 *        onConfirm={handleConfirm}
 *        onCancel={() => setOpen(false)}
 *     />
 *
 *  2) imperative（推荐，最少代码）
 *     import { confirm } from '../../components/ui/ConfirmDialog';
 *     const ok = await confirm({
 *       title: '确认删除',
 *       description: '此操作不可恢复',
 *       danger: true,
 *     });
 *     if (!ok) return;
 *     // 真正执行删除...
 *
 *     需要 App 顶层渲染 <ConfirmDialogHost />（已挂在 src/App.js 根节点）。
 */

import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import ModalShell from './ModalShell';
import Button from './Button';

/* ============== 组件式 API ============== */

export default function ConfirmDialog({
  open,
  title = '确认',
  description,
  confirmText = '确认',
  cancelText = '取消',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const handleConfirm = () => {
    if (loading) return;
    if (typeof onConfirm === 'function') onConfirm();
  };

  const handleCancel = () => {
    if (loading) return;
    if (typeof onCancel === 'function') onCancel();
  };

  return (
    <ModalShell
      open={open}
      width="md"
      title={
        <span className="flex items-center gap-2">
          {danger && <AlertTriangle className="h-5 w-5 text-danger-600" aria-hidden="true" />}
          <span>{title}</span>
        </span>
      }
      onClose={handleCancel}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={handleCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? '处理中...' : confirmText}
          </Button>
        </div>
      }
    >
      {typeof description === 'string'
        ? <p className="text-sm text-text-muted whitespace-pre-line">{description}</p>
        : description}
    </ModalShell>
  );
}

/* ============== imperative API ============== */

const listeners = new Set();
let counter = 0;

/**
 * confirm({ title, description, confirmText, cancelText, danger }) → Promise<boolean>
 * 用户点确认 → resolve(true)；点取消 / 关闭 → resolve(false)。
 * 永远不会 reject，调用方只需关心 ok 真/假即可。
 */
export function confirm(options = {}) {
  return new Promise((resolve) => {
    const id = ++counter;
    const item = {
      id,
      title: '确认',
      description: '',
      confirmText: '确认',
      cancelText: '取消',
      danger: false,
      ...options,
      resolve,
    };
    listeners.forEach((fn) => fn(item));
  });
}

export function ConfirmDialogHost() {
  const [items, setItems] = useState([]);

  const handleResolve = useCallback((id, value) => {
    setItems((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target && typeof target.resolve === 'function') {
        try {
          target.resolve(value);
        } catch {
          /* ignore caller error */
        }
      }
      return prev.filter((x) => x.id !== id);
    });
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

  // 只渲染最新一条；多个并发请求会按顺序逐条出现（resolve 后下一条才显示）
  // 简单起见：渲染所有，z-index 自然叠加；ModalShell 自带遮罩，最后压栈的可见
  return (
    <>
      {items.map((item) => (
        <ConfirmDialog
          key={item.id}
          open
          title={item.title}
          description={item.description}
          confirmText={item.confirmText}
          cancelText={item.cancelText}
          danger={item.danger}
          onConfirm={() => handleResolve(item.id, true)}
          onCancel={() => handleResolve(item.id, false)}
        />
      ))}
    </>
  );
}
