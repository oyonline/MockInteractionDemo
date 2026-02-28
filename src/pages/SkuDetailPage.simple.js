// src/pages/SkuDetailPage.simple.js
import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronDown, MousePointer2, RotateCcw, Move, Circle } from 'lucide-react';

/* ========= 小工具 ========= */
function cx(...args) {
    return args.filter(Boolean).join(' ');
}

/* ========= 图像占位组件 ========= */
function ImageWithFallback({ src, alt, className }) {
    const [error, setError] = useState(false);
    const fallback =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
         <rect width="100%" height="100%" fill="#f3f4f6"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14">No Image</text>
       </svg>`
        );
    return (
        <img
            src={error ? fallback : src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
}

/* ========= 1) 面包屑 + 标题 ========= */
function ProductHeader({ sku = 'KRDSPNCE-7MHMH2WH-C' }) {
    return (
        <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>产品中心</span>
                <ChevronRight size={12} className="mx-1" />
                <span>产品 / SKU 列表</span>
                <ChevronRight size={12} className="mx-1" />
                <span className="text-gray-900">{sku}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">SKU: {sku}</h1>
        </div>
    );
}

/* ========= 2) 头图 + 基础信息栅格（公共信息区） ========= */
const PRODUCT_IMAGE =
    'https://images.unsplash.com/photo-1529230117010-b6c436154f25?auto=format&fit=crop&w=1080&q=80';

function ProductInfoGrid({ record }) {
    const fileInputRef = useRef(null);
    const handleUploadClick = () => fileInputRef.current?.click();
    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            alert(`图片上传模拟成功：${e.target.files[0].name}`);
        }
    };

    // 如果传入了 record，这里可从 record 读取；否则给默认示例
    const info = {
        enName: record?.enName || 'Crixus Spinning Rod',
        brand: record?.brand || 'KastKing',
        cnName: record?.cnName || '克雷斯直柄竿',
        categoryPath: record?.categoryPath || 'Rods | (KRD) / Spinning | (SPN)',
        pm: record?.pm || '尹学根',
        series: record?.series || 'Plano (PLN)',
        markets: record?.markets || 'USA ONLINE / DTC / OFFLINE',
        status: record?.status || '在售',
        launchDate: record?.launchDate || '2025-03-15',
        syncState: record?.syncState || '已同步',
        creator: record?.creator || 'Wilson',
        createTime: record?.createTime || '2025-05-14 11:29:02',
        tags: record?.tags || ['2025新品', '春季'],
        categoryName: record?.categoryName || '鱼竿',
    };

    return (
        <div className="bg-white p-4 border border-gray-200 m-4 flex gap-4 shadow-sm">
            <div
                onClick={handleUploadClick}
                className="w-48 h-48 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all shrink-0 relative group overflow-hidden"
                title="点击上传产品主图"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 flex items-center justify-center transition-opacity z-10 backdrop-blur-[1px]">
                    <div className="flex flex-col items-center text-white">
                        <span className="text-3xl leading-none">＋</span>
                        <span className="text-sm mt-2 font-medium">点击上传产品主图</span>
                    </div>
                </div>
                <ImageWithFallback src={PRODUCT_IMAGE} alt="Product" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 w-full bg-white/90 py-1 text-center text-[10px] text-gray-500 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    只支持 jpg,png 格式
                </div>
            </div>

            <div className="flex-1 grid grid-cols-4 border-t border-l border-gray-200 text-sm">
                <InfoItem label="英文名" value={info.enName} />
                <InfoItem label="所属品牌" value={info.brand} />

                <InfoItem label="中文名" value={info.cnName} />
                <InfoItem label="所属类目" value={info.categoryPath} />

                <InfoItem label="产品经理" value={info.pm} />
                <InfoItem label="所属系列" value={info.series} />

                <InfoItem label="主营市场" value={info.markets} />
                <InfoItem
                    label="产品状态"
                    value={
                        <span className="text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                            {info.status}
            </span>
                    }
                />

                <InfoItem label="上市日期" value={info.launchDate} />
                <InfoItem label="系统同步状态" value={info.syncState} />

                <InfoItem label="创建人" value={info.creator} />
                <InfoItem label="创建时间" value={info.createTime} />

                <InfoItem
                    label="产品标签"
                    value={
                        <div className="flex gap-1">
                            {info.tags.map((t, i) => (
                                <span
                                    key={i}
                                    className={cx(
                                        'px-2 py-0.5 text-xs rounded border',
                                        i % 2 === 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                                    )}
                                >
                  {t}
                </span>
                            ))}
                        </div>
                    }
                />
                <InfoItem label="类目/Category" value={info.categoryName} />
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <>
            <div className="bg-gray-50 px-3 py-2 border-b border-r border-gray-200 text-gray-500 flex items-center hover:bg-gray-100 transition-colors cursor-default">
                {label}
            </div>
            <div className="px-3 py-2 border-b border-r border-gray-200 text-gray-800 flex items-center overflow-hidden whitespace-nowrap text-ellipsis bg-white hover:bg-blue-50/30 transition-colors">
                {value}
            </div>
        </>
    );
}

/* ========= 3) 产品属性（示例占位，可后续接入真实逻辑） ========= */
function ProductAttributes() {
    const [basicType, setBasicType] = useState('normal');
    const [specialAttrs, setSpecialAttrs] = useState({ textile: false, bluetooth: false, glasses: true, wood: false, motor: false });
    const [glassesOptions, setGlassesOptions] = useState({ prescription: true, nonPrescription: false, photochromic: false, degree: 230 });
    const [batteryType, setBatteryType] = useState('included');
    const [batteryDetails, setBatteryDetails] = useState({ type: '手持', model: '5A', capacity: 1500 });
    const [prohibitedAttrs, setProhibitedAttrs] = useState({ knife: true, sharp: false, flammable: true, lighter: true, flint: false, other: false });
    const [bladeLength, setBladeLength] = useState('35cm');
    const [shapeAttrs, setShapeAttrs] = useState({ liquid: true, paste: false, powder: true, gas: false });
    const [contentVolume, setContentVolume] = useState('15');

    const toggle = (setter, key) => setter((prev) => ({ ...prev, [key]: !prev[key] }));
    const toggleGlasses = (key) =>
        setGlassesOptions((prev) => {
            if (key === 'nonPrescription' && !prev.nonPrescription) return { ...prev, nonPrescription: true, prescription: false };
            if (key === 'prescription' && !prev.prescription) return { ...prev, prescription: true, nonPrescription: false };
            return { ...prev, [key]: !prev[key] };
        });

    return (
        <div className="bg-white p-4 m-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-2">
                <h3 className="font-bold text-gray-800">产品属性</h3>
            </div>

            <div className="flex flex-col gap-0 border border-gray-200 bg-gray-50">
                <AttributeRow label="基础属性(单选)">
                    <ToggleSwitch label="普货类" checked={basicType === 'normal'} onChange={(c) => setBasicType(c ? 'normal' : 'special')} />
                </AttributeRow>

                <AttributeRow label="特殊属性(多选)" className="items-start py-3">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-6 flex-wrap">
                            <Check label="纺织品" checked={specialAttrs.textile} onChange={() => toggle(setSpecialAttrs, 'textile')} />
                            <Check label="蓝牙产品" checked={specialAttrs.bluetooth} onChange={() => toggle(setSpecialAttrs, 'bluetooth')} />
                            <Check label="眼镜产品" checked={specialAttrs.glasses} onChange={() => toggle(setSpecialAttrs, 'glasses')} />
                            <Check label="木制品" checked={specialAttrs.wood} onChange={() => toggle(setSpecialAttrs, 'wood')} />
                            <Check label="特定强性产品(含电机以及马达)" checked={specialAttrs.motor} onChange={() => toggle(setSpecialAttrs, 'motor')} />
                        </div>

                        {specialAttrs.glasses && (
                            <div className="ml-0 pl-4 bg-white border border-gray-200 p-2 rounded w-fit">
                                <div className="flex gap-4 mb-2">
                                    <Check label="带度数眼镜" checked={glassesOptions.prescription} onChange={() => toggleGlasses('prescription')} />
                                    <Check label="不带度数眼镜" checked={glassesOptions.nonPrescription} onChange={() => toggleGlasses('nonPrescription')} />
                                    <Check label="是否变色" checked={glassesOptions.photochromic} onChange={() => toggleGlasses('photochromic')} />
                                </div>
                                {glassesOptions.prescription && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">度数</span>
                                        <input
                                            type="number"
                                            value={glassesOptions.degree}
                                            onChange={(e) => setGlassesOptions({ ...glassesOptions, degree: Number(e.target.value) })}
                                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </AttributeRow>

                <AttributeRow label="电池属性(单选)" className="items-start py-3">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-6 flex-wrap">
                            <Radio label="无电池" name="battery" checked={batteryType === 'none'} onChange={() => setBatteryType('none')} />
                            <Radio label="内置电池" name="battery" checked={batteryType === 'built-in'} onChange={() => setBatteryType('built-in')} />
                            <Radio label="配套电池" name="battery" checked={batteryType === 'included'} onChange={() => setBatteryType('included')} />
                            <Radio label="纯电池及移动电源" name="battery" checked={batteryType === 'pure'} onChange={() => setBatteryType('pure')} />
                        </div>

                        {batteryType !== 'none' && (
                            <div className="flex gap-4 items-center flex-wrap">
                                <LabeledInput label="电池类型" value={batteryDetails.type} onChange={(v) => setBatteryDetails({ ...batteryDetails, type: v })} />
                                <LabeledInput label="电池型号" value={batteryDetails.model} onChange={(v) => setBatteryDetails({ ...batteryDetails, model: v })} />
                                <LabeledInput
                                    label="电池容量(mAh)"
                                    type="number"
                                    value={batteryDetails.capacity}
                                    onChange={(v) => setBatteryDetails({ ...batteryDetails, capacity: Number(v || 0) })}
                                />
                            </div>
                        )}
                    </div>
                </AttributeRow>

                <AttributeRow label="违禁属性(多选)" className="items-start py-3">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-6 flex-wrap">
                            <Check label="管制刀具" checked={prohibitedAttrs.knife} onChange={() => toggle(setProhibitedAttrs, 'knife')} />
                            <Check label="特殊尖锐器具" checked={prohibitedAttrs.sharp} onChange={() => toggle(setProhibitedAttrs, 'sharp')} />
                            <Check label="易燃易爆品" checked={prohibitedAttrs.flammable} onChange={() => toggle(setProhibitedAttrs, 'flammable')} />
                        </div>
                        <div className="flex gap-4 items-center flex-wrap">
                            {prohibitedAttrs.knife && <LabeledInput label="刀刃长度" value={bladeLength} onChange={setBladeLength} className="w-24" />}
                            {prohibitedAttrs.flammable && (
                                <>
                                    <Check label="电子点烟器" checked={prohibitedAttrs.lighter} onChange={() => toggle(setProhibitedAttrs, 'lighter')} />
                                    <Check label="打火石" checked={prohibitedAttrs.flint} onChange={() => toggle(setProhibitedAttrs, 'flint')} />
                                    <Check label="其他" checked={prohibitedAttrs.other} onChange={() => toggle(setProhibitedAttrs, 'other')} />
                                </>
                            )}
                        </div>
                    </div>
                </AttributeRow>

                <AttributeRow label="形态属性(多选)" isLast>
                    <div className="flex gap-6 items-center flex-wrap">
                        <Check label="液体产品" checked={shapeAttrs.liquid} onChange={() => toggle(setShapeAttrs, 'liquid')} />
                        <Check label="膏体产品" checked={shapeAttrs.paste} onChange={() => toggle(setShapeAttrs, 'paste')} />
                        <Check label="粉末产品" checked={shapeAttrs.powder} onChange={() => toggle(setShapeAttrs, 'powder')} />
                        <Check label="气体产品" checked={shapeAttrs.gas} onChange={() => toggle(setShapeAttrs, 'gas')} />
                        {(shapeAttrs.liquid || shapeAttrs.paste || shapeAttrs.powder || shapeAttrs.gas) && (
                            <div className="flex items-center gap-2 ml-4 border-l pl-4 border-gray-200">
                                <span className="text-xs text-gray-500">产品含量(ml)</span>
                                <input
                                    type="number"
                                    value={contentVolume}
                                    onChange={(e) => setContentVolume(e.target.value)}
                                    className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        )}
                    </div>
                </AttributeRow>
            </div>
        </div>
    );
}

function AttributeRow({ label, children, className, isLast }) {
    return (
        <div className={cx('flex min-h-[50px] border-b border-gray-200', isLast && 'border-b-0')}>
            <div className="w-32 bg-gray-50 p-3 text-xs text-gray-500 flex items-center border-r border-gray-200 shrink-0">{label}</div>
            <div className={cx('flex-1 p-3 bg-white flex items-center', className)}>{children}</div>
        </div>
    );
}
function Check({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none group">
            <div className={cx('w-4 h-4 rounded border flex items-center justify-center transition-colors shadow-sm', checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400')}>
                {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
            <span className={cx('text-sm', checked ? 'text-gray-900 font-medium' : 'text-gray-700')}>{label}</span>
        </label>
    );
}
function Radio({ label, name, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none group">
            <div className={cx('w-4 h-4 rounded-full border flex items-center justify-center transition-colors shadow-sm', checked ? 'border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400')}>
                {checked && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </div>
            <input type="radio" name={name} className="hidden" checked={checked} onChange={onChange} />
            <span className={cx('text-sm', checked ? 'text-gray-900 font-medium' : 'text-gray-700')}>{label}</span>
        </label>
    );
}
function ToggleSwitch({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className={cx('w-10 h-5 rounded-full relative transition-colors shadow-inner', checked ? 'bg-blue-600' : 'bg-gray-300')}>
                <div className={cx('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm', checked ? 'left-5.5' : 'left-0.5')} />
            </div>
            <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
            <span className={cx('text-sm', checked ? 'text-gray-900 font-medium' : 'text-gray-700')}>{label}</span>
        </label>
    );
}
function LabeledInput({ label, value, onChange, type = 'text', className }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={cx('w-28 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500', className)}
            />
        </div>
    );
}

/* ========= 4) 参数表（示例） ========= */
function ProductParameters() {
    const params = [
        { label: 'PinionGear\n齿杆', value: 'Brass' },
        { label: 'TeNosionNoKnobSouNod\n微调旋钮发声', value: 'Yes' },
        { label: 'HandOrientation\n左右手', value: 'LeftHanded' },
        { label: 'CPT(cm)\n收线速率', value: '65' },
        { label: 'DragClicker\n泄力报警', value: 'No' },
        { label: 'SideCovers\n侧盖', value: 'Aluminium' },
        { label: 'LineCapacity(LB/Yds)\n线容量(尼龙)', value: '12LB/200Yds, 16LB/180Yds' },
        { label: 'HandleKnobs\n握手', value: 'EVA' },
        { label: 'BBMaterial\n轴承材料', value: 'Stainlesssteel' },
        { label: 'IPT(Inch)\n收线速率', value: '25.6' },
        { label: 'MaxDrag\n最大钓力', value: '15LB' },
        { label: 'MainGear\n齿盘', value: 'Brass' },
        { label: 'Frame\n主体支架', value: 'SUS' },
        { label: '', value: '' },
        { label: '', value: '' },
    ];

    return (
        <div className="bg-white p-4 m-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-2">
                <h3 className="font-bold text-gray-800">产品参数</h3>
            </div>

            <div className="grid grid-cols-3 border-t border-l border-gray-200">
                {params.map((param, index) => (
                    <ParamItem key={index} label={param.label} value={param.value} />
                ))}
            </div>
        </div>
    );
}
function ParamItem({ label, value }) {
    const parts = String(label || '').split('\n');
    return (
        <div className="flex border-b border-r border-gray-200 min-h-[60px]">
            <div className="w-1/3 bg-gray-50 p-2 text-xs text-gray-500 flex flex-col justify-center border-r border-gray-200">
                {parts.map((p, i) => (
                    <span key={i} className={i === 0 ? 'font-medium' : ''}>
            {p}
          </span>
                ))}
            </div>
            <div className="w-2/3 p-2 text-sm text-gray-800 flex items-center bg-white">{value || '-'}</div>
        </div>
    );
}

/* ========= 5) Tabs ========= */
function ProductTabs({ activeTab, onTabChange }) {
    const tabs = ['产品信息', '采购信息', '物流信息', '计划信息', '评论/备注', '操作日志'];
    return (
        <div className="flex border-b border-gray-200 bg-white px-4 sticky top-0 z-30">
            {tabs.map((label) => {
                const isActive = activeTab === label;
                return (
                    <div
                        key={label}
                        onClick={() => onTabChange?.(label)}
                        className={cx(
                            'px-6 py-3 text-sm cursor-pointer font-medium relative transition-colors',
                            isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        )}
                    >
                        {label}
                        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </div>
                );
            })}
        </div>
    );
}

/* ========= 6) 特别说明（关键：编号与详情默认一致） ========= */
function SpecialInstructions() {
    // 右侧说明列表：顺序即编号（1..N）
    const partsData = [
        {
            title: '7.5" Aluminum Pliers',
            descriptions: [
                '6061 铝材主体 + 420 不锈钢齿',
                '人体工学防滑手柄 / 弹簧助力',
                '可开分裂环',
                '可剪 10-60lb PE 或尼龙线（手柄激光 “KASTKING” 字样）',
            ],
        },
        {
            title: 'Molded Plier Sheath',
            descriptions: ['耐用注塑材质', '皮带夹便携', '底部排水孔'],
        },
        {
            title: 'Utility Plier Lanyard',
            descriptions: ['高弹线圈绳', '铝合金登山扣', '最长 1.2m'],
        },
        {
            title: 'Wacky & Neko Rig Pliers',
            descriptions: ['针对 finesse 技法', '舒适握持', '带 O-ring 分配器'],
        },
        {
            title: 'Single Aluminum Pliers Version',
            descriptions: ['标准单品版', '性价比高', '同材质同工艺'],
        },
        {
            title: 'Tool Combo Version',
            descriptions: ['整套版（含鞘与绳）', '礼盒包装', '更高性价比'],
        },
    ];

    // 根据 partsData 长度自动生成随机分布的初始点位（后续可拖拽）
    const makeInitialMarkers = (count) => {
        // 使用固定种子的伪随机，确保每次渲染位置一致
        const seededRandom = (seed) => {
            const x = Math.sin(seed * 9999) * 10000;
            return x - Math.floor(x);
        };

        return Array.from({ length: count }, (_, i) => {
            const id = i + 1;
            // 随机分布在图片区域内，避免太靠边
            const anchorX = 15 + seededRandom(id * 7) * 70; // 15% ~ 85%
            const anchorY = 10 + seededRandom(id * 13) * 75; // 10% ~ 85%
            // 标签位置相对锚点偏移
            const labelX = Math.min(Math.max(anchorX + (seededRandom(id * 17) - 0.5) * 20, 5), 95);
            const labelY = Math.min(Math.max(anchorY - 8 - seededRandom(id * 23) * 5, 2), 90);
            return { id, anchor: { x: anchorX, y: anchorY }, label: { x: labelX, y: labelY } };
        });
    };

    const [markers, setMarkers] = useState(() => makeInitialMarkers(partsData.length));
    const [dragging, setDragging] = useState(null); // {id, type:'anchor'|'label'}
    const [expandedItems, setExpandedItems] = useState(new Set([1])); // 默认展开 1
    const containerRef = useRef(null);

    // 点击新增标记
    const handleContainerClick = (e) => {
        if (dragging) return;
        if (e.target.closest('.marker-interactive')) return;
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const label = { x: Math.min(Math.max(x + 5, 0), 100), y: Math.min(Math.max(y - 10, 0), 100) };
        const newId = markers.length + 1;
        setMarkers([...markers, { id: newId, anchor: { x, y }, label }]);
    };

    // 拖拽
    const onMouseDown = (e, id, type) => {
        e.stopPropagation();
        e.preventDefault();
        setDragging({ id, type });
    };
    const onMouseMove = (e) => {
        if (!dragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
        const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
        setMarkers((prev) => prev.map((m) => (m.id === dragging.id ? { ...m, [dragging.type]: { x, y } } : m)));
    };
    const onMouseUp = () => setDragging(null);
    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        } else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    // onMouseMove/onMouseUp 稳定引用，仅依赖 dragging 控制挂载
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragging]);

    // 删除（双击标签）
    const onDoubleClickLabel = (e, id) => {
        e.stopPropagation();
        const filtered = markers.filter((m) => m.id !== id);
        // ✅ 重新编号成 1..N，继续与右侧 partsData 对齐
        const reindexed = filtered.map((m, i) => ({ ...m, id: i + 1 }));
        setMarkers(reindexed);
        alert(`已删除标记 #${id}`);
    };

    const clearMarkers = () => {
        setMarkers([]);
        alert('已清空所有标记点');
    };

    const toggleExpand = (idx) => {
        const s = new Set(expandedItems);
        s.has(idx) ? s.delete(idx) : s.add(idx);
        setExpandedItems(s);
    };

    const DIAGRAM =
        'https://images.unsplash.com/photo-1647601317118-c29dc70032e9?auto=format&fit=crop&w=1080&q=80';

    return (
        <div className="bg-white p-4 m-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4 border-l-4 border-blue-600 pl-2">
                <h3 className="font-bold text-gray-800">特别说明 / Special Instruction</h3>
                <div className="flex gap-2">
                    {markers.length > 0 && (
                        <button
                            onClick={clearMarkers}
                            className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                            <RotateCcw size={12} /> 重置标记
                        </button>
                    )}
                    <div className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <MousePointer2 size={12} /> 点击添加 / 拖拽调整 / 双击数字删除
                    </div>
                </div>
            </div>

            <div className="flex border border-gray-200 p-4 gap-6 min-h-[500px]">
                {/* 左侧：可标注图片 */}
                <div className="w-1/2 border border-gray-200 bg-gray-50 p-2 flex items-center justify-center relative select-none overflow-hidden">
                    <div
                        ref={containerRef}
                        onClick={handleContainerClick}
                        className="relative w-full h-full flex items-center justify-center cursor-crosshair"
                    >
                        <ImageWithFallback src={DIAGRAM} alt="Product Diagram" className="max-w-full max-h-[500px] object-contain" />

                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {markers.map((m) => (
                                <line
                                    key={`line-${m.id}`}
                                    x1={`${m.anchor.x}%`}
                                    y1={`${m.anchor.y}%`}
                                    x2={`${m.label.x}%`}
                                    y2={`${m.label.y}%`}
                                    stroke="#EF4444"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 2"
                                />
                            ))}
                        </svg>

                        {markers.map((m) => (
                            <div key={m.id} className="z-10">
                                <div
                                    onMouseDown={(e) => onMouseDown(e, m.id, 'anchor')}
                                    className="absolute w-3 h-3 -ml-1.5 -mt-1.5 bg-red-500 rounded-full border-2 border-white shadow-sm cursor-move marker-interactive hover:scale-125 transition-transform"
                                    style={{ left: `${m.anchor.x}%`, top: `${m.anchor.y}%` }}
                                    title="拖拽定位点"
                                >
                                    <div className="w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>

                                <div
                                    onMouseDown={(e) => onMouseDown(e, m.id, 'label')}
                                    onDoubleClick={(e) => onDoubleClickLabel(e, m.id)}
                                    className="absolute -ml-4 -mt-4 flex flex-col items-center cursor-move marker-interactive group"
                                    style={{ left: `${m.label.x}%`, top: `${m.label.y}%` }}
                                    title="拖拽移动标签 / 双击删除"
                                >
                                    <div
                                        className={cx(
                                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 transition-all',
                                            dragging?.id === m.id && dragging.type === 'label'
                                                ? 'bg-red-600 scale-110 border-white text-white'
                                                : 'bg-red-500 border-white text-white hover:bg-red-600'
                                        )}
                                    >
                                        {m.id}
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-4 text-red-500 transition-opacity bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                                        <Move size={10} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 右侧：部件说明列表（与编号 1..N 对齐） */}
                <div className="w-1/2 flex flex-col h-full">
                    <div className="border border-gray-200 rounded-sm flex-1 overflow-auto bg-white">
                        <div className="flex bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-medium sticky top-0 z-10">
                            <div className="w-12 py-2 px-3 text-center border-r border-gray-200">序号</div>
                            <div className="flex-1 py-2 px-3">详情说明</div>
                        </div>

                        {partsData.map((item, idx) => {
                            const markerId = idx + 1; // 关键：与 markers.id 对齐
                            const markerExists = markers.find((m) => m.id === markerId);
                            const isExpanded = expandedItems.has(markerId);

                            return (
                                <div
                                    key={idx}
                                    className={cx('border-b border-gray-200 last:border-b-0', markerExists ? 'bg-red-50/30' : 'hover:bg-gray-50')}
                                >
                                    <div className="flex items-start text-sm cursor-pointer" onClick={() => toggleExpand(markerId)}>
                                        <div className="w-12 py-3 px-3 text-center border-r border-gray-200 font-medium text-gray-500">{markerId}</div>
                                        <div className="flex-1 py-3 px-3 flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 font-medium text-gray-800">
                                                    {isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                                                    <span>{item.title}</span>
                                                </div>
                                                {markerExists && (
                                                    <span className="text-[10px] text-red-500 border border-red-200 px-1.5 rounded bg-red-50">已关联</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="bg-gray-50/50 pl-14 pr-4 py-2 text-xs text-gray-600 border-t border-gray-100">
                                            <ul className="space-y-2">
                                                {item.descriptions.map((d, i) => (
                                                    <li key={i} className="flex gap-2 items-start">
                                                        <Circle size={6} className="mt-1.5 shrink-0 fill-gray-400 text-gray-400" />
                                                        <span className="leading-relaxed">{d}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* 多出来的标记（partsData 没有定义的） */}
                        {markers
                            .filter((m) => m.id > partsData.length)
                            .map((m) => (
                                <div key={m.id} className="border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center text-sm bg-blue-50/30">
                                        <div className="w-12 py-3 px-3 text-center border-r border-gray-200 font-medium text-blue-600">{m.id}</div>
                                        <div className="flex-1 py-3 px-3">
                                            <div className="flex items-center gap-2 text-blue-600 font-medium">
                                                <span>待配置详情</span>
                                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 rounded text-blue-700">新标记</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">点击此处编辑该标记点的详细描述信息...</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========= 7) 页面装配 ========= */
export default function SkuDetailPage({ record }) {
    const [activeTab, setActiveTab] = useState('产品信息');
    const sku = record?.sku || record?.skuId || 'KRDSPNCE-7MHMH2WH-C';

    return (
        <div className="flex-1 min-h-0 overflow-auto">
            <ProductHeader sku={sku} />
            <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === '产品信息' && (
                <>
                    <ProductInfoGrid record={record} />
                    <ProductAttributes />
                    <ProductParameters />
                    <SpecialInstructions />
                </>
            )}

            {activeTab !== '产品信息' && (
                <div className="m-4 p-8 bg-white border border-gray-200 text-gray-500 text-sm rounded">{activeTab}（示例占位区域）</div>
            )}
        </div>
    );
}
