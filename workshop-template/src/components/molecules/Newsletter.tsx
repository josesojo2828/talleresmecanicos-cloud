"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

export const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus("error");
            return;
        }

        setStatus("loading");

        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-brand-sky ${status === "error" ? "border-red-400" : ""
                        }`}
                    disabled={status === "loading" || status === "success"}
                />
                <Button
                    type="submit"
                    variant="PRIMARY"
                    className="bg-brand-sky hover:bg-sky-400 text-brand-slate font-bold px-6 whitespace-nowrap"
                    isLoading={status === "loading"}
                    disabled={status === "loading" || status === "success"}
                >
                    {status === "success" ? "¡Suscrito!" : "Suscribirse"}
                </Button>
            </form>
            {status === "error" && (
                <p className="text-red-300 text-sm">Por favor ingresa un email válido</p>
            )}
            {status === "success" && (
                <p className="text-green-300 text-sm">¡Gracias por suscribirte! 🎉</p>
            )}
        </div>
    );
};
