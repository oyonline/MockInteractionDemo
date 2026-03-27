// src/pages/sales/SalesEuropePage.js
import React from 'react';
import { Building2, TrendingUp, Target, BarChart3, Globe } from 'lucide-react';

const SalesEuropePage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">欧洲事业部</h1>
                            <p className="text-sm text-gray-500">欧洲市场销售管理与分析</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">试运营</span>
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">本月销售额</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">€420K</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+8.3%</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">目标达成率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">78.5%</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">覆盖国家</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">5</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">主力平台</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">Amazon</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-2 gap-6 h-full">
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">国家分布</h3>
                        <div className="space-y-3">
                            {[
                                { country: '德国', percent: 40 },
                                { country: '英国', percent: 25 },
                                { country: '法国', percent: 18 },
                                { country: '意大利', percent: 10 },
                                { country: '西班牙', percent: 7 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="w-20 text-sm text-gray-600">{item.country}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                                        <div 
                                            className="h-2 bg-blue-500 rounded-full"
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                    <span className="w-12 text-sm text-gray-500 text-right">{item.percent}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">月度销售趋势</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">销售趋势图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">热门品类</h3>
                        <div className="space-y-3">
                            {['飞钓装备', '路亚竿系列', '渔轮系列', '钓线系列', '冬季钓鱼装备'].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                            {idx + 1}
                                        </span>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                    <span className="text-gray-500">€{(300 - idx * 50)}K</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">运营计划</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                <p className="text-sm font-medium text-yellow-700">欧洲仓建设筹备中</p>
                                <p className="text-xs text-yellow-600 mt-1">预计 Q3 完成建仓，提升配送效率</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">亚马逊欧洲站 Prime Day 筹备</p>
                                <p className="text-xs text-gray-500 mt-1">备货量计划增加 50%</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">本地化团队组建</p>
                                <p className="text-xs text-gray-500 mt-1">计划在德国、英国设立本地客服</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesEuropePage;
