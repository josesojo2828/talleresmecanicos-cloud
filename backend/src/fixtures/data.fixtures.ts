import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

/**
 * Service to handle initial data seeding (Fixtures)
 * Ensures that the system has all necessary master data to operate.
 */
@Injectable()
export class DataFixtures implements OnModuleInit {
    constructor(private readonly prisma: PrismaService) { }

    async onModuleInit() {
        await this.seedLatAmRegions();
        await this.seedWorkshopCategories();
    }

    private async seedLatAmRegions() {
        const regions = [
            { name: "México", flag: "🇲🇽", latitude: 23.6345, longitude: -102.5528, cities: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"] },
            { name: "Colombia", flag: "🇨🇴", latitude: 4.5709, longitude: -74.2973, cities: ["Bogotá", "Medellín", "Cali", "Barranquilla"] },
            { name: "Argentina", flag: "🇦🇷", latitude: -38.4161, longitude: -63.6167, cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"] },
            { name: "Chile", flag: "🇨🇱", latitude: -35.6751, longitude: -71.5430, cities: ["Santiago", "Valparaíso", "Concepción", "La Serena"] },
            { name: "Brasil", flag: "🇧🇷", latitude: -14.2350, longitude: -51.9253, cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"] },
            { name: "Perú", flag: "🇵🇪", latitude: -9.1900, longitude: -75.0152, cities: ["Lima", "Arequipa", "Trujillo", "Chiclayo"] },
            { name: "Ecuador", flag: "🇪🇨", latitude: -1.8312, longitude: -78.1834, cities: ["Quito", "Guayaquil", "Cuenca", "Manta"] },
            { name: "Venezuela", flag: "🇻🇪", latitude: 6.4238, longitude: -66.5897, cities: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"] },
            { name: "Uruguay", flag: "🇺🇾", latitude: -32.5228, longitude: -55.7658, cities: ["Montevideo", "Salto", "Ciudad de la Costa", "Paysandú"] },
            { name: "Paraguay", flag: "🇵🇾", latitude: -23.4425, longitude: -58.4438, cities: ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque"] },
            { name: "Bolivia", flag: "🇧🇴", latitude: -16.2902, longitude: -63.5887, cities: ["La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre"] },
            { name: "Panamá", flag: "🇵🇦", latitude: 8.5380, longitude: -80.7821, cities: ["Ciudad de Panamá", "San Miguelito", "Tocumen", "David"] },
            { name: "Costa Rica", flag: "🇨🇷", latitude: 9.7489, longitude: -83.7534, cities: ["San José", "Alajuela", "Cartago", "Heredia"] },
            { name: "Guatemala", flag: "🇬🇹", latitude: 15.7835, longitude: -90.2308, cities: ["Ciudad de Guatemala", "Mixco", "Villa Nueva", "Quetzaltenango"] },
            { name: "Honduras", flag: "🇭🇳", latitude: 15.2000, longitude: -86.2419, cities: ["Tegucigalpa", "San Pedro Sula", "Choloma", "La Ceiba"] },
            { name: "El Salvador", flag: "🇸🇻", latitude: 13.7942, longitude: -88.8965, cities: ["San Salvador", "Santa Ana", "San Miguel", "Soyapango"] },
            { name: "Nicaragua", flag: "🇳🇮", latitude: 12.8654, longitude: -85.2072, cities: ["Managua", "León", "Masaya", "Matagalpa"] },
            { name: "República Dominicana", flag: "🇩🇴", latitude: 18.7357, longitude: -70.1627, cities: ["Santo Domingo", "Santiago de los Caballeros", "La Romana", "San Pedro de Macorís"] },
            { name: "Puerto Rico", flag: "🇵🇷", latitude: 18.2208, longitude: -66.5901, cities: ["San Juan", "Bayamón", "Carolina", "Ponce"] },
            { name: "Cuba", flag: "🇨🇺", latitude: 21.5218, longitude: -77.7812, cities: ["La Habana", "Santiago de Cuba", "Camagüey", "Holguín"] }
        ];

        for (const region of regions) {
            const country = await this.prisma.country.upsert({
                where: { name: region.name },
                update: {
                    flag: region.flag,
                    latitude: (region as any).latitude,
                    longitude: (region as any).longitude,
                },
                create: {
                    name: region.name,
                    flag: region.flag,
                    latitude: (region as any).latitude,
                    longitude: (region as any).longitude,
                    enabled: false
                }
            });

            for (const cityName of region.cities) {
                await this.prisma.city.upsert({
                    where: {
                        name_countryId: {
                            name: cityName,
                            countryId: country.id
                        }
                    },
                    update: {},
                    create: {
                        name: cityName,
                        countryId: country.id,
                        enabled: false
                    }
                });
            }
        }
    }

    private async seedWorkshopCategories() {
        const categories = [
            { name: "Mecánica General", description: "Mantenimiento y reparación general de vehículos" },
            { name: "Electrónica y Diesel", description: "Sistemas de inyección, escaneo computarizado y reparaciones eléctricas" },
            { name: "Frenos y Suspensión", description: "Sistemas de frenado, amortiguadores y tren delantero" },
            { name: "Pintura y Carrocería", description: "Reparación de golpes, abolladuras y pintura automotriz" },
            { name: "Neumáticos y Ruedas", description: "Cambio, alineación, balanceo y rotación de neumáticos" },
            { name: "Aire Acondicionado", description: "Carga de gas y reparación de sistemas de enfriamiento" },
            { name: "Transmisiones", description: "Reparación de cajas de cambio y embragues" },
            { name: "Lubricentro", description: "Cambio de aceite, filtros y chequeo de niveles" },
            { name: "Estética Automotriz", description: "Lavado detallado, pulido, encerado y limpieza de interiores" }
        ];

        for (const cat of categories) {
            await this.prisma.workshopCategory.upsert({
                where: { name: cat.name },
                update: { description: cat.description },
                create: {
                    name: cat.name,
                    description: cat.description,
                    enabled: true
                }
            });
        }
    }
}