'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
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
    User,
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

// --- Types ---

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

// --- Page Component ---

export default function ComunidadPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [stats, setStats] = useState<ForumStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'date' | 'top'>('date');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
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

    // Fetch Posts based on filter
    useEffect(() => {
        const timeoutId = setTimeout(fetchPosts, 300); // debounce search
        return () => clearTimeout(timeoutId);
    }, [filter, searchTerm, user?.id, startDate, endDate, selectedCategory]);

    // Fetch Categories
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

    // Fetch Stats
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
        <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 md:gap-8">
                
                {/* --- Left Sidebar: Navigation & Filters --- */}
                <aside className="hidden lg:block space-y-6 lg:order-1 lg:sticky lg:top-32 h-fit overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
                    {/* ... (existing sidebar content) ... */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <Typography variant="H4" className="text-slate-900 mb-6 font-black text-lg">
                            Navegación
                        </Typography>
                        <nav className="space-y-2">
                            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold">
                                <Home size={20} />
                                Inicio
                            </Link>
                            <Link href="/directorio" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold">
                                <Map size={20} />
                                Directorio
                            </Link>
                            {isAuthenticated ? (
                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold">
                                    <LayoutDashboard size={20} />
                                    Panel de Control
                                </Link>
                            ) : (
                                <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold">
                                    <LogIn size={20} />
                                    Iniciar Sesión
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <Typography variant="H4" className="text-slate-900 mb-6 font-black text-lg">
                            Filtros
                        </Typography>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Buscar tema..."
                                    className="w-full bg-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setFilter('date')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${filter === 'date' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <Clock size={18} />
                                    Más Recientes
                                </button>
                                <button 
                                    onClick={() => setFilter('top')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${filter === 'top' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <TrendingUp size={18} />
                                    Recomendados
                                </button>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Typography variant="H4" className="text-slate-900 mb-4 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Calendar size={16} className="text-emerald-500" /> Rango de Fechas
                                </Typography>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Desde</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Hasta</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                    {(startDate || endDate) && (
                                        <button 
                                            onClick={() => { setStartDate(''); setEndDate(''); }}
                                            className="text-[10px] font-bold text-rose-500 uppercase hover:underline ml-2"
                                        >
                                            Limpiar fechas
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Typography variant="H4" className="text-slate-900 mb-4 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Filter size={16} className="text-emerald-500" /> Especialidad
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    <button 
                                        onClick={() => setSelectedCategory('')}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                                            selectedCategory === '' ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-slate-500 border-slate-100 hover:border-emerald-200"
                                        )}
                                    >
                                        Todas
                                    </button>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                                                selectedCategory === cat.id ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-slate-500 border-slate-100 hover:border-emerald-200"
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- Center: Main Feed --- */}
                <section className="space-y-6 lg:order-2 order-2">

                    <div className="flex items-center justify-between px-2">
                        <Typography variant="H3" className="!text-xl font-black text-slate-900 uppercase tracking-tight">
                            Comunidad <span className="text-emerald-600 underline">Mecánica</span>
                        </Typography>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {posts.length} Temas encontrados
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white rounded-[40px] p-16 text-center shadow-sm border border-slate-200">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Search size={40} className="text-slate-200" />
                            </div>
                            <Typography variant="H3" className="text-slate-900 mb-2 font-black">
                                No hay publicaciones aún
                            </Typography>
                            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-10 font-medium">
                                Parece que no hay temas que coincidan con tu búsqueda o filtros. ¡Sé el primero en iniciar un debate!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <Link href={`/comunidad/${post.id}`} key={post.id} className="block">
                                    <article className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-emerald-200 transition-all hover:translate-y-[-2px] group">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg">
                                                    {post.user.firstName.charAt(0)}
                                                </div>
                                                <div>
                                                    <Typography variant="H4" className="!text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                        {post.title}
                                                    </Typography>
                                                    <div className="text-xs font-medium text-slate-400">
                                                        Por {post.user.firstName} • Hace {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {post.categories?.map(cat => (
                                                    <span key={cat.id} className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-2 font-medium opacity-80">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                                                    <MessageSquare size={18} />
                                                    <span className="text-xs font-bold">{post._count.comments} Comentarios</span>
                                                </div>
                                                <button 
                                                    onClick={(e) => handleLike(post.id, e)}
                                                    className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                                                >
                                                    <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
                                                    <span className="text-xs font-bold">{post._count.likes}</span>
                                                </button>
                                            </div>
                                            <div className="text-emerald-600 font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                Leer más <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* --- Right Sidebar: Stats & Activity --- */}
                <aside className="hidden lg:block space-y-6 lg:order-3 lg:sticky lg:top-32 h-fit overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
                    {isAuthenticated ? (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center">
                            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center font-black text-emerald-600 text-3xl mb-4">
                                {user?.firstName?.charAt(0)}
                            </div>
                            <Typography variant="H4" className="text-slate-900 font-black text-xl mb-1">
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full mb-8">
                                Miembro de la Red
                            </span>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100">
                                    <div className="text-2xl font-black text-slate-900">{stats?.posts || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posts</div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100">
                                    <div className="text-2xl font-black text-slate-900">{stats?.approved || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aprobados</div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 text-left col-span-2 border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-black text-slate-900">{stats?.favorites || 0}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Favoritos</div>
                                    </div>
                                    <Bookmark className="text-slate-200" size={24} />
                                </div>
                            </div>

                            <Link href="/dashboard" className="w-full mt-8">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 font-bold text-sm shadow-lg shadow-slate-100">
                                    Ver Mi Actividad
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                            <Typography variant="H4" className="text-slate-900 mb-6 font-black text-lg">
                                Actividad Global
                            </Typography>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <ArrowRight size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900">{stats?.totalPosts || 0}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temas Activos</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <ArrowRight size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900">{stats?.totalComments || 0}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Respuestas</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                                        <ArrowRight size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-slate-900">{stats?.totalLikes || 0}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reacciones</div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="my-8 border-slate-100" />
                            
                            <Link href="/login">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 font-bold text-sm shadow-lg shadow-emerald-100">
                                    Unirse a la Comunidad
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <Typography variant="H4" className="text-white mb-4 font-black text-xl relative z-10">
                            ¿Necesitas un Taller?
                        </Typography>
                        <p className="text-slate-400 text-xs mb-8 font-medium leading-relaxed relative z-10 italic">
                            Encuentra los mecánicos más confiables de tu zona, verificados por la comunidad.
                        </p>
                        <Link href="/directorio" className="relative z-10">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-none rounded-2xl h-12 font-bold text-xs shadow-lg shadow-emerald-900/40">
                                Abrir Directorio
                            </Button>
                        </Link>
                    </div>
                </aside>

            </main>

            <Footer />

            {/* Botón flotante para crear post */}
            {isAuthenticated && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] shadow-2xl shadow-emerald-600/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group z-[60]"
                >
                    <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
            )}

            <CreatePostModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                onSuccess={() => {
                    addAlert("¡Post creado con éxito! Esperando aprobación del moderador.", "success");
                    fetchPosts();
                }}
            />
        </div>
    );
}