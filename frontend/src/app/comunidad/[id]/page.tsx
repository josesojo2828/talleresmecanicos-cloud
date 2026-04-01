'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { 
    ArrowLeft, 
    MessageSquare, 
    Heart, 
    Bookmark, 
    Share2, 
    User,
    Send,
    ThumbsUp
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/utils/api/api.client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface ForumComment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface ForumPost {
    id: string;
    title: string;
    content: string;
    images: string[];
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
    category?: {
        name: string;
    };
    isLiked?: boolean;
    comments: ForumComment[];
    _count: {
        likes: number;
        comments: number;
        favorites: number;
    };
}

export default function PostDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [post, setPost] = useState<ForumPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/forum-post/${id}`, { params: { userId: user?.id } });
                setPost(response.data?.body || response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id, user?.id]);

    const handleLike = async () => {
        if (!isAuthenticated || !post) return router.push('/login');
        try {
            const response = await apiClient.post(`/forum-post/${id}/like`, { userId: user?.id });
            const result = response.data?.body || response.data;
            const isAdded = result.action === 'added';
            
            setPost(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    isLiked: isAdded,
                    _count: {
                        ...prev._count,
                        likes: isAdded ? prev._count.likes + 1 : prev._count.likes - 1
                    }
                };
            });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return router.push('/login');
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await apiClient.post('/forum-post/comment', {
                content: newComment,
                postId: id,
                userId: user?.id
            });
            setNewComment('');
            // Refresh post
            const response = await apiClient.get(`/forum-post/${id}`, { params: { userId: user?.id } });
            setPost(response.data?.body || response.data);
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    if (!post) return <div className="min-h-screen flex items-center justify-center">No se encontró el tema.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-24">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver a la comunidad
                </button>

                <article className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200 mb-10">
                    <header className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <Link href={`/comunidad?category=${post.category?.name}`} className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                {post.category?.name || 'General'}
                            </Link>
                            <div className="text-sm font-bold text-slate-400">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <Typography variant="H1" className="!text-3xl md:!text-4xl text-slate-900 font-black mb-6 leading-tight">
                            {post.title}
                        </Typography>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg">
                                {post.user.firstName.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{post.user.firstName} {post.user.lastName}</div>
                                <div className="text-xs font-medium text-slate-400">Autor de la publicación</div>
                            </div>
                        </div>
                    </header>

                    <div className="text-slate-600 leading-relaxed mb-10 whitespace-pre-wrap">
                        {post.content}
                    </div>

                    {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {post.images.map((img, idx) => (
                                <div key={idx} className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative">
                                    <img src={img} alt={`imagen-${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-8">
                            <button 
                                onClick={handleLike}
                                className={`flex items-center gap-2 transition-colors group ${post.isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
                            >
                                <Heart size={22} className={`group-active:scale-125 transition-transform ${post.isLiked ? 'fill-current' : ''}`} />
                                <span className="font-bold">{post._count.likes} Likes</span>
                            </button>
                            <div className="flex items-center gap-2 text-slate-500 font-bold">
                                <MessageSquare size={22} />
                                <span>{post._count.comments} Comentarios</span>
                            </div>
                        </div>
                    </div>
                </article>

                {/* --- Comments Section --- */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <Typography variant="H3" className="!text-2xl font-black text-slate-900">
                            Comentarios
                        </Typography>
                    </div>

                    {isAuthenticated ? (
                        <form onSubmit={handleSubmitComment} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-4">
                            <textarea 
                                placeholder="Escribe tu respuesta aquí..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all min-h-[120px] resize-none"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-emerald-100 flex items-center gap-2"
                                >
                                    <Send size={18} />
                                    {isSubmitting ? 'Enviando...' : 'Publicar Comentario'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-emerald-600 rounded-[30px] p-10 text-white text-center shadow-xl shadow-emerald-100">
                            <Typography variant="H3" className="text-white mb-4 font-black">
                                Únete a la discusión
                            </Typography>
                            <p className="opacity-90 mb-8 font-medium max-w-md mx-auto">
                                Debes tener una cuenta para poder comentar y ayudar a otros miembros de la comunidad.
                            </p>
                            <Link href="/login">
                                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl px-10 h-14 font-black shadow-xl">
                                    Iniciar Sesión Ahora
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="space-y-6">
                        {post.comments.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 font-medium italic">
                                Aún no hay comentarios. ¡Sé el primero en responder!
                            </div>
                        ) : (
                            post.comments.map((comment) => (
                                <div key={comment.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                            {comment.user.firstName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{comment.user.firstName} {comment.user.lastName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hace {new Date(comment.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button className="text-slate-400 hover:text-emerald-600 flex items-center gap-2 text-xs font-bold transition-all">
                                            <ThumbsUp size={14} />
                                            Útil
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
