// src/pages/AnnouncementDetailPage.js
// 公告详情页
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Calendar,
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
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import RichTextContent from '../../components/ui/RichTextContent';
import cn from '../../utils/cn';

// --------------- 类型配置 ---------------
const typeConfig = {
    urgent: { 
        label: '紧急', 
        tone: 'danger',
        icon: AlertCircle 
    },
    warning: { 
        label: '通知', 
        tone: 'warning',
        icon: Bell 
    },
    normal: { 
        label: '公告', 
        tone: 'primary',
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
        <div className="flex min-h-0 flex-col bg-surface-muted">
            {/* 顶部操作栏 */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        size="sm"
                        icon={ArrowLeft}
                    >
                        返回
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <Badge tone={typeInfo.tone} className="gap-1">
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeInfo.label}
                    </Badge>
                    <h1 className="max-w-[500px] line-clamp-1 text-lg font-bold text-text">
                        {record.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        className="rounded-xl p-2 text-text-subtle transition-colors hover:bg-surface-subtle hover:text-text"
                        title="打印"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="rounded-xl p-2 text-text-subtle transition-colors hover:bg-surface-subtle hover:text-text"
                        title="分享"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    {!isRead ? (
                        <Button
                            onClick={handleMarkAsRead}
                            icon={CheckCircle2}
                            size="sm"
                        >
                            标记已读
                        </Button>
                    ) : (
                        <span className="flex items-center gap-2 rounded-xl bg-success-50 px-4 py-2 text-sm font-medium text-success-700">
                            <CheckCircle2 className="w-4 h-4" />
                            已读
                        </span>
                    )}
                </div>
            </div>

            {/* 已读确认提示 */}
            {showReadConfirm && (
                <div className="animate-fade-in-up fixed right-6 top-20 z-toast">
                    <div className="flex items-center gap-2 rounded-2xl bg-success-600 px-4 py-3 text-white shadow-elevated">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">已标记为已读</span>
                    </div>
                </div>
            )}

            {/* 内容区域 */}
            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto py-8 px-6">
                    {/* 公告头部信息 */}
                    <Card padding="lg" className="mb-6">
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
                        <h1 className="mb-4 text-2xl font-bold text-text">
                            {record.title}
                        </h1>

                        {/* 元信息 */}
                        <div className="flex flex-wrap items-center gap-6 border-b border-border-subtle pb-6 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100">
                                    <span className="text-sm font-medium text-brand-700">
                                        {record.author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-text">{record.author}</p>
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
                        <RichTextContent html={record.content} />
                    </Card>

                    {/* 附件区域 */}
                    {record.attachments && record.attachments.length > 0 && (
                        <Card padding="lg" className="mb-6">
                            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-text">
                                <FileText className="w-5 h-5 text-text-subtle" />
                                附件 ({record.attachments.length})
                            </h3>
                            <div className="space-y-3">
                                {record.attachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center gap-4 rounded-xl bg-surface-subtle p-4 transition-colors hover:bg-slate-100"
                                    >
                                        <div className="flex-shrink-0">
                                            {getFileIcon(file.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-text">
                                                {file.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-text-muted">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => handleDownload(file.name)}
                                            variant="ghost"
                                            size="sm"
                                            icon={Download}
                                            className="opacity-0 group-hover:opacity-100"
                                        >
                                            下载
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* 底部阅读确认区 */}
                    <Card padding="lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                                    <Megaphone className="w-6 h-6 text-brand-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-text">阅读确认</p>
                                    <p className="text-sm text-text-muted">
                                        {isRead 
                                            ? '您已于 ' + new Date().toLocaleString() + ' 阅读该公告'
                                            : '请阅读以上内容后点击确认已读'
                                        }
                                    </p>
                                </div>
                            </div>
                            {!isRead ? (
                                <Button
                                    onClick={handleMarkAsRead}
                                    icon={CheckCircle2}
                                    className="px-6"
                                >
                                    确认已读
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2 rounded-xl bg-success-50 px-6 py-3 font-medium text-success-700">
                                    <CheckCircle2 className="w-5 h-5" />
                                    已确认阅读
                                </div>
                            )}
                        </div>

                        {/* 阅读进度条 */}
                        <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between text-sm text-text-muted">
                                <span>全员阅读进度</span>
                                <span>{Math.round((record.readCount / record.views) * 100)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-surface-subtle">
                                <div 
                                    className="h-full rounded-full bg-brand-600 transition-all duration-500"
                                    style={{ width: `${Math.round((record.readCount / record.views) * 100)}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-text-subtle">
                                {record.readCount} 人已读 / {record.views} 人阅读
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
