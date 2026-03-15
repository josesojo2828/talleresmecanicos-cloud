import { Metadata } from 'next';
import DirectoryClient from '@/features/directory/components/DirectoryClient';

export const metadata: Metadata = {
    title: "Directorio de Talleres Mecánicos | Encuentra tu taller de confianza",
    description: "Busca y compara los mejores talleres mecánicos en tu zona. Filtra por país, ciudad y especialidad para encontrar el servicio que tu auto necesita.",
    keywords: "directorio talleres mecanicos, buscar taller mecanico, talleres mecanicos mexico, talleres mecanicos latam",
};

export default function Page() {
    return <DirectoryClient />;
}