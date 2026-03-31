/**
 * 表格操作列统一组件：主按钮 + 次按钮 + 更多菜单，单行不换行。
 * 「更多」菜单通过 Portal 挂到 body，避免被表格 overflow:auto 裁剪。
 * props: primary?, secondary?, more? (Array<{ label, onClick, disabled?, danger?, iconText? }>)
 *        moreLabel?, moreIcon? — 可选，如 moreLabel="操作" moreIcon=<ChevronDown />
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { getButtonClassName } from './ui/Button';

const BTN_BASE = 'inline-flex items-center justify-center whitespace-nowrap gap-1';
const PRIMARY_CLASS = getButtonClassName({ variant: 'primary', size: 'sm' });
const SECONDARY_CLASS = getButtonClassName({ variant: 'secondary', size: 'sm' });
const DISABLED_CLASS = getButtonClassName({ variant: 'primary', size: 'sm', disabled: true });

const MORE_MENU_WIDTH = 180;
const MORE_MENU_ESTIMATE_HEIGHT = 200;

function clampLeft(rect, menuWidth) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  let left = rect.left;
  if (left + menuWidth > vw - 8) left = rect.right - menuWidth;
  return Math.max(8, Math.min(left, vw - menuWidth - 8));
}

function computeMorePosition(triggerEl, menuEl) {
  if (!triggerEl) return { top: 0, left: 0 };
  const rect = triggerEl.getBoundingClientRect();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  const menuHeight = menuEl?.getBoundingClientRect?.()?.height ?? MORE_MENU_ESTIMATE_HEIGHT;
  const left = clampLeft(rect, MORE_MENU_WIDTH);
  const spaceBelow = vh - rect.bottom - 8;
  const top = spaceBelow >= menuHeight
    ? rect.bottom + 8
    : Math.max(8, rect.top - menuHeight - 8);
  return { top, left };
}

function ActionBar({ primary, secondary, more, moreLabel = '⋯ 更多', moreIcon }) {
  const moreTriggerRef = useRef(null);
  const moreMenuRef = useRef(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [morePosition, setMorePosition] = useState({ top: 0, left: 0 });

  const updateMorePosition = useCallback(() => {
    if (!moreTriggerRef.current || !moreOpen) return;
    setMorePosition(computeMorePosition(moreTriggerRef.current, moreMenuRef.current));
  }, [moreOpen]);

  const openMore = () => {
    if (!moreTriggerRef.current || !more?.length) return;
    setMorePosition(computeMorePosition(moreTriggerRef.current, null));
    setMoreOpen(true);
  };

  const closeMore = () => setMoreOpen(false);

  const toggleMore = () => {
    if (moreOpen) closeMore();
    else openMore();
  };

  useEffect(() => {
    if (!moreOpen) return;
    const onDocClick = (e) => {
      if (moreTriggerRef.current?.contains(e.target)) return;
      if (moreMenuRef.current?.contains(e.target)) return;
      closeMore();
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [moreOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeMore();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [moreOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    let raf = 0;
    const onScrollOrResize = () => {
      raf = raf || requestAnimationFrame(() => {
        raf = 0;
        updateMorePosition();
      });
    };
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [moreOpen, updateMorePosition]);

  useEffect(() => {
    if (!moreOpen || !moreMenuRef.current) return;
    const raf = requestAnimationFrame(() => updateMorePosition());
    return () => cancelAnimationFrame(raf);
  }, [moreOpen, updateMorePosition]);

  const wrapMoreClick = (onClick) => {
    return (e) => {
      if (onClick) onClick(e);
      closeMore();
    };
  };

  const moreMenuPortal =
    moreOpen &&
    more?.length > 0 &&
    ReactDOM.createPortal(
      <div
        ref={moreMenuRef}
        className="fixed z-[9999] w-[180px] rounded-2xl border border-border bg-surface p-1 shadow-elevated"
        style={{ top: morePosition.top, left: morePosition.left }}
      >
        {more.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={wrapMoreClick(item.onClick)}
            disabled={item.disabled}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50 ${item.danger ? 'text-danger-600 hover:bg-danger-50' : 'text-text-muted hover:bg-surface-subtle'}`}
          >
            {item.iconText}
            {item.label}
          </button>
        ))}
      </div>,
      document.body
    );

  return (
    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
      {primary && (
        <button
          type="button"
          onClick={primary.onClick}
          disabled={primary.disabled}
          className={primary.className || (primary.disabled ? DISABLED_CLASS : PRIMARY_CLASS)}
        >
          {primary.iconText}
          {primary.label}
        </button>
      )}
      {secondary && !secondary.hide && (
        <button
          type="button"
          onClick={secondary.onClick}
          disabled={secondary.disabled}
          className={secondary.className || SECONDARY_CLASS}
        >
          {secondary.iconText}
          {secondary.label}
        </button>
      )}
      {more && more.length > 0 && (
        <button
          ref={moreTriggerRef}
          type="button"
          onClick={toggleMore}
          className={getButtonClassName({ variant: 'secondary', size: 'sm', className: BTN_BASE })}
        >
          {moreLabel}
          {moreIcon}
        </button>
      )}
      {moreMenuPortal}
    </div>
  );
}

export default ActionBar;
