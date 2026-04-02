"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Heart, ArrowRight, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

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
    _count: {
        likes: number;
        comments: number;
    };
}

export const CommunityHighlights = () => {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopPosts = async () => {
            try {
                // Fetching recommended/top posts
                const response = await apiClient.get('/forum-post/recommended', {
                    params: { take: 3 }
                });
                const result = response.data?.body || response.data;
                setPosts(result?.data || result || []);
            } catch (error) {
                console.error('Error fetching top posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopPosts();
    }, []);

    // removed early return to allow showing the section even if empty

    const t = useTranslations();

    return (
        <section className="py-32 bg-slate-900 relative z-10 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto px-6 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-[2px] bg-emerald-500"></div>
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">COMUNIDAD // OPEN_SOURCE</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] italic">
                            Foro de <br />
                            <span className="text-transparent border-text">Expertos</span>
                        </h2>
                    </div>

                    <Link href="/comunidad" className="group flex items-center gap-4 bg-white/5 hover:bg-white text-white hover:text-slate-950 px-10 py-6 rounded-2xl border border-white/10 hover:border-white transition-all duration-500 h-fit">
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('action.view').toUpperCase()} TODOS</span>
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white border border-slate-100 h-80 animate-pulse" />
                        ))
                    ) : (
                        posts.length > 0 ? (
                            posts.slice(0, 3).map((post) => (
                                <Link href={`/comunidad/${post.id}`} key={post.id} className="block group">
                                    <article className="h-full bg-white border border-white/10 p-10 hover:border-emerald-500 transition-all duration-500 relative flex flex-col justify-between group">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                    {post.categories?.[0]?.name || t('community.technicalQuery')}
                                                </span>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Clock size={12} />
                                                    <span className="text-[9px] font-black">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-[1.1] italic">
                                                {post.title}
                                            </h3>

                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                                                {post.content}
                                            </p>
                                        </div>

                                        <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <MessageSquare size={14} />
                                                    <span className="text-[10px] font-black">{post._count.comments}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Heart size={14} />
                                                    <span className="text-[10px] font-black">{post._count.likes}</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="text-emerald-500 group-hover:translate-x-1 transition-transform" size={16} />
                                        </div>
                                    </article>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                                <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">{t('community.emptyState')}</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};
