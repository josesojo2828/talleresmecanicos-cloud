"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Heart, ArrowRight, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";

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

    if (!loading && posts.length === 0) return null;

    return (
        <section className="py-32 bg-slate-900 relative z-10 overflow-hidden">
            {/* Structural Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl space-y-6">
                        <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">
                            TENDENCIAS EN <br /> <span className="text-emerald-500 not-italic">LA COMUNIDAD.</span>
                        </h2>
                    </div>

                    <Link href="/comunidad" className="group">
                        <button className="px-10 py-5 border border-white/20 bg-transparent text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all flex items-center gap-4">
                            VER TODOS LOS TEMAS <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-white/5 border border-white/10 h-80 animate-pulse" />
                        ))
                    ) : (
                        posts.slice(0, 3).map((post) => (
                            <Link href={`/comunidad/${post.id}`} key={post.id} className="block group">
                                <article className="h-full bg-white/5 border border-white/10 p-10 hover:border-emerald-500 hover:bg-white transition-all duration-500 relative flex flex-col justify-between group">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest group-hover:text-emerald-600">
                                                {post.categories?.[0]?.name || "CONSULTA TÉCNICA"}
                                            </span>
                                            <div className="flex items-center gap-2 text-white/30 group-hover:text-slate-400">
                                                <Clock size={12} />
                                                <span className="text-[9px] font-black">{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-white group-hover:text-slate-950 uppercase tracking-tighter leading-[1.1] italic">
                                            {post.title}
                                        </h3>
                                        
                                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-600 font-medium">
                                            {post.content}
                                        </p>
                                    </div>

                                    <div className="pt-8 mt-8 border-t border-white/10 group-hover:border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-white/40 group-hover:text-slate-400">
                                                <MessageSquare size={14} />
                                                <span className="text-[10px] font-black">{post._count.comments}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white/40 group-hover:text-slate-400">
                                                <Heart size={14} />
                                                <span className="text-[10px] font-black">{post._count.likes}</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="text-emerald-500 group-hover:translate-x-1 transition-transform" size={16} />
                                    </div>
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
