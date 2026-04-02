'use client';

import { useEffect } from "react";
import { Header } from "@/components/organisms/Header";
import { Hero } from "@/components/organisms/Hero";
import { CountryShowcase } from "@/components/organisms/CountryShowcase";
import { ValueProposition } from "@/components/organisms/ValueProposition";
import { CommunityHighlights } from "@/components/organisms/CommunityHighlights";
import { CategoryShowcase } from "@/components/organisms/CategoryShowcase";
import { CTASection } from "@/components/organisms/CTASection";
import { Footer } from "@/components/organisms/Footer";

export default function HomeClient() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white selection:bg-emerald-100 selection:text-emerald-900" suppressHydrationWarning={true}>
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
      
      <div className="relative z-10 antialiased">
        <Header />
        <main className="min-h-[calc(100vh-200px)] pt-16">
          <Hero />
          <CountryShowcase />
          <ValueProposition />
          <CommunityHighlights />
          <CategoryShowcase />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
