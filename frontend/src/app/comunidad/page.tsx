'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import {
    Search,
    Home,
    LayoutDashboard,
    LogIn,
    Clock,
    TrendingUp,
    Plus,
    MessageSquare,
    Heart,
    Bookmark,
    ArrowRight,
    Map,
    Calendar,
    ChevronRight,
    Filter
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/utils/api/api.client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { CreatePostModal } from '@/features/community/components/CreatePostModal';
import { useAlertStore } from '@/store/useAlertStore';
import { PostSkeleton } from '@/components/atoms/Skeleton';

interface ForumPost {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
    categories?: {
        id: string;
        name: string;
    }[];
    isLiked?: boolean;
    _count: {
        likes: number;
        comments: number;
        favorites: number;
    };
}

interface ForumStats {
    posts?: number;
    approved?: number;
    favorites?: number;
    totalPosts?: number;
    totalComments?: number;
    totalLikes?: number;
}

export default function ComunidadPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [stats, setStats] = useState<ForumStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'date' | 'top'>('date');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const { addAlert } = useAlertStore();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = '/forum-post';
            const params: any = {
                take: 20,
                skip: 0,
                filters: JSON.stringify({
                    enabled: true,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    categoryIds: selectedCategory || undefined
                }),
                search: searchTerm || undefined,
                userId: user?.id
            };

            if (filter === 'top') {
                url = '/forum-post/recommended';
                params.take = 10;
            } else {
                params.orderBy = JSON.stringify([{ createdAt: 'desc' }]);
            }

            const response = await apiClient.get(url, { params });
            const result = response.data?.body || response.data;
            setPosts(result?.data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchPosts, 300);
        return () => clearTimeout(timeoutId);
    }, [filter, searchTerm, user?.id, startDate, endDate, selectedCategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/workshop-category', {
                    params: { filters: JSON.stringify({ enabled: true }) }
                });
                const result = response.data?.body || response.data;
                setCategories(result?.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const params = isAuthenticated ? { userId: user?.id } : {};
                const response = await apiClient.get('/forum-post/stats', { params });
                setStats(response.data?.body || response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, [isAuthenticated, user?.id]);

    const handleLike = async (postId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated || !user) return router.push('/login');

        try {
            const response = await apiClient.post(`/forum-post/${postId}/like`, { userId: user.id });
            const result = response.data?.body || response.data;
            const isAdded = result.action === 'added';

            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    return {
                        ...p,
                        isLiked: isAdded,
                        _count: {
                            ...p._count,
                            likes: isAdded ? p._count.likes + 1 : p._count.likes - 1
                        }
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error('Error in like:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32 transition-all duration-500">
            <Header />

            <div className="bg-slate-950 border-b border-emerald-500/20 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-4xl space-y-6">
                        <h1 className="text-white text-5xl md:text-9xl font-black italic tracking-tighter leading-[0.85] uppercase">
                            DIÁLOGOS <br />
                            <span className="text-emerald-500 not-italic">TÉCNICOS.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-12 border-l border-white/10 pl-12 h-fit mb-1">
                        <div>
                            <p className="text-white text-2xl font-black">{stats?.totalPosts || 0}</p>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">TEMAS_ACTIVOS</p>
                        </div>
                        <div>
                            <p className="text-white text-2xl font-black">{stats?.totalComments || 0}</p>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">RESPUESTAS</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">

                {/* --- Left Sidebar: Technical Navigation --- */}
                <aside className="space-y-12 lg:sticky lg:top-40 h-fit">

                    {/* Navigation */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] italic border-b border-slate-950 pb-2">ACCESO_RÁPIDO</h4>
                        <nav className="flex flex-col gap-1">
                            <Link href="/" className="group flex items-center justify-between py-3 text-slate-500 hover:text-emerald-600 transition-all font-bold text-xs uppercase tracking-widest border-b border-slate-100 italic">
                                INICIO <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                            <Link href="/directorio" className="group flex items-center justify-between py-3 text-slate-500 hover:text-emerald-600 transition-all font-bold text-xs uppercase tracking-widest border-b border-slate-100 italic">
                                DIRECTORIO <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                            {isAuthenticated && (
                                <Link href="/dashboard" className="group flex items-center justify-between py-3 text-slate-500 hover:text-emerald-600 transition-all font-bold text-xs uppercase tracking-widest border-b border-slate-100 italic">
                                    DASHBOARD <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Filters Module */}
                    <div className="space-y-8 bg-white border border-slate-200 p-8">
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest italic">PROTOCOLO_DE_BÚSQUEDA</h4>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="BUSCAR_TEMA..."
                                    className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-950 outline-none transition-all italic"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest italic">ORDEN_DE_DATOS</h4>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setFilter('date')}
                                    className={cn(
                                        "w-full text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all italic border-l-4",
                                        filter === 'date' ? "bg-slate-950 text-white border-emerald-500" : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
                                    )}
                                >
                                    MÁS_RECIENTES
                                </button>
                                <button
                                    onClick={() => setFilter('top')}
                                    className={cn(
                                        "w-full text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all italic border-l-4",
                                        filter === 'top' ? "bg-slate-950 text-white border-emerald-500" : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
                                    )}
                                >
                                    RECOMENDADOS
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest italic">ESPECIALIDAD</h4>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={cn(
                                        "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all border italic",
                                        selectedCategory === '' ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-950"
                                    )}
                                >
                                    TODAS
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={cn(
                                            "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all border italic",
                                            selectedCategory === cat.id ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-950"
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- Center: Main Feed --- */}
                <section className="space-y-8">
                    {loading ? (
                        <div className="space-y-8">
                            {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="py-32 border border-slate-200 bg-white flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 mb-8">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-950 uppercase tracking-widest mb-4 italic">SIN_REGISTROS_ACTIVOS</h3>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-10 italic">SÉ EL PRIMERO EN REGISTRAR UNA CONSULTA TÉCNICA.</p>
                            {isAuthenticated && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-10 py-5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all italic"
                                >
                                    PUBLICAR_AHORA
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {posts.map((post) => (
                                <Link href={`/comunidad/${post.id}`} key={post.id} className="block group">
                                    <article className="bg-white border border-slate-200 hover:border-slate-950 transition-all duration-300 p-10 flex flex-col gap-6 relative">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {post.categories?.map(cat => (
                                                        <span key={cat.id} className="text-emerald-600 text-[9px] font-black uppercase tracking-widest italic border-b border-emerald-500/20">
                                                            {cat.name}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic leading-none group-hover:text-emerald-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                            </div>
                                            <div className="hidden md:block text-right">
                                                <p className="text-slate-300 text-[9px] font-black uppercase tracking-widest">REG_ID: {post.id.slice(0, 8)}</p>
                                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest italic">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <p className="text-slate-500 text-sm leading-relaxed font-medium opacity-80 line-clamp-3">
                                            {post.content}
                                        </p>

                                        <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {post.user.firstName.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest italic">{post.user.firstName}</span>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <MessageSquare size={14} />
                                                        <span className="text-[10px] font-black tracking-widest">{post._count.comments}</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleLike(post.id, e)}
                                                        className={cn(
                                                            "flex items-center gap-2 transition-all",
                                                            post.isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                                                        )}
                                                    >
                                                        <Heart size={14} className={post.isLiked ? "fill-current" : ""} />
                                                        <span className="text-[10px] font-black tracking-widest">{post._count.likes}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-slate-950 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                                                ABRIR_HILO <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />

            {/* Technical FAB */}
            {isAuthenticated && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-10 right-10 w-20 h-20 bg-slate-950 text-white shadow-2xl flex items-center justify-center transition-all hover:bg-emerald-600 hover:scale-105 active:scale-95 group z-[60]"
                >
                    <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 animate-ping opacity-20" />
                </button>
            )}

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                onSuccess={() => {
                    addAlert("¡TEMA_REGISTRADO_CON_ÉXITO! ESPERANDO_AUDITORÍA.", "success");
                    fetchPosts();
                }}
            />
        </div>
    );
}