"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    Instagram,
    Facebook,
    Twitter,
    Linkedin,
    MessageSquare,
    Wrench,
    ChevronRight
} from "lucide-react";

export const Footer = () => {
    const t = useTranslations("footer");

    // Iconos mapeados para mayor limpieza
    const socialLinks = [
        { name: 'Instagram', icon: Instagram },
        { name: 'Facebook', icon: Facebook },
        { name: 'X', icon: Twitter },
        { name: 'LinkedIn', icon: Linkedin },
        { name: 'WhatsApp', icon: MessageSquare },
    ];

    return (
        <footer className="relative mt-20 bg-slate-50 border-t border-slate-200 pt-20 pb-10 overflow-hidden text-slate-600">
            {/* Elemento decorativo superior: Línea de gradiente verde */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Columna 1: Brand & Social */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-6">
                                <Wrench className="text-white w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tight">
                                Talleres<span className="text-emerald-600">Mecanicos</span>
                            </span>
                        </div>

                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            {t("description")}
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            {socialLinks.map((social, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Columna 2: Platform Links */}
                    <div>
                        <h4 className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mb-8">{t("sections.platform")}</h4>
                        <ul className="space-y-4">
                            {[
                                { label: t("links.directory"), href: "/directorio" },
                                { label: t("links.community"), href: "/comunidad" },
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold flex items-center gap-2 group">
                                        <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-500" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3: Resources */}
                    <div>
                        {/* <h4 className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mb-8">{t("sections.resources")}</h4>
                        <ul className="space-y-4">
                            {[
                                { label: t("links.blog"), href: "/blog" },
                                { label: t("links.support"), href: "/soporte" },
                                { label: t("links.terms"), href: "/terminos" },
                                { label: t("links.privacy"), href: "/privacidad" }
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-slate-500 hover:text-emerald-600 transition-colors text-sm font-bold">{item.label}</Link>
                                </li>
                            ))}
                        </ul> */}
                    </div>

                    {/* Columna 4: Contact Info con Glass Card sutil */}
                    {/* <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2rem] border border-white shadow-sm">
                        <h4 className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] mb-6">{t("sections.contact")}</h4>
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Email</p>
                                    <span className="text-xs font-bold text-slate-700">contacto@talleresmecanicos.com</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Sede</p>
                                    <span className="text-xs font-bold text-slate-700">Presencia en Latinoamérica</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Bottom Bar: Ultra Clean */}
                {/* <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                        © {new Date().getFullYear()} {t("brand")} — Todos los derechos reservados
                    </p>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Sistemas en línea
                        </div>
                        <div className="text-slate-300 text-[9px] font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors cursor-default">
                            Hecho con precisión técnica
                        </div>
                    </div>
                </div> */}
            </div>
        </footer>
    );
};