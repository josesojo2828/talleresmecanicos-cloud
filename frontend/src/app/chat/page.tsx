'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/organisms/Header';
import Link from 'next/link';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { 
    Send, 
    MessageSquare, 
    Users, 
    Search,
    MoreVertical,
    Smile,
    Paperclip,
    Hash
} from 'lucide-react';
import { useChat, ChatMessage } from '@/hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/molecules/GlassCard';
import { cn } from '@/utils/cn';

const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble = ({ msg, isMe }: { msg: ChatMessage, isMe: boolean }) => {
    const avatarUrl = msg.user.profile?.avatarUrl;
    const name = `${msg.user.firstName} ${msg.user.lastName}`;

    return (
        <div className={cn("flex gap-4 mb-6", isMe ? "flex-row-reverse" : "flex-row")}>
            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
                <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border-2 border-white",
                    isMe ? "bg-slate-900" : "bg-emerald-600"
                )}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-sm">{msg.user.firstName[0]}</span>
                    )}
                </div>
            </div>

            <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        {isMe ? "Tú" : name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                        {formatTime(msg.createdAt)}
                    </span>
                    {!isMe && (
                         <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-100">
                            {msg.user.role}
                        </span>
                    )}
                </div>
                
                <div className={cn(
                    "px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm border transition-all",
                    isMe 
                        ? "bg-slate-900 text-white border-slate-800 rounded-tr-none shadow-slate-200" 
                        : "bg-white text-slate-800 border-slate-100 rounded-tl-none"
                )}>
                    {msg.content}
                </div>
            </div>
        </div>
    );
};

export default function ChatPage() {
    const { user, isAuthenticated, _hasHydrated } = useAuthStore();
    const { messages, sendMessage, isConnected } = useChat();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || !isConnected) return;
        sendMessage(text);
        setInput("");
    };

    if (!_hasHydrated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <GlassCard className="max-w-md w-full text-center p-12 border-none shadow-2xl !rounded-[3rem]">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Users size={40} />
                        </div>
                        <Typography variant="H3" className="text-slate-900 mb-4 font-black">Acceso Restringido</Typography>
                        <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed">
                            Debes iniciar sesión para unirte al chat de la comunidad y conectar con otros mecánicos y entusiastas.
                        </p>
                        <Link href="/login" className="w-full">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-bold text-base shadow-xl shadow-emerald-100">
                                Iniciar Sesión
                            </Button>
                        </Link>
                    </GlassCard>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            <Header />
            
            <main className="flex-1 flex flex-col pt-24 pb-4 px-4 max-w-7xl mx-auto w-full gap-4 overflow-hidden">
                
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <Typography variant="H3" className="!text-xl font-black text-slate-900 uppercase tracking-tight leading-none">
                                Chat <span className="text-emerald-600">General</span>
                            </Typography>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className={cn("w-2 h-2 rounded-full animate-pulse", isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500")} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {isConnected ? "En Vivo · Conectado" : "Desconectado · Intentando reconectar"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-1.5 opacity-40">
                            <Users size={14} className="text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chat Abierto</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    {/* Área Principal de Chat */}
                    <section className="h-full flex flex-col bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative">
                        {/* Background Decor */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-600 rounded-full blur-[100px]" />
                            <div className="absolute bottom-20 right-10 w-64 h-64 bg-slate-900 rounded-full blur-[100px]" />
                        </div>

                        {/* Mensajes */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide relative z-10">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                                        <MessageSquare size={48} />
                                    </div>
                                    <Typography variant="H3" className="text-slate-900 mb-2 font-black uppercase tracking-tight">El chat está vacío</Typography>
                                    <p className="text-slate-400 text-sm font-medium italic">¡Sé el primero en saludar a la comunidad!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center mb-10">
                                        <div className="bg-slate-50 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                                            Hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </div>
                                    </div>
                                    {messages.map((msg, i) => (
                                        <MessageBubble 
                                            key={msg.id || i}
                                            msg={msg}
                                            isMe={msg.userId === user?.id}
                                        />
                                    ))}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Entrada de Texto */}
                        <div className="p-4 md:p-6 bg-white border-t border-slate-50 relative z-10">
                            <form onSubmit={handleSend} className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 bg-slate-50 rounded-[2rem] p-2 pr-3 border border-slate-100 transition-all focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:border-emerald-500/20">
                                    <Button variant="GHOST" type="button" className="!p-2.5 text-slate-400 hover:text-emerald-600 rounded-full hover:bg-white">
                                        <Paperclip size={20} />
                                    </Button>
                                    <Input 
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Envía un mensaje a la comunidad..."
                                        className="!bg-transparent !border-none !ring-0 !text-sm flex-1 !h-10 font-medium"
                                        disabled={!isConnected}
                                    />
                                    <Button variant="GHOST" type="button" className="!p-2.5 text-slate-400 hover:text-emerald-600 rounded-full hover:bg-white hidden sm:flex">
                                        <Smile size={20} />
                                    </Button>
                                    <Button 
                                        type="submit"
                                        disabled={!input.trim() || !isConnected}
                                        className={cn(
                                            "rounded-2xl h-11 px-5 font-black text-xs uppercase tracking-widest transition-all",
                                            input.trim() && isConnected 
                                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                        )}
                                    >
                                        <span className="hidden sm:inline mr-2">Enviar</span>
                                        <Send size={16} />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between px-4">
                                    <div className="flex items-center gap-4">
                                        <button type="button" className="text-[10px] font-black text-slate-400 uppercase hover:text-emerald-600 transition-colors">Markdown soportado</button>
                                        <button type="button" className="text-[10px] font-black text-slate-400 uppercase hover:text-emerald-600 transition-colors">Ayuda</button>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter italic">
                                        Powered by Red TalleresMecánicos
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
