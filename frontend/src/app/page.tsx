import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: "Red de Talleres Mecánicos | Encuentra tu taller de confianza en México y LATAM",
    description: "La plataforma líder para encontrar talleres mecánicos verificados. Compara precios, lee opiniones y agenda tu cita en México, Argentina, Chile y más.",
    keywords: "taller mecanico, talleres mecanicos en mexico, mejor taller mecanico, reparacion de autos mexico, mecanicos verificados",
    openGraph: {
        title: "Red de Talleres Mecánicos | Tu auto en buenas manos",
        description: "Encuentra y compara los mejores talleres mecánicos en México y Latinoamérica.",
        images: ["/og-image.jpg"],
    }
};

export default function Page() {
    return <HomeClient />;
}
