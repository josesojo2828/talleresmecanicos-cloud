'use client';

import { useEffect } from "react";
import { Header } from "@/components/organisms/Header";
import { Hero } from "@/components/organisms/Hero";
import { CountryShowcase } from "@/components/organisms/CountryShowcase";
import { TopWorkshops } from "@/components/organisms/TopWorkshops";
import { ValueProposition } from "@/components/organisms/ValueProposition";
import { CategoryShowcase } from "@/components/organisms/CategoryShowcase";
import { CTASection } from "@/components/organisms/CTASection";
import { Footer } from "@/components/organisms/Footer";

export default function HomeClient() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-base-100">
      <div className="relative z-10">
        <Header />
        <main className="min-h-[calc(100vh-200px)] pt-16">
          <Hero />
          <div className="reveal"><CountryShowcase /></div>
          <div className="reveal"><ValueProposition /></div>
          <div className="reveal"><TopWorkshops /></div>
          <div className="reveal"><CategoryShowcase /></div>
          <div className="reveal"><CTASection /></div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
