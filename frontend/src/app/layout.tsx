import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AlertContainer } from "@/components/organisms/AlertContainer";
import { ModalContainer } from "@/components/organisms/ModalContainer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CountryProvider } from "@/components/providers/CountryProvider";
import { ThemeWrapper } from "@/components/providers/ThemeWrapper";
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from 'sonner';
import messages from '@/locales/es.json';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Talleres Mecánicos | Red de Talleres Mecánicos de Alta Precisión",
    template: "%s | Talleres Mecánicos"
  },
  description: "La red más grande de talleres mecánicos verificados en México, Argentina, Chile y más. Encuentra, compara y agenda tu cita con los mejores expertos de tu zona.",
  keywords: "taller mecanico, mecanica automotriz, reparacion autos, mantenimiento preventivo, taller mecanico en mexico, taller mecanico cerca de mi, mejores talleres mecanicos",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="mexico-light" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} antialiased bg-base-100 text-base-content selection:bg-primary/20`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale="es" messages={messages}>
          <AuthProvider>
            <CountryProvider>
              <ThemeWrapper>
                {children}
              </ThemeWrapper>
            </CountryProvider>
            <AlertContainer />
            <ModalContainer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
