"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

// ── Robot chibi/cute ───────────────────────────────────────
const RobotAvatar = ({ size = 28, className = "" }: { size?: number; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 110"
        fill="none"
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
    >
        {/* Sombra */}
        <ellipse cx="50" cy="106" rx="20" ry="4" fill="rgba(0,0,0,0.18)" />

        {/* Cuerpo */}
        <ellipse cx="50" cy="84" rx="16" ry="14" fill="white" opacity="0.92" />
        {/* Orb pecho */}
        <circle cx="50" cy="84" r="6" fill="#22c55e" />
        <circle cx="50" cy="84" r="3.5" fill="white" opacity="0.7" />

        {/* Brazo izquierdo — abierto */}
        <ellipse cx="24" cy="76" rx="12" ry="6" fill="white" opacity="0.88" transform="rotate(-30 24 76)" />
        <ellipse cx="14" cy="68" rx="6.5" ry="5" fill="white" opacity="0.82" />

        {/* Brazo derecho — saluda */}
        <g style={{ transformOrigin: "76px 76px", animation: "robotWave 1.6s ease-in-out infinite" }}>
            <ellipse cx="76" cy="76" rx="12" ry="6" fill="white" opacity="0.88" transform="rotate(30 76 76)" />
            <ellipse cx="86" cy="68" rx="6.5" ry="5" fill="white" opacity="0.82" />
        </g>

        {/* Cuello */}
        <rect x="44" y="64" width="12" height="8" rx="3" fill="white" opacity="0.75" />

        {/* Cabeza — domo grande */}
        <ellipse cx="50" cy="40" rx="34" ry="36" fill="white" opacity="0.96" />
        {/* Brillo cabeza */}
        <ellipse cx="42" cy="24" rx="14" ry="9" fill="white" opacity="0.35" />

        {/* Orejas */}
        <ellipse cx="16" cy="42" rx="7" ry="9" fill="white" opacity="0.9" />
        <ellipse cx="16" cy="42" rx="3.5" ry="5.5" fill="#bfdbfe" opacity="0.7" />
        <ellipse cx="84" cy="42" rx="7" ry="9" fill="white" opacity="0.9" />
        <ellipse cx="84" cy="42" rx="3.5" ry="5.5" fill="#bfdbfe" opacity="0.7" />

        {/* Visor — oscuro */}
        <rect x="19" y="32" width="62" height="26" rx="13" fill="#1e1b4b" />
        {/* Reflejo visor */}
        <rect x="23" y="34" width="25" height="8" rx="4" fill="white" opacity="0.08" />

        {/* Ojo izquierdo — cerrado/feliz */}
        <path d="M27 47 Q33 41 39 47" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Ojo derecho — cerrado/feliz */}
        <path d="M61 47 Q67 41 73 47" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Boca — sonrisa + punto azul */}
        <path d="M42 55 Q50 61 58 55" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="50" cy="59" r="2.5" fill="#38bdf8" />

        <style>{`
            @keyframes robotWave {
                0%, 100% { transform: rotate(0deg); }
                35%       { transform: rotate(-26deg); }
                65%       { transform: rotate(10deg); }
            }
        `}</style>
    </svg>
);

interface Message {
    id: number;
    role: "user" | "ai";
    text: string;
    timestamp: Date;
}

const AI_GREETING: Message = {
    id: 0,
    role: "ai",
    text: "¡Hola! Soy el asistente virtual de **TalleresMecanicos** 🌎\n\nPuedo ayudarte a encontrar talleres, servicios y repuestos en toda Latinoamérica. ¿En qué te puedo ayudar hoy?",
    timestamp: new Date(),
};

const AI_RESPONSE =
    "Gracias por tu mensaje 😊 Actualmente estoy en modo de prueba y muy pronto podré responder todas tus preguntas sobre la comunidad. Mientras tanto, puedes explorar el directorio o contactarnos directamente.";

const formatTime = (d: Date) =>
    d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

const MessageBubble = ({ msg }: { msg: Message }) => {
    const isUser = msg.role === "user";
    const parts = msg.text.split(/\*\*(.*?)\*\*/g);

    return (
        <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            {!isUser && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary flex items-center justify-center mt-1 shadow-lg shadow-primary/20">
                    <RobotAvatar size={35} />
                </div>
            )}

            <div className={`max-w-[80%] space-y-1 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`px-4 py-3 rounded-[1.25rem] text-sm leading-relaxed font-sans whitespace-pre-line border backdrop-blur-md transition-all
                    ${isUser
                        ? "bg-primary text-white border-primary/50 rounded-tr-sm shadow-[0_4px_12px_rgba(34,197,94,0.2)]"
                        : "bg-white text-slate-800 border-slate-100 rounded-tl-sm shadow-sm"
                    }`}
                >
                    {parts.map((part, i) =>
                        i % 2 === 1
                            ? <strong key={i}>{part}</strong>
                            : <span key={i}>{part}</span>
                    )}
                </div>
                <span className="text-[10px] text-slate-400 font-bold px-1 uppercase tracking-tighter">{formatTime(msg.timestamp)}</span>
            </div>
        </div>
    );
};

export const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([AI_GREETING]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpen, messages]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isTyping) return;

        const userMsg: Message = { id: Date.now(), role: "user", text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simula delay de respuesta de la IA
        await new Promise(r => setTimeout(r, 1200));

        const aiMsg: Message = {
            id: Date.now() + 1,
            role: "ai",
            text: AI_RESPONSE,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    return (
        <>
            {/* ── Chat Panel ─────────────────────────────────── */}
            <div
                className={`fixed bottom-28 right-4 sm:right-6 z-50 w-[360px] sm:w-[400px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isOpen
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                    }`}
            >
                <GlassCard className="!p-0 border-none shadow-2xl overflow-hidden flex flex-col h-[520px] !rounded-[2.5rem]">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 py-5 bg-primary text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none"></div>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 relative z-10 border border-white/20 backdrop-blur-md">
                            <RobotAvatar size={30} />
                        </div>
                        <div className="flex-1 min-w-0 relative z-10">
                            <Typography variant="H4" className="text-sm leading-none text-white font-black">Asistente Virtual</Typography>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">En línea</span>
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
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {messages.map(msg => (
                            <MessageBubble key={msg.id} msg={msg} />
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex gap-3 items-center animate-pulse">
                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <RobotAvatar size={18} />
                                </div>
                                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center border border-slate-100 shadow-sm backdrop-blur-sm">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 border-t border-slate-100 bg-white">
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex gap-3 items-center"
                        >
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Escríbeme algo..."
                                    disabled={isTyping}
                                    className="!rounded-xl !bg-slate-50 !border-slate-100"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="PRIMARY"
                                size="LG"
                                disabled={!input.trim() || isTyping}
                                className="!p-3 !rounded-xl shrink-0"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                        <Typography variant="P" className="text-[10px] text-slate-400 text-center mt-3 font-bold uppercase tracking-widest">
                            Presiona Enter para enviar · TalleresMecanicos
                        </Typography>
                    </div>
                </GlassCard>
            </div>

            {/* ── Trigger Button ─────────────────── */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-label={isOpen ? "Cerrar chat" : "Abrir chat con asistente"}
                className="fixed bottom-8 right-5 sm:right-6 z-50 rounded-full group transition-all duration-300 active:scale-95"
            >
                <div className={`p-4 rounded-full shadow-2xl transition-all duration-500 border-2 border-white bg-white/80 backdrop-blur-md ${isOpen ? 'rotate-90 scale-110 border-primary/40' : 'hover:scale-110 shadow-primary/20'}`}>
                    <div className="w-12 h-12 flex items-center justify-center relative">
                        {isOpen ? (
                            <X className="w-8 h-8 text-primary animate-fade-in" />
                        ) : (
                            <div className="relative">
                                <RobotAvatar size={50} className="drop-shadow-lg" />
                                {/* Notification Dot */}
                                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                            </div>
                        )}
                    </div>
                </div>
            </button>
        </>
    );
};
