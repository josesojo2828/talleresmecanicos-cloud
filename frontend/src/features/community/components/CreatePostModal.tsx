"use client";

import React, { useState } from "react";
import { X, Plus, Image as ImageIcon, Loader2, Send } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import apiClient from "@/utils/api/api.client";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categories: { id: string, name: string }[];
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
    isOpen, onClose, onSuccess, categories 
}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setLoading(true);
        try {
            let imageKeys: string[] = [];
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(img => formData.append('files', img));
                const uploadRes = await apiClient.post("/forum-post/upload-images", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageKeys = uploadRes.data.map((res: {key: string}) => res.key);
            }

            await apiClient.post("/forum-post", {
                title,
                content,
                categoryIds: selectedCategories,
                images: imageKeys
            });
            onSuccess();
            onClose();
            // Reset form
            setTitle("");
            setContent("");
            setSelectedCategories([]);
            setImages([]);
        } catch (error) {
            console.error("Error creating post", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <header className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Plus size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nuevo Tema</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comparte con la comunidad</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título del Debate</label>
                        <input 
                            required
                            type="text" 
                            placeholder="Ej: ¿Cuál es el mejor aceite para motor diésel?"
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-5 text-lg font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contenido / Pregunta</label>
                        <textarea 
                            required
                            rows={6}
                            placeholder="Describe tu duda o comparte tu experiencia aquí..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-slate-700 font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all resize-none placeholder:text-slate-300"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Imágenes (Opcional, máx 5)</label>
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-full transition-colors flex items-center gap-2 text-xs font-bold px-4"
                            >
                                <ImageIcon size={16} /> Agregar Imágenes
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                multiple 
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newFiles = Array.from(e.target.files);
                                        setImages(prev => [...prev, ...newFiles].slice(0, 5));
                                    }
                                }}
                            />
                        </div>
                        {images.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-3">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group">
                                        <img src={URL.createObjectURL(img)} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Categorías Relacionadas</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => toggleCategory(cat.id)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                        selectedCategories.includes(cat.id) 
                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200" 
                                            : "bg-white text-slate-400 border-slate-100 hover:border-emerald-500 hover:text-emerald-600"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white py-8 rounded-[2rem] font-black text-base transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            PUBLICAR AHORA
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
