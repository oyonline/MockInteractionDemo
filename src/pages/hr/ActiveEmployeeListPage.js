// src/pages/hr/ActiveEmployeeListPage.js
// 在职员工列表页面
import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    Group,
    ArrowUpDown,
    X,
    ChevronLeft,
    ChevronRight,
    Eye,
    Download,
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Building2,
    Briefcase,
    Calendar,
    CreditCard,
    Shield,
    Tag,
    CheckCircle2,
    UserCheck,
    FileText,
    Award
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- Mock 在职员工数据 ---------------
const mockActiveEmployees = [
    {
        id: 1,
        name: '张伟',
        employeeNo: 'EP2021001',
        birthDate: '1990-05-15',
        phone: '13800138001',
        email: 'zhangwei@company.com',
        education: '本科',
        school: '北京大学',
        graduateDate: '2012-06-30',
        department: '技术部',
        position: '高级工程师',
        tags: ['数据分析', '项目管理'],
        highlights: '主导过3个核心系统重构项目',
        entryDate: '2021-03-01',
        probationEndDate: '2021-06-01',
        contractEndDate: '2026-03-01',
        employmentType: '正式',
        workLocation: '北京总部',
        source: 'BOSS直聘',
        address: '北京市海淀区中关村大街1号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei',
        socialSecurity: '11010119900515001X',
        providentFund: '11010119900515001X',
        bankCard: '6222021234567890123',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 2,
        name: '李娜',
        employeeNo: 'EP2020005',
        birthDate: '1988-08-22',
        phone: '13800138002',
        email: 'lina@company.com',
        education: '研究生',
        school: '清华大学',
        graduateDate: '2014-06-30',
        department: '产品部',
        position: '产品总监',
        tags: ['海外背景', '客户管理', '营销策划'],
        highlights: '10年产品经验，前BAT产品负责人',
        entryDate: '2020-06-15',
        probationEndDate: '2020-09-15',
        contractEndDate: '2025-06-15',
        employmentType: '正式',
        workLocation: '北京总部',
        source: '内推',
        address: '北京市朝阳区建国路88号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lina',
        socialSecurity: '11010119880822002X',
        providentFund: '11010119880822002X',
        bankCard: '6222021234567890124',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 3,
        name: '王强',
        employeeNo: 'EP2022008',
        birthDate: '1995-03-10',
        phone: '13800138003',
        email: 'wangqiang@company.com',
        education: '本科',
        school: '复旦大学',
        graduateDate: '2017-06-30',
        department: '市场部',
        position: '市场经理',
        tags: ['营销策划', '沟通能力', '新人培训'],
        highlights: '年度优秀员工，培训导师',
        entryDate: '2022-01-10',
        probationEndDate: '2022-04-10',
        contractEndDate: '2025-01-10',
        employmentType: '正式',
        workLocation: '上海分部',
        source: '智联招聘',
        address: '上海市浦东新区陆家嘴环路1000号',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang',
        socialSecurity: '31010119950310003X',
        providentFund: '31010119950310003X',
        bankCard: '6222021234567890125',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 4,
        name: '刘洋',
        employeeNo: 'EP2019003',
        birthDate: '1985-11-28',
        phone: '13800138004',
        email: 'liuyang@company.com',
        education: '博士',
        school: '斯坦福大学',
        graduateDate: '2015-06-30',
        department: '技术部',
        position: '技术VP',
        tags: ['海外背景', '项目管理', '数据分析'],
        highlights: '硅谷归国人才，专利发明人',
        entryDate: '2019-08-20',
        probationEndDate: '2019-11-20',
        contractEndDate: '2025-08-20',
        employmentType: '正式',
        workLocation: '深圳总部',
        source: '51Job',
        address: '深圳市南山区科技园',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuyang',
        socialSecurity: '44030119851128004X',
        providentFund: '44030119851128004X',
        bankCard: '6222021234567890126',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 5,
        name: '陈静',
        employeeNo: 'EP2021015',
        birthDate: '1992-07-08',
        phone: '13800138005',
        email: 'chenjing@company.com',
        education: '本科',
        school: '上海财经大学',
        graduateDate: '2014-06-30',
        department: '财务部',
        position: '财务经理',
        tags: ['数据分析', '沟通能力'],
        highlights: '注册会计师，财务流程优化专家',
        entryDate: '2021-05-18',
        probationEndDate: '2021-08-18',
        contractEndDate: '2026-05-18',
        employmentType: '正式',
        workLocation: '上海分部',
        source: 'BOSS直聘',
        address: '杭州市西湖区文三路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjing',
        socialSecurity: '33010619920708005X',
        providentFund: '33010619920708005X',
        bankCard: '6222021234567890127',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 6,
        name: '赵敏',
        employeeNo: 'EP2023015',
        birthDate: '1998-02-14',
        phone: '13800138006',
        email: 'zhaomin@company.com',
        education: '大专',
        school: '深圳职业技术学院',
        graduateDate: '2019-06-30',
        department: '客服部',
        position: '客服主管',
        tags: ['沟通能力', '客户管理', '新人培训'],
        highlights: '客户满意度连续12个月第一',
        entryDate: '2023-02-01',
        probationEndDate: '2023-05-01',
        contractEndDate: '2026-02-01',
        employmentType: '正式',
        workLocation: '深圳总部',
        source: '内推',
        address: '深圳市福田区华强北路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaomin',
        socialSecurity: '44030419980214006X',
        providentFund: '44030419980214006X',
        bankCard: '6222021234567890128',
        ethnicity: '壮族',
        status: 'active'
    },
    {
        id: 7,
        name: '孙涛',
        employeeNo: 'EP2020050',
        birthDate: '1989-09-20',
        phone: '13800138007',
        email: 'xupeng@company.com',
        education: '研究生',
        school: '上海交通大学',
        graduateDate: '2015-06-30',
        department: '供应链部',
        position: '供应链总监',
        tags: ['项目管理', '数据分析', '沟通能力'],
        highlights: '供应链管理专家，成本节约500万',
        entryDate: '2020-11-11',
        probationEndDate: '2021-02-11',
        contractEndDate: '2025-11-11',
        employmentType: '正式',
        workLocation: '上海分部',
        source: '智联招聘',
        address: '上海市闵行区东川路800号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suntao',
        socialSecurity: '31011219890920007X',
        providentFund: '31011219890920007X',
        bankCard: '6222021234567890129',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 8,
        name: '周雪',
        employeeNo: 'EP2022022',
        birthDate: '1993-12-03',
        phone: '13800138008',
        email: 'zhouxue@company.com',
        education: '本科',
        school: '武汉大学',
        graduateDate: '2016-06-30',
        department: '人力资源部',
        position: 'HRBP',
        tags: ['沟通能力', '新人培训', '项目管理'],
        highlights: '校招负责人，年度招聘200+',
        entryDate: '2022-07-01',
        probationEndDate: '2022-10-01',
        contractEndDate: '2025-07-01',
        employmentType: '正式',
        workLocation: '武汉分部',
        source: '51Job',
        address: '武汉市洪山区珞喻路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouxue',
        socialSecurity: '42011119931203008X',
        providentFund: '42011119931203008X',
        bankCard: '6222021234567890130',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 9,
        name: '吴磊',
        employeeNo: 'EP2018025',
        birthDate: '1983-04-18',
        phone: '13800138009',
        email: 'wulei@company.com',
        education: '本科',
        school: '中山大学',
        graduateDate: '2006-06-30',
        department: '销售部',
        position: '销售总监',
        tags: ['客户管理', '营销策划', '沟通能力'],
        highlights: '连续5年销冠，团队管理经验丰富',
        entryDate: '2018-03-15',
        probationEndDate: '2018-06-15',
        contractEndDate: '2026-03-15',
        employmentType: '正式',
        workLocation: '广州分部',
        source: 'BOSS直聘',
        address: '广州市天河区珠江新城',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wulei',
        socialSecurity: '44010619830418009X',
        providentFund: '44010619830418009X',
        bankCard: '6222021234567890131',
        ethnicity: '汉族',
        status: 'active'
    },
    {
        id: 10,
        name: '郑芳',
        employeeNo: 'EP2021025',
        birthDate: '1991-06-25',
        phone: '13800138010',
        email: 'zhengfang@company.com',
        education: '研究生',
        school: '南京大学',
        graduateDate: '2016-06-30',
        department: '技术部',
        position: '架构师',
        tags: ['海外背景', '数据分析', '项目管理'],
        highlights: '微服务架构专家，开源贡献者',
        entryDate: '2021-09-01',
        probationEndDate: '2021-12-01',
        contractEndDate: '2026-09-01',
        employmentType: '正式',
        workLocation: '南京分部',
        source: '内推',
        address: '南京市鼓楼区汉口路22号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengfang',
        socialSecurity: '32010619910625010X',
        providentFund: '32010619910625010X',
        bankCard: '6222021234567890132',
        ethnicity: '满族',
        status: 'active'
    },
    {
        id: 11,
        name: '钱明',
        employeeNo: 'EP2023070',
        birthDate: '1997-10-12',
        phone: '13800138011',
        email: 'qianming@company.com',
        education: '本科',
        school: '四川美术学院',
        graduateDate: '2020-06-30',
        department: '设计部',
        position: 'UI设计师',
        tags: ['营销策划', '沟通能力'],
        highlights: '红点奖获得者，设计系统搭建者',
        entryDate: '2023-06-01',
        probationEndDate: '2023-09-01',
        contractEndDate: '2026-06-01',
        employmentType: '正式',
        workLocation: '成都分部',
        source: 'BOSS直聘',
        address: '成都市武侯区一环路南一段',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qianming',
        socialSecurity: '51010719971012011X',
        providentFund: '51010719971012011X',
        bankCard: '6222021234567890133',
        ethnicity: '汉族',
        status: 'probation'
    },
    {
        id: 12,
        name: '冯晓',
        employeeNo: 'EP2019033',
        birthDate: '1987-01-30',
        phone: '13800138012',
        email: 'fengxiao@company.com',
        education: '大专',
        school: '广东轻工职业技术学院',
        graduateDate: '2008-06-30',
        department: '仓储部',
        position: '仓库主管',
        tags: ['项目管理', '沟通能力'],
        highlights: '仓储管理专家，库存准确率99.9%',
        entryDate: '2019-05-20',
        probationEndDate: '2019-08-20',
        contractEndDate: '2025-05-20',
        employmentType: '正式',
        workLocation: '佛山仓储中心',
        source: '智联招聘',
        address: '佛山市南海区桂城街道',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fengxiao',
        socialSecurity: '44060519870130012X',
        providentFund: '44060519870130012X',
        bankCard: '6222021234567890134',
        ethnicity: '汉族',
        status: 'active'
    }
];

// --------------- 标签颜色配置 ---------------
const tagColors = {
    '沟通能力': 'bg-blue-100 text-blue-700 border-blue-200',
    '海外背景': 'bg-purple-100 text-purple-700 border-purple-200',
    '数据分析': 'bg-green-100 text-green-700 border-green-200',
    '营销策划': 'bg-orange-100 text-orange-700 border-orange-200',
    '客户管理': 'bg-pink-100 text-pink-700 border-pink-200',
    '项目管理': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    '新人培训': 'bg-teal-100 text-teal-700 border-teal-200'
};

const educationColors = {
    '博士': 'bg-red-100 text-red-700 border-red-200',
    '研究生': 'bg-purple-100 text-purple-700 border-purple-200',
    '本科': 'bg-blue-100 text-blue-700 border-blue-200',
    '大专': 'bg-gray-100 text-gray-700 border-gray-200'
};

const statusColors = {
    'active': 'bg-green-100 text-green-700 border-green-200',
    'probation': 'bg-yellow-100 text-yellow-700 border-yellow-200'
};

const statusLabels = {
    'active': '正式员工',
    'probation': '试用期'
};

const sourceColors = {
    '内推': 'bg-purple-100 text-purple-700 border-purple-200',
    'BOSS直聘': 'bg-green-100 text-green-700 border-green-200',
    '智联招聘': 'bg-blue-100 text-blue-700 border-blue-200',
    '51Job': 'bg-orange-100 text-orange-700 border-orange-200'
};

// --------------- 下拉选择器组件 ---------------
const SelectFilter = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                        {value || placeholder}
                    </span>
                    <span className="flex items-center gap-1">
                        {value && (
                            <X 
                                className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('');
                                }}
                            />
                        )}
                        <span className="text-gray-400">▼</span>
                    </span>
                </button>
                
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                            <div className="p-2 border-b border-gray-100">
                                <input
                                    type="text"
                                    placeholder="搜索..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        onChange('');
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
                                >
                                    全部
                                </button>
                                {filteredOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className={cn(
                                            'w-full px-3 py-2 text-left text-sm hover:bg-gray-50',
                                            value === opt ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --------------- 员工详情 Drawer 组件 ---------------
const EmployeeDetailDrawer = ({ employee, onClose }) => {
    if (!employee) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-[500px] h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900">在职员工档案详情</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 基本信息卡片 */}
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-4">
                            <img
                                src={employee.photo}
                                alt={employee.name}
                                className="w-20 h-20 rounded-full bg-white/20 p-1"
                            />
                            <div>
                                <h3 className="text-2xl font-bold">{employee.name}</h3>
                                <p className="text-white/80 text-sm mt-1">{employee.employeeNo}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                                        {employee.department}
                                    </span>
                                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                                        {employee.position}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className={cn(
                                        'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                                        statusColors[employee.status]
                                    )}>
                                        {statusLabels[employee.status]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 联系信息 */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            联系信息
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">联系电话</p>
                                <p className="text-gray-900">{employee.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">电子邮箱</p>
                                <a 
                                    href={`mailto:${employee.email}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {employee.email}
                                </a>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 text-xs mb-1">家庭住址</p>
                                <p className="text-gray-900 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    {employee.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 个人信息 */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            个人信息
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">出生日期</p>
                                <p className="text-gray-900">{employee.birthDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">婚姻状况</p>
                                <p className="text-gray-900">{employee.maritalStatus}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">民族</p>
                                <p className="text-gray-900">{employee.ethnicity}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">工作地点</p>
                                <p className="text-gray-900">{employee.workLocation}</p>
                            </div>
                        </div>
                    </div>

                    {/* 工作信息 */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            工作信息
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">入职日期</p>
                                <p className="text-gray-900">{employee.entryDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">转正日期</p>
                                <p className="text-gray-900">{employee.probationEndDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">合同到期日</p>
                                <p className="text-gray-900">{employee.contractEndDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">员工类型</p>
                                <p className="text-gray-900">{employee.employmentType}</p>
                            </div>
                        </div>
                    </div>

                    {/* 教育背景 */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            教育背景
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">最高学历</p>
                                <span className={cn(
                                    'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                    educationColors[employee.education]
                                )}>
                                    {employee.education}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">毕业院校</p>
                                <p className="text-gray-900">{employee.school}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">毕业时间</p>
                                <p className="text-gray-900">{employee.graduateDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* 个人标签 & 亮点 */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            个人标签 & 亮点
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {employee.tags.map(tag => (
                                <span
                                    key={tag}
                                    className={cn(
                                        'px-2.5 py-1 rounded-full text-xs font-medium border',
                                        tagColors[tag] || 'bg-gray-100 text-gray-700 border-gray-200'
                                    )}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 bg-white p-3 rounded-lg border border-gray-100">
                            {employee.highlights}
                        </p>
                    </div>

                    {/* 账户信息 */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            账户信息
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5" />
                                    社保账号
                                </span>
                                <span className="text-gray-900 font-mono">{employee.socialSecurity}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5" />
                                    公积金账号
                                </span>
                                <span className="text-gray-900 font-mono">{employee.providentFund}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    银行卡号
                                </span>
                                <span className="text-gray-900 font-mono">{employee.bankCard}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function ActiveEmployeeListPage() {
    // 筛选状态
    const [filters, setFilters] = useState({
        name: '',
        department: '',
        position: '',
        workLocation: ''
    });
    
    // 学历 Tab
    const [activeEducationTab, setActiveEducationTab] = useState('all');
    
    // 搜索
    const [searchQuery, setSearchQuery] = useState('');
    
    // 分页
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    // 排序
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
    // 选中的员工（用于详情 Drawer）
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // 筛选选项
    const names = [...new Set(mockActiveEmployees.map(e => e.name))].sort();
    const departments = [...new Set(mockActiveEmployees.map(e => e.department))].sort();
    const positions = [...new Set(mockActiveEmployees.map(e => e.position))].sort();
    const workLocations = [...new Set(mockActiveEmployees.map(e => e.workLocation))].sort();

    // 学历 Tab 配置
    const educationTabs = [
        { key: 'all', label: '全部' },
        { key: '博士', label: '博士' },
        { key: '研究生', label: '研究生' },
        { key: '本科', label: '本科' },
        { key: '大专', label: '大专' }
    ];

    // 筛选逻辑
    const filteredData = useMemo(() => {
        let result = [...mockActiveEmployees];
        
        // 学历筛选
        if (activeEducationTab !== 'all') {
            result = result.filter(e => e.education === activeEducationTab);
        }
        
        // 下拉筛选
        if (filters.name) {
            result = result.filter(e => e.name === filters.name);
        }
        if (filters.department) {
            result = result.filter(e => e.department === filters.department);
        }
        if (filters.position) {
            result = result.filter(e => e.position === filters.position);
        }
        if (filters.workLocation) {
            result = result.filter(e => e.workLocation === filters.workLocation);
        }
        
        // 搜索
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e => 
                e.name.toLowerCase().includes(query) ||
                e.employeeNo.toLowerCase().includes(query) ||
                e.department.toLowerCase().includes(query) ||
                e.position.toLowerCase().includes(query)
            );
        }
        
        // 排序
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return result;
    }, [activeEducationTab, filters, searchQuery, sortConfig]);

    // 分页数据
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // 处理排序
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // 重置筛选
    const handleReset = () => {
        setFilters({ name: '', department: '', position: '', workLocation: '' });
        setActiveEducationTab('all');
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">在职员工列表</h1>
                        <p className="text-sm text-gray-500 mt-1">管理在职员工信息、合同及工作状态</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <UserCheck className="w-4 h-4" />
                            导出在职名单
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
                {/* 筛选区域 */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div className="grid grid-cols-4 gap-4">
                        <SelectFilter
                            label="姓名"
                            value={filters.name}
                            options={names}
                            onChange={(val) => setFilters(prev => ({ ...prev, name: val }))}
                            placeholder="请选择姓名"
                        />
                        <SelectFilter
                            label="部门"
                            value={filters.department}
                            options={departments}
                            onChange={(val) => setFilters(prev => ({ ...prev, department: val }))}
                            placeholder="请选择部门"
                        />
                        <SelectFilter
                            label="职位"
                            value={filters.position}
                            options={positions}
                            onChange={(val) => setFilters(prev => ({ ...prev, position: val }))}
                            placeholder="请选择职位"
                        />
                        <SelectFilter
                            label="工作地点"
                            value={filters.workLocation}
                            options={workLocations}
                            onChange={(val) => setFilters(prev => ({ ...prev, workLocation: val }))}
                            placeholder="请选择工作地点"
                        />
                    </div>
                    <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            清空筛选
                        </button>
                    </div>
                </div>

                {/* 学历筛选 Tab */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 mr-2">学历筛选：</span>
                        {educationTabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveEducationTab(tab.key);
                                    setCurrentPage(1);
                                }}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                    activeEducationTab === tab.key
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 数据表格 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                共 <span className="font-medium text-gray-900">{totalItems}</span> 条记录
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="搜索员工..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Filter className="w-4 h-4" />
                                筛选
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Group className="w-4 h-4" />
                                分组
                            </button>
                            <button 
                                onClick={() => handleSort('name')}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors',
                                    sortConfig.key === 'name' 
                                        ? 'bg-green-50 text-green-600' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                )}
                            >
                                <ArrowUpDown className="w-4 h-4" />
                                排序
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                                导出
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">姓名</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">工号</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">部门</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">职位</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">最高学历</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">入职日期</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">转正日期</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">合同到期日</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">工作地点</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedData.map(employee => (
                                    <tr key={employee.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={employee.photo}
                                                    alt={employee.name}
                                                    className="w-8 h-8 rounded-full bg-gray-100"
                                                />
                                                <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.employeeNo}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.department}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.position}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                                educationColors[employee.education]
                                            )}>
                                                {employee.education}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.entryDate}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.probationEndDate}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.contractEndDate}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.workLocation}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                                statusColors[employee.status]
                                            )}>
                                                {statusLabels[employee.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedEmployee(employee)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                查看详情
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 分页 */}
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                第 {currentPage} / {totalPages} 页
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">每页</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-500">条</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={cn(
                                            'min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors',
                                            currentPage === pageNum
                                                ? 'bg-green-600 text-white'
                                                : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                                        )}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {selectedEmployee && (
                <EmployeeDetailDrawer
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                />
            )}
        </div>
    );
}
