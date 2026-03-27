// src/pages/project/ProjectCreatePage.js
// 项目管理 - 新建项目页
import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    Plus,
    X,
    Building2,
    Tag,
    User,
    FileText,
    Package
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

const deptOptions = ['美国事业部', '中国事业部', '东南亚事业部', '欧洲事业部'];
const brandOptions = ['HomePlus', 'KitchenPro', 'TechLife', 'SecureHome', 'HealthCare', 'SoundMax', 'CleanBot', 'LightPro'];

export default function ProjectCreatePage({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        dept: '',
        brand: '',
        pm: '',
        description: '',
        skus: [{ code: '', name: '', market: '美国', cost: '' }],
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSkuChange = (index, field, value) => {
        setFormData(prev => {
            const newSkus = [...prev.skus];
            newSkus[index] = { ...newSkus[index], [field]: value };
            return { ...prev, skus: newSkus };
        });
    };

    const handleAddSku = () => {
        setFormData(prev => ({
            ...prev,
            skus: [...prev.skus, { code: '', name: '', market: '美国', cost: '' }],
        }));
    };

    const handleRemoveSku = (index) => {
        setFormData(prev => ({
            ...prev,
            skus: prev.skus.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 顶部导航 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">新建项目</h1>
                            <p className="text-sm text-gray-500 mt-1">创建新品开发项目，进入需求调研阶段</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            创建项目
                        </button>
                    </div>
                </div>
            </div>

            {/* 表单内容 */}
            <div className="flex-1 overflow-auto p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                    {/* 基本信息 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            基本信息
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    项目名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="例如：智能保温杯-美"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    所属事业部 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.dept}
                                    onChange={(e) => handleChange('dept', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">请选择事业部</option>
                                    {deptOptions.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    所属品牌 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.brand}
                                    onChange={(e) => handleChange('brand', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">请选择品牌</option>
                                    {brandOptions.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    项目经理 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.pm}
                                    onChange={(e) => handleChange('pm', e.target.value)}
                                    placeholder="请输入项目经理姓名"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    项目描述
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="描述项目背景、目标市场、产品定位等..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SKU信息 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-600" />
                                SKU信息
                            </h3>
                            <button
                                type="button"
                                onClick={handleAddSku}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                添加SKU
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.skus.map((sku, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">SKU #{index + 1}</span>
                                        {formData.skus.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSku(index)}
                                                className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 mb-1">SKU编码</label>
                                            <input
                                                type="text"
                                                value={sku.code}
                                                onChange={(e) => handleSkuChange(index, 'code', e.target.value)}
                                                placeholder="SKU-US-001"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 mb-1">产品名称</label>
                                            <input
                                                type="text"
                                                value={sku.name}
                                                onChange={(e) => handleSkuChange(index, 'name', e.target.value)}
                                                placeholder="智能保温杯-黑色-500ml"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">目标市场</label>
                                            <select
                                                value={sku.market}
                                                onChange={(e) => handleSkuChange(index, 'market', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="美国">美国</option>
                                                <option value="中国">中国</option>
                                                <option value="东南亚">东南亚</option>
                                                <option value="欧洲">欧洲</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">预估成本</label>
                                            <input
                                                type="number"
                                                value={sku.cost}
                                                onChange={(e) => handleSkuChange(index, 'cost', e.target.value)}
                                                placeholder="45.00"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
