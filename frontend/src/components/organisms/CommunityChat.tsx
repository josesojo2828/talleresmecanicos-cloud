"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useChat, ChatMessage } from "@/hooks/useChat";
import { useAuthStore } from "@/store/useAuthStore";

const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble = ({ msg, isMe }: { msg: ChatMessage, isMe: boolean }) => {
    const avatarUrl = msg.user.profile?.avatarUrl;
    const name = `${msg.user.firstName} ${msg.user.lastName}`;

    return (
        <div className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            {!isMe && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center mt-1 overflow-hidden border border-slate-100 shadow-sm">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-bold text-slate-500">{msg.user.firstName[0]}</span>
                    )}
                </div>
            )}

            <div className={`max-w-[80%] space-y-1 ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                {!isMe && (
                    <span className="text-[9px] font-black text-slate-400 px-1 uppercase tracking-tighter italic">
                        {name} · {msg.user.role}
                    </span>
                )}
                <div className={`px-4 py-3 rounded-[1.25rem] text-sm leading-relaxed font-sans whitespace-pre-line border backdrop-blur-md transition-all
                    ${isMe
                        ? "bg-primary text-white border-primary/50 rounded-tr-sm shadow-[0_4px_12px_rgba(34,197,94,0.2)]"
                        : "bg-white text-slate-800 border-slate-100 rounded-tl-sm shadow-sm"
                    }`}
                >
                    {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 font-bold px-1 uppercase tracking-tighter italic">
                    {formatTime(msg.createdAt)}
                </span>
            </div>
        </div>
    );
};

export const CommunityChat = () => {
    const { user, isAuthenticated, _hasHydrated } = useAuthStore();
    const { messages, sendMessage, isConnected } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpen, messages]);

    const handleSend = () => {
        const text = input.trim();
        if (!text || !isConnected) return;
        sendMessage(text);
        setInput("");
    };

    if (!_hasHydrated || !isAuthenticated || !user) return null;

    return (
        <>
            {/* ── Chat Panel ─────────────────────────────────── */}
            <div
                className={`fixed bottom-28 right-4 sm:right-6 z-[60] w-[360px] sm:w-[400px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isOpen
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                    }`}
            >
                <GlassCard className="!p-0 border-none shadow-2xl overflow-hidden flex flex-col h-[520px] !rounded-[2.5rem] bg-white/90 backdrop-blur-xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 py-5 bg-primary text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none"></div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 relative z-10 border border-white/20 backdrop-blur-md">
                            <MessageSquare size={24} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0 relative z-10">
                            <Typography variant="H4" className="text-sm leading-none text-white font-black uppercase tracking-tight">Comunidad en Vivo</Typography>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)] ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                                    {isConnected ? 'Conectado' : 'Reconectando...'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors relative z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-40 text-center space-y-2">
                                <MessageSquare size={48} />
                                <span className="text-xs font-black uppercase tracking-widest italic">No hay mensajes aún.<br/>¡Sé el primero en saludar!</span>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                             <MessageBubble 
                                key={msg.id || i} 
                                msg={msg} 
                                isMe={msg.userId === user?.id} 
                             />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 border-t border-slate-100 bg-white">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-3 items-center"
                        >
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Escribe un mensaje a la comunidad..."
                                    disabled={!isConnected}
                                    className="!rounded-xl !bg-slate-50 !border-slate-100 !h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="PRIMARY"
                                size="LG"
                                disabled={!input.trim() || !isConnected}
                                className="!p-3 !rounded-xl shrink-0 h-11"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                        <div className="flex justify-center mt-3">
                             <Typography variant="P" className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
                                Chatea en tiempo real con otros usuarios
                            </Typography>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* ── Trigger Button ─────────────────── */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-8 right-5 sm:right-6 z-50 rounded-full group transition-all duration-300 active:scale-95"
            >
                <div className={`p-4 rounded-full shadow-2xl transition-all duration-500 border-2 border-white bg-white/90 backdrop-blur-md ${isOpen ? 'rotate-90 scale-110 border-primary/40' : 'hover:scale-110 shadow-primary/20 shadow-primary/20'}`}>
                    <div className="w-12 h-12 flex items-center justify-center relative">
                        {isOpen ? (
                            <X className="w-8 h-8 text-primary animate-fade-in" />
                        ) : (
                            <div className="relative">
                                <MessageSquare size={38} className="text-primary drop-shadow-sm" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 border-2 border-white rounded-full animate-bounce"></div>
                            </div>
                        )}
                    </div>
                </div>
            </button>
        </>
    );
};
