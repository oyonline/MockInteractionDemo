// src/pages/AnnouncementDetailPage.js
// 公告详情页
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Calendar,
    User,
    Eye,
    Download,
    FileText,
    FileImage,
    FileSpreadsheet,
    Presentation,
    CheckCircle2,
    Megaphone,
    AlertCircle,
    Bell,
    Share2,
    Printer
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 类型配置 ---------------
const typeConfig = {
    urgent: { 
        label: '紧急', 
        color: 'bg-red-100 text-red-700 border-red-200',
        bgColor: 'bg-red-50',
        icon: AlertCircle 
    },
    warning: { 
        label: '通知', 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        bgColor: 'bg-amber-50',
        icon: Bell 
    },
    normal: { 
        label: '公告', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        bgColor: 'bg-blue-50',
        icon: Megaphone 
    }
};

// --------------- 获取文件图标 ---------------
const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconClass = "w-8 h-8";
    switch (ext) {
        case 'pdf':
            return <FileText className={cn(iconClass, "text-red-500")} />;
        case 'docx':
        case 'doc':
            return <FileText className={cn(iconClass, "text-blue-500")} />;
        case 'xlsx':
        case 'xls':
            return <FileSpreadsheet className={cn(iconClass, "text-green-500")} />;
        case 'pptx':
        case 'ppt':
            return <Presentation className={cn(iconClass, "text-orange-500")} />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return <FileImage className={cn(iconClass, "text-purple-500")} />;
        default:
            return <FileText className={cn(iconClass, "text-gray-500")} />;
    }
};

// --------------- 格式化文件大小 ---------------
const formatFileSize = (sizeStr) => {
    return sizeStr;
};

export default function AnnouncementDetailPage({ record, onClose }) {
    const [isRead, setIsRead] = useState(record?.isRead || false);
    const [showReadConfirm, setShowReadConfirm] = useState(false);

    // 模拟进入页面时自动标记已读（可选）
    useEffect(() => {
        if (!isRead) {
            // 可以在这里调用API标记已读
            // 暂时显示提示，让用户手动确认
        }
    }, [isRead]);

    // 处理确认已读
    const handleMarkAsRead = () => {
        setIsRead(true);
        setShowReadConfirm(true);
        // 3秒后隐藏提示
        setTimeout(() => setShowReadConfirm(false), 3000);
    };

    // 处理下载附件（模拟）
    const handleDownload = (fileName) => {
        // 模拟下载提示
        alert(`开始下载：${fileName}`);
    };

    // 处理打印
    const handlePrint = () => {
        window.print();
    };

    // 处理分享（模拟）
    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            alert('链接已复制到剪贴板');
        } else {
            alert('分享功能演示');
        }
    };

    if (!record) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>公告信息不存在</p>
                </div>
            </div>
        );
    }

    const typeInfo = typeConfig[record.type] || typeConfig.normal;
    const TypeIcon = typeInfo.icon;

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 顶部操作栏 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回
                    </button>
                    <div className="h-6 w-px bg-gray-200" />
                    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border', typeInfo.color)}>
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeInfo.label}
                    </span>
                    <h1 className="text-lg font-bold text-gray-900 line-clamp-1 max-w-[500px]">
                        {record.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="打印"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="分享"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    {!isRead ? (
                        <button
                            onClick={handleMarkAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            标记已读
                        </button>
                    ) : (
                        <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            已读
                        </span>
                    )}
                </div>
            </div>

            {/* 已读确认提示 */}
            {showReadConfirm && (
                <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-2">
                    <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">已标记为已读</span>
                    </div>
                </div>
            )}

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto py-8 px-6">
                    {/* 公告头部信息 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        {/* 封面图 */}
                        {record.coverImage && (
                            <div className="mb-6 rounded-xl overflow-hidden">
                                <img
                                    src={record.coverImage}
                                    alt="公告封面"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* 标题 */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {record.title}
                        </h1>

                        {/* 元信息 */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium text-sm">
                                        {record.author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{record.author}</p>
                                    <p className="text-xs">{record.department}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>发布于 {record.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{record.views} 次阅读</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{record.readCount} 人已读</span>
                            </div>
                        </div>

                        {/* 富文本内容 */}
                        <div 
                            className="max-w-none mt-6 text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: record.content }}
                        />

                        {/* 自定义富文本样式 */}
                        <style>{`
                            .max-w-none h3 {
                                font-size: 1.125rem;
                                font-weight: 600;
                                color: #111827;
                                margin-top: 1.5rem;
                                margin-bottom: 0.75rem;
                            }
                            .max-w-none p {
                                margin-bottom: 0.75rem;
                                line-height: 1.8;
                            }
                            .max-w-none strong {
                                font-weight: 600;
                                color: #111827;
                            }
                        `}</style>
                    </div>

                    {/* 附件区域 */}
                    {record.attachments && record.attachments.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                附件 ({record.attachments.length})
                            </h3>
                            <div className="space-y-3">
                                {record.attachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="flex-shrink-0">
                                            {getFileIcon(file.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(file.name)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Download className="w-4 h-4" />
                                            下载
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 底部阅读确认区 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Megaphone className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">阅读确认</p>
                                    <p className="text-sm text-gray-500">
                                        {isRead 
                                            ? '您已于 ' + new Date().toLocaleString() + ' 阅读该公告'
                                            : '请阅读以上内容后点击确认已读'
                                        }
                                    </p>
                                </div>
                            </div>
                            {!isRead ? (
                                <button
                                    onClick={handleMarkAsRead}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    确认已读
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 font-medium rounded-xl">
                                    <CheckCircle2 className="w-5 h-5" />
                                    已确认阅读
                                </div>
                            )}
                        </div>

                        {/* 阅读进度条 */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                <span>全员阅读进度</span>
                                <span>{Math.round((record.readCount / record.views) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.round((record.readCount / record.views) * 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                {record.readCount} 人已读 / {record.views} 人阅读
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
