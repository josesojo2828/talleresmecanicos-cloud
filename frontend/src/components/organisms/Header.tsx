"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import {
    Home,
    Search,
    Users2,
    Info,
    LogIn,
    Menu,
    X,
    Wrench,
    LayoutDashboard,
    MessageSquare
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";

export const Header = () => {
    const t = useTranslations("nav");
    const { isAuthenticated } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Efecto para cambiar el estilo al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: t("home"), icon: Home },
        { href: "/directorio", label: t("directory"), icon: Search },
        { href: "/comunidad", label: t("community"), icon: Users2 },
        ...(isAuthenticated ? [{ href: "/chat", label: "Chat General", icon: MessageSquare }] : []),
        { href: "/nosotros", label: t("about"), icon: Info },
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 px-4 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"}`}>
            <div className={`max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between rounded-2xl transition-all duration-500 
        ${isScrolled
                    ? "bg-white/80 backdrop-blur-lg border border-white/40 shadow-lg shadow-slate-200/50"
                    : "bg-white/40 backdrop-blur-sm border border-white/20"
                }`}>

                {/* Logo con el nuevo color verde */}
                <Link href="/" className="flex items-center cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center mr-3 shadow-emerald-200 shadow-lg transition-transform group-hover:scale-105 group-hover:rotate-3">
                        <Wrench className="text-white w-5 h-5" />
                    </div>
                    <span className="text-slate-900 font-black text-xl tracking-tight leading-none">
                        Talleres<span className="text-emerald-600">Mecanicos</span>
                    </span>
                </Link>

                {/* Desktop Nav: Centrada y minimalista */}
                <div className="hidden md:flex items-center gap-1 bg-slate-200/20 p-1 rounded-xl border border-white/50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 text-slate-600 hover:text-emerald-600 hover:bg-white/80 group"
                        >
                            <link.icon className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-all" />
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Acciones: Botón prominente */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated ? (
                        <Link href="/dashboard">
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white border-none rounded-xl px-6 h-10 font-bold text-sm shadow-md transition-all hover:scale-[1.02] flex items-center gap-2">
                                <LayoutDashboard size={16} />
                                Panel de Control
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="GHOST" className="text-slate-600 font-bold text-sm hover:text-emerald-600 transition-colors">
                                    {t("login")}
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl px-6 h-10 font-bold text-sm shadow-md shadow-emerald-100 transition-all hover:scale-[1.02] flex items-center gap-2">
                                    <LogIn size={16} />
                                    Registrarse
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        className="p-2 text-slate-600 hover:bg-emerald-50 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown: Glass Effect */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-4 right-4 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center px-4 py-3.5 rounded-2xl text-base font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mr-4 group-hover:bg-white">
                                    <link.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                                </div>
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-2 border-slate-100" />
                        {isAuthenticated ? (
                            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full py-6 bg-slate-900 text-white rounded-2xl font-bold text-base shadow-lg transition-all">
                                    Ir al Panel
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-100">
                                    {t("login_mobile")}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};