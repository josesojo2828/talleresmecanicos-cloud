'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { 
    Command,
    ArrowUpRight
} from 'lucide-react';
import { useChat, ChatMessage } from '@/hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { useAlertStore } from '@/store/useAlertStore';
import { cn } from '@/utils/cn';
import Link from 'next/link';

// --- CSS Animations for Industrial Movement ---
const style = `
@keyframes industrialFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes industrialSlideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
}
@keyframes industrialSlideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}
.animate-industrial {
    animation: industrialFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-slide-me {
    animation: industrialSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-slide-node {
    animation: industrialSlideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;

// --- Components ---

const DataBlock = ({ msg, isMe, index }: { msg: ChatMessage, isMe: boolean, index: number }) => {
    const timestamp = useMemo(() => {
        const d = new Date(msg.createdAt);
        return d.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, [msg.createdAt]);

    return (
        <div 
            className={cn(
                "flex flex-col mb-10 w-full max-w-2xl opacity-0", 
                isMe ? "ml-auto items-end animate-slide-me" : "mr-auto items-start animate-slide-node"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Header Metadata */}
            <div className={cn("flex items-center gap-4 mb-3", isMe ? "flex-row-reverse" : "flex-row")}>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className={cn("text-[9px] font-black uppercase tracking-tighter", isMe ? "text-slate-950" : "text-emerald-500")}>
                            {isMe ? "SRC::SELF_NODE" : `SRC::${msg.user.firstName.toUpperCase()}`}
                        </span>
                        <div className={cn("w-2 h-2 rotate-45", isMe ? "bg-slate-950" : "bg-emerald-500")} />
                    </div>
                    <span className="text-[8px] font-mono font-bold text-slate-400 mt-0.5">
                        TIMESTAMP // {timestamp}
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={cn(
                "relative p-6 border transition-all duration-500 w-full group",
                isMe 
                    ? "bg-slate-950 border-slate-950 text-white" 
                    : "bg-white border-slate-200 text-slate-950"
            )}>
                {/* Decorative Grid on Card */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '10px 10px' }} />
                
                {/* Corner Accents */}
                <div className={cn("absolute -top-px -left-px w-2 h-2 border-t border-l", isMe ? "border-emerald-500" : "border-slate-950")} />
                <div className={cn("absolute -bottom-px -right-px w-2 h-2 border-b border-r", isMe ? "border-emerald-500" : "border-slate-950")} />

                <p className="text-sm font-semibold leading-relaxed relative z-10 antialiased">
                    {msg.content}
                </p>

                {/* Footer Data */}
                <div className="mt-6 flex items-center justify-between opacity-40">
                    <div className="flex items-center gap-4">
                        <span className="text-[7px] font-mono tracking-widest uppercase">{isMe ? "ENCRYPTED_OUT" : "ENCRYPTED_IN"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-[3px] h-[3px] bg-current rounded-full" />
                        <div className="w-[3px] h-[3px] bg-current rounded-full" />
                        <div className="w-[3px] h-[3px] bg-current rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ChatPage() {
    const { user, isAuthenticated, _hasHydrated } = useAuthStore();
    const { messages, sendMessage, isConnected } = useChat();
    const { addAlert } = useAlertStore();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text) return;
        
        if (!isConnected) {
            addAlert("error.default", 'error');
            return;
        }

        sendMessage(text);
        setInput("");
    };

    if (!_hasHydrated) return null;

    if (!isAuthenticated || !user) {
        return (
            <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
                <style dangerouslySetInnerHTML={{ __html: style }} />
                <Header />
                <main className="flex-1 flex items-center justify-center p-6 relative">
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-[0.03]"
                         style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                    
                    <div className="max-w-xl w-full border-2 border-slate-950 p-20 bg-white relative z-10 animate-industrial">
                        {/* Brackets */}
                        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-slate-950" />
                        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-slate-950" />
                        
                        <div className="space-y-12">
                            <div className="inline-flex py-2 px-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[.4em] italic leading-none">
                                SEC_FAILURE // UNKNOWN_ORIGIN
                            </div>
                            
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-[0.85]">
                                    ACCESO <br /> <span className="text-emerald-500 not-italic">RESTRINGIDO.</span>
                                </h1>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[.25em] leading-relaxed max-w-sm">
                                    EL PROTOCOLO DE TRANSMISIÓN REQUIERE AUTENTICACIÓN. POR FAVOR VALIDAR CREDENCIALES.
                                </p>
                            </div>

                            <Link href="/login" className="block">
                                <button className="w-full bg-slate-950 text-white h-20 text-[11px] font-black uppercase tracking-[.4em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 group">
                                    INICIALIZAR LOGIN <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-white">
            <style dangerouslySetInnerHTML={{ __html: style }} />
            <Header />
            
            <main className="flex-1 flex flex-col pt-32 h-full overflow-hidden">
                <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
                    
                    {/* Area de Mensajes */}
                    <div className="flex-1 overflow-y-auto p-10 md:p-16 space-y-4 scrollbar-hide relative">
                        {/* CRT Grain Overlay Effect */}
                        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-multiply z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8 animate-industrial">
                                <div className="space-y-2">
                                    <h3 className="text-5xl font-black text-slate-950 uppercase italic tracking-tighter">SIN MENSAJES</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto">ESPERANDO TRANSMISIÓN DE DATOS...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto w-full">
                                <div className="flex items-center gap-6 mb-20 relative px-4">
                                    <div className="h-px flex-1 bg-slate-100" />
                                    <div className="text-[10px] font-black text-slate-950 uppercase tracking-[0.5em] italic bg-white px-6">
                                        CHAT_GENERAL // {new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()}
                                    </div>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>
                                
                                {messages.map((msg, i) => (
                                    <DataBlock 
                                        key={msg.id || i}
                                        msg={msg}
                                        isMe={msg.userId === user?.id}
                                        index={i}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-10 bg-white border-t border-slate-950/10">
                        <form onSubmit={handleSend} className="max-w-4xl mx-auto w-full">
                            <div className="relative flex flex-col md:flex-row gap-4 p-2 bg-slate-100 border border-slate-200 animate-industrial">
                                <div className="absolute -top-3 left-4 px-3 bg-white text-[9px] font-black text-slate-950 uppercase tracking-widest italic border border-slate-950">
                                    TRANSMISIÓN
                                </div>
                                
                                <div className="flex-1 relative">
                                    <input 
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="ESCRIBE UN MENSAJE..."
                                        className="w-full bg-transparent p-6 text-xs font-mono font-black uppercase tracking-widest outline-none placeholder:text-slate-300"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className={cn(
                                        "px-10 h-16 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4",
                                        input.trim() 
                                            ? "bg-slate-950 text-white hover:bg-emerald-600" 
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    ENVIAR <Command size={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
