"use client";

import Link from "next/link";
import { IUser } from "@/types/user/user";

interface UserDashboardProps {
    user: IUser | null;
}

export const UserDashboard = ({ user }: UserDashboardProps) => {
    return (
        <div className="p-8 max-w-5xl mx-auto animate-in zoom-in duration-500">
            <div className="bg-white p-12 border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 text-center space-y-8 relative overflow-hidden group">
                {/* Fondo decorativo de ingeniería */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full translate-x-32 -translate-y-32 blur-[100px] group-hover:bg-emerald-500/10 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-x-32 translate-y-32 blur-[80px] opacity-70" />
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none" 
                    style={{ backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-emerald-500 decoration-[12px] underline-offset-4">
                        Hola, {user?.firstName}
                    </h1>
                    <p className="text-slate-400 font-bold text-base max-w-sm mx-auto uppercase tracking-widest leading-relaxed">
                        Tu centro de control personal para la gestión de vehículos.
                    </p>
                    
                    <div className="pt-10 flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/appointment/new" className="group/btn relative overflow-hidden btn btn-primary border-none rounded-2xl px-12 font-black uppercase tracking-tighter italic h-16 shadow-2xl shadow-emerald-500/30 transition-all active:scale-95 text-lg">
                            <span className="relative z-10">Agendar Cita Nueva</span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        </Link>
                        <Link href="/workshops" className="btn btn-ghost border-slate-200 hover:border-slate-300 rounded-2xl px-12 font-black uppercase tracking-tighter italic h-16 text-slate-500 hover:text-slate-900 transition-all">
                            Explorar Talleres Élite
                        </Link>
                    </div>
                </div>

                {/* Micro-anuncio o status */}
                <div className="pt-12 relative z-10 border-t border-slate-50 flex justify-center items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-emerald-500/20" />
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+150 Talleres verificados en tu zona</p>
                </div>
            </div>
        </div>
    );
};
