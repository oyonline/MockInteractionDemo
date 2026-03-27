// src/pages/overview/ProductOverviewPage.js
import React from 'react';
import { Package, Box, Tags, Layers } from 'lucide-react';

const ProductOverviewPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">产品中心概览</h1>
                        <p className="text-sm text-gray-500">产品数据总览与管理入口</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <Box className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">产品中心概览</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于展示产品中心的整体数据概况，包括SKU数量、品类分布、标签统计等。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">SKU统计</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">品类分布</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">属性管理</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductOverviewPage;
