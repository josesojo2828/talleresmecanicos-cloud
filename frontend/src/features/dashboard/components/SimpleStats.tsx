"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Activity, ArrowUpRight, TrendingUp, Users, Wrench, MessageSquare, Heart } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatBoxProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color?: 'emerald' | 'blue' | 'purple' | 'rose' | 'amber';
    trend?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, icon, color = 'emerald', trend }) => {
    const colors = {
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-900/5',
        blue: 'text-blue-600 bg-blue-50 border-blue-100 shadow-blue-900/5',
        purple: 'text-purple-600 bg-purple-50 border-purple-100 shadow-purple-900/5',
        rose: 'text-rose-600 bg-rose-50 border-rose-100 shadow-rose-900/5',
        amber: 'text-amber-600 bg-amber-50 border-amber-100 shadow-amber-900/5',
    };

    return (
        <div className={cn("p-5 rounded-[2rem] border bg-white shadow-md transition-all hover:scale-[1.01] flex flex-col justify-between group", colors[color])}>
            <div className="flex justify-between items-start mb-4">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6", colors[color])}>
                    {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-[8px] uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ArrowUpRight size={8} /> {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-0.5 italic leading-none">{label}</p>
                <p className="text-2xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">
                    {value}
                </p>
            </div>
        </div>
    );
};

export const SimpleStats: React.FC<{ slug: string; data: any }> = ({ slug, data }) => {
    const t = useTranslations();
    // Generate mockup stats based on slug
    const getStats = () => {
        switch (slug) {
            case 'country':
                return [
                    { label: t('dashboard.detail.city'), value: data.cities?.length || 0, icon: <TrendingUp size={24} />, color: 'blue', trend: '+2' },
                    { label: t('dashboard.detail.workshop'), value: data.workshops?.length || 0, icon: <Wrench size={24} />, color: 'emerald', trend: '+12%' },
                    { label: t('dashboard.detail.user'), value: data.users?.length || 0, icon: <Users size={24} />, color: 'purple', trend: t('ficha.stats.new') },
                ];
            case 'forum-post':
                return [
                    { label: t('dashboard.detail.forum-comment'), value: data.forumComments?.length || 0, icon: <MessageSquare size={24} />, color: 'blue' },
                    { label: 'Likes', value: data.forumLikes?.length || 0, icon: <Heart size={24} />, color: 'rose' },
                ];
            default:
                return [
                    { label: t('ficha.stats.appearances'), value: '1.2k', icon: <TrendingUp size={24} />, color: 'emerald', trend: '+5%' },
                    { label: t('ficha.stats.views'), value: '4.8k', icon: <Activity size={24} />, color: 'blue', trend: '+10%' },
                    { label: t('ficha.stats.engagement'), value: '12%', icon: <Users size={24} />, color: 'purple' },
                ];
        }
    };

    const stats = getStats();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((s, idx) => (
                <StatBox key={idx} {...(s as any)} />
            ))}
        </div>
    );
};
