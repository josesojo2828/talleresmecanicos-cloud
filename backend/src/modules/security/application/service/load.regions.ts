import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadRegionsService {
    private readonly logger = new Logger(LoadRegionsService.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async execute() {
        const DEFAULT_COLORS = { primaryColor: '#10b981', secondaryColor: '#ef4444', tertiaryColor: '#ffffff' };
        
        const countriesData = [
            {
                name: 'México',
                flag: '🇲🇽',
                colors: { primaryColor: '#10b981', secondaryColor: '#ef4444', tertiaryColor: '#ffffff' }, // Emerald, Red, White
                cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Querétaro', 'Mérida']
            },
            {
                name: 'Colombia',
                flag: '🇨🇴',
                colors: { primaryColor: '#eab308', secondaryColor: '#3b82f6', tertiaryColor: '#ef4444' },
                cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga']
            },
            {
                name: 'Argentina',
                flag: '🇦🇷',
                colors: { primaryColor: '#38bdf8', secondaryColor: '#ffffff', tertiaryColor: '#eab308' },
                cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán']
            },
            {
                name: 'Chile',
                flag: '🇨🇱',
                colors: { primaryColor: '#ef4444', secondaryColor: '#ffffff', tertiaryColor: '#3b82f6' },
                cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco']
            },
            {
                name: 'Perú',
                flag: '🇵🇪',
                colors: { primaryColor: '#ef4444', secondaryColor: '#ffffff', tertiaryColor: '#ef4444' },
                cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos']
            },
            {
                name: 'Ecuador',
                flag: '🇪🇨',
                colors: { primaryColor: '#eab308', secondaryColor: '#3b82f6', tertiaryColor: '#ef4444' },
                cities: ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Manta']
            },
            {
                name: 'Venezuela',
                flag: '🇻🇪',
                colors: { primaryColor: '#eab308', secondaryColor: '#3b82f6', tertiaryColor: '#ef4444' },
                cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana']
            },
            {
                name: 'Uruguay',
                flag: '🇺🇾',
                colors: { primaryColor: '#3b82f6', secondaryColor: '#ffffff', tertiaryColor: '#eab308' },
                cities: ['Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Las Piedras', 'Maldonado']
            },
            {
                name: 'Paraguay',
                flag: '🇵🇾',
                colors: { primaryColor: '#ef4444', secondaryColor: '#ffffff', tertiaryColor: '#3b82f6' },
                cities: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Lambaré']
            },
            {
                name: 'Bolivia',
                flag: '🇧🇴',
                colors: { primaryColor: '#ef4444', secondaryColor: '#eab308', tertiaryColor: '#22c55e' },
                cities: ['La Paz', 'Santa Cruz de la Sierra', 'Cochabamba', 'El Alto', 'Oruro', 'Sucre']
            },
            {
                name: 'Panamá',
                flag: '🇵🇦',
                colors: { primaryColor: '#ffffff', secondaryColor: '#ef4444', tertiaryColor: '#3b82f6' },
                cities: ['Panamá', 'San Miguelito', 'Arraiján', 'La Chorrera', 'David', 'Colón']
            },
            {
                name: 'Costa Rica',
                flag: '🇨🇷',
                colors: { primaryColor: '#ef4444', secondaryColor: '#ffffff', tertiaryColor: '#3b82f6' },
                cities: ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Puntarenas', 'Limón']
            },
            {
                name: 'Guatemala',
                flag: '🇬🇹',
                colors: { primaryColor: '#38bdf8', secondaryColor: '#ffffff', tertiaryColor: '#38bdf8' },
                cities: ['Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'Chinautla']
            },
            {
                name: 'Honduras',
                flag: '🇭🇳',
                colors: { primaryColor: '#38bdf8', secondaryColor: '#ffffff', tertiaryColor: '#38bdf8' },
                cities: ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Villanueva']
            },
            {
                name: 'El Salvador',
                flag: '🇸🇻',
                colors: { primaryColor: '#3b82f6', secondaryColor: '#ffffff', tertiaryColor: '#3b82f6' },
                cities: ['San Salvador', 'Soyapango', 'Santa Ana', 'San Miguel', 'Mejicanos', 'Santa Tecla']
            },
            {
                name: 'Nicaragua',
                flag: '🇳🇮',
                colors: { primaryColor: '#3b82f6', secondaryColor: '#ffffff', tertiaryColor: '#3b82f6' },
                cities: ['Managua', 'León', 'Masaya', 'Tipitapa', 'Chinandega', 'Matagalpa']
            },
            {
                name: 'República Dominicana',
                flag: '🇩🇴',
                colors: { primaryColor: '#ef4444', secondaryColor: '#3b82f6', tertiaryColor: '#ffffff' },
                cities: ['Santo Domingo', 'Santiago de los Caballeros', 'Santo Domingo Oeste', 'Santo Domingo Este', 'San Pedro de Macorís', 'La Romana']
            }
        ];

        for (const countryData of countriesData) {
            // Upsert country
            const colors = countryData.colors || DEFAULT_COLORS;
            const country = await this.prisma.country.upsert({
                where: { name: countryData.name },
                update: {
                    flag: countryData.flag,
                    primaryColor: colors.primaryColor,
                    secondaryColor: colors.secondaryColor,
                    tertiaryColor: colors.tertiaryColor
                },
                create: {
                    name: countryData.name,
                    flag: countryData.flag,
                    primaryColor: colors.primaryColor,
                    secondaryColor: colors.secondaryColor,
                    tertiaryColor: colors.tertiaryColor,
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
