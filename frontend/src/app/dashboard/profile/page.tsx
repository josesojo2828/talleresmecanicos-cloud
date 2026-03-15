"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useFicha } from '@/features/dashboard/hooks/useFicha';
import { FichaLayout } from '@/features/dashboard/components/FichaLayout';
import { InternalRecords } from '@/features/dashboard/components/InternalRecords';
import { FormGenerator } from '@/features/dashboard/components/FormGenerator';
import { 
    User as UserIcon, Heart, MessageSquare, 
    Settings, Shield, Key, Heart as HeartFull,
    Activity
} from 'lucide-react';
import { UserUpdateForm } from '@/types/form/user.form';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('data');
    
    // We use the same useFicha hook but with the current user ID
    const { data, loading, updateRecord } = useFicha('user', user?.id || '');

    const tabs = [
        { id: 'data', label: 'Mis Datos', icon: <UserIcon size={16} /> },
        { id: 'likes', label: 'Mis Likes', icon: <Heart size={16} /> },
        { id: 'comments', label: 'Mis Comentarios', icon: <MessageSquare size={16} /> },
        { id: 'account', label: 'Cuenta y Seguridad', icon: <Shield size={16} /> },
    ];

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Cargando tu perfil...</p>
            </div>
        );
    }

    return (
        <FichaLayout
            title={`${data?.firstName} ${data?.lastName}`}
            subtitle="Perfil de Usuario Sesionado"
            icon={<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl font-black">{data?.firstName?.charAt(0)}</div>}
            createdAt={data?.createdAt}
            updatedAt={data?.updatedAt}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
        >
            {activeTab === 'data' && (
                <div className="max-w-4xl mx-auto bg-white/50 p-10 rounded-[2.5rem] border border-white shadow-xl animate-in fade-in slide-in-from-bottom-4">
                    <FormGenerator 
                        structure={{
                            ...UserUpdateForm,
                            fields: UserUpdateForm.fields.filter(f => !['status', 'kycLevel', 'twoFactorEnabled'].includes(f.name))
                        }}
                        defaultValues={data}
                        isUpdate={true}
                        onSubmit={updateRecord}
                        onCancel={() => {}}
                    />
                </div>
            )}

            {activeTab === 'likes' && (
                <div className="animate-in fade-in slide-in-from-left-4">
                    <InternalRecords 
                        title="Publicaciones que me gustan" 
                        records={(data?.forumLikes || []).map((l: any) => ({
                            id: l.forumPost?.id,
                            title: l.forumPost?.title || "Publicación",
                            subtitle: "Likeado el " + new Date(l.createdAt).toLocaleDateString(),
                            slug: 'forum-post'
                        }))}
                        icon={<HeartFull size={16} fill="currentColor" />}
                    />
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="animate-in fade-in slide-in-from-right-4">
                    <InternalRecords 
                        title="Mis Comentarios" 
                        records={(data?.forumComments || []).map((c: any) => ({
                            id: c.forumPost?.id || c.id,
                            title: c.content?.substring(0, 60),
                            subtitle: "Publicación: " + (c.forumPost?.title || 'General'),
                            slug: 'forum-post'
                        }))}
                        icon={<MessageSquare size={16} />}
                    />
                </div>
            )}

            {activeTab === 'account' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                <Key size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">Cambiar Contraseña</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protege tu acceso</p>
                            </div>
                        </div>
                        <FormGenerator 
                            structure={{
                                slug: 'change-password',
                                fields: [
                                    { name: 'currentPassword', label: 'Contraseña Actual', type: 'password', validation: { required: true } },
                                    { name: 'newPassword', label: 'Nueva Contraseña', type: 'password', validation: { required: true, minLength: 8 } },
                                    { name: 'confirmPassword', label: 'Confirmar Nueva Contraseña', type: 'password', validation: { required: true } },
                                ]
                            }}
                            onSubmit={async (vals) => {
                                // Logic for change password
                                console.log("Changing password", vals);
                            }}
                            onCancel={() => {}}
                        />
                    </div>
                </div>
            )}
        </FichaLayout>
    );
}
