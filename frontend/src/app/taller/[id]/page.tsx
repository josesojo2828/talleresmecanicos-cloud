import { Metadata } from 'next';
import WorkshopClient from './WorkshopClient';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001/api';

async function getWorkshop(id: string) {
    try {
        const res = await axios.get(`${API_URL}/workshop/${id}`);
        return res.data?.body?.data || res.data?.data || res.data;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const workshop = await getWorkshop(id);

    if (!workshop) {
        return {
            title: 'Taller No Encontrado | Red de Talleres',
        };
    }

    return {
        title: `${workshop.name} | Red de Talleres Mecánicos`,
        description: workshop.description || `Encuentra información sobre ${workshop.name} en nuestra red de talleres mecánicos.`,
        openGraph: {
            title: workshop.name,
            description: workshop.description,
            images: workshop.logoUrl
                ? [workshop.logoUrl.startsWith('http') ? workshop.logoUrl : `/talleres-mecanicos/${workshop.logoUrl}`]
                : [],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    await params; // Ensure params are unwrapped if needed by components inside, but client components do it via useParams
    return <WorkshopClient />;
}
