'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/organisms/Header';
import Link from 'next/link';
import { Footer } from '@/components/organisms/Footer';
import { 
    Send, 
    MessageSquare, 
    Users, 
    Search,
    MoreVertical,
    Terminal,
    ChevronRight,
    Lock,
    Clock,
    Activity,
    Shield
} from 'lucide-react';
import { useChat, ChatMessage } from '@/hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/cn';

const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const MessageBubble = ({ msg, isMe }: { msg: ChatMessage, isMe: boolean }) => {
    const name = `${msg.user.firstName} ${msg.user.lastName}`;

    return (
        <div className={cn("flex flex-col mb-8", isMe ? "items-end" : "items-start")}>
            <div className={cn("flex items-center gap-3 mb-2 px-1", isMe ? "flex-row-reverse" : "flex-row")}>
                <div className="flex flex-col">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest leading-none",
                        isMe ? "text-slate-950 text-right" : "text-emerald-600"
                    )}>
                        {isMe ? "OPERATOR.ID" : name.toUpperCase()}
                    </span>
                    <span className={cn("text-[8px] font-bold text-slate-400 font-mono tracking-tight", isMe ? "text-right" : "")}>
                        {formatTime(msg.createdAt)} // TX_RELAY_{msg.id?.slice(0, 4) || 'NULL'}
                    </span>
                </div>
                {!isMe && (
                    <div className="w-8 h-8 bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase italic">
                        {msg.user.firstName[0]}
                    </div>
                )}
            </div>
            
            <div className={cn(
                "p-6 text-sm leading-relaxed border transition-all relative max-w-[85%]",
                isMe 
                    ? "bg-slate-950 text-white border-slate-950" 
                    : "bg-white text-slate-900 border-slate-200"
            )}>
                {/* Visual Accent */}
                <div className={cn(
                    "absolute top-0 w-8 h-[2px]",
                    isMe ? "right-0 bg-emerald-500" : "left-0 bg-emerald-500"
                )} />
                
                <p className={cn(isMe ? "font-medium" : "font-semibold")}>
                    {msg.content}
                </p>

                {/* Sub-label */}
                <div className={cn(
                    "mt-4 pt-4 border-t border-dashed text-[8px] font-black uppercase tracking-[0.2em] opacity-40",
                    isMe ? "border-white/10 text-white" : "border-slate-200 text-slate-400"
                )}>
                    {isMe ? "TRANSMISSION_SECURE" : `ROLE :: ${msg.user.role || 'GUEST'}`}
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

    if (!_hasHydrated) return (
        <div className="h-screen bg-white flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border border-slate-200 flex items-center justify-center">
                    <Activity className="text-emerald-500 animate-pulse" size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-950 uppercase tracking-[0.5em] italic">BOOT_SEQUENCE_INITIALIZING</span>
            </div>
        </div>
    );

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6 bg-white relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                         style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                    
                    <div className="max-w-2xl w-full border border-slate-950 p-16 md:p-24 bg-white relative z-10 space-y-12">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-slate-950 flex items-center justify-center text-white">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
                                ACCESO <br /> <span className="text-emerald-600 not-italic">RESTRINGIDO.</span>
                            </h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                                SE REQUIERE AUTENTICACIÓN NIVEL_01 PARA ACCEDER AL PROTOCOLO DE COMUNICACIÓN EN VIVO.
                            </p>
                        </div>

                        <Link href="/login" className="block">
                            <button className="w-full bg-slate-950 text-white px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-4">
                                VALIDAR CREDENCIALES <ChevronRight size={16} />
                            </button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            <Header />
            
            <main className="flex-1 flex flex-col pt-32 h-full overflow-hidden">
                
                {/* Structural Grid Interface */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-[350px,1fr] border-y border-slate-950">
                    
                    {/* Left Panel: Status & Logs */}
                    <aside className="hidden lg:flex flex-col border-r border-slate-950 bg-slate-50 overflow-hidden">
                        <div className="p-10 border-b border-slate-200 space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
                                    ESTADO DEL <br /> <span className="text-emerald-600 not-italic">SISTEMA.</span>
                                </h3>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className={cn("w-2 h-2", isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">
                                        {isConnected ? "NETWORK_VERIFIED" : "LINK_FAILURE"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>USUARIO_ACTUAL</span>
                                    <span className="text-slate-950 italic">{user.firstName}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>NIVEL_ACCESO</span>
                                    <span className="text-emerald-600 italic">SECURE_LEVEL_1</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-10 font-mono text-[10px] text-slate-400 space-y-4 overflow-y-auto">
                            <p className="flex gap-4">
                                <span className="text-emerald-500">[SYS]</span>
                                <span>INITIALIZING_CHAT_RELAY_v4.2</span>
                            </p>
                            <p className="flex gap-4">
                                <span className="text-emerald-500">[LOG]</span>
                                <span>WS_AUTH_TOKEN_VALIDATED</span>
                            </p>
                            <p className="flex gap-4 leading-relaxed italic">
                                > Esta es una zona de comunicación técnica verificada. 
                                Respete los protocolos de interoperabilidad mecánica.
                            </p>
                            {messages.slice(-5).map((m, i) => (
                                <p key={i} className="flex gap-4 opacity-50">
                                    <span className="text-slate-300">[{formatTime(m.createdAt)}]</span>
                                    <span>NEW_MSG_FROM_{m.user.firstName.toUpperCase()}</span>
                                </p>
                            ))}
                        </div>
                    </aside>

                    {/* Right Panel: Chat Terminal */}
                    <section className="flex flex-col bg-white overflow-hidden relative">
                        {/* Area de Mensajes */}
                        <div className="flex-1 overflow-y-auto p-10 md:p-16 scrollbar-hide">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8">
                                    <div className="w-20 h-20 border-2 border-slate-100 flex items-center justify-center text-slate-100">
                                        <Terminal size={40} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter">BUZÓN_VACÍO</h3>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">ESPERANDO INICIO DE TRANSMISIÓN DE DATOS EN LA RED.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-4xl mx-auto w-full">
                                    <div className="flex justify-center mb-20 relative before:w-full before:h-px before:bg-slate-100 before:absolute before:top-1/2 before:z-0">
                                        <div className="bg-white px-8 py-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.4em] italic border border-slate-950 relative z-10">
                                            INDEXING_DATE :: {new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()}
                                        </div>
                                    </div>
                                    {messages.map((msg, i) => (
                                        <MessageBubble 
                                            key={msg.id || i}
                                            msg={msg}
                                            isMe={msg.userId === user?.id}
                                        />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area: Console Style */}
                        <div className="p-10 border-t border-slate-950 bg-slate-50 relative z-20">
                            <form onSubmit={handleSend} className="max-w-4xl mx-auto w-full">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-mono text-sm font-black italic select-none">
                                            {">_"}
                                        </div>
                                        <input 
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="REDACTAR TRANSMISIÓN..."
                                            className="w-full bg-white border border-slate-950 pl-16 pr-6 py-6 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300"
                                            disabled={!isConnected}
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!input.trim() || !isConnected}
                                        className={cn(
                                            "px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4",
                                            input.trim() && isConnected 
                                                ? "bg-slate-950 text-white hover:bg-emerald-600" 
                                                : "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
                                        )}
                                    >
                                        ENVIAR.CMD <Send size={14} />
                                    </button>
                                </div>
                                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <Shield size={10} className="text-emerald-500" /> ENCRYPTED_CHANNEL
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <Activity size={10} className="text-emerald-500" /> LATENCY: 2.4MS
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter italic">
                                        PROTOCOL_TM_v4.2 // RED_TALLERES_MECANICOS
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
