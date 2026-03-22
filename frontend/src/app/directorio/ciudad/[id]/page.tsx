import CityDetailClient from "@/features/directory/components/CityDetailClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talleres Mecánicos | Detalle de Ciudad",
  description: "Explora los mejores talleres mecánicos en esta ciudad.",
};

export default function CityPage({ params }: { params: { id: string } }) {
  return <CityDetailClient id={params.id} />;
}
