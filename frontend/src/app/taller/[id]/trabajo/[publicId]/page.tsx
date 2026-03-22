import WorkPublicPage from './WorkPublicPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Consultar Trabajo | Red de Talleres',
    description: 'Consulta el avance de tu vehículo en tiempo real con el ID público de tu orden.',
};

export default function Page() {
    return <WorkPublicPage />;
}
