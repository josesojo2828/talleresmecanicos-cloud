import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadRegionsService {
    private readonly logger = new Logger(LoadRegionsService.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async execute() {
        const countriesData = [
            {
                name: 'México',
                flag: '🇲🇽',
                cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Querétaro', 'Mérida']
            },
            {
                name: 'Colombia',
                flag: '🇨🇴',
                cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga']
            },
            {
                name: 'Argentina',
                flag: '🇦🇷',
                cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán']
            },
            {
                name: 'Chile',
                flag: '🇨🇱',
                cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco']
            },
            {
                name: 'Perú',
                flag: '🇵🇪',
                cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos']
            },
            {
                name: 'Ecuador',
                flag: '🇪🇨',
                cities: ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Manta']
            },
            {
                name: 'Venezuela',
                flag: '🇻🇪',
                cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana']
            },
            {
                name: 'Uruguay',
                flag: '🇺🇾',
                cities: ['Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Las Piedras', 'Maldonado']
            },
            {
                name: 'Paraguay',
                flag: '🇵🇾',
                cities: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Lambaré']
            },
            {
                name: 'Bolivia',
                flag: '🇧🇴',
                cities: ['La Paz', 'Santa Cruz de la Sierra', 'Cochabamba', 'El Alto', 'Oruro', 'Sucre']
            },
            {
                name: 'Panamá',
                flag: '🇵🇦',
                cities: ['Panamá', 'San Miguelito', 'Arraiján', 'La Chorrera', 'David', 'Colón']
            },
            {
                name: 'Costa Rica',
                flag: '🇨🇷',
                cities: ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Puntarenas', 'Limón']
            },
            {
                name: 'Guatemala',
                flag: '🇬🇹',
                cities: ['Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'Chinautla']
            },
            {
                name: 'Honduras',
                flag: '🇭🇳',
                cities: ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Villanueva']
            },
            {
                name: 'El Salvador',
                flag: '🇸🇻',
                cities: ['San Salvador', 'Soyapango', 'Santa Ana', 'San Miguel', 'Mejicanos', 'Santa Tecla']
            },
            {
                name: 'Nicaragua',
                flag: '🇳🇮',
                cities: ['Managua', 'León', 'Masaya', 'Tipitapa', 'Chinandega', 'Matagalpa']
            },
            {
                name: 'República Dominicana',
                flag: '🇩🇴',
                cities: ['Santo Domingo', 'Santiago de los Caballeros', 'Santo Domingo Oeste', 'Santo Domingo Este', 'San Pedro de Macorís', 'La Romana']
            }
        ];

        for (const countryData of countriesData) {
            // Upsert country
            const country = await this.prisma.country.upsert({
                where: { name: countryData.name },
                update: {
                    flag: countryData.flag // Update flag if country exists
                },
                create: {
                    name: countryData.name,
                    flag: countryData.flag,
                    enabled: false
                }
            });

            let citiesCount = 0;
            for (const cityName of countryData.cities) {
                // Upsert city
                await this.prisma.city.upsert({
                    where: {
                        name_countryId: {
                            name: cityName,
                            countryId: country.id
                        }
                    },
                    update: {
                        countryId: country.id // Ensure relation is correct
                    },
                    create: {
                        name: cityName,
                        countryId: country.id,
                        enabled: true
                    }
                });
                citiesCount++;
            }

            this.logger.log(`PAIS CREADO "${country.name}" con ${citiesCount} ciudades.`);
        }
    }
}
