"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import apiClient from '@/utils/api/api.client';
import { useAlertStore } from '@/store/useAlertStore';

interface GalleryManagerProps {
    images: string[];
    onUpdate: (data: any) => Promise<any>;
}

export const GalleryManager = ({ images = [], onUpdate }: GalleryManagerProps) => {
    const t = useTranslations();
    const { addAlert } = useAlertStore();
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            const res = await apiClient.post('/storage/upload-multiple', formData, {
                params: { folder: 'workshops/gallery' },
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newKeys = res.data.body.map((item: any) => item.key);
            await onUpdate({ images: [...images, ...newKeys] });
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        try {
            await onUpdate({ images: newImages });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Galería de Imágenes</h3>
                    <p className="text-xs font-bold text-slate-400">Gestiona las fotos que ven los clientes en el directorio</p>
                </div>
                
                <label className={`
                    flex items-center gap-3 px-6 py-3 rounded-2xl cursor-pointer transition-all active:scale-95
                    ${uploading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20'}
                `}>
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {uploading ? 'Subiendo...' : 'Añadir Fotos'}
                    </span>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleUpload} 
                        disabled={uploading}
                    />
                </label>
            </header>

            {images.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 text-slate-300">
                    <ImageIcon size={64} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">No hay imágenes en la galería</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((url, index) => {
                        const displayUrl = url.startsWith('http') || url.startsWith('/') 
                            ? url 
                            : `/explorar-red/${url}`;
                        
                        return (
                            <div key={index} className="group relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                                <img 
                                    src={displayUrl} 
                                    alt={`Gallery ${index}`} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                                    <button 
                                        onClick={() => handleDelete(index)}
                                        className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
