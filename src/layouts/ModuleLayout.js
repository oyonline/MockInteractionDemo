// src/layouts/ModuleLayout.js
// 一级入口模块布局（简化版，导航已移至左侧）
import React from 'react';

// --------------- 主组件 ---------------
export default function ModuleLayout({ children }) {
    return (
        <div className="h-full flex flex-col bg-gray-50/50">
            {/* 页面内容 */}
            <div className="flex-1 overflow-auto p-6">
                {children}
            </div>
        </div>
    );
}
