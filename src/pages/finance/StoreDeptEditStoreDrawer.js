import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Store, Globe, Building2, Target, CheckCircle2, X } from 'lucide-react';
import { toast } from '../../components/ui/Toast';

// 下拉数据
const departments = [
    { code: 'EMEA_PLATFORM', name: '欧美事业部 > 平台电商部', costCenter: 'CC_EMEA_PLT' },
    { code: 'EMEA_DTC', name: '欧美事业部 > 直营电商部', costCenter: 'CC_EMEA_DTC' },
    { code: 'APAC_PLATFORM', name: '亚太事业部 > 平台电商部', costCenter: 'CC_APAC_PLT' },
    { code: 'APAC_DTC', name: '亚太事业部 > 直营电商部', costCenter: 'CC_APAC_DTC' },
];

const costCenterOptions = [
    { code: 'CC_EMEA_PLT', name: '欧美事业部-平台电商部成本中心' },
    { code: 'CC_EMEA_DTC', name: '欧美事业部-直营电商部成本中心' },
    { code: 'CC_APAC_PLT', name: '亚太事业部-平台电商部成本中心' },
    { code: 'CC_APAC_DTC', name: '亚太事业部-直营电商部成本中心' },
];

const countries = ['美国', '英国', '德国', '法国', '日本', '新加坡', '马来西亚', '澳大利亚', '加拿大', '中国', '其他'];

export default function StoreDeptEditStoreDrawer({ isOpen, onClose, store, onSave }) {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (store) {
                // 根据 departmentName 找到对应的 departmentCode
                const dept = departments.find(d => d.name === store.departmentName);
                const deptCode = dept ? dept.code : '';
                
                // 根据 costCenterName 找到对应的 costCenterCode
                const cc = costCenterOptions.find(c => c.name === store.costCenterName);
                const ccCode = cc ? cc.code : '';
                
                setFormData({
                    ...store,
                    departmentCode: deptCode,
                    costCenterCode: ccCode,
                });
            } else {
                setFormData({
                    storeId: '',
                    storeName: '',
                    customerGroup: '',
                    country: '',
                    departmentCode: '',
                    departmentName: '',
                    costCenterCode: '',
                    costCenterName: '',
                    kingdeeOrgCode: '',
                    effectiveDate: '',
                    status: 'active',
                    isActive: true,
                    remarks: '',
                });
            }
        } else {
            // 关闭时清空数据
            setFormData(null);
        }
    }, [isOpen, store]);

    const handleDepartmentChange = (departmentCode) => {
        const dept = departments.find((d) => d.code === departmentCode);
        if (!dept || !formData) return;
        const cc = costCenterOptions.find((c) => c.code === dept.costCenter);
        setFormData({
            ...formData,
            departmentCode: dept.code,
            departmentName: dept.name,
            costCenterCode: dept.costCenter,
            costCenterName: cc ? cc.name : dept.costCenter,
        });
    };

    const handleSave = () => {
        if (!formData) return;
        if (!formData.storeId || !formData.storeName || !formData.effectiveDate) {
            toast.warning('请填写必填项：店铺ID、店铺名称、生效日期');
            return;
        }
        onSave?.(formData);
        onClose?.();
    };

    if (!isOpen || !formData) return null;

    const drawerContent = (
        <>
            {/* 遮罩层 */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity"
                onClick={onClose}
            />
            
            {/* 抽屉 */}
            <div className="fixed right-0 top-0 h-full w-[50vw] min-w-[600px] bg-white shadow-xl z-[9999] flex flex-col transform transition-transform">
                {/* 头部 */}
                <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {store?.storeId ? '编辑店铺映射' : '新建店铺映射'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    维护店铺的基本信息与部门 / 成本中心映射
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-6">
                        {/* 基本信息 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-700 mb-4">
                                <Store className="w-4 h-4" />
                                <h3 className="font-medium">基本信息</h3>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="storeId" className="block text-sm font-medium text-gray-700">
                                    金蝶店铺ID
                                </label>
                                <input
                                    id="storeId"
                                    type="text"
                                    value={formData.storeId || ''}
                                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                                    placeholder="例如：AMZ_US_01"
                                    className="w-full h-10 px-3 border rounded-lg bg-gray-50 text-gray-500"
                                    disabled={!!store?.storeId}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                                    金蝶店铺名称
                                </label>
                                <input
                                    id="storeName"
                                    type="text"
                                    value={formData.storeName || ''}
                                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                    placeholder="例如：Amazon美国站"
                                    className="w-full h-10 px-3 border rounded-lg"
                                    disabled={!!store?.storeId}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="customerGroup" className="block text-sm font-medium text-gray-700">
                                    客户分组
                                </label>
                                <input
                                    id="customerGroup"
                                    type="text"
                                    value={formData.customerGroup || ''}
                                    onChange={(e) => setFormData({ ...formData, customerGroup: e.target.value })}
                                    placeholder="例如：Amazon"
                                    className="w-full h-10 px-3 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="border-t"></div>

                        {/* 区域 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-700 mb-4">
                                <Globe className="w-4 h-4" />
                                <h3 className="font-medium">区域</h3>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                    国家
                                </label>
                                <select
                                    id="country"
                                    value={formData.country || ''}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full h-10 px-3 border rounded-lg"
                                >
                                    <option value="">选择国家</option>
                                    {countries.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border-t"></div>

                        {/* 组织映射 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-700 mb-4">
                                <Building2 className="w-4 h-4" />
                                <h3 className="font-medium">组织映射</h3>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                    归属部门
                                </label>
                                <select
                                    id="department"
                                    value={formData.departmentCode || ''}
                                    onChange={(e) => handleDepartmentChange(e.target.value)}
                                    className="w-full h-10 px-3 border rounded-lg"
                                >
                                    <option value="">选择部门</option>
                                    {departments.map((d) => (
                                        <option key={d.code} value={d.code}>{d.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">默认自动带出部门对应的成本中心，可手动调整</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="costCenter" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> 成本中心
                                </label>
                                <select
                                    id="costCenter"
                                    value={formData.costCenterCode || ''}
                                    onChange={(e) => {
                                        const cc = costCenterOptions.find((c) => c.code === e.target.value);
                                        setFormData({
                                            ...formData,
                                            costCenterCode: e.target.value,
                                            costCenterName: cc ? cc.name : e.target.value,
                                        });
                                    }}
                                    className="w-full h-10 px-3 border rounded-lg"
                                >
                                    <option value="">请选择成本中心</option>
                                    {costCenterOptions.map((cc) => (
                                        <option key={cc.code} value={cc.code}>{cc.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="kingdeeOrgCode" className="block text-sm font-medium text-gray-700">
                                    金蝶归属组织
                                </label>
                                <input
                                    id="kingdeeOrgCode"
                                    type="text"
                                    value={formData.kingdeeOrgCode || ''}
                                    onChange={(e) => setFormData({ ...formData, kingdeeOrgCode: e.target.value })}
                                    placeholder="例如：100、203、107等"
                                    className="w-full h-10 px-3 border rounded-lg bg-gray-50 text-gray-500"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="border-t"></div>

                        {/* 状态 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-700 mb-4">
                                <CheckCircle2 className="w-4 h-4" />
                                <h3 className="font-medium">状态设置</h3>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    状态
                                </label>
                                <select
                                    id="status"
                                    value={formData.status || 'active'}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        status: e.target.value,
                                        isActive: e.target.value === 'active'
                                    })}
                                    className="w-full h-10 px-3 border rounded-lg"
                                >
                                    <option value="active">启用</option>
                                    <option value="inactive">停用</option>
                                    <option value="disabled">禁用</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                                    生效日期
                                </label>
                                <input
                                    id="effectiveDate"
                                    type="date"
                                    value={formData.effectiveDate || ''}
                                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                                    className="w-full h-10 px-3 border rounded-lg"
                                />
                                <p className="text-xs text-gray-500">同一店铺多条记录时，以生效日期最新的为准</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                                    备注
                                </label>
                                <input
                                    id="remarks"
                                    type="text"
                                    value={formData.remarks || ''}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    placeholder="请输入备注说明..."
                                    className="w-full h-10 px-3 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 px-4 border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        保存修改
                    </button>
                </div>
            </div>
        </>
    );

    return createPortal(drawerContent, document.body);
}

