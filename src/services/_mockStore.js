/**
 * 原型级 mockStore：薄壳封装 utils/storage，提供 get/set/update/reset。
 *
 * 定位：
 *   - 仅服务于"高保真原型阶段"页面级状态持久化（推送预测、保存方案、看板档案等）
 *   - 不是真正的状态管理库；不是 service 层抽象；不是 BFF；不模拟异步
 *   - 内部走 utils/storage（已自带 schemaVersion 校验、QuotaExceededError 自动清理与重试）
 *   - 不直接操作 window.localStorage、不引入新依赖
 *
 * 用法：
 *   import { mockStore } from '../../services/_mockStore';
 *   import { SALES_FORECAST_PAGE_STATE } from '../../utils/storageKeys';
 *
 *   // 读：不存在则返回 fallback
 *   const state = mockStore.get(SALES_FORECAST_PAGE_STATE, {});
 *
 *   // 写：调用方传完整状态
 *   mockStore.set(SALES_FORECAST_PAGE_STATE, nextState);
 *
 *   // 读 → updater(prev) → 写
 *   mockStore.update(SALES_FORECAST_PAGE_STATE, (prev) => ({ ...prev, foo: 1 }), {});
 *
 *   // 删除指定 key（用于"重置 mock 数据"等开发态入口）
 *   mockStore.reset(SALES_FORECAST_PAGE_STATE);
 */

import * as storage from '../utils/storage';

export const mockStore = {
  /** 读取；不存在或解析失败时返回 fallback（默认 null）。 */
  get(key, fallback = null) {
    const v = storage.get(key);
    return v == null ? fallback : v;
  },

  /** 写入完整状态。调用方负责传整体而非增量。 */
  set(key, value) {
    storage.set(key, value);
  },

  /**
   * 读取 → updater(prev) → 写入；返回写入后的值。
   * - prev 不存在时使用 fallback 作为前值
   * - updater 既可以是函数也可以直接是新值
   */
  update(key, updater, fallback = null) {
    const prev = mockStore.get(key, fallback);
    const next = typeof updater === 'function' ? updater(prev) : updater;
    storage.set(key, next);
    return next;
  },

  /** 删除单个 key。 */
  reset(key) {
    storage.remove(key);
  },
};

export default mockStore;
