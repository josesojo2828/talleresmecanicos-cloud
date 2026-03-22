"use client";

import React from "react";
import Image from "next/image";
import { Copy, Hexagon, Type, Palette, Layout, Ghost, Check } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";
import { IconBubble } from "@/components/atoms/IconBubble";

const ColorSwatch = ({ name, hex, description }: { name: string; hex: string; description: string }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative">
            <div
                className="w-full h-24 rounded-2xl mb-4 border border-slate-200 shadow-sm transition-all duration-500 group-hover:scale-[1.02] flex items-end p-4"
                style={{ backgroundColor: hex }}
            >
                <div className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                    {hex}
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <Typography variant="H4" className="text-slate-900 mb-0.5 !text-sm">{name}</Typography>
                    <Typography variant="CAPTION" className="text-slate-500 text-[8px]">{name.toLowerCase().replace(' ', '-')}</Typography>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 bg-slate-50 hover:bg-white rounded-lg border border-slate-200 transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
            </div>
            <Typography variant="P" className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                {description}
            </Typography>
        </div>
    );
};

const IconShowcaseCard = ({ name, src }: { name: string; src: string }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        const filename = src.split('/').pop() || '';
        navigator.clipboard.writeText(filename);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="flex flex-col items-center group relative">
            <div
                onClick={handleCopy}
                className="w-full aspect-square flex items-center justify-center p-3 mb-2 glass-effect rounded-xl border-white/50 bg-white shadow-sm hover:border-primary/40 transition-all cursor-pointer"
            >
                <div className="relative w-8 h-8 z-10 transition-transform duration-500 group-hover:scale-110">
                    <Image
                        src={src}
                        alt={name}
                        width={32}
                        height={32}
                        className="w-full h-full"
                        unoptimized
                    />
                </div>
                <div className={`absolute top-1 right-1 p-1 rounded-md bg-primary text-white transition-all ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <Check className="w-2.5 h-2.5" />
                </div>
            </div>
            <Typography variant="CAPTION" className="text-slate-400 group-hover:text-slate-900 transition-colors text-[8px] truncate w-full text-center">
                {name}
            </Typography>
        </div>
    );
};

export default function IdentityPage() {
    return (
        <main className="min-h-screen bg-base-100 text-slate-900 pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-float"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <Typography variant="CAPTION" className="text-primary mb-3">Identity System v2.0</Typography>
                    <Typography variant="H1" className="mb-4 !text-4xl md:!text-6xl font-black italic">Talleres Mecanicos</Typography>
                    <Typography variant="P" className="text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium">
                        Una identidad visual refinada que combina la frescura de la bandera de México con una interfaz de cristal moderna y compacta.
                    </Typography>
                </div>

                {/* Color Palette */}
                <section className="mb-32">
                    <div className="flex items-center gap-3 mb-12">
                        <IconBubble colorClass="bg-primary/10 border-primary/20">
                            <Palette className="w-5 h-5 text-primary" />
                        </IconBubble>
                        <Typography variant="H2" className="!text-2xl">Paleta de Colores</Typography>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <ColorSwatch
                            name="Light Green"
                            hex="#22c55e"
                            description="Color primario de la marca. Evoca crecimiento, esperanza y el verde de la bandera."
                        />
                        <ColorSwatch
                            name="Deep Gray"
                            hex="#4b5563"
                            description="Tono para textos principales y elementos técnicos. Aporta seriedad y contraste."
                        />
                        <ColorSwatch
                            name="Glass White"
                            hex="#ffffff"
                            description="Base translúcida para paneles y tarjetas con efecto de cristal."
                        />
                        <ColorSwatch
                            name="Talleres Error"
                            hex="#ef4444"
                            description="Funcional para alertas y validaciones críticas."
                        />
                    </div>
                </section>

                {/* Typography */}
                <section className="mb-32">
                    <div className="flex items-center gap-3 mb-12">
                        <IconBubble colorClass="bg-primary/10 border-primary/20">
                            <Type className="w-5 h-5 text-primary" />
                        </IconBubble>
                        <Typography variant="H2" className="!text-2xl">Tipografía</Typography>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 glass-card border-white/50 bg-white/40 shadow-sm rounded-3xl">
                            <Typography variant="CAPTION" className="text-slate-400 mb-6 block">Display Header</Typography>
                            <Typography variant="H1" className="!text-5xl font-black tracking-tighter italic text-slate-900">
                                Nexo Premium
                            </Typography>
                        </div>
                        <div className="p-8 glass-card border-white/50 bg-white/40 shadow-sm rounded-3xl">
                            <Typography variant="CAPTION" className="text-slate-400 mb-6 block">Body Language</Typography>
                            <Typography variant="P" className="text-slate-600 text-sm leading-relaxed">
                                Plus Jakarta Sans es nuestra fuente base. Proporciona una lectura fluida y moderna, ideal para interfaces densas de información.
                            </Typography>
                        </div>
                    </div>
                </section>

                {/* Icons Grid (Compact) */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-12">
                        <IconBubble colorClass="bg-primary/10 border-primary/20">
                            <Hexagon className="w-5 h-5 text-primary" />
                        </IconBubble>
                        <Typography variant="H2" className="!text-2xl">Sistemas de Iconos</Typography>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                        {[
                            { name: 'Profile', src: '/icons/svg/user-profile.svg' },
                            { name: 'Settings', src: '/icons/svg/user-settings.svg' },
                            { name: 'Location', src: '/icons/svg/srv-location-pin.svg' },
                            { name: 'Torii', src: '/icons/svg/jp/jp-torii.svg' },
                            { name: 'Sakura', src: '/icons/svg/jp/jp-sakura.svg' },
                            { name: 'WhatsApp', src: '/icons/svg/soc-whatsapp.svg' },
                            { name: 'Instagram', src: '/icons/svg/soc-instagram.svg' },
                            { name: 'Verified', src: '/icons/svg/srv-verification-check.svg' },
                            { name: 'Wallet', src: '/icons/svg/fin-wallet.svg' },
                            { name: 'Chat', src: '/icons/svg/msg-chat-bubble.svg' },
                        ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                    </div>
                </section>
            </div>
        </main>
    );
}
