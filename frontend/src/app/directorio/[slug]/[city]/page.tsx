import { Metadata } from 'next';
import DirectoryClient from '@/features/directory/components/DirectoryClient';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001/api';

async function getCityData(countrySlug: string, citySlug: string) {
    try {
        const countriesRes = await axios.get(`${API_URL}/country?filters={"enabled":true}`);
        const countriesArr = countriesRes.data?.body?.data || countriesRes.data?.data || [];
        const country = countriesArr.find((c: any) => c.name.toLowerCase().replace(/\s+/g, '-') === countrySlug.toLowerCase());

        if (!country) return null;

        const citiesRes = await axios.get(`${API_URL}/city?filters={"countryId":"${country.id}"}`);
        const citiesArr = citiesRes.data?.body?.data || citiesRes.data?.data || [];
        const city = citiesArr.find((c: any) => c.name.toLowerCase().replace(/\s+/g, '-') === citySlug.toLowerCase());

        return { country, city };
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string, city: string } }): Promise<Metadata> {
    // Note: Next.js catch-all or nested routes can be tricky with param names
    // For [slug]/[city]/page.tsx, params will have slug and city
    const data = await getCityData(params.slug, params.city);
    
    if (!data || !data.city) {
        return { title: 'Directorio de Talleres' };
    }

    return {
        title: `Talleres Mecánicos en ${data.city.name}, ${data.country.name} | Red de Talleres`,
        description: `Encuentra información y agenda cita en los mejores talleres mecánicos en ${data.city.name}. Expertos en mecánica, frenos, suspensión y más.`,
        keywords: `talleres mecanicos en ${data.city.name}, mecanico ${data.city.name}, reparacion autos ${data.city.name}`,
    };
}

export default async function Page({ params }: { params: { slug: string, city: string } }) {
    const data = await getCityData(params.slug, params.city);
    
    return <DirectoryClient initialCountryId={data?.country?.id} initialCityId={data?.city?.id} />;
}
