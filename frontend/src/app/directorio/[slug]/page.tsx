import { Metadata } from 'next';
import DirectoryClient from '@/features/directory/components/DirectoryClient';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001/api';

async function getCountryBySlug(slug: string) {
    try {
        // Since we don't have slugs in DB yet, we fetch enabled countries and match
        const res = await axios.get(`${API_URL}/country?filters={"enabled":true}`);
        const countries = res.data?.body?.data || res.data?.data || [];
        
        return countries.find((c: any) => 
            c.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
            c.id === slug // handle ID as fallback
        );
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const country = await getCountryBySlug(params.slug);
    
    if (!country) {
        return {
            title: "Directorio de Talleres | Red de Talleres",
        };
    }

    return {
        title: `Talleres Mecánicos en ${country.name} | Red de Talleres Mecánicos`,
        description: `Encuentra los mejores talleres mecánicos en ${country.name}. Compara especialidades, opiniones y agenda tu cita en línea con expertos verificados.`,
        keywords: `talleres mecanicos ${country.name}, mecanica automotriz ${country.name}, mejor taller mecanico ${country.name}`,
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const country = await getCountryBySlug(params.slug);
    
    return <DirectoryClient initialCountryId={country?.id} />;
}
