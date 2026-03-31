// src/layouts/ModuleLayout.js
// 一级入口模块布局（简化版，导航已移至左侧）
import React from 'react';

// --------------- 主组件 ---------------
export default function ModuleLayout({ children }) {
  return <div className="flex h-full min-h-0 flex-col overflow-auto bg-surface-muted px-6 py-6">{children}</div>;
}
