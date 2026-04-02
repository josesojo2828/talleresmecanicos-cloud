"use client";

import React, { useState, useMemo } from 'react';
import {
    Wrench, Clock, CheckCircle2, Package,
    Copy, Plus, Trash2, Search, ExternalLink,
    FileText, User, Hash, Calendar,
    Phone, Navigation, Settings, Eye,
    Zap, Info, ListFilter, PlusCircle,
    LayoutDashboard, X,
    Save,
    Minus,
    Images
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/utils/api/api.client';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormGenerator } from '@/features/dashboard/components/FormGenerator';
import { PartForm, PartCategoryForm, WorkForm } from '@/types/form/app.form';

interface WorkDetailProps {
    data: any;
    updateRecord: (data: any) => Promise<any>;
    refresh: () => void;
}

export function WorkDetail({ data, updateRecord, refresh }: WorkDetailProps) {
    const t = useTranslations();
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<'overview' | 'parts' | 'data'>('overview');

    // Parts Management
    const [addingPart, setAddingPart] = useState(false);
    const [searchPart, setSearchPart] = useState('');
    const [partsResults, setPartsResults] = useState<any[]>([]);
    const [selectedPart, setSelectedPart] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    // Modals for "Administrative" actions
    const [modal, setModal] = useState<'category' | 'part' | null>(null);

    const statuses = [
        { key: 'OPEN', label: t('status.open'), color: 'bg-blue-500', icon: <Clock size={16} /> },
        { key: 'IN_PROGRESS', label: t('status.in_progress'), color: 'bg-amber-500', icon: <Wrench size={16} /> },
        { key: 'COMPLETED', label: t('status.completed'), color: 'bg-emerald-500', icon: <CheckCircle2 size={16} /> },
        { key: 'DELIVERED', label: t('status.delivered'), color: 'bg-slate-500', icon: <Package size={16} /> },
    ];

    const currentStatus = statuses.find(s => s.key === data.status) || statuses[0];

    const handleSearchPart = async (val: string) => {
        setSearchPart(val);
        if (val.length > 0) {
            try {
                const res = await apiClient.get(`/app/select/PART?param=${val}&parentId=${data.workshopId}`);
                setPartsResults(res.data.body);
            } catch (e) { }
        } else {
            setPartsResults([]);
        }
    };

    const handleAddPart = async () => {
        if (!selectedPart) return;
        setSaving(true);
        try {
            await apiClient.post(`/work/${data.id}/part`, { partId: selectedPart.id, quantity });
            toast.success(t('success.update'));
            setSelectedPart(null);
            setSearchPart('');
            setQuantity(1);
            refresh();
            setAddingPart(false);
        } catch (e) {
            toast.error(t('error.default'));
        } finally {
            setSaving(false);
        }
    };

    const handleRemovePart = async (partId: string) => {
        if (!confirm(t('dialog.delete_confirm', { slug: 'repuesto' }))) return;
        setSaving(true);
        try {
            await apiClient.delete(`/work/${data.id}/part/${partId}`);
            toast.success(t('success.delete'));
            refresh();
        } catch (e) {
            toast.error(t('error.default'));
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = async (status: string) => {
        setSaving(true);
        try {
            await updateRecord({ status });
        } finally {
            setSaving(false);
        }
    };

    const copyPublicLink = () => {
        const url = `${window.location.origin}/trabajo/${data.workshop?.slug}/${data.publicId}`;
        navigator.clipboard.writeText(url);
        toast.success("Enlace copiado al portapapeles");
    };

    const openPublicPage = () => {
        const url = `${window.location.origin}/trabajo/${data.workshop?.slug}/${data.publicId}`;
        window.open(url, '_blank');
    };

    const exportPDF = async () => {
        const doc = new jsPDF() as any;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 14;

        // 1. Header & Workshop Identity
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 45, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(data.workshop?.name?.toUpperCase() || 'REPORTE DE TRABAJO', margin, 25);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(200, 200, 200);
        doc.text(`DIRECCIÓN: ${data.workshop?.address?.toUpperCase() || 'DIRECCIÓN NO REGISTRADA'}`, margin, 33);
        doc.text(`TELÉFONO: ${data.workshop?.phone || data.workshop?.whatsapp || 'SIN TELÉFONO'}`, margin, 38);

        // 2. Document Identification (Right side of header)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('ORDEN DE SERVICIO', pageWidth - margin - 40, 20, { align: 'right' });
        doc.setFontSize(14);
        doc.text(`#${data.publicId}`, pageWidth - margin, 20, { align: 'right' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`FECHA: ${new Date(data.createdAt).toLocaleDateString()}`, pageWidth - margin, 33, { align: 'right' });
        doc.text(`ESTADO: ${t(`status.${data.status.toLowerCase()}`).toUpperCase()}`, pageWidth - margin, 38, { align: 'right' });

        // 3. Client & Vehicle Section
        let currentY = 60;
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('DETALLES DEL CLIENTE Y VEHÍCULO', margin, currentY);

        currentY += 5;
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setLineWidth(0.5);
        doc.line(margin, currentY, pageWidth - margin, currentY);

        currentY += 10;
        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(margin, currentY - 5, pageWidth - (margin * 2), 30, 3, 3, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENTE:', margin + 5, currentY + 5);
        doc.text('TELÉFONO:', margin + 5, currentY + 12);
        doc.text('PLACA/VIN:', pageWidth / 2, currentY + 5);
        doc.text('TICKET ID:', pageWidth / 2, currentY + 12);

        doc.setFont('helvetica', 'normal');
        doc.text(data.clientName || data.client?.firstName + ' ' + data.client?.lastName || 'S/N', margin + 35, currentY + 5);
        doc.text(data.clientPhone || data.client?.phone || 'S/N', margin + 35, currentY + 12);
        doc.text(data.vehicleLicensePlate?.toUpperCase() || 'S/N', (pageWidth / 2) + 30, currentY + 5);
        doc.text(data.id.substring(0, 8).toUpperCase(), (pageWidth / 2) + 30, currentY + 12);

        // 4. Job Description
        currentY += 45;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('TRABAJO SOLICITADO / DIAGNÓSTICO', margin, currentY);

        currentY += 5;
        doc.line(margin, currentY, pageWidth - margin, currentY);

        currentY += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const splitDesc = doc.splitTextToSize(data.description || 'Sin descripción detallada registrada.', pageWidth - (margin * 2));
        doc.text(splitDesc, margin, currentY);
        currentY += (splitDesc.length * 5) + 10;

        // 5. Financial Breakdown Table
        const tableData = data.partsUsed?.map((p: any) => [
            p.part.name.toUpperCase(),
            p.quantity,
            `${currencySymbol} ${p.part.price?.toLocaleString() || 0}`,
            `${currencySymbol} ${(p.quantity * (p.part.price || 0)).toLocaleString()}`
        ]) || [];

        if (data.laborPrice) {
            tableData.push([
                'MANO DE OBRA Y SERVICIOS PROFESIONALES',
                '1',
                `${currencySymbol} ${data.laborPrice.toLocaleString()}`,
                `${currencySymbol} ${data.laborPrice.toLocaleString()}`
            ]);
        }

        autoTable(doc, {
            startY: currentY,
            head: [['DESCRIPCIÓN DE CARGOS', 'CANT', 'PRECIO UNIT.', 'SUBTOTAL']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { halign: 'center' },
                2: { halign: 'right' },
                3: { halign: 'right', fontStyle: 'bold' }
            },
            margin: { left: margin, right: margin },
            styles: { fontSize: 9, cellPadding: 4 }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 15;

        // 6. Totals & Footer
        doc.setFillColor(15, 23, 42);
        doc.rect(pageWidth - margin - 80, finalY - 5, 80, 25, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('TOTAL A INVERTIR', pageWidth - margin - 75, finalY + 5);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`${currencySymbol} ${totalWork.toLocaleString()}`, pageWidth - margin - 5, finalY + 15, { align: 'right' });

        doc.setTextColor(100);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('NOTAS IMPORTANTES:', margin, finalY + 5);
        doc.text('- Este documento es un comprobante de servicio generado por el sistema administrativo.', margin, finalY + 12);
        doc.text('- Los precios incluyen impuestos según la normativa vigente en la región del taller.', margin, finalY + 17);

        // Branding
        doc.setFontSize(7);
        doc.setTextColor(180);
        doc.text(`Impreso el ${new Date().toLocaleString()} - Sistema de gestión para Talleres Mecánicos (RINDE+)`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

        doc.save(`Ticket_Servicio_${data.publicId}.pdf`);
    };

    const subtotalParts = useMemo(() => {
        return data.partsUsed?.reduce((acc: number, p: any) => acc + (p.quantity * (p.part?.price || 0)), 0) || 0;
    }, [data.partsUsed]);

    const totalWork = useMemo(() => {
        return subtotalParts + (data.laborPrice || 0);
    }, [subtotalParts, data.laborPrice]);

    const currencySymbol = useMemo(() => {
        const c = data.currency || 'USD';
        const symbols: Record<string, string> = {
            'USD': '$',
            'COP': 'COP$',
            'ARS': 'ARS$',
            'MXN': 'MXN$',
            'JPY': '¥'
        };
        return symbols[c] || '$';
    }, [data.currency]);

    const groupedParts = useMemo(() => {
        const groups: Record<string, any[]> = {};
        data.partsUsed?.forEach((p: any) => {
            const cat = p.part.category?.name || 'Varios';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });
        return groups;
    }, [data.partsUsed]);

    return (
        <div className="space-y-8 pb-20">
            {/* 0. Top Bar (Administrative Actions) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-950 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl sticky top-4 z-40">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none mb-1.5">{data.clientName || 'ORDEN DE TRABAJO'}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">VEHÍCULO: {data.vehicleLicensePlate || 'S/P'}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">{data.publicId}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={copyPublicLink} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all shadow-sm flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest active:scale-95 group">
                        <Copy size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" /> <span className="hidden md:inline">Copiar Enlace</span>
                    </button>
                    <button onClick={openPublicPage} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all shadow-sm flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest active:scale-95 group">
                        <ExternalLink size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" /> <span className="hidden md:inline">Página Pública</span>
                    </button>
                    <button onClick={exportPDF} className="p-4 px-8 rounded-2xl bg-emerald-500 text-slate-950 border border-emerald-400 hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-3 text-[10px] font-black uppercase tracking-widest active:scale-95">
                        <FileText size={18} /> <span>Exportar PDF</span>
                    </button>
                </div>
            </div>

            {/* 1. Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Lateral Panel: Control & Status */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Navigation Tabs */}
                    <div className="bg-white/40 p-3 rounded-[2rem] border border-white shadow-xl flex flex-col gap-1">
                        <button onClick={() => setActiveSection('overview')} className={cn("flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'overview' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-white")}>
                            <LayoutDashboard size={14} /> Resumen
                        </button>
                        <button onClick={() => setActiveSection('parts')} className={cn("flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'parts' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-white")}>
                            <Package size={14} /> Repuestos {data.partsUsed?.length > 0 && <span className="ml-auto bg-primary px-1.5 py-0.5 rounded text-[8px]">{data.partsUsed.length}</span>}
                        </button>
                        <button onClick={() => setActiveSection('data')} className={cn("flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'data' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-white")}>
                            <Settings size={14} /> Datos Técnicos
                        </button>
                    </div>

                            {/* Status Card */}
                            <div className="bg-slate-900/5 p-8 rounded-[2rem] border border-white shadow-xl space-y-6">
                                <header className="text-center space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ESTADO ACTUAL</p>
                                    <div className={cn("mx-auto w-fit px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-sm flex items-center gap-2", currentStatus.color)}>
                                        {currentStatus.icon} {currentStatus.label}
                                    </div>
                                </header>
                        <div className="grid grid-cols-2 gap-2.5">
                            {statuses.map(s => (
                                <button
                                    key={s.key}
                                    onClick={() => updateStatus(s.key)}
                                    disabled={saving}
                                    className={cn(
                                        "p-3 rounded-2xl border text-[9px] font-black uppercase transition-all duration-300 flex items-center justify-center gap-2",
                                        data.status === s.key
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]"
                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50 shadow-sm"
                                    )}
                                >
                                    <div className={cn("w-1.5 h-1.5 rounded-full", data.status === s.key ? "bg-emerald-400" : "bg-slate-200")} />
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main View Area */}
                <div className="lg:col-span-3">

                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Summary Card */}
                            <div className="bg-white/40 p-10 rounded-[3rem] border border-white shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                    <Wrench size={120} />
                                </div>
                                <div className="relative space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-inner border border-slate-100">
                                            <Wrench size={24} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{data.title}</h2>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed bg-white/40 p-4 rounded-2xl border border-white/50">{data.description || 'Sin descripción detallada del trabajo.'}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-100">
                                        <div className="p-4 bg-slate-50/50 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cliente</p>
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <User size={14} className="text-emerald-500" />
                                                <span className="text-[11px] font-black uppercase tracking-tight">
                                                    {data.clientName || (data.client ? `${data.client.firstName} ${data.client.lastName}` : 'Sin asignar')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50/50 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Vehículo</p>
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <Hash size={14} className="text-emerald-500" />
                                                <span className="text-[11px] font-black uppercase tracking-tight">{data.vehicleLicensePlate || 'Sin placa'}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50/50 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('headers.phone')}</p>
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <Phone size={14} className="text-emerald-500" />
                                                <span className="text-[11px] font-black uppercase tracking-tight">
                                                    {data.clientPhone || data.client?.phone || t('status.waiting') }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-900 rounded-2xl">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Inversión Actual</p>
                                            <div className="flex items-center gap-2 text-white">
                                                <Zap size={14} className="text-emerald-500" />
                                                <span className="text-[14px] font-black uppercase tracking-tight">{currencySymbol} {totalWork.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                {/* Live Evidence Preview for Mechanic */}
                                <div className="bg-white/40 p-8 rounded-[2.5rem] border border-white shadow-xl md:col-span-2">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><Images size={16} /> EVIDENCIAS ACTUALES</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                        {data.images?.map((img: string, i: number) => (
                                            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
                                                <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Info size={16} className="text-white" />
                                                </div>
                                            </div>
                                        ))}
                                        {(!data.images || data.images.length === 0) && (
                                            <div className="col-span-full py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sin fotos de evidencia cargadas</p>
                                            </div>
                                        )}
                                        <button onClick={() => setActiveSection('data')} className="aspect-square rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all font-black uppercase text-[8px]">
                                            <Plus size={20} />
                                            Gestionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'parts' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Inventory Search & Controls */}
                            <div className="bg-white/40 p-8 rounded-[3rem] border border-white shadow-xl space-y-8">
                                <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2"><Package size={18} /> Repuestos de la Orden</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inventario e Insumos</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setModal('category')}
                                            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-[9px] font-black uppercase tracking-tight active:scale-95"
                                        >
                                            <PlusCircle size={14} className="text-slate-400" /> Nueva Categoría
                                        </button>
                                        <button
                                            onClick={() => setModal('part')}
                                            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-[9px] font-black uppercase tracking-tight active:scale-95"
                                        >
                                            <Plus size={14} className="text-slate-400" /> Nuevo Repuesto
                                        </button>
                                        <button
                                            onClick={() => setAddingPart(!addingPart)}
                                            className={cn(
                                                "px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2.5",
                                                addingPart
                                                    ? "bg-slate-900 text-white shadow-slate-200"
                                                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                                            )}
                                        >
                                            {addingPart ? <X size={15} /> : <Plus size={15} />} {addingPart ? 'Cancelar' : 'Cargar Repuesto'}
                                        </button>
                                    </div>
                                </header>

                                {addingPart && (
                                    <div className="p-8 bg-slate-900 rounded-[3rem] text-white animate-in slide-in-from-top-4 duration-500 shadow-2xl relative overflow-visible border border-slate-800">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                            <div className="md:col-span-2 relative">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">1. BUSCAR EN INVENTARIO</label>
                                                <div className="relative group">
                                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre del repuesto o código SKU..."
                                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-14 pr-5 py-4.5 text-sm font-medium focus:bg-white focus:text-slate-900 transition-all outline-none ring-0 focus:ring-4 focus:ring-emerald-500/20 placeholder:text-slate-600"
                                                        value={searchPart}
                                                        onChange={(e) => handleSearchPart(e.target.value)}
                                                    />
                                                </div>

                                                {partsResults.length > 0 && (
                                                    <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resultados encontrados</p>
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                        </div>
                                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                                            {partsResults.map(p => (
                                                                <button
                                                                    key={p.id}
                                                                    onClick={() => {
                                                                        setSelectedPart(p);
                                                                        setPartsResults([]);
                                                                        setSearchPart(p.label);
                                                                    }}
                                                                    className="w-full px-8 py-5 text-left group hover:bg-emerald-50/50 border-b border-slate-50 last:border-0 transition-all flex items-center justify-between"
                                                                >
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-slate-900 text-[13px] font-black group-hover:text-emerald-600 transition-colors uppercase">{p.label}</span>
                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Disponible en stock</span>
                                                                    </div>
                                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                                                        <Plus size={14} />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">2. CANTIDAD</label>
                                                <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden group focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all">
                                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4.5 text-slate-500 hover:text-white hover:bg-slate-700 transition-colors">
                                                        <Minus size={16} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                                        className="w-full bg-transparent text-center text-sm font-black outline-none group-focus-within:text-slate-900"
                                                    />
                                                    <button onClick={() => setQuantity(quantity + 1)} className="p-4.5 text-slate-500 hover:text-white hover:bg-slate-700 transition-colors">
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="md:col-span-1">
                                                <button
                                                    onClick={handleAddPart}
                                                    disabled={saving || !selectedPart}
                                                    className={cn(
                                                        "w-full py-4.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3",
                                                        selectedPart
                                                            ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/30 ring-4 ring-emerald-500/10"
                                                            : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                                                    )}
                                                >
                                                    {saving ? <div className="loading loading-spinner loading-xs" /> : <Zap size={16} />}
                                                    <span>Confirmar</span>
                                                </button>
                                            </div>
                                        </div>

                                        {!selectedPart && searchPart.length > 0 && partsResults.length === 0 && (
                                            <div className="mt-5 flex items-center gap-2 text-rose-400">
                                                <Info size={14} />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                                                    No se encontraron repuestos con ese criterio de búsqueda.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Parts List Grouped */}
                                <div className="space-y-10">
                                    {Object.entries(groupedParts).map(([category, items]) => (
                                        <div key={category} className="space-y-3">
                                            <header className="flex items-center gap-2 px-2">
                                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] opacity-40">{category}</h5>
                                            </header>
                                            <div className="space-y-2">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-900/5 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-900">
                                                                {item.quantity}x
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-900 uppercase leading-none mb-1">{item.part.name}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{currencySymbol} {item.part.price?.toLocaleString() || 0} c/u</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <p className="text-[11px] font-black text-slate-900">{currencySymbol} {(item.quantity * (item.part.price || 0)).toLocaleString()}</p>
                                                            <button onClick={() => handleRemovePart(item.partId)} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {(!data.partsUsed || data.partsUsed.length === 0) && (
                                        <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
                                                <Package size={24} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">No hay repuestos registrados en esta orden</p>
                                        </div>
                                    )}

                                    <div className="pt-8 border-t border-slate-100 px-6 space-y-3">
                                        {((data.laborPrice ?? 0) > 0) && (
                                             <div className="flex justify-between items-center text-slate-400">
                                                 <span className="text-[10px] font-black uppercase tracking-widest">{t('headers.price_labor')}</span>
                                                 <span className="text-sm font-bold font-mono">{currencySymbol} {data.laborPrice?.toLocaleString() || 0}</span>
                                             </div>
                                        )}
                                        {data.partsUsed?.length > 0 && (
                                             <div className="flex justify-between items-center text-slate-400">
                                                 <span className="text-[10px] font-black uppercase tracking-widest">SUBTOTAL REPUESTOS</span>
                                                 <span className="text-sm font-bold font-mono">{currencySymbol} {subtotalParts.toLocaleString()}</span>
                                             </div>
                                        )}
                                        <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inversión Total</p>
                                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{currencySymbol} {totalWork.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-40 italic">Iva Incluido en sistema genérico*</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'data' && (
                        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-10 rounded-[3rem] border border-white shadow-xl">
                                <header className="mb-10 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900">
                                        <Settings size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Ajustes Técnicos</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Actualiza la información vital</p>
                                    </div>
                                </header>
                                <FormGenerator
                                    structure={WorkForm}
                                    defaultValues={data}
                                    isUpdate={true}
                                    onSubmit={async (values) => {
                                        await updateRecord(values);
                                        toast.success("Información actualizada");
                                        setActiveSection('overview');
                                    }}
                                    onCancel={() => setActiveSection('overview')}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modals for Quick Administration */}
            {modal === 'category' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-2xl relative border border-emerald-100">
                        <button onClick={() => setModal(null)} className="absolute top-8 right-8 text-slate-300 hover:text-emerald-500 transition-colors">
                            <X size={24} />
                        </button>
                        <header className="mb-10 text-center space-y-2">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce duration-1000">
                                <PlusCircle size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nueva Categoría</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Organiza mejor tu inventario</p>
                        </header>
                        <FormGenerator
                            structure={PartCategoryForm}
                            onSubmit={async (val) => {
                                await apiClient.post('/part/category', val);
                                toast.success("Categoría creada");
                                setModal(null);
                            }}
                            onCancel={() => setModal(null)}
                        />
                    </div>
                </div>
            )}

            {modal === 'part' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-900/10 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl relative max-h-[90vh] overflow-y-auto border border-emerald-100">
                        <button onClick={() => setModal(null)} className="absolute top-8 right-8 text-slate-300 hover:text-emerald-500 transition-colors">
                            <X size={24} />
                        </button>
                        <header className="mb-10 text-center space-y-2">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nuevo Repuesto</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Añade existencias al inventario</p>
                        </header>
                        <FormGenerator
                            structure={PartForm}
                            onSubmit={async (val) => {
                                await apiClient.post('/part', val);
                                toast.success("Repuesto añadido al inventario");
                                setModal(null);
                            }}
                            onCancel={() => setModal(null)}
                        />
                    </div>
                </div>
            )}

        </div>
    );
}
