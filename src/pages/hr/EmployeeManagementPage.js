// src/pages/EmployeeManagementPage.js
// 企业人才库页面 - 增强版（支持面试管理和 Offer 管理）
import React, { useState, useMemo } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
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
    Phone,
    MapPin,
    GraduationCap,
    Tag,
    CheckCircle2,
    CalendarPlus,
    Send,
    MessageSquare,
    History,
    FileCheck,
    Star,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DrawerShell from '../../components/ui/DrawerShell';
import ModalShell from '../../components/ui/ModalShell';
import TableShell from '../../components/ui/TableShell';
import cn from '../../utils/cn';

// --------------- 日期范围选择组件 ---------------
const DateRangeFilter = ({ label, startDate, endDate, onChange }) => {
    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onChange(e.target.value, endDate)}
                    className="ui-input flex-1"
                />
                <span className="text-gray-400">-</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onChange(startDate, e.target.value)}
                    className="ui-input flex-1"
                />
            </div>
        </div>
    );
};

// --------------- Mock 员工数据（增加面试和Offer相关字段）---------------
const mockEmployees = [
    {
        id: 1,
        name: '张伟',
        employeeNo: '-',
        birthDate: '1990-05-15',
        phone: '13800138001',
        email: 'zhangwei@company.com',
        education: '本科',
        school: '北京大学',
        graduateDate: '2012-06-30',
        department: '-',
        position: '高级工程师',
        tags: ['数据分析', '项目管理'],
        highlights: '主导过3个核心系统重构项目',
        entryDate: '2021-03-01',
        source: 'BOSS直聘',
        address: '北京市海淀区中关村大街1号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei',
        socialSecurity: '11010119900515001X',
        providentFund: '11010119900515001X',
        bankCard: '6222021234567890123',
        ethnicity: '汉族',
        // 招聘状态
        status: 'interviewing', // new / interviewing / offered / hired / rejected
        statusLabel: '面试中',
        // 面试记录
        interviews: [
            {
                id: 1,
                round: 1,
                type: '电话面试',
                interviewer: '李经理',
                date: '2024-01-15',
                time: '14:00',
                duration: '30分钟',
                result: '通过',
                score: 85,
                evaluation: '基础扎实，沟通清晰，对项目经验描述详细。建议进入下一轮。',
                notes: '重点关注了其主导的系统重构项目细节'
            },
            {
                id: 2,
                round: 2,
                type: '技术面试',
                interviewer: '王总监',
                date: '2024-01-18',
                time: '10:00',
                duration: '60分钟',
                result: '通过',
                score: 88,
                evaluation: '技术能力优秀，算法基础扎实，系统设计思路清晰。',
                notes: '现场编程题完成度很高'
            },
            {
                id: 3,
                round: 3,
                type: 'HR面试',
                interviewer: 'HRBP陈静',
                date: '2024-01-22',
                time: '15:00',
                duration: '45分钟',
                result: '待定',
                score: null,
                evaluation: '',
                notes: '待进一步沟通薪资期望'
            }
        ],
        // Offer记录
        offers: []
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
        source: '内推',
        address: '北京市朝阳区建国路88号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lina',
        socialSecurity: '11010119880822002X',
        providentFund: '11010119880822002X',
        bankCard: '6222021234567890124',
        ethnicity: '汉族',
        status: 'hired',
        statusLabel: '已入职',
        interviews: [
            {
                id: 1,
                round: 1,
                type: 'HR面试',
                interviewer: 'HRBP周雪',
                date: '2020-05-20',
                time: '14:00',
                duration: '45分钟',
                result: '通过',
                score: 90,
                evaluation: '经验丰富，职业规划清晰，价值观匹配度高。',
                notes: '对薪资期望在预算范围内'
            },
            {
                id: 2,
                round: 2,
                type: '总监面试',
                interviewer: '产品VP',
                date: '2020-05-25',
                time: '10:00',
                duration: '90分钟',
                result: '通过',
                score: 92,
                evaluation: '产品思维出色，过往业绩优秀，非常符合岗位需求。',
                notes: '建议尽快发offer'
            }
        ],
        offers: [
            {
                id: 1,
                sendDate: '2020-05-28',
                position: '产品总监',
                department: '产品部',
                baseSalary: 35000,
                bonus: '3个月',
                stock: '5000股',
                probation: '3个月',
                status: 'accepted',
                acceptDate: '2020-05-30',
                notes: '候选人接受offer，约定6月15日入职'
            }
        ]
    },
    {
        id: 3,
        name: '王强',
        employeeNo: '-',
        birthDate: '-',
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
        source: '智联招聘',
        address: '上海市浦东新区陆家嘴环路1000号',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang',
        socialSecurity: '31010119950310003X',
        providentFund: '31010119950310003X',
        bankCard: '6222021234567890125',
        ethnicity: '汉族',
        status: 'offered',
        statusLabel: 'Offer已发',
        interviews: [
            {
                id: 1,
                round: 1,
                type: '视频面试',
                interviewer: '市场总监',
                date: '2024-01-10',
                time: '16:00',
                duration: '40分钟',
                result: '通过',
                score: 82,
                evaluation: '市场敏感度高，策划能力强，沟通能力优秀。',
                notes: '对市场营销有独到见解'
            }
        ],
        offers: [
            {
                id: 1,
                sendDate: '2024-01-15',
                position: '市场经理',
                department: '市场部',
                baseSalary: 18000,
                bonus: '2个月',
                stock: null,
                probation: '3个月',
                status: 'pending',
                acceptDate: null,
                notes: '候选人在考虑中，预计3天内回复'
            }
        ]
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
        source: '51Job',
        address: '深圳市南山区科技园',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuyang',
        socialSecurity: '44030119851128004X',
        providentFund: '44030119851128004X',
        bankCard: '6222021234567890126',
        ethnicity: '汉族',
        status: 'hired',
        statusLabel: '已入职',
        interviews: [
            {
                id: 1,
                round: 1,
                type: '视频面试',
                interviewer: 'CEO',
                date: '2019-07-15',
                time: '09:00',
                duration: '120分钟',
                result: '通过',
                score: 95,
                evaluation: '技术视野开阔，管理经验丰富，战略思维强。',
                notes: '硅谷背景非常有价值'
            }
        ],
        offers: [
            {
                id: 1,
                sendDate: '2019-07-20',
                position: '技术VP',
                department: '技术部',
                baseSalary: 80000,
                bonus: '6个月',
                stock: '20000股',
                probation: '3个月',
                status: 'accepted',
                acceptDate: '2019-07-22',
                notes: ' special offer，需要CEO特批'
            }
        ]
    },
    {
        id: 5,
        name: '陈静',
        employeeNo: '-',
        birthDate: '1992-07-08',
        phone: '-',
        email: 'chenjing@company.com',
        education: '本科',
        school: '-',
        graduateDate: '2014-06-30',
        department: '财务部',
        position: '财务经理',
        tags: ['数据分析', '沟通能力'],
        highlights: '注册会计师，财务流程优化专家',
        entryDate: '2021-05-18',
        source: 'BOSS直聘',
        address: '杭州市西湖区文三路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjing',
        socialSecurity: '33010619920708005X',
        providentFund: '33010619920708005X',
        bankCard: '6222021234567890127',
        ethnicity: '汉族',
        status: 'new',
        statusLabel: '新入库',
        interviews: [],
        offers: []
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
        source: '内推',
        address: '深圳市福田区华强北路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaomin',
        socialSecurity: '44030419980214006X',
        providentFund: '44030419980214006X',
        bankCard: '6222021234567890128',
        ethnicity: '壮族',
        status: 'hired',
        statusLabel: '已入职',
        interviews: [
            {
                id: 1,
                round: 1,
                type: '现场面试',
                interviewer: '客服经理',
                date: '2023-01-15',
                time: '14:00',
                duration: '30分钟',
                result: '通过',
                score: 88,
                evaluation: '服务意识强，应变能力强，有经验。',
                notes: '推荐录用'
            }
        ],
        offers: [
            {
                id: 1,
                sendDate: '2023-01-18',
                position: '客服主管',
                department: '客服部',
                baseSalary: 12000,
                bonus: '1个月',
                stock: null,
                probation: '3个月',
                status: 'accepted',
                acceptDate: '2023-01-20',
                notes: '内推候选人，表现优秀'
            }
        ]
    },
    {
        id: 7,
        name: '孙涛',
        employeeNo: '-',
        birthDate: '1989-09-20',
        phone: '13800138007',
        email: '-',
        education: '研究生',
        school: '上海交通大学',
        graduateDate: '2015-06-30',
        department: '供应链部',
        position: '供应链总监',
        tags: ['项目管理', '数据分析', '沟通能力'],
        highlights: '供应链管理专家，成本节约500万',
        entryDate: '2020-11-11',
        source: '智联招聘',
        address: '上海市闵行区东川路800号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suntao',
        socialSecurity: '31011219890920007X',
        providentFund: '31011219890920007X',
        bankCard: '6222021234567890129',
        ethnicity: '汉族',
        status: 'rejected',
        statusLabel: '已拒绝',
        interviews: [
            {
                id: 1,
                round: 1,
                type: '电话面试',
                interviewer: 'HR',
                date: '2024-01-05',
                time: '10:00',
                duration: '20分钟',
                result: '不通过',
                score: 65,
                evaluation: '薪资期望过高，超出预算30%，且不愿意调整。',
                notes: '建议放入人才库，后续有预算时再联系'
            }
        ],
        offers: []
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
        source: '51Job',
        address: '武汉市洪山区珞喻路',
        maritalStatus: '未婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouxue',
        socialSecurity: '42011119931203008X',
        providentFund: '42011119931203008X',
        bankCard: '6222021234567890130',
        ethnicity: '汉族',
        status: 'hired',
        statusLabel: '已入职',
        interviews: [
            {
                id: 1,
                round: 1,
                type: '现场面试',
                interviewer: 'HRD',
                date: '2022-06-10',
                time: '14:00',
                duration: '60分钟',
                result: '通过',
                score: 90,
                evaluation: '招聘经验丰富，校园资源广泛，非常符合需求。',
                notes: '校招经验丰富'
            }
        ],
        offers: [
            {
                id: 1,
                sendDate: '2022-06-15',
                position: 'HRBP',
                department: '人力资源部',
                baseSalary: 15000,
                bonus: '2个月',
                stock: null,
                probation: '3个月',
                status: 'accepted',
                acceptDate: '2022-06-18',
                notes: '表现优秀，提前转正'
            }
        ]
    },
    {
        id: 9,
        name: '吴磊',
        employeeNo: '-',
        birthDate: '1983-04-18',
        phone: '13800138009',
        email: 'wulei@company.com',
        education: '-',
        school: '中山大学',
        graduateDate: '2006-06-30',
        department: '销售部',
        position: '销售总监',
        tags: ['客户管理', '营销策划', '沟通能力'],
        highlights: '连续5年销冠，团队管理经验丰富',
        entryDate: '2018-03-15',
        source: 'BOSS直聘',
        address: '广州市天河区珠江新城',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wulei',
        socialSecurity: '44010619830418009X',
        providentFund: '44010619830418009X',
        bankCard: '6222021234567890131',
        ethnicity: '汉族',
        status: 'interviewing',
        statusLabel: '面试中',
        interviews: [
            {
                id: 1,
                round: 1,
                type: '电话面试',
                interviewer: '销售总监',
                date: '2024-01-20',
                time: '15:00',
                duration: '45分钟',
                result: '通过',
                score: 87,
                evaluation: '销售业绩优秀，客户资源丰富，管理能力出色。',
                notes: '有带团队经验，符合销售总监要求'
            }
        ],
        offers: []
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
        source: '内推',
        address: '南京市鼓楼区汉口路22号',
        maritalStatus: '已婚',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengfang',
        socialSecurity: '32010619910625010X',
        providentFund: '32010619910625010X',
        bankCard: '6222021234567890132',
        ethnicity: '满族',
        status: 'hired',
        statusLabel: '已入职',
        interviews: [],
        offers: []
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

const offerStatusLabels = {
    'pending': '待确认',
    'accepted': '已接受',
    'rejected': '已拒绝'
};

// 人才来源配置
const sourceColors = {
    '内推': 'bg-purple-100 text-purple-700 border-purple-200',
    'BOSS直聘': 'bg-green-100 text-green-700 border-green-200',
    '智联招聘': 'bg-blue-100 text-blue-700 border-blue-200',
    '51Job': 'bg-orange-100 text-orange-700 border-orange-200',
    '-': 'bg-gray-100 text-gray-500 border-gray-200'
};

const getStatusTone = (status) => ({
    new: 'neutral',
    interviewing: 'primary',
    offered: 'warning',
    hired: 'success',
    rejected: 'danger'
}[status] || 'neutral');

const getInterviewResultTone = (result) => ({
    '通过': 'success',
    '不通过': 'danger',
    '待定': 'warning'
}[result] || 'neutral');

const getOfferStatusTone = (status) => ({
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger'
}[status] || 'neutral');

// ============== 子组件 ==============

// 下拉选择器
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
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-sm transition-colors hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <span className={value ? 'text-text' : 'text-text-subtle'}>
                        {value || placeholder}
                    </span>
                    <span className="flex items-center gap-1">
                        {value && (
                            <X 
                                className="h-3.5 w-3.5 text-text-subtle transition-colors hover:text-text"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('');
                                }}
                            />
                        )}
                        <ChevronDown className={cn('h-4 w-4 text-text-subtle transition-transform', isOpen && 'rotate-180')} />
                    </span>
                </button>
                
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-2xl border border-border bg-surface shadow-elevated">
                            <div className="border-b border-border-subtle p-2">
                                <input
                                    type="text"
                                    placeholder="搜索..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="ui-input py-1.5"
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
                                    className="w-full px-3 py-2 text-left text-sm text-text-muted transition-colors hover:bg-surface-subtle"
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
                                            'w-full px-3 py-2 text-left text-sm transition-colors hover:bg-surface-subtle',
                                            value === opt ? 'bg-brand-50 text-brand-700' : 'text-text'
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

// 安排面试弹窗
const ScheduleInterviewModal = ({ employee, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        type: '现场面试',
        round: employee.interviews?.length + 1 || 1,
        date: '',
        time: '',
        interviewer: '',
        notes: ''
    });

    const handleSubmit = () => {
        onSubmit({ ...form, employeeId: employee.id });
        onClose();
    };

    return (
        <ModalShell
            open={Boolean(employee)}
            onClose={onClose}
            title="安排面试"
            subtitle={`候选人：${employee?.name}`}
            width="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} icon={CalendarPlus}>
                        确认安排
                    </Button>
                </div>
            }
        >
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
                    <CalendarPlus className="h-5 w-5" />
                </div>
                <span>统一使用蓝色主操作，方便后续所有招聘弹窗复用。</span>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">面试类型</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="ui-select"
                        >
                            <option>电话面试</option>
                            <option>视频面试</option>
                            <option>现场面试</option>
                            <option>HR面试</option>
                            <option>总监面试</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">面试轮次</label>
                        <input
                            type="number"
                            value={form.round}
                            onChange={(e) => setForm({ ...form, round: parseInt(e.target.value) })}
                            className="ui-input"
                            min={1}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">面试日期</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="ui-input"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">面试时间</label>
                        <input
                            type="time"
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                            className="ui-input"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">面试官</label>
                    <input
                        type="text"
                        value={form.interviewer}
                        onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                        placeholder="请输入面试官姓名"
                        className="ui-input"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">备注</label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="请输入备注信息..."
                        rows={3}
                        className="ui-textarea resize-none"
                    />
                </div>
            </div>
        </ModalShell>
    );
};

// 发送 Offer 弹窗
const SendOfferModal = ({ employee, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        position: employee?.position || '',
        department: employee?.department || '',
        baseSalary: '',
        bonus: '',
        stock: '',
        probation: '3个月',
        notes: ''
    });

    const handleSubmit = () => {
        onSubmit({ ...form, employeeId: employee.id });
        onClose();
    };

    return (
        <ModalShell
            open={Boolean(employee)}
            onClose={onClose}
            title="发送 Offer"
            subtitle={`候选人：${employee?.name}`}
            width="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} icon={Send}>
                        发送 Offer
                    </Button>
                </div>
            }
        >
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-success-50 px-4 py-3 text-sm text-success-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-100">
                    <Send className="h-5 w-5" />
                </div>
                <span>Offer 表单沿用统一输入控件，后续补薪资审批也能直接复用。</span>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">职位</label>
                        <input
                            type="text"
                            value={form.position}
                            onChange={(e) => setForm({ ...form, position: e.target.value })}
                            className="ui-input"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">部门</label>
                        <input
                            type="text"
                            value={form.department}
                            onChange={(e) => setForm({ ...form, department: e.target.value })}
                            className="ui-input"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">基本工资（元/月）</label>
                    <input
                        type="number"
                        value={form.baseSalary}
                        onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                        placeholder="请输入基本工资"
                        className="ui-input"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">年终奖</label>
                        <input
                            type="text"
                            value={form.bonus}
                            onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                            placeholder="如：3个月"
                            className="ui-input"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">期权/股权</label>
                        <input
                            type="text"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            placeholder="如：5000股"
                            className="ui-input"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">试用期</label>
                    <select
                        value={form.probation}
                        onChange={(e) => setForm({ ...form, probation: e.target.value })}
                        className="ui-select"
                    >
                        <option>1个月</option>
                        <option>2个月</option>
                        <option>3个月</option>
                        <option>6个月</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">备注</label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="请输入备注信息..."
                        rows={3}
                        className="ui-textarea resize-none"
                    />
                </div>
            </div>
        </ModalShell>
    );
};

// 面试评价弹窗
const InterviewEvaluationModal = ({ interview, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        result: interview?.result || '通过',
        score: interview?.score || 80,
        evaluation: interview?.evaluation || '',
        notes: interview?.notes || ''
    });

    const handleSubmit = () => {
        onSubmit({ ...form, interviewId: interview.id });
        onClose();
    };

    return (
        <ModalShell
            open={Boolean(interview)}
            onClose={onClose}
            title="面试评价"
            subtitle={`第${interview?.round}轮 ${interview?.type}`}
            width="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} icon={MessageSquare}>
                        保存评价
                    </Button>
                </div>
            }
        >
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
                    <MessageSquare className="h-5 w-5" />
                </div>
                <span>面试结果和分数统一通过公共弹窗收敛，避免颜色和间距继续发散。</span>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">面试结果</label>
                        <select
                            value={form.result}
                            onChange={(e) => setForm({ ...form, result: e.target.value })}
                            className="ui-select"
                        >
                            <option>通过</option>
                            <option>不通过</option>
                            <option>待定</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">综合评分</label>
                        <input
                            type="number"
                            value={form.score}
                            onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) })}
                            min={0}
                            max={100}
                            className="ui-input"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">评价内容</label>
                    <textarea
                        value={form.evaluation}
                        onChange={(e) => setForm({ ...form, evaluation: e.target.value })}
                        placeholder="请输入面试评价..."
                        rows={4}
                        className="ui-textarea resize-none"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">备注</label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="请输入备注信息..."
                        rows={2}
                        className="ui-textarea resize-none"
                    />
                </div>
            </div>
        </ModalShell>
    );
};

// 员工详情 Drawer 组件
const EmployeeDetailDrawer = ({ employee, onClose, onScheduleInterview, onSendOffer }) => {
    const [activeTab, setActiveTab] = useState('basic'); // basic / interviews / offers
    const [expandedInterview, setExpandedInterview] = useState(null);
    const [evaluationModal, setEvaluationModal] = useState(null);

    if (!employee) return null;

    const handleSaveEvaluation = (data) => {
        console.log('保存评价:', data);
        // 实际应用中这里会调用 API
        alert('评价已保存！');
    };

    return (
        <>
            <DrawerShell
                open={Boolean(employee)}
                onClose={onClose}
                title="人才档案详情"
                subtitle={`${employee.name} · ${employee.position}`}
                width="xl"
                contentClassName="p-0"
                headerActions={
                    <>
                        <Badge tone={getStatusTone(employee.status)}>
                            {employee.statusLabel}
                        </Badge>
                        {employee.status !== 'hired' && employee.status !== 'rejected' && (
                            <>
                                <Button
                                    onClick={() => onScheduleInterview(employee)}
                                    variant="secondary"
                                    size="sm"
                                    icon={CalendarPlus}
                                >
                                    安排面试
                                </Button>
                                {employee.interviews?.length > 0 && (
                                    <Button
                                        onClick={() => onSendOffer(employee)}
                                        size="sm"
                                        icon={Send}
                                    >
                                        发送 Offer
                                    </Button>
                                )}
                            </>
                        )}
                    </>
                }
            >
                {/* 标签页导航 */}
                <div className="flex border-b border-border px-6">
                    {[
                        { key: 'basic', label: '基本信息', icon: User },
                        { key: 'interviews', label: `面试记录 (${employee.interviews?.length || 0})`, icon: History },
                        { key: 'offers', label: `Offer记录 (${employee.offers?.length || 0})`, icon: FileCheck }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                                activeTab === tab.key
                                    ? 'border-brand-500 text-brand-700'
                                    : 'border-transparent text-text-muted hover:text-text'
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 内容区域 */}
                <div className="flex-1 overflow-auto p-6">
                    {/* 基本信息 Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            {/* 基本信息卡片 */}
                            <div className="rounded-[24px] bg-gradient-to-br from-brand-600 to-slate-900 p-6 text-white shadow-elevated">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={employee.photo}
                                        alt={employee.name}
                                        className="w-20 h-20 rounded-full bg-white/20 p-1"
                                    />
                                    <div>
                                        <h3 className="text-2xl font-bold">{employee.name}</h3>
                                        <p className="text-white/80 text-sm mt-1">期望职位：{employee.position}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge tone={getStatusTone(employee.status)} className="border-white/20 bg-white/15 text-white">
                                                {employee.statusLabel}
                                            </Badge>
                                            <span className="rounded bg-white/20 px-2 py-0.5 text-xs">
                                                {employee.education}
                                            </span>
                                            <span className="rounded bg-white/20 px-2 py-0.5 text-xs">
                                                {employee.school}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 联系信息 */}
                            <Card padding="md" className="space-y-3 bg-surface-subtle">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-text">
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
                                            <a href={`mailto:${employee.email}`} className="text-brand-700 hover:underline">
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
                            </Card>

                            {/* 个人信息 */}
                            <Card padding="md" className="space-y-3 bg-surface-subtle">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-text">
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
                                        <p className="text-gray-500 text-xs mb-1">入库时间</p>
                                        <p className="text-gray-900">{employee.entryDate}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* 教育背景 */}
                            <Card padding="md" className="space-y-3 bg-surface-subtle">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-text">
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
                            </Card>

                            {/* 个人标签 & 亮点 */}
                            <Card padding="md" className="space-y-3 bg-surface-subtle">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-text">
                                    <Tag className="w-4 h-4" />
                                    个人标签 & 亮点
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {employee.tags?.map(tag => (
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
                            </Card>
                        </div>
                    )}

                    {/* 面试记录 Tab */}
                    {activeTab === 'interviews' && (
                        <div className="space-y-4">
                            {employee.interviews?.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <History className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">暂无面试记录</p>
                                    <Button
                                        onClick={() => onScheduleInterview(employee)}
                                        icon={CalendarPlus}
                                        className="mt-4"
                                    >
                                        安排面试
                                    </Button>
                                </div>
                            ) : (
                                employee.interviews?.map((interview) => (
                                    <div
                                        key={interview.id}
                                        className="overflow-hidden rounded-2xl border border-border bg-surface"
                                    >
                                        <div
                                            className="flex cursor-pointer items-center justify-between bg-surface-subtle px-4 py-3"
                                            onClick={() => setExpandedInterview(
                                                expandedInterview === interview.id ? null : interview.id
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                                                    <span className="text-sm font-bold text-brand-700">{interview.round}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        第{interview.round}轮 {interview.type}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {interview.date} {interview.time} · {interview.interviewer}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge tone={getInterviewResultTone(interview.result)}>
                                                    {interview.result}
                                                </Badge>
                                                {interview.score && (
                                                    <span className="flex items-center gap-1 text-xs text-amber-600">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {interview.score}
                                                    </span>
                                                )}
                                                {expandedInterview === interview.id ? (
                                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                        
                                        {expandedInterview === interview.id && (
                                            <div className="px-4 py-3 border-t border-gray-100">
                                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">时长：</span>
                                                        <span className="text-gray-900">{interview.duration}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">面试官：</span>
                                                        <span className="text-gray-900">{interview.interviewer}</span>
                                                    </div>
                                                </div>
                                                
                                                {interview.evaluation && (
                                                    <div className="mb-3">
                                                        <p className="text-xs text-gray-500 mb-1">面试评价</p>
                                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                            {interview.evaluation}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {interview.notes && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">备注</p>
                                                        <p className="text-sm text-gray-600">{interview.notes}</p>
                                                    </div>
                                                )}
                                                
                                                <div className="flex justify-end gap-2 mt-3">
                                                    <Button
                                                        onClick={() => setEvaluationModal(interview)}
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={MessageSquare}
                                                    >
                                                        {interview.evaluation ? '修改评价' : '添加评价'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Offer记录 Tab */}
                    {activeTab === 'offers' && (
                        <div className="space-y-4">
                            {employee.offers?.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileCheck className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">暂无Offer记录</p>
                                    {employee.interviews?.length > 0 && (
                                        <Button
                                            onClick={() => onSendOffer(employee)}
                                            icon={Send}
                                            className="mt-4"
                                        >
                                            发送 Offer
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                employee.offers?.map((offer) => (
                                    <div
                                        key={offer.id}
                                        className="rounded-2xl border border-border bg-surface p-4"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <FileCheck className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {offer.department} - {offer.position}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        发送日期：{offer.sendDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge tone={getOfferStatusTone(offer.status)}>
                                                {offerStatusLabels[offer.status]}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                            <div className="bg-gray-50 rounded-lg p-2.5">
                                                <p className="text-xs text-gray-500 mb-0.5">基本工资</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ¥{offer.baseSalary?.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-2.5">
                                                <p className="text-xs text-gray-500 mb-0.5">年终奖</p>
                                                <p className="text-gray-900">{offer.bonus}</p>
                                            </div>
                                            {offer.stock && (
                                                <div className="bg-gray-50 rounded-lg p-2.5">
                                                    <p className="text-xs text-gray-500 mb-0.5">期权/股权</p>
                                                    <p className="text-gray-900">{offer.stock}</p>
                                                </div>
                                            )}
                                            <div className="bg-gray-50 rounded-lg p-2.5">
                                                <p className="text-xs text-gray-500 mb-0.5">试用期</p>
                                                <p className="text-gray-900">{offer.probation}</p>
                                            </div>
                                        </div>
                                        
                                        {offer.status === 'accepted' && offer.acceptDate && (
                                            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2.5">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>候选人已于 {offer.acceptDate} 接受 Offer</span>
                                            </div>
                                        )}
                                        
                                        {offer.notes && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">备注</p>
                                                <p className="text-sm text-gray-600">{offer.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </DrawerShell>

            {/* 面试评价弹窗 */}
            {evaluationModal && (
                <InterviewEvaluationModal
                    interview={evaluationModal}
                    onClose={() => setEvaluationModal(null)}
                    onSubmit={handleSaveEvaluation}
                />
            )}
        </>
    );
};

// --------------- 主组件 ---------------
export default function EmployeeManagementPage() {
    const [filters, setFilters] = useState({
        name: '',
        department: '',
        position: '',
        education: '',
        source: '',
        school: '',
        birthDateStart: '',
        birthDateEnd: '',
        entryDateStart: '',
        entryDateEnd: ''
    });
    
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    // 弹窗状态
    const [scheduleModal, setScheduleModal] = useState(null);
    const [offerModal, setOfferModal] = useState(null);

    // 筛选选项
    const names = [...new Set(mockEmployees.map(e => e.name))].sort();
    const departments = [...new Set(mockEmployees.map(e => e.department).filter(Boolean))].sort();
    const positions = [...new Set(mockEmployees.map(e => e.position).filter(Boolean))].sort();
    const sources = [...new Set(mockEmployees.map(e => e.source).filter(Boolean))].sort();
    const schools = [...new Set(mockEmployees.map(e => e.school).filter(Boolean))].sort();
    const educations = ['博士', '研究生', '本科', '大专'];

    const filteredData = useMemo(() => {
        let result = [...mockEmployees];
        
        // 姓名筛选
        if (filters.name) {
            result = result.filter(e => e.name === filters.name);
        }
        
        // 应聘部门筛选
        if (filters.department) {
            result = result.filter(e => e.department === filters.department);
        }
        
        // 应聘岗位筛选
        if (filters.position) {
            result = result.filter(e => e.position === filters.position);
        }
        
        // 最高学历筛选
        if (filters.education) {
            result = result.filter(e => e.education === filters.education);
        }
        
        // 人才来源筛选
        if (filters.source) {
            result = result.filter(e => e.source === filters.source);
        }
        
        // 毕业院校筛选
        if (filters.school) {
            result = result.filter(e => e.school === filters.school);
        }
        
        // 出生日期范围筛选
        if (filters.birthDateStart || filters.birthDateEnd) {
            result = result.filter(e => {
                if (!e.birthDate || e.birthDate === '-') return false;
                const birthDate = parseISO(e.birthDate);
                if (filters.birthDateStart && filters.birthDateEnd) {
                    return isWithinInterval(birthDate, {
                        start: parseISO(filters.birthDateStart),
                        end: parseISO(filters.birthDateEnd)
                    });
                }
                if (filters.birthDateStart) {
                    return birthDate >= parseISO(filters.birthDateStart);
                }
                if (filters.birthDateEnd) {
                    return birthDate <= parseISO(filters.birthDateEnd);
                }
                return true;
            });
        }
        
        // 入库时间范围筛选
        if (filters.entryDateStart || filters.entryDateEnd) {
            result = result.filter(e => {
                if (!e.entryDate) return false;
                const entryDate = parseISO(e.entryDate);
                if (filters.entryDateStart && filters.entryDateEnd) {
                    return isWithinInterval(entryDate, {
                        start: parseISO(filters.entryDateStart),
                        end: parseISO(filters.entryDateEnd)
                    });
                }
                if (filters.entryDateStart) {
                    return entryDate >= parseISO(filters.entryDateStart);
                }
                if (filters.entryDateEnd) {
                    return entryDate <= parseISO(filters.entryDateEnd);
                }
                return true;
            });
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

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleReset = () => {
        setFilters({
            name: '',
            department: '',
            position: '',
            education: '',
            source: '',
            school: '',
            birthDateStart: '',
            birthDateEnd: '',
            entryDateStart: '',
            entryDateEnd: ''
        });
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleScheduleInterview = (data) => {
        console.log('安排面试:', data);
        alert('面试已安排！');
    };

    const handleSendOffer = (data) => {
        console.log('发送Offer:', data);
        alert('Offer已发送！');
    };

    return (
        <div className="flex min-h-0 flex-col gap-4">
            {/* 筛选区域 */}
            <Card padding="md">
                <div className="grid grid-cols-6 gap-4">
                    {/* 第一行：姓名、应聘部门、应聘岗位、最高学历 */}
                    <SelectFilter
                        label="姓名"
                        value={filters.name}
                        options={names}
                        onChange={(val) => {
                            setFilters(prev => ({ ...prev, name: val }));
                            setCurrentPage(1);
                        }}
                        placeholder="请选择姓名"
                    />
                    <SelectFilter
                        label="应聘部门"
                        value={filters.department}
                        options={departments}
                        onChange={(val) => {
                            setFilters(prev => ({ ...prev, department: val }));
                            setCurrentPage(1);
                        }}
                        placeholder="请选择部门"
                    />
                    <SelectFilter
                        label="应聘岗位"
                        value={filters.position}
                        options={positions}
                        onChange={(val) => {
                            setFilters(prev => ({ ...prev, position: val }));
                            setCurrentPage(1);
                        }}
                        placeholder="请选择岗位"
                    />
                    <SelectFilter
                        label="最高学历"
                        value={filters.education}
                        options={educations}
                        onChange={(val) => {
                            setFilters(prev => ({ ...prev, education: val }));
                            setCurrentPage(1);
                        }}
                        placeholder="请选择学历"
                    />
                    <SelectFilter
                        label="人才来源"
                        value={filters.source}
                        options={sources}
                        onChange={(val) => {
                            setFilters(prev => ({ ...prev, source: val }));
                            setCurrentPage(1);
                        }}
                        placeholder="请选择来源"
                    />
                    <SelectFilter
                        label="毕业院校"
                        value={filters.school}
                        options={schools}
                        onChange={(val) => {
                            setFilters(prev => ({ ...prev, school: val }));
                            setCurrentPage(1);
                        }}
                        placeholder="请选择院校"
                    />
                </div>
                
                {/* 第二行：日期范围筛选 */}
                <div className="mt-4 grid grid-cols-6 gap-4">
                    <div className="col-span-2">
                        <DateRangeFilter
                            label="出生日期"
                            startDate={filters.birthDateStart}
                            endDate={filters.birthDateEnd}
                            onChange={(start, end) => {
                                setFilters(prev => ({
                                    ...prev,
                                    birthDateStart: start,
                                    birthDateEnd: end
                                }));
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <DateRangeFilter
                            label="入库时间"
                            startDate={filters.entryDateStart}
                            endDate={filters.entryDateEnd}
                            onChange={(start, end) => {
                                setFilters(prev => ({
                                    ...prev,
                                    entryDateStart: start,
                                    entryDateEnd: end
                                }));
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    {/* 清空按钮放在第二行右侧 */}
                    <div className="col-span-2 flex items-end justify-end">
                        <Button
                            onClick={handleReset}
                            variant="ghost"
                            size="sm"
                            icon={X}
                        >
                            清空筛选
                        </Button>
                    </div>
                </div>
            </Card>

            {/* 数据表格 */}
            <TableShell
                minWidth="1380px"
                toolbar={(
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-muted">
                                共 <span className="font-medium text-text">{totalItems}</span> 条记录
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                                <input
                                    type="text"
                                    placeholder="搜索人才..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="ui-input w-48 pl-9"
                                />
                            </div>
                            <Button variant="secondary" size="sm" icon={Filter}>
                                筛选
                            </Button>
                            <Button variant="secondary" size="sm" icon={Group}>
                                分组
                            </Button>
                            <Button
                                onClick={() => handleSort('name')}
                                variant="secondary"
                                size="sm"
                                icon={ArrowUpDown}
                                className={sortConfig.key === 'name' ? 'border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100' : ''}
                            >
                                排序
                            </Button>
                            <Button variant="secondary" size="sm" icon={Download}>
                                导出
                            </Button>
                        </div>
                    </div>
                )}
                pagination={(
                    <div className="flex items-center justify-between border-t border-border bg-surface-subtle px-4 py-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-text-muted">
                                第 {currentPage} / {totalPages} 页
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-text-muted">每页</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="ui-select w-20 py-1.5"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-text-muted">条</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                variant="secondary"
                                size="sm"
                                icon={ChevronLeft}
                            />
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
                                    <Button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        variant={currentPage === pageNum ? 'primary' : 'secondary'}
                                        size="sm"
                                        className="min-w-[36px] px-0"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            <Button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                variant="secondary"
                                size="sm"
                                icon={ChevronRight}
                            />
                        </div>
                    </div>
                )}
            >
                <table className="w-full">
                    <thead className="bg-surface-subtle">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">姓名</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">出生日期</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">联系电话</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">最高学历</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">电子邮箱</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">应聘职位</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">毕业院校</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">人才来源</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">入库时间</th>
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
                                <td className="px-4 py-3 text-sm text-gray-600">{employee.birthDate}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{employee.phone}</td>
                                <td className="px-4 py-3">
                                    <span className={cn(
                                        'inline-flex px-2 py-0.5 rounded-full text-xs font-medium border',
                                        educationColors[employee.education]
                                    )}>
                                        {employee.education}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <a 
                                        href={`mailto:${employee.email}`}
                                        className="text-sm text-brand-700 hover:underline"
                                    >
                                        {employee.email}
                                    </a>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{employee.position}</td>
                                <td className="px-4 py-3">
                                    <Badge tone={getStatusTone(employee.status)}>
                                        {employee.statusLabel}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{employee.school}</td>
                                <td className="px-4 py-3">
                                    <span className={cn(
                                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                                        sourceColors[employee.source] || sourceColors['-']
                                    )}>
                                        {employee.source}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{employee.entryDate}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            onClick={() => setSelectedEmployee(employee)}
                                            variant="ghost"
                                            size="sm"
                                            icon={Eye}
                                            className="px-2 text-brand-700 hover:bg-brand-50"
                                        >
                                            详情
                                        </Button>
                                        {employee.status !== 'hired' && employee.status !== 'rejected' && (
                                            <>
                                                <Button
                                                    onClick={() => setScheduleModal(employee)}
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={CalendarPlus}
                                                    className="px-2 text-brand-700 hover:bg-brand-50"
                                                >
                                                    面试
                                                </Button>
                                                {employee.interviews?.length > 0 && (
                                                    <Button
                                                        onClick={() => setOfferModal(employee)}
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={Send}
                                                        className="px-2 text-success-700 hover:bg-success-50"
                                                    >
                                                        Offer
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableShell>

            {/* 详情抽屉 */}
            {selectedEmployee && (
                <EmployeeDetailDrawer
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                    onScheduleInterview={(emp) => {
                        setSelectedEmployee(null);
                        setScheduleModal(emp);
                    }}
                    onSendOffer={(emp) => {
                        setSelectedEmployee(null);
                        setOfferModal(emp);
                    }}
                />
            )}

            {/* 安排面试弹窗 */}
            {scheduleModal && (
                <ScheduleInterviewModal
                    employee={scheduleModal}
                    onClose={() => setScheduleModal(null)}
                    onSubmit={handleScheduleInterview}
                />
            )}

            {/* 发送Offer弹窗 */}
            {offerModal && (
                <SendOfferModal
                    employee={offerModal}
                    onClose={() => setOfferModal(null)}
                    onSubmit={handleSendOffer}
                />
            )}
        </div>
    );
}
