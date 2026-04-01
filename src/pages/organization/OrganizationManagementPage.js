import React from 'react';
// 可选：如果不想装 lucide-react，删除这一行和下面 JSX 里的图标标签即可
import { ChevronRight, ChevronDown } from 'lucide-react';

/** ---------------- Mock 数据 ---------------- */
const initialDepartments = [
  { id: '1', code: 'BM000007', name: '欧美事业部', parentCode: 'ROOT', parentName: '集团总部', level: 1, manager: 'Tate', headcount: 100, actualCount: 78, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '2', code: '', name: '零售', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Eric', headcount: 5, actualCount: 4, status: 'inactive', updateDate: '2024-12-31', type: '业务单元' },
  { id: '3', code: 'BM000093', name: '行政及仓储部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Jed', headcount: 2, actualCount: 1, status: 'active', updateDate: '2024-01-01', type: '职能单元' },
  { id: '4', code: 'BM000094', name: '直营电商部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: '-', headcount: 35, actualCount: 30, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '5', code: '', name: '市场营销组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '6', code: '', name: '视频内容组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-12-01', type: '业务单元' },
  { id: '7', code: '', name: 'DTC运营组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '孙静', headcount: 7, actualCount: 6, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '8', code: '', name: 'Tiktok运营组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '9', code: '', name: '达人建联组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', headcount: 5, actualCount: 4, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '10', code: '', name: '品牌市场组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '11', code: 'BM000101', name: '平台电商部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Jason', headcount: 32, actualCount: 27, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
  { id: '12', code: '', name: '线钓组', parentCode: 'BM000101', parentName: '平台电商部', level: 3, manager: '-', headcount: 5, actualCount: 4, status: 'active', updateDate: '2025-02-01', type: '业务单元' },
  { id: '18', code: 'BM000108', name: '创意设计部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Tina', headcount: 20, actualCount: 16, status: 'active', updateDate: '2024-01-01', type: '职能单元' },
  { id: '19', code: 'BM000109', name: '全球共享服务中心', parentCode: 'ROOT', parentName: '集团总部', level: 1, manager: 'Harry', headcount: 100, actualCount: 84, status: 'active', updateDate: '2024-01-01', type: '职能单元' },
  { id: '20', code: 'BM000110', name: '人力资源部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: 'David', headcount: 12, actualCount: 10, status: 'active', updateDate: '2024-01-01', type: '职能单元' },
  { id: '26', code: 'BM000116', name: '供应链管理部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: 'CH', headcount: 36, actualCount: 31, status: 'active', updateDate: '2024-01-01', type: '职能单元' },
  { id: '32', code: 'BM000129', name: '信息技术与系统服务部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: '林燊', headcount: 12, actualCount: 10, status: 'active', updateDate: '2025-01-10', type: '职能单元' },
  { id: '37', code: 'BM000120', name: '产品开发部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: '-', headcount: 12, actualCount: 10, status: 'active', updateDate: '2024-01-01', type: '职能单元' },
  { id: '38', code: 'BM000121', name: '产品研发部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: '张云廷', headcount: 14, actualCount: 12, status: 'active', updateDate: '2024-01-01', type: '职能单元' },
  { id: '39', code: 'BM000008', name: '亚太事业部', parentCode: 'ROOT', parentName: '集团总部', level: 1, manager: 'Effie', headcount: 85, actualCount: 72, status: 'active', updateDate: '2024-01-01', type: '业务单元' },
];

/** 工具：产生稳定节点键（解决 code 为空时展开冲突） */
const getNodeKey = (dept) => (dept.code && dept.code.length ? dept.code : `ID_${dept.id}`);

export default function OrganizationManagementPageSimple() {
  const [departments, setDepartments] = React.useState(initialDepartments);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [expandedNodes, setExpandedNodes] = React.useState(new Set(['ROOT']));

  // 搜索过滤 + 搜索时自动展开祖先
  const filtered = React.useMemo(() => {
    const res = departments.filter((d) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (d.name || '').toLowerCase().includes(q) ||
        (d.code || '').toLowerCase().includes(q) ||
        (d.manager || '').toLowerCase().includes(q)
      );
    });

    if (searchQuery) {
      const nodesToExpand = new Set(['ROOT']);
      function addAncestorKeys(dept) {
        const p = departments.find((x) => x.code === dept.parentCode);
        if (!p) return;
        nodesToExpand.add(getNodeKey(p));
        addAncestorKeys(p);
      }
      res.forEach((dept) => addAncestorKeys(dept));
      setExpandedNodes(nodesToExpand);
    }
    return res;
  }, [departments, searchQuery]);

  // 构建可见列表（根据展开状态）
  const visibleDepartments = React.useMemo(() => {
    const result = [];
    const addChildren = (parentCode) => {
      const children = filtered.filter((d) => d.parentCode === parentCode);
      children.forEach((child) => {
        result.push(child);
        if (expandedNodes.has(getNodeKey(child))) {
          addChildren(child.code);
        }
      });
    };
    const top = filtered.filter((d) => d.level === 1);
    top.forEach((t) => {
      result.push(t);
      if (expandedNodes.has(getNodeKey(t))) addChildren(t.code);
    });
    return result;
  }, [filtered, expandedNodes]);

  const hasChildren = (code) => departments.some((d) => d.parentCode === code);
  const toggleNode = (nodeKey) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeKey)) next.delete(nodeKey);
      else next.add(nodeKey);
      return next;
    });
  };
  const expandAll = () => {
    const all = new Set(['ROOT']);
    departments.forEach((d) => all.add(getNodeKey(d)));
    setExpandedNodes(all);
  };
  const collapseAll = () => setExpandedNodes(new Set(['ROOT']));

  const handleRowClick = (dept) => {
    setSelectedDepartment(dept);
    setDrawerOpen(true);
  };
  const handleSave = () => {
    if (!selectedDepartment) return;
    setDepartments((prev) => prev.map((d) => (d.id === selectedDepartment.id ? selectedDepartment : d)));
    setDrawerOpen(false);
    alert('已保存修改');
  };

  const handleAdd = () => {
    const newDept = {
      id: Date.now().toString(),
      code: '',
      name: '',
      parentCode: 'ROOT',
      parentName: '集团总部',
      level: 1,
      manager: '',
      headcount: 0,
      actualCount: 0,
      status: 'active',
      updateDate: new Date().toISOString().split('T')[0],
      type: '业务单元',
    };
    setDepartments((prev) => [...prev, newDept]);
    setSelectedDepartment(newDept);
    setDrawerOpen(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) setSelectedRows(visibleDepartments.map((d) => d.id));
    else setSelectedRows([]);
  };
  const handleSelectRow = (id, checked) => {
    setSelectedRows((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-gray-900 text-lg font-semibold">组织架构管理</h1>
      </div>

      {/* 工具条 */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full max-w-md min-w-[200px]">
            <input
              type="text"
              placeholder="搜索部门名称、编码或负责人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-3 pr-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={expandAll} className="h-10 px-3 rounded border text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              全部展开
            </button>
            <button onClick={collapseAll} className="h-10 px-3 rounded border text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              全部收起
            </button>
            <button onClick={handleAdd} className="h-10 px-3 rounded bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap">
              新增部门
            </button>
            <button className="h-10 px-3 rounded border text-gray-700 hover:bg-gray-50 whitespace-nowrap">导出数据</button>
          </div>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    checked={visibleDepartments.length > 0 && selectedRows.length === visibleDepartments.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-3 whitespace-nowrap">部门名称</th>
                <th className="p-3 whitespace-nowrap">金蝶部门编码</th>
                <th className="p-3 whitespace-nowrap">类型</th>
                <th className="p-3 whitespace-nowrap">负责人</th>
                <th className="p-3 whitespace-nowrap">预算编制</th>
                <th className="p-3 whitespace-nowrap">实际</th>
                <th className="p-3 whitespace-nowrap">层级</th>
                <th className="p-3 whitespace-nowrap">更新日期</th>
                <th className="p-3 whitespace-nowrap">状态</th>
              </tr>
            </thead>
            <tbody>
              {visibleDepartments.map((dept, idx) => {
                const nodeKey = getNodeKey(dept);
                const isExpanded = expandedNodes.has(nodeKey);
                const showExpandIcon = hasChildren(dept.code);
                const indent = (dept.level || 1) - 1;

                return (
                  <tr key={dept.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(dept.id)}
                        onChange={(e) => handleSelectRow(dept.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-3 cursor-pointer" onClick={() => handleRowClick(dept)}>
                      <div className="flex items-center" style={{ paddingLeft: indent * 24 }}>
                        {showExpandIcon ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNode(nodeKey);
                            }}
                            className="mr-2 p-0.5 rounded hover:bg-gray-200"
                            title={isExpanded ? '收起' : '展开'}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        ) : (
                          <span className="w-4 mr-2" />
                        )}
                        <span className="text-gray-900">{dept.name || '-'}</span>
                      </div>
                    </td>
                    <td className="p-3">{dept.code || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${dept.type === '业务单元' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                        {dept.type}
                      </span>
                    </td>
                    <td className="p-3">{dept.manager || '-'}</td>
                    <td className="p-3">{dept.headcount}</td>
                    <td className="p-3">{dept.actualCount}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded border text-xs">L{dept.level}</span></td>
                    <td className="p-3">{dept.updateDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${dept.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {dept.status === 'active' ? '启用' : '停用'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {visibleDepartments.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={10}>
                    没有找到匹配的部门
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 右侧抽屉（纯原生 div 实现） */}
      <div
        className={`fixed top-0 right-0 h-full w-[50vw] min-w-[600px] bg-white shadow-xl border-l border-gray-200 transition-transform duration-300 z-50 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="font-semibold">编辑部门详情</div>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-gray-900">✕</button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6 overflow-auto h-[calc(100%-112px)]">
          {/* 基本信息 */}
          <div>
            <div className="text-gray-700 font-medium mb-3">基本信息</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">部门编码</label>
                <input
                  className="mt-1 w-full h-10 rounded border px-3"
                  value={selectedDepartment?.code || ''}
                  onChange={(e) => setSelectedDepartment({ ...selectedDepartment, code: e.target.value })}
                  placeholder="例：DEPT001"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">部门名称</label>
                <input
                  className="mt-1 w-full h-10 rounded border px-3"
                  value={selectedDepartment?.name || ''}
                  onChange={(e) => setSelectedDepartment({ ...selectedDepartment, name: e.target.value })}
                  placeholder="例：人力资源部"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-700">上级部门</label>
                <select
                  className="mt-1 w-full h-10 rounded border px-3"
                  value={selectedDepartment?.parentCode || 'ROOT'}
                  onChange={(e) => {
                    const map = {
                      ROOT: '集团总部',
                      BM000007: '欧美事业部',
                      BM000094: '直营电商部',
                      BM000101: '平台电商部',
                      BM000109: '全球共享服务中心',
                      BM000110: '人力资源部',
                      BM000116: '供应链管理部',
                      BM000129: '信息技术与系统服务部',
                      BM000008: '亚太事业部',
                    };
                    setSelectedDepartment({
                      ...selectedDepartment,
                      parentCode: e.target.value,
                      parentName: map[e.target.value] || '',
                    });
                  }}
                >
                  <option value="ROOT">集团总部</option>
                  <option value="BM000007">欧美事业部</option>
                  <option value="BM000094">直营电商部</option>
                  <option value="BM000101">平台电商部</option>
                  <option value="BM000109">全球共享服务中心</option>
                  <option value="BM000110">人力资源部</option>
                  <option value="BM000116">供应链管理部</option>
                  <option value="BM000129">信息技术与系统服务部</option>
                  <option value="BM000008">亚太事业部</option>
                </select>
              </div>
            </div>
          </div>

          {/* 负责人 */}
          <div>
            <div className="text-gray-700 font-medium mb-3">负责人信息</div>
            <label className="text-sm text-gray-700">部门负责人</label>
            <input
              className="mt-1 w-full h-10 rounded border px-3"
              value={selectedDepartment?.manager || ''}
              onChange={(e) => setSelectedDepartment({ ...selectedDepartment, manager: e.target.value })}
              placeholder="输入负责人姓名"
            />
          </div>

          {/* 人员配置 */}
          <div>
            <div className="text-gray-700 font-medium mb-3">人员配置</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">编制人数</label>
                <input
                  type="number"
                  className="mt-1 w-full h-10 rounded border px-3"
                  value={selectedDepartment?.headcount ?? 0}
                  onChange={(e) => setSelectedDepartment({ ...selectedDepartment, headcount: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">实际人数</label>
                <input
                  type="number"
                  className="mt-1 w-full h-10 rounded border px-3"
                  value={selectedDepartment?.actualCount ?? 0}
                  onChange={(e) => setSelectedDepartment({ ...selectedDepartment, actualCount: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>

            {selectedDepartment?.headcount > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">编制利用率</span>
                  <span className="font-medium text-blue-600">
                    {((selectedDepartment.actualCount / selectedDepartment.headcount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.min((selectedDepartment.actualCount / selectedDepartment.headcount) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 生效与类型 */}
          <div>
            <div className="text-gray-700 font-medium mb-3">生效日期与类型</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">生效日期</label>
                <input
                  type="date"
                  className="mt-1 w-full h-10 rounded border px-3"
                  value={selectedDepartment?.updateDate || ''}
                  onChange={(e) => setSelectedDepartment({ ...selectedDepartment, updateDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">单元类型</label>
                <select
                  className="mt-1 w-full h-10 rounded border px-3"
                  value={selectedDepartment?.type || '业务单元'}
                  onChange={(e) => setSelectedDepartment({ ...selectedDepartment, type: e.target.value })}
                >
                  <option value="业务单元">业务单元</option>
                  <option value="职能单元">职能单元</option>
                </select>
              </div>
            </div>
          </div>

          {/* 状态 */}
          <div>
            <div className="text-gray-700 font-medium mb-3">状态设置</div>
            <label className="text-sm text-gray-700">部门状态</label>
            <select
              className="mt-1 w-full h-10 rounded border px-3"
              value={selectedDepartment?.status || 'active'}
              onChange={(e) => setSelectedDepartment({ ...selectedDepartment, status: e.target.value })}
            >
              <option value="active">启用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="h-[64px] px-6 py-3 border-t bg-white flex gap-3">
          <button onClick={() => setDrawerOpen(false)} className="flex-1 h-10 rounded border text-gray-700 hover:bg-gray-50">
            取消
          </button>
          <button onClick={handleSave} className="flex-1 h-10 rounded bg-blue-600 text-white hover:bg-blue-700">
            保存修改
          </button>
        </div>
      </div>
    </div>
  );
}

