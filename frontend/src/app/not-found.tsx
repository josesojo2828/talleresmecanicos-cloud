"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-base-100">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative">
                    <h1 className="text-[12rem] font-black text-slate-100 leading-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-400 tracking-[0.4em] uppercase">Not_Found</span>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <Typography variant="H2" className="text-slate-900 !text-3xl font-black italic">
                        Perdido en el Nexo?
                    </Typography>
                    <Typography variant="P" className="text-slate-500 font-medium">
                        La página que buscas no existe o ha sido movida. Vuelve al inicio para seguir explorando.
                    </Typography>
                </div>

                <div className="pt-8">
                    <Link href="/">
                        <Button className="w-full h-14 rounded-2xl group shadow-lg shadow-primary/10">
                            <MoveLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                            Regresar al Inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
