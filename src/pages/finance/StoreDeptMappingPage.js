import React, { useMemo, useState } from 'react';
import { Search, Upload, Download, Store as StoreIcon, Building2, Globe, Edit, Plus } from 'lucide-react';
import StoreDeptEditStoreDrawer from './StoreDeptEditStoreDrawer';

const initialStores = [
  { id:'AMZ_US_01', storeId:'AMZ_US_01', storeName:'Amazon美国站', customerGroup:'Amazon', country:'美国',
    departmentName:'欧美事业部 > 平台电商部', costCenterName:'欧美事业部-平台电商部成本中心',
    kingdeeOrgCode:'100', effectiveDate:'2024-01-01', lastSyncTime:'2025-07-15 10:00:00',
    isActive:true, status:'active', remarks:'' },
  { id:'TIKTOK_ACCU', storeId:'TIKTOK_ACCU', storeName:'TikTokACCU', customerGroup:'TikTok US', country:'美国',
    departmentName:'欧美事业部 > 直营电商部', costCenterName:'欧美事业部-直营电商部成本中心',
    kingdeeOrgCode:'205', effectiveDate:'2025-01-01', lastSyncTime:'2025-07-15 10:00:00',
    isActive:true, status:'active', remarks:'亚马逊广告投放' },
  { id:'TMALL_CN_01', storeId:'TMALL_CN_01', storeName:'卡斯丁天猫旗舰店', customerGroup:'天猫', country:'中国',
    departmentName:'亚太事业部 > 平台电商部', costCenterName:'亚太事业部-平台电商部成本中心',
    kingdeeOrgCode:'501', effectiveDate:'2024-01-01', lastSyncTime:'', isActive:true, status:'active', remarks:'' },
  { id:'AMZ_UK_01', storeId:'AMZ_UK_01', storeName:'Amazon英国站', customerGroup:'Amazon', country:'英国',
    departmentName:'欧美事业部 > 平台电商部', costCenterName:'欧美事业部-平台电商部成本中心',
    kingdeeOrgCode:'101', effectiveDate:'2024-03-01', lastSyncTime:'2025-07-14 15:30:00',
    isActive:true, status:'active', remarks:'' },
  { id:'SHOPEE_SG_01', storeId:'SHOPEE_SG_01', storeName:'Shopee新加坡站', customerGroup:'Shopee', country:'新加坡',
    departmentName:'亚太事业部 > 平台电商部', costCenterName:'亚太事业部-平台电商部成本中心',
    kingdeeOrgCode:'502', effectiveDate:'2024-06-01', lastSyncTime:'2025-07-13 09:20:00',
    isActive:true, status:'active', remarks:'' },
  { id:'EBAY_US_01', storeId:'EBAY_US_01', storeName:'eBay美国站', customerGroup:'eBay', country:'美国',
    departmentName:'欧美事业部 > 平台电商部', costCenterName:'欧美事业部-平台电商部成本中心',
    kingdeeOrgCode:'102', effectiveDate:'2024-02-15', lastSyncTime:'2025-07-12 14:45:00',
    isActive:false, status:'inactive', remarks:'已停用' },
];

export default function StoreDeptMappingPage() {
  const [stores, setStores] = useState(initialStores);
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('all');
  const [country, setCountry] = useState('all');
  const [status, setStatus] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const groups = useMemo(() => Array.from(new Set(stores.map(s => s.customerGroup))), [stores]);
  const countries = useMemo(() => Array.from(new Set(stores.map(s => s.country))), [stores]);

  const filtered = useMemo(() => {
    return stores.filter(s => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q ||
        s.storeId.toLowerCase().includes(q) ||
        s.storeName.toLowerCase().includes(q) ||
        s.departmentName.toLowerCase().includes(q);
      const matchChannel = channel === 'all' || s.customerGroup === channel;
      const matchCountry = country === 'all' || s.country === country;
      const matchStatus = status === 'all' || s.status === status;
      return matchSearch && matchChannel && matchCountry && matchStatus;
    });
  }, [stores, search, channel, country, status]);

  const handleEdit = (store) => {
    setSelectedStore(store);
    setIsDrawerOpen(true);
  };

  const handleNew = () => {
    setSelectedStore(null);
    setIsDrawerOpen(true);
  };

  const handleSave = (formData) => {
    if (selectedStore) {
      // 编辑
      setStores(stores.map(s => s.id === selectedStore.id ? { ...formData, id: s.id } : s));
    } else {
      // 新建
      const newStore = { ...formData, id: formData.storeId };
      setStores([...stores, newStore]);
    }
    setIsDrawerOpen(false);
    setSelectedStore(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedStore(null);
  };

  return (
    <div className="flex h-full gap-4">
      {/* 左侧列表区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h3 className="text-xl font-bold">店铺与部门归属映射</h3>
          <p className="text-gray-600 mt-1">维护电商店铺与组织部门、成本中心的对应关系。</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="搜索店铺ID / 名称 / 归属部门"
                className="pl-9 pr-3 py-2 border rounded-lg text-sm w-72"
              />
            </div>

            <select value={channel} onChange={(e)=>setChannel(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
              <option value="all">全部客户分组</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <select value={country} onChange={(e)=>setCountry(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
              <option value="all">全部国家</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
              <option value="all">全部状态</option>
              <option value="active">启用</option>
              <option value="inactive">停用</option>
              <option value="disabled">禁用</option>
            </select>

            <div className="flex-1" />
            <button 
              onClick={handleNew}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> 新建
            </button>
            <button className="px-3 py-2 border rounded-lg text-sm flex items-center gap-2">
              <Upload className="w-4 h-4" /> 批量导入
            </button>
            <button className="px-3 py-2 border rounded-lg text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> 导出数据
            </button>
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm min-w-[1400px]">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">金蝶店铺ID</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">金蝶店铺名称</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">客户分组</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">金蝶归属组织</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">所属地区</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">当前生效</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">生效日期</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap min-w-[180px]">归属部门</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap min-w-[200px]">关联成本中心</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">拉取时间</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">备注</th>
                <th className="px-4 py-3 text-left text-gray-600 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr key={s.id} className={`border-b ${idx % 2 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-900">
                      <StoreIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {s.storeId}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{s.storeName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded text-xs bg-purple-50 text-purple-700 border border-purple-200">
                      {s.customerGroup}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{s.kingdeeOrgCode}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {s.status === 'active'
                      ? <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 border border-green-200">启用</span>
                      : s.status === 'inactive'
                      ? <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 border">停用</span>
                      : <span className="px-2 py-1 rounded text-xs bg-red-50 text-red-700 border border-red-200">禁用</span>
                    }
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4 flex-shrink-0" /> {s.country}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {s.isActive
                      ? <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 border border-green-200 inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500" /> 生效中
                        </span>
                      : <span className="px-2 py-1 rounded text-xs bg-gray-50 text-gray-500 border border-gray-200">已失效</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.effectiveDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {s.departmentName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-blue-600 whitespace-nowrap">{s.costCenterName}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{s.lastSyncTime || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{s.remarks || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(s)}
                      className="px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded text-sm flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" /> 编辑
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="13" className="text-center text-gray-500 py-10">
                    没有找到匹配的店铺
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>

          <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{filtered.length}</span> 条记录
          </div>
        </div>
      </div>

      {/* 右侧抽屉 */}
      <StoreDeptEditStoreDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        store={selectedStore}
        onSave={handleSave}
      />
    </div>
  );
}
