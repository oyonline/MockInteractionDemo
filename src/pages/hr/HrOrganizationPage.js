// src/pages/hr/HrOrganizationPage.js
// HR组织架构管理页面 - 独立数据，支持完整编辑和HR特有功能
import React, { useState, useMemo } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Users,
    UserPlus,
    UserMinus,
    AlertCircle,
    Briefcase,
    Phone,
    Mail,
    Plus,
    Edit2,
    Trash2,
    Search,
    Download,
    X,
    Building2,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import { toast } from '../../components/ui/Toast';

const cn = (...args) => args.filter(Boolean).join(' ');

/** ---------------- HR独立的Mock数据（复制自OrganizationManagementPage）---------------- */
const initialDepartments = [
    { id: '1', code: 'BM000007', name: '欧美事业部', parentCode: 'ROOT', parentName: '集团总部', level: 1, manager: 'Tate', managerPhone: '13800138001', managerEmail: 'tate@company.com', headcount: 100, actualCount: 78, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 850000 },
    { id: '2', code: '', name: '零售', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Eric', managerPhone: '13800138002', managerEmail: 'eric@company.com', headcount: 5, actualCount: 4, status: 'inactive', updateDate: '2024-12-31', type: '业务单元', monthlyCost: 45000 },
    { id: '3', code: 'BM000093', name: '行政及仓储部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Jed', managerPhone: '13800138003', managerEmail: 'jed@company.com', headcount: 2, actualCount: 1, status: 'active', updateDate: '2024-01-01', type: '职能单元', monthlyCost: 28000 },
    { id: '4', code: 'BM000094', name: '直营电商部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: '-', managerPhone: '', managerEmail: '', headcount: 35, actualCount: 30, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 320000 },
    { id: '5', code: '', name: '市场营销组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', managerPhone: '', managerEmail: '', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 55000 },
    { id: '6', code: '', name: '视频内容组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', managerPhone: '', managerEmail: '', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-12-01', type: '业务单元', monthlyCost: 48000 },
    { id: '7', code: '', name: 'DTC运营组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '孙静', managerPhone: '13800138007', managerEmail: 'sunjing@company.com', headcount: 7, actualCount: 6, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 62000 },
    { id: '8', code: '', name: 'Tiktok运营组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', managerPhone: '', managerEmail: '', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 50000 },
    { id: '9', code: '', name: '达人建联组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', managerPhone: '', managerEmail: '', headcount: 5, actualCount: 4, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 42000 },
    { id: '10', code: '', name: '品牌市场组', parentCode: 'BM000094', parentName: '直营电商部', level: 3, manager: '-', managerPhone: '', managerEmail: '', headcount: 6, actualCount: 5, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 55000 },
    { id: '11', code: 'BM000101', name: '平台电商部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Jason', managerPhone: '13800138011', managerEmail: 'jason@company.com', headcount: 32, actualCount: 27, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 280000 },
    { id: '12', code: '', name: '线钓组', parentCode: 'BM000101', parentName: '平台电商部', level: 3, manager: '-', managerPhone: '', managerEmail: '', headcount: 5, actualCount: 4, status: 'active', updateDate: '2025-02-01', type: '业务单元', monthlyCost: 38000 },
    { id: '18', code: 'BM000108', name: '创意设计部', parentCode: 'BM000007', parentName: '欧美事业部', level: 2, manager: 'Tina', managerPhone: '13800138018', managerEmail: 'tina@company.com', headcount: 20, actualCount: 16, status: 'active', updateDate: '2024-01-01', type: '职能单元', monthlyCost: 180000 },
    { id: '19', code: 'BM000109', name: '全球共享服务中心', parentCode: 'ROOT', parentName: '集团总部', level: 1, manager: 'Harry', managerPhone: '13800138019', managerEmail: 'harry@company.com', headcount: 100, actualCount: 84, status: 'active', updateDate: '2024-01-01', type: '职能单元', monthlyCost: 720000 },
    { id: '20', code: 'BM000110', name: '人力资源部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: 'David', managerPhone: '13800138020', managerEmail: 'david@company.com', headcount: 12, actualCount: 10, status: 'active', updateDate: '2024-01-01', type: '职能单元', monthlyCost: 95000 },
    { id: '26', code: 'BM000116', name: '供应链管理部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: 'CH', managerPhone: '13800138026', managerEmail: 'ch@company.com', headcount: 36, actualCount: 31, status: 'active', updateDate: '2024-01-01', type: '职能单元', monthlyCost: 280000 },
    { id: '32', code: 'BM000129', name: '信息技术与系统服务部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: '林燊', managerPhone: '13800138032', managerEmail: 'linshen@company.com', headcount: 12, actualCount: 10, status: 'active', updateDate: '2025-01-10', type: '职能单元', monthlyCost: 320000 },
    { id: '37', code: 'BM000120', name: '产品开发部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: '-', managerPhone: '', managerEmail: '', headcount: 12, actualCount: 10, status: 'active', updateDate: '2024-01-01', type: '职能单元', monthlyCost: 260000 },
    { id: '38', code: 'BM000121', name: '产品研发部', parentCode: 'BM000109', parentName: '全球共享服务中心', level: 2, manager: '张云廷', managerPhone: '13800138038', managerEmail: 'zhangyt@company.com', headcount: 14, actualCount: 12, status: 'active', updateDate: '2024-01-01', type: '职能单元', monthlyCost: 310000 },
    { id: '39', code: 'BM000008', name: '亚太事业部', parentCode: 'ROOT', parentName: '集团总部', level: 1, manager: 'Effie', managerPhone: '13800138039', managerEmail: 'effie@company.com', headcount: 85, actualCount: 72, status: 'active', updateDate: '2024-01-01', type: '业务单元', monthlyCost: 680000 },
];

/** 部门员工数据（HR特有） */
const departmentEmployees = {
    'BM000007': [
        { id: 1, name: '张伟', position: '高级运营经理', phone: '13800138001', email: 'zhangwei@company.com', entryDate: '2023-06-01', status: 'active' },
        { id: 2, name: '李娜', position: '市场总监', phone: '13800138002', email: 'lina@company.com', entryDate: '2022-08-15', status: 'active' },
        { id: 3, name: '王强', position: '销售主管', phone: '13800138003', email: 'wangqiang@company.com', entryDate: '2023-03-20', status: 'active' },
    ],
    'BM000094': [
        { id: 4, name: '刘洋', position: '电商运营', phone: '13800138004', email: 'liuyang@company.com', entryDate: '2023-09-01', status: 'active' },
        { id: 5, name: '陈静', position: '内容运营', phone: '13800138005', email: 'chenjing@company.com', entryDate: '2024-01-10', status: 'active' },
    ],
    'BM000110': [
        { id: 6, name: '赵敏', position: 'HRBP', phone: '13800138006', email: 'zhaomin@company.com', entryDate: '2023-05-15', status: 'active' },
        { id: 7, name: '孙涛', position: '招聘专员', phone: '13800138007', email: 'suntao@company.com', entryDate: '2023-11-01', status: 'active' },
    ],
};

/** 招聘需求数据（HR特有） */
const departmentRecruitments = {
    'BM000007': 5,
    'BM000094': 3,
    'BM000101': 2,
    'BM000110': 1,
    'BM000116': 4,
};

/** 本月入职/离职统计（HR特有） */
const departmentStats = {
    'BM000007': { entry: 3, leave: 1 },
    'BM000094': { entry: 2, leave: 0 },
    'BM000110': { entry: 1, leave: 0 },
    'BM000116': { entry: 2, leave: 1 },
};

/** 工具：产生稳定节点键 */
const getNodeKey = (dept) => (dept.code && dept.code.length ? dept.code : `ID_${dept.id}`);

/** 工具：格式化金额 */
const formatMoney = (amount) => {
    if (amount >= 10000) {
        return `¥${(amount / 10000).toFixed(1)}万`;
    }
    return `¥${amount.toLocaleString()}`;
};

export default function HrOrganizationPage() {
    const [departments, setDepartments] = useState(initialDepartments);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('edit'); // 'edit' | 'employees'
    const [expandedNodes, setExpandedNodes] = useState(new Set(['ROOT']));
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // 搜索过滤
    const filtered = useMemo(() => {
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

    // 构建可见列表
    const visibleDepartments = useMemo(() => {
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

    // 打开编辑抽屉
    const handleEdit = (dept, e) => {
        e.stopPropagation();
        setSelectedDepartment(dept);
        setDrawerMode('edit');
        setDrawerOpen(true);
    };

    // 打开员工列表抽屉
    const handleViewEmployees = (dept, e) => {
        e.stopPropagation();
        setSelectedDepartment(dept);
        setDrawerMode('employees');
        setDrawerOpen(true);
    };

    // 新增部门
    const handleAdd = () => {
        const newDept = {
            id: Date.now().toString(),
            code: '',
            name: '',
            parentCode: 'ROOT',
            parentName: '集团总部',
            level: 1,
            manager: '',
            managerPhone: '',
            managerEmail: '',
            headcount: 0,
            actualCount: 0,
            status: 'active',
            updateDate: new Date().toISOString().split('T')[0],
            type: '业务单元',
            monthlyCost: 0,
        };
        setSelectedDepartment(newDept);
        setDrawerMode('edit');
        setDrawerOpen(true);
    };

    // 保存部门
    const handleSave = () => {
        if (!selectedDepartment) return;
        
        if (departments.find(d => d.id === selectedDepartment.id)) {
            // 更新
            setDepartments((prev) => prev.map((d) => (d.id === selectedDepartment.id ? selectedDepartment : d)));
        } else {
            // 新增
            setDepartments((prev) => [...prev, selectedDepartment]);
        }
        setDrawerOpen(false);
        toast.success('已保存修改');
    };

    // 删除部门
    const handleDelete = (dept, e) => {
        e.stopPropagation();
        if (hasChildren(dept.code)) {
            toast.warning('该部门下有子部门，无法删除！');
            return;
        }
        setShowDeleteConfirm(dept);
    };

    const confirmDelete = () => {
        if (showDeleteConfirm) {
            setDepartments((prev) => prev.filter((d) => d.id !== showDeleteConfirm.id));
            setShowDeleteConfirm(null);
            toast.success('部门已删除');
        }
    };

    // 获取部门员工
    const getDeptEmployees = (deptCode) => {
        return departmentEmployees[deptCode] || [];
    };

    // 获取招聘需求
    const getRecruitmentCount = (deptCode) => {
        return departmentRecruitments[deptCode] || 0;
    };

    // 获取入离职统计
    const getDeptStats = (deptCode) => {
        return departmentStats[deptCode] || { entry: 0, leave: 0 };
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 顶部标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">HR组织架构管理</h1>
                        <p className="text-sm text-gray-500 mt-1">管理部门架构、编制及员工分布</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            新增部门
                        </button>
                    </div>
                </div>
            </div>

            {/* 工具条 */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索部门名称、编码或负责人..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={expandAll} className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                            全部展开
                        </button>
                        <button onClick={collapseAll} className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                            全部收起
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            导出数据
                        </button>
                    </div>
                </div>
            </div>

            {/* 表格 */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">部门名称</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">编码</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">负责人</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">编制/实际</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">本月入/离职</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">待招</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">人力成本</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {visibleDepartments.map((dept, idx) => {
                                const nodeKey = getNodeKey(dept);
                                const isExpanded = expandedNodes.has(nodeKey);
                                const showExpandIcon = hasChildren(dept.code);
                                const indent = (dept.level || 1) - 1;
                                const recruitmentCount = getRecruitmentCount(dept.code);
                                const stats = getDeptStats(dept.code);
                                const isOverstaffed = dept.actualCount > dept.headcount;

                                return (
                                    <tr key={dept.id} className={cn('hover:bg-gray-50', idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center" style={{ paddingLeft: indent * 24 }}>
                                                {showExpandIcon ? (
                                                    <button
                                                        onClick={() => toggleNode(nodeKey)}
                                                        className="mr-2 p-0.5 rounded hover:bg-gray-200"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-600" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="w-5 mr-2" />
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">{dept.name || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{dept.code || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'px-2 py-0.5 rounded text-xs border',
                                                dept.type === '业务单元' 
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                    : 'bg-gray-100 text-gray-700 border-gray-200'
                                            )}>
                                                {dept.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {dept.manager ? (
                                                <div>
                                                    <p className="text-sm text-gray-900">{dept.manager}</p>
                                                    {dept.managerPhone && (
                                                        <p className="text-xs text-gray-500">{dept.managerPhone}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    'text-sm font-medium',
                                                    isOverstaffed ? 'text-red-600' : 'text-gray-900'
                                                )}>
                                                    {dept.actualCount}/{dept.headcount}
                                                </span>
                                                {isOverstaffed && (
                                                    <AlertCircle className="w-4 h-4 text-red-500" title="超编" />
                                                )}
                                            </div>
                                            {dept.headcount > 0 && (
                                                <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full',
                                                            isOverstaffed ? 'bg-red-500' : 'bg-blue-500'
                                                        )}
                                                        style={{ width: `${Math.min((dept.actualCount / dept.headcount) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <UserPlus className="w-3 h-3" />
                                                    {stats.entry}
                                                </span>
                                                <span className="flex items-center gap-1 text-red-600">
                                                    <UserMinus className="w-3 h-3" />
                                                    {stats.leave}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {recruitmentCount > 0 ? (
                                                <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-medium border border-orange-200">
                                                    {recruitmentCount}个
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {dept.monthlyCost ? formatMoney(dept.monthlyCost) : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'px-2 py-0.5 rounded text-xs border',
                                                dept.status === 'active' 
                                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                            )}>
                                                {dept.status === 'active' ? '启用' : '停用'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => handleViewEmployees(dept, e)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="查看员工"
                                                >
                                                    <Users className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleEdit(dept, e)}
                                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                                    title="编辑"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(dept, e)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                    title="删除"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {visibleDepartments.length === 0 && (
                                <tr>
                                    <td className="px-4 py-12 text-center text-gray-500" colSpan={10}>
                                        没有找到匹配的部门
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 右侧抽屉 */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
                    <div className="relative w-[50vw] min-w-[600px] h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right">
                        {/* 头部 */}
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3">
                                {drawerMode === 'edit' ? (
                                    <>
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{selectedDepartment?.id ? '编辑部门' : '新增部门'}</h3>
                                            <p className="text-xs text-gray-500">{selectedDepartment?.name || '新部门'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">部门员工</h3>
                                            <p className="text-xs text-gray-500">{selectedDepartment?.name} · 共{getDeptEmployees(selectedDepartment?.code).length}人</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* 内容 */}
                        <div className="flex-1 overflow-auto p-6">
                            {drawerMode === 'edit' ? (
                                <div className="space-y-6">
                                    {/* 基本信息 */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            基本信息
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">部门编码</label>
                                                <input
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.code || ''}
                                                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, code: e.target.value })}
                                                    placeholder="例：DEPT001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">部门名称</label>
                                                <input
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.name || ''}
                                                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, name: e.target.value })}
                                                    placeholder="例：人力资源部"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1.5">上级部门</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.parentCode || 'ROOT'}
                                                    onChange={(e) => {
                                                        const parent = departments.find(d => d.code === e.target.value);
                                                        setSelectedDepartment({
                                                            ...selectedDepartment,
                                                            parentCode: e.target.value,
                                                            parentName: parent?.name || '集团总部',
                                                            level: (parent?.level || 0) + 1,
                                                        });
                                                    }}
                                                >
                                                    <option value="ROOT">集团总部</option>
                                                    {departments.map(d => (
                                                        <option key={d.id} value={d.code}>{d.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 负责人信息 */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-gray-400" />
                                            负责人信息
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">部门负责人</label>
                                                <input
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.manager || ''}
                                                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, manager: e.target.value })}
                                                    placeholder="输入负责人姓名"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1.5">联系电话</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={selectedDepartment?.managerPhone || ''}
                                                            onChange={(e) => setSelectedDepartment({ ...selectedDepartment, managerPhone: e.target.value })}
                                                            placeholder="13800138000"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1.5">邮箱</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={selectedDepartment?.managerEmail || ''}
                                                            onChange={(e) => setSelectedDepartment({ ...selectedDepartment, managerEmail: e.target.value })}
                                                            placeholder="manager@company.com"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 人员配置 */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            人员配置
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">编制人数</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.headcount ?? 0}
                                                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, headcount: parseInt(e.target.value) || 0 })}
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">实际人数</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                    <span className={cn(
                                                        'font-medium',
                                                        selectedDepartment.actualCount > selectedDepartment.headcount ? 'text-red-600' : 'text-blue-600'
                                                    )}>
                                                        {((selectedDepartment.actualCount / selectedDepartment.headcount) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full transition-all',
                                                            selectedDepartment.actualCount > selectedDepartment.headcount ? 'bg-red-500' : 'bg-blue-600'
                                                        )}
                                                        style={{ width: `${Math.min((selectedDepartment.actualCount / selectedDepartment.headcount) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                {selectedDepartment.actualCount > selectedDepartment.headcount && (
                                                    <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        已超编 {selectedDepartment.actualCount - selectedDepartment.headcount} 人
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 人力成本 */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            人力成本
                                        </h4>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5">月度人力成本（元）</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={selectedDepartment?.monthlyCost || 0}
                                                onChange={(e) => setSelectedDepartment({ ...selectedDepartment, monthlyCost: parseInt(e.target.value) || 0 })}
                                                min="0"
                                                step="1000"
                                            />
                                        </div>
                                    </div>

                                    {/* 其他设置 */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-gray-400" />
                                            其他设置
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">单元类型</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.type || '业务单元'}
                                                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, type: e.target.value })}
                                                >
                                                    <option value="业务单元">业务单元</option>
                                                    <option value="职能单元">职能单元</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">生效日期</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.updateDate || ''}
                                                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, updateDate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1.5">部门状态</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedDepartment?.status || 'active'}
                                                    onChange={(e) => setSelectedDepartment({ ...selectedDepartment, status: e.target.value })}
                                                >
                                                    <option value="active">启用</option>
                                                    <option value="inactive">停用</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {getDeptEmployees(selectedDepartment?.code).length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Users className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500">暂无员工数据</p>
                                        </div>
                                    ) : (
                                        getDeptEmployees(selectedDepartment?.code).map((emp) => (
                                            <div key={emp.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">{emp.name[0]}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{emp.name}</p>
                                                            <p className="text-sm text-gray-500">{emp.position}</p>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        'px-2 py-0.5 rounded text-xs border',
                                                        emp.status === 'active' 
                                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                    )}>
                                                        {emp.status === 'active' ? '在职' : '离职'}
                                                    </span>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {emp.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {emp.email}
                                                    </div>
                                                    <div className="col-span-2 text-xs text-gray-500">
                                                        入职日期：{emp.entryDate}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 底部按钮 */}
                        {drawerMode === 'edit' && (
                            <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                                <button 
                                    onClick={() => setDrawerOpen(false)} 
                                    className="flex-1 h-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    className="flex-1 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                >
                                    保存修改
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 删除确认弹窗 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(null)} />
                    <div className="relative bg-white rounded-xl shadow-2xl p-6 w-[400px]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">确认删除</h3>
                                <p className="text-sm text-gray-500">此操作不可撤销</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            确定要删除部门 <span className="font-medium text-gray-900">「{showDeleteConfirm.name}」</span> 吗？
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowDeleteConfirm(null)} 
                                className="flex-1 h-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm"
                            >
                                取消
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="flex-1 h-10 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
