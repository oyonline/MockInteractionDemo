// src/pages/overview/ProcurementOverviewPage.js
import React from 'react';
import { ShoppingCart, Truck, Users, ClipboardList } from 'lucide-react';

const ProcurementOverviewPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">供应链采购概览</h1>
                        <p className="text-sm text-gray-500">采购业务总览与管理入口</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                            <Truck className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">供应链采购概览</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于展示供应链采购的整体概况，包括供应商数量、采购订单状态、SKU迭代进度等。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">供应商统计</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">订单跟踪</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">SKU迭代</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcurementOverviewPage;
