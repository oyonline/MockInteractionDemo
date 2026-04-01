// src/pages/sales/SalesChinaPage.js
import React from 'react';
import { Building2, TrendingUp, Target, BarChart3, Globe } from 'lucide-react';

const SalesChinaPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">中国事业部</h1>
                            <p className="text-sm text-gray-500">国内市场销售管理与分析</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">运营中</span>
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">本月销售额</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">¥1.2M</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+18.5%</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">目标达成率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">95.2%</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">活跃渠道</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">8</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">主力平台</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">天猫/京东</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-2 gap-6 h-full">
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">销售渠道分布</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">渠道分布图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">月度销售趋势</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">销售趋势图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">品类销售TOP5</h3>
                        <div className="space-y-3">
                            {['路亚竿系列', '渔轮系列', '钓线系列', '鱼饵系列', '配件系列'].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                            {idx + 1}
                                        </span>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                    <span className="text-gray-500">¥{(500 - idx * 80)}K</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">最新动态</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">3·8大促活动圆满结束</p>
                                <p className="text-xs text-gray-500 mt-1">销售额同比增长 25%</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">京东旗舰店上新 20+ SKU</p>
                                <p className="text-xs text-gray-500 mt-1">新品首周销量突破 1000 件</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">直播带货合作启动</p>
                                <p className="text-xs text-gray-500 mt-1">已与 5 位头部主播达成合作</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesChinaPage;
