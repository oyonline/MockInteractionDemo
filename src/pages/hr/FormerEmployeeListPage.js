// src/pages/hr/FormerEmployeeListPage.js
// 离职员工列表页面
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
    UserX,
    FileText,
    LogOut,
    Archive
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- Mock 离职员工数据 ---------------
const mockFormerEmployees = [
    {
        id: 101,
        name: '王明',
        employeeNo: 'EP2018056',
        birthDate: '1986-03-20',
        phone: '13900139001',
        email: 'wangming@company.com',
        education: '本科',
        school: '浙江大学',
        graduateDate: '2008-06-30',
        department: '技术部',
        position: '前端工程师',
        tags: ['沟通能力', '团队协作'],
        highlights: '负责过公司官网重构项目',
        entryDate: '2018-04-15',
        probationEndDate: '2018-07-15',
        leaveDate: '2024-12-31',
        leaveType: '主动离职',
        leaveReason: '个人发展',
        leaveDetails: '计划回老家创业，开设自己的工作室',
        handoverStatus: '已交接',
        workLocation: '杭州分部',
        source: '51Job',
        address: '杭州市西湖区文三路',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangming',
        socialSecurity: '33010619860320001X',
        providentFund: '33010619860320001X',
        bankCard: '6222021234567890201',
        ethnicity: '汉族',
        workingYears: 6.7,
        finalPosition: '高级前端工程师'
    },
    {
        id: 102,
        name: '李华',
        employeeNo: 'EP2020058',
        birthDate: '1992-09-12',
        phone: '13900139002',
        email: 'lihua@company.com',
        education: '研究生',
        school: '复旦大学',
        graduateDate: '2017-06-30',
        department: '市场部',
        position: '市场专员',
        tags: ['营销策划', '数据分析'],
        highlights: '多次获得月度优秀员工',
        entryDate: '2020-03-01',
        probationEndDate: '2020-06-01',
        leaveDate: '2024-11-15',
        leaveType: '主动离职',
        leaveReason: '家庭原因',
        leaveDetails: '配偶工作调动，需随迁至其他城市',
        handoverStatus: '已交接',
        workLocation: '上海分部',
        source: 'BOSS直聘',
        address: '上海市浦东新区陆家嘴环路1000号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lihua',
        socialSecurity: '31010119920912002X',
        providentFund: '31010119920912002X',
        bankCard: '6222021234567890202',
        ethnicity: '汉族',
        workingYears: 4.7,
        finalPosition: '高级市场专员'
    },
    {
        id: 103,
        name: '张丽',
        employeeNo: 'EP2019032',
        birthDate: '1988-12-05',
        phone: '13900139003',
        email: 'zhangli@company.com',
        education: '本科',
        school: '武汉大学',
        graduateDate: '2011-06-30',
        department: '人力资源部',
        position: 'HR专员',
        tags: ['沟通能力', '新人培训'],
        highlights: '建立了完善的入职培训体系',
        entryDate: '2019-07-01',
        probationEndDate: '2019-10-01',
        leaveDate: '2024-10-30',
        leaveType: '主动离职',
        leaveReason: '跳槽',
        leaveDetails: '接受了同行业头部企业的offer，职位为HR经理',
        handoverStatus: '已交接',
        workLocation: '武汉分部',
        source: '智联招聘',
        address: '武汉市洪山区珞喻路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangli',
        socialSecurity: '42011119881205003X',
        providentFund: '42011119881205003X',
        bankCard: '6222021234567890203',
        ethnicity: '汉族',
        workingYears: 5.3,
        finalPosition: 'HR主管'
    },
    {
        id: 104,
        name: '刘强',
        employeeNo: 'EP2021068',
        birthDate: '1995-06-18',
        phone: '13900139004',
        email: 'liuqiang@company.com',
        education: '大专',
        school: '深圳职业技术学院',
        graduateDate: '2016-06-30',
        department: '仓储部',
        position: '仓库管理员',
        tags: ['项目管理'],
        highlights: '仓库管理流程优化，提升效率20%',
        entryDate: '2021-05-20',
        probationEndDate: '2021-08-20',
        leaveDate: '2024-09-15',
        leaveType: '被动离职',
        leaveReason: '试用期不合格',
        leaveDetails: '工作能力未达到岗位要求，经培训后仍无法胜任',
        handoverStatus: '已交接',
        workLocation: '深圳仓储中心',
        source: 'BOSS直聘',
        address: '深圳市宝安区福永街道',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuqiang',
        socialSecurity: '44030619950618004X',
        providentFund: '44030619950618004X',
        bankCard: '6222021234567890204',
        ethnicity: '汉族',
        workingYears: 3.3,
        finalPosition: '仓库管理员'
    },
    {
        id: 105,
        name: '陈杰',
        employeeNo: 'EP2017045',
        birthDate: '1984-02-28',
        phone: '13900139005',
        email: 'chenjie@company.com',
        education: '研究生',
        school: '华中科技大学',
        graduateDate: '2009-06-30',
        department: '技术部',
        position: '后端工程师',
        tags: ['数据分析', '项目管理'],
        highlights: '核心系统架构师，技术骨干',
        entryDate: '2017-08-01',
        probationEndDate: '2017-11-01',
        leaveDate: '2024-08-31',
        leaveType: '主动离职',
        leaveReason: '个人发展',
        leaveDetails: '计划出国深造，攻读博士学位',
        handoverStatus: '已交接',
        workLocation: '武汉分部',
        source: '内推',
        address: '武汉市东湖高新区光谷大道',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjie',
        socialSecurity: '42011119840228005X',
        providentFund: '42011119840228005X',
        bankCard: '6222021234567890205',
        ethnicity: '汉族',
        workingYears: 7.1,
        finalPosition: '技术专家'
    },
    {
        id: 106,
        name: '杨芳',
        employeeNo: 'EP2022045',
        birthDate: '1997-11-08',
        phone: '13900139006',
        email: 'yangfang@company.com',
        education: '本科',
        school: '四川大学',
        graduateDate: '2020-06-30',
        department: '设计部',
        position: 'UI设计师',
        tags: ['营销策划'],
        highlights: '设计风格深受用户喜爱',
        entryDate: '2022-07-01',
        probationEndDate: '2022-10-01',
        leaveDate: '2024-07-20',
        leaveType: '主动离职',
        leaveReason: '转行',
        leaveDetails: '决定转型从事自由职业插画师',
        handoverStatus: '已交接',
        workLocation: '成都分部',
        source: 'BOSS直聘',
        address: '成都市高新区天府大道',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yangfang',
        socialSecurity: '51010719971108006X',
        providentFund: '51010719971108006X',
        bankCard: '6222021234567890206',
        ethnicity: '汉族',
        workingYears: 2.0,
        finalPosition: 'UI设计师'
    },
    {
        id: 107,
        name: '赵伟',
        employeeNo: 'EP2016068',
        birthDate: '1982-07-15',
        phone: '13900139007',
        email: 'zhaowei@company.com',
        education: '本科',
        school: '中山大学',
        graduateDate: '2005-06-30',
        department: '销售部',
        position: '销售经理',
        tags: ['客户管理', '营销策划'],
        highlights: '连续三年超额完成销售目标',
        entryDate: '2016-09-01',
        probationEndDate: '2016-12-01',
        leaveDate: '2024-06-30',
        leaveType: '主动离职',
        leaveReason: '退休',
        leaveDetails: '达到退休年龄，正式办理退休手续',
        handoverStatus: '已交接',
        workLocation: '广州分部',
        source: '智联招聘',
        address: '广州市天河区珠江新城',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaowei',
        socialSecurity: '44010619820715007X',
        providentFund: '44010619820715007X',
        bankCard: '6222021234567890207',
        ethnicity: '汉族',
        workingYears: 7.8,
        finalPosition: '高级销售经理'
    },
    {
        id: 108,
        name: '孙静',
        employeeNo: 'EP2021088',
        birthDate: '1994-04-22',
        phone: '13900139008',
        email: 'sunjing@company.com',
        education: '研究生',
        school: '南开大学',
        graduateDate: '2019-06-30',
        department: '财务部',
        position: '会计',
        tags: ['数据分析'],
        highlights: '财务报表编制准确及时',
        entryDate: '2021-09-01',
        probationEndDate: '2021-12-01',
        leaveDate: '2024-05-15',
        leaveType: '主动离职',
        leaveReason: '考公',
        leaveDetails: '成功考取公务员，入职税务局',
        handoverStatus: '已交接',
        workLocation: '北京总部',
        source: '51Job',
        address: '北京市朝阳区建国路88号',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunjing',
        socialSecurity: '11010519940422008X',
        providentFund: '11010519940422008X',
        bankCard: '6222021234567890208',
        ethnicity: '满族',
        workingYears: 2.7,
        finalPosition: '高级会计'
    },
    {
        id: 109,
        name: '周鹏',
        employeeNo: 'EP2019055',
        birthDate: '1990-08-30',
        phone: '13900139009',
        email: 'zhoupeng@company.com',
        education: '本科',
        school: '东南大学',
        graduateDate: '2013-06-30',
        department: '产品部',
        position: '产品经理',
        tags: ['项目管理', '数据分析'],
        highlights: '主导过多款成功产品上线',
        entryDate: '2019-10-15',
        probationEndDate: '2020-01-15',
        leaveDate: '2024-04-30',
        leaveType: '被动离职',
        leaveReason: '绩效不达标',
        leaveDetails: '连续两个季度绩效评级为C，不符合岗位要求',
        handoverStatus: '已交接',
        workLocation: '南京分部',
        source: 'BOSS直聘',
        address: '南京市鼓楼区汉口路22号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoupeng',
        socialSecurity: '32010619900830009X',
        providentFund: '32010619900830009X',
        bankCard: '6222021234567890209',
        ethnicity: '汉族',
        workingYears: 4.5,
        finalPosition: '产品经理'
    },
    {
        id: 110,
        name: '吴倩',
        employeeNo: 'EP2021099',
        birthDate: '1996-12-10',
        phone: '13900139010',
        email: 'wuqian@company.com',
        education: '本科',
        school: '西安电子科技大学',
        graduateDate: '2019-06-30',
        department: '客服部',
        position: '客服专员',
        tags: ['沟通能力', '客户管理'],
        highlights: '客户满意度高，多次获得好评',
        entryDate: '2021-11-01',
        probationEndDate: '2022-02-01',
        leaveDate: '2024-03-31',
        leaveType: '主动离职',
        leaveReason: '个人发展',
        leaveDetails: '计划回老家发展，已找到当地工作',
        handoverStatus: '已交接',
        workLocation: '西安分部',
        source: '智联招聘',
        address: '西安市雁塔区电子一路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wuqian',
        socialSecurity: '61011319961210010X',
        providentFund: '61011319961210010X',
        bankCard: '6222021234567890210',
        ethnicity: '汉族',
        workingYears: 2.4,
        finalPosition: '客服主管'
    },
    {
        id: 111,
        name: '郑涛',
        employeeNo: 'EP2020077',
        birthDate: '1989-05-18',
        phone: '13900139011',
        email: 'zhengtao@company.com',
        education: '本科',
        school: '天津大学',
        graduateDate: '2012-06-30',
        department: '运营部',
        position: '运营专员',
        tags: ['营销策划'],
        highlights: '运营活动策划执行能力强',
        entryDate: '2020-08-01',
        probationEndDate: '2020-11-01',
        leaveDate: '2024-02-29',
        leaveType: '主动离职',
        leaveReason: '跳槽',
        leaveDetails: '接受了电商巨头的offer，薪资涨幅30%',
        handoverStatus: '已交接',
        workLocation: '天津分部',
        source: '51Job',
        address: '天津市南开区卫津路92号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengtao',
        socialSecurity: '12010419890518011X',
        providentFund: '12010419890518011X',
        bankCard: '6222021234567890211',
        ethnicity: '汉族',
        workingYears: 3.5,
        finalPosition: '运营主管'
    },
    {
        id: 112,
        name: '何敏',
        employeeNo: 'EP2022099',
        birthDate: '1998-03-25',
        phone: '13900139012',
        email: 'hemin@company.com',
        education: '本科',
        school: '山东大学',
        graduateDate: '2020-06-30',
        department: '行政部',
        position: '行政助理',
        tags: ['沟通能力'],
        highlights: '行政事务处理细致周到',
        entryDate: '2022-09-01',
        probationEndDate: '2022-12-01',
        leaveDate: '2024-01-15',
        leaveType: '主动离职',
        leaveReason: '考研',
        leaveDetails: '考取研究生，计划继续深造',
        handoverStatus: '已交接',
        workLocation: '济南分部',
        source: 'BOSS直聘',
        address: '济南市历城区旅游路4516号',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hemin',
        socialSecurity: '37011219980325012X',
        providentFund: '37011219980325012X',
        bankCard: '6222021234567890212',
        ethnicity: '汉族',
        workingYears: 1.3,
        finalPosition: '行政专员'
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
    '新人培训': 'bg-teal-100 text-teal-700 border-teal-200',
    '团队协作': 'bg-cyan-100 text-cyan-700 border-cyan-200'
};

const educationColors = {
    '博士': 'bg-red-100 text-red-700 border-red-200',
    '研究生': 'bg-purple-100 text-purple-700 border-purple-200',
    '本科': 'bg-blue-100 text-blue-700 border-blue-200',
    '大专': 'bg-gray-100 text-gray-700 border-gray-200'
};

const leaveTypeColors = {
    '主动离职': 'bg-blue-100 text-blue-700 border-blue-200',
    '被动离职': 'bg-red-100 text-red-700 border-red-200'
};

const leaveReasonColors = {
    '个人发展': 'bg-green-100 text-green-700 border-green-200',
    '家庭原因': 'bg-orange-100 text-orange-700 border-orange-200',
    '跳槽': 'bg-purple-100 text-purple-700 border-purple-200',
    '试用期不合格': 'bg-red-100 text-red-700 border-red-200',
    '绩效不达标': 'bg-red-100 text-red-700 border-red-200',
    '转行': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    '退休': 'bg-gray-100 text-gray-700 border-gray-200',
    '考公': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    '考研': 'bg-teal-100 text-teal-700 border-teal-200'
};

const handoverStatusColors = {
    '已交接': 'bg-green-100 text-green-700 border-green-200',
    '未交接': 'bg-yellow-100 text-yellow-700 border-yellow-200'
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
            <div className="relative w-[50vw] min-w-[600px] h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900">离职员工档案详情</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 基本信息卡片 */}
                    <div className="bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl p-6 text-white">
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
                                        {employee.finalPosition}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={cn(
                                        'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                                        leaveTypeColors[employee.leaveType]
                                    )}>
                                        {employee.leaveType}
                                    </span>
                                    <span className="text-xs text-white/70">
                                        {employee.workingYears.toFixed(1)}年司龄
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 离职信息 */}
                    <div className="bg-red-50 rounded-xl p-4 space-y-3 border border-red-100">
                        <h4 className="text-sm font-semibold text-red-700 flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            离职信息
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-1">离职日期</p>
                                <p className="text-gray-900 font-medium">{employee.leaveDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">离职类型</p>
                                <span className={cn(
                                    'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                    leaveTypeColors[employee.leaveType]
                                )}>
                                    {employee.leaveType}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">离职原因</p>
                                <span className={cn(
                                    'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                    leaveReasonColors[employee.leaveReason]
                                )}>
                                    {employee.leaveReason}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">交接状态</p>
                                <span className={cn(
                                    'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                    handoverStatusColors[employee.handoverStatus]
                                )}>
                                    {employee.handoverStatus}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">离职详情</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-red-100">
                                {employee.leaveDetails}
                            </p>
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

                    {/* 在职信息 */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            在职信息
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
                                <p className="text-gray-500 text-xs mb-1">司龄</p>
                                <p className="text-gray-900">{employee.workingYears.toFixed(1)} 年</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-1">人才来源</p>
                                <span className={cn(
                                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                                    sourceColors[employee.source] || sourceColors['-']
                                )}>
                                    {employee.source}
                                </span>
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
                </div>
            </div>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function FormerEmployeeListPage() {
    // 筛选状态
    const [filters, setFilters] = useState({
        name: '',
        department: '',
        leaveType: '',
        leaveReason: ''
    });
    
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
    const names = [...new Set(mockFormerEmployees.map(e => e.name))].sort();
    const departments = [...new Set(mockFormerEmployees.map(e => e.department))].sort();
    const leaveTypes = [...new Set(mockFormerEmployees.map(e => e.leaveType))].sort();
    const leaveReasons = [...new Set(mockFormerEmployees.map(e => e.leaveReason))].sort();

    // 筛选逻辑
    const filteredData = useMemo(() => {
        let result = [...mockFormerEmployees];
        
        // 下拉筛选
        if (filters.name) {
            result = result.filter(e => e.name === filters.name);
        }
        if (filters.department) {
            result = result.filter(e => e.department === filters.department);
        }
        if (filters.leaveType) {
            result = result.filter(e => e.leaveType === filters.leaveType);
        }
        if (filters.leaveReason) {
            result = result.filter(e => e.leaveReason === filters.leaveReason);
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
    }, [filters, searchQuery, sortConfig]);

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
        setFilters({ name: '', department: '', leaveType: '', leaveReason: '' });
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">离职员工列表</h1>
                        <p className="text-sm text-gray-500 mt-1">管理离职员工档案、离职原因分析及交接状态</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                            <Archive className="w-4 h-4" />
                            导出离职报表
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
                            label="离职类型"
                            value={filters.leaveType}
                            options={leaveTypes}
                            onChange={(val) => setFilters(prev => ({ ...prev, leaveType: val }))}
                            placeholder="请选择离职类型"
                        />
                        <SelectFilter
                            label="离职原因"
                            value={filters.leaveReason}
                            options={leaveReasons}
                            onChange={(val) => setFilters(prev => ({ ...prev, leaveReason: val }))}
                            placeholder="请选择离职原因"
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
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 w-48"
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
                                onClick={() => handleSort('leaveDate')}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors',
                                    sortConfig.key === 'leaveDate' 
                                        ? 'bg-slate-100 text-slate-600' 
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">最终职位</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">入职日期</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">离职日期</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">司龄</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">离职类型</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">离职原因</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">交接状态</th>
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
                                                    className="w-8 h-8 rounded-full bg-gray-100 grayscale"
                                                />
                                                <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.employeeNo}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.department}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.finalPosition}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.entryDate}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.leaveDate}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{employee.workingYears.toFixed(1)}年</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                                leaveTypeColors[employee.leaveType]
                                            )}>
                                                {employee.leaveType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                                leaveReasonColors[employee.leaveReason]
                                            )}>
                                                {employee.leaveReason}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                                handoverStatusColors[employee.handoverStatus]
                                            )}>
                                                {employee.handoverStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedEmployee(employee)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
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
                                    className="px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
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
                                                ? 'bg-slate-600 text-white'
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
