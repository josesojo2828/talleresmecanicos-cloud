import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    Instagram,
    Facebook,
    Twitter,
    Linkedin,
    MessageSquare,
    Wrench,
    ChevronRight,
    Globe,
    Cpu,
    Shield
} from "lucide-react";

export const Footer = () => {
    const t = useTranslations("footer");

    const socialLinks = [
        { name: 'Instagram', icon: Instagram },
        { name: 'Facebook', icon: Facebook },
        { name: 'X', icon: Twitter },
        { name: 'LinkedIn', icon: Linkedin },
        { name: 'WhatsApp', icon: MessageSquare },
    ];

    return (
        <footer className="relative bg-white border-t border-slate-950 pt-32 pb-16 overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

                    {/* Columna 1 */}
                    <div className="space-y-10">
                        <div className="flex flex-col gap-4">
                            <div className="w-16 h-16 bg-slate-950 flex items-center justify-center text-white">
                                <Image src="/logo.svg" alt="Talleres Mecánicos Logo" width={40} height={40} />
                            </div>
                            <span className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                                Talleres <span className="text-emerald-600 not-italic">Mecánicos</span>
                            </span>
                        </div>

                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-xs">
                            LA PLATAFORMA LÍDER PARA LA GESTIÓN INTEGRAL DE TALLERES MECÁNICOS.
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {socialLinks.map((social, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-colors"
                                >
                                    <social.icon size={16} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Columna 2 */}
                    <div className="space-y-8">
                        <h4 className="text-slate-950 font-black text-xs uppercase tracking-[0.2em] pb-4 border-b border-slate-100">PLATAFORMA</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "DIRECTORIO", href: "/directorio" },
                                { label: "COMUNIDAD", href: "/comunidad" },
                                { label: "REGISTRO", href: "/registro" },
                                { label: "SOPORTE", href: "/soporte" }
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-slate-400 hover:text-emerald-600 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3 */}
                    <div className="space-y-8">
                        <h4 className="text-slate-950 font-black text-xs uppercase tracking-[0.2em] pb-4 border-b border-slate-100">LEGAL</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "TERMINOS", href: "/terminos" },
                                { label: "PRIVACIDAD", href: "/privacidad" },
                                { label: "LICENCIAS", href: "/blog" }
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-slate-400 hover:text-emerald-600 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 4 */}
                    <div className="bg-slate-950 p-10 flex flex-col justify-center items-center text-center space-y-6">
                        <div className="space-y-2">
                            <p className="text-white text-lg font-black uppercase tracking-tighter italic">
                                ÚNETE AL <br /> <span className="text-emerald-500 not-italic">FUTURO.</span>
                            </p>
                        </div>
                        <Link href="/registro" className="w-full">
                            <button className="w-full bg-white text-slate-950 px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                                EMPEZAR AHORA
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                        © {new Date().getFullYear()} Talleres Mecánicos — TODOS LOS DERECHOS RESERVADOS
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="text-emerald-600 text-[10px] font-black uppercase tracking-widest italic">
                            CALIDAD GARANTIZADA
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};