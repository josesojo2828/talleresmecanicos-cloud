"use client";

import React, { useState, useEffect } from 'react';
import { StarRating } from '@/components/atoms/StarRating';
import apiClient from '@/utils/api/api.client';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@prisma/client';
import { toast } from 'sonner';
import { Loader2, MessageSquare, User } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    }
}

interface Props {
    workshopId: string;
}

export const WorkshopReviews = ({ workshopId }: Props) => {
    const { user, isAuthenticated } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hasRated, setHasRated] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await apiClient.get(`/workshop-review/workshop/${workshopId}`);
            const data = res.data?.body?.data || res.data?.data || [];
            setReviews(data);
            
            // Si el usuario está logueado, verificar si ya calificó
            if (user) {
                const userReview = data.find((r: any) => r.userId === user.id);
                if (userReview) setHasRated(true);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workshopId) fetchReviews();
    }, [workshopId, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Por favor, selecciona una calificación");
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post('/workshop-review', {
                rating,
                comment,
                workshopId
            });
            toast.success("¡Gracias por tu calificación!");
            setRating(0);
            setComment('');
            setHasRated(true);
            fetchReviews();
        } catch (error: any) {
            const message = error.response?.data?.message || "Error al enviar la calificación";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const isClient = user?.role === UserRole.CLIENT;

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>;

    return (
        <div className="space-y-12">
            <header className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Opiniones de Clientes</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Feedback real de la comunidad</p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black italic tracking-tighter">
                        {reviews.length > 0 
                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                            : "0.0"}
                    </p>
                    <StarRating 
                        rating={reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0} 
                        size={14} 
                    />
                </div>
            </header>

            {/* Formulario (Solo para CLIENTES logueados que no hayan calificado) */}
            {isAuthenticated && isClient && !hasRated && (
                <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Tu Calificación</label>
                        <StarRating rating={rating} onRatingChange={setRating} interactive size={32} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Tu comentario</label>
                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Cuéntanos tu experiencia en este taller..."
                            className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm focus:border-slate-950 outline-none transition-all min-h-[120px]"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                        {submitting ? "ENVIANDO..." : "PUBLICAR CALIFICACIÓN"}
                    </button>
                </form>
            )}

            {/* Listado de reviews */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-10 space-y-4">
                        <MessageSquare className="mx-auto text-slate-200" size={48} />
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Aún no hay opiniones. ¡Sé el primero en calificar!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white border border-slate-50 p-6 rounded-[24px] shadow-sm flex gap-6 group hover:border-slate-200 transition-all">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                                <User size={24} />
                            </div>
                            <div className="space-y-2 flex-grow">
                                <header className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-900">{review.user.firstName} {review.user.lastName}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <StarRating rating={review.rating} size={12} />
                                </header>
                                <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
