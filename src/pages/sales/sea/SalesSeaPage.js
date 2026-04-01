// src/pages/sales/SalesSeaPage.js
import React from 'react';
import { Building2, TrendingUp, Target, BarChart3, Globe } from 'lucide-react';

const SalesSeaPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">东南亚事业部</h1>
                            <p className="text-sm text-gray-500">东南亚市场销售管理与分析</p>
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
                            <p className="text-2xl font-semibold text-gray-800 mt-1">$850K</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+32.1%</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">目标达成率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">108.5%</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">覆盖国家</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">6</p>
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
                            <p className="text-2xl font-semibold text-gray-800 mt-1">Shopee/Lazada</p>
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
                                { country: '新加坡', percent: 35 },
                                { country: '马来西亚', percent: 25 },
                                { country: '泰国', percent: 20 },
                                { country: '越南', percent: 12 },
                                { country: '印尼', percent: 5 },
                                { country: '菲律宾', percent: 3 },
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
                            {['路亚竿系列', '海钓装备', '渔轮系列', '钓线系列', '户外配件'].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                                            {idx + 1}
                                        </span>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                    <span className="text-gray-500">${(400 - idx * 70)}K</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">市场动态</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">Shopee 3.15大促创新高</p>
                                <p className="text-xs text-gray-500 mt-1">单日销售额突破 $150K</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">新加坡旗舰店开业</p>
                                <p className="text-xs text-gray-500 mt-1">首月销售额超预期 40%</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">TikTok Shop 渠道拓展</p>
                                <p className="text-xs text-gray-500 mt-1">即将入驻泰国、越南站点</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesSeaPage;
