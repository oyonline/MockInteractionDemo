/** Hook：key + initialValue -> state + 自动持久化（使用 storage 的 get/set，带 schemaVersion）。 */

import { useState, useCallback } from 'react';
import * as storage from '../utils/storage';

/**
 * @param {string} key - storage key
 * @param {any} initialValue - 当 storage 无数据或版本不符时使用的初始值
 * @returns {[any, (value: any) => void]} [value, setValue]，setValue 会同步写入 localStorage
 */
export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    const stored = storage.get(key);
    return stored !== null ? stored : initialValue;
  });

  const setValue = useCallback(
    (value) => {
      setState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        storage.set(key, next);
        return next;
      });
    },
    [key]
  );

  return [state, setValue];
}
