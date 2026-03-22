import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadInventoryService {
    private readonly logger = new Logger(LoadInventoryService.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async execute() {
        this.logger.log(`INVENTARIO SEED: Comenzando seeding de categorías de repuestos.`);

        const defaultCategories = [
            { name: "Motor", description: "Cigüeñales, pistones, válvulas y componentes internos del motor" },
            { name: "Transmisión", description: "Cajas de cambio, embragues, ejes y diferenciales" },
            { name: "Suspensión", description: "Amortiguadores, resortes, brazos y bujes" },
            { name: "Dirección", description: "Cremalleras, terminales, bombas de dirección y volantes" },
            { name: "Frenos", description: "Pastillas, discos, tambores, cilindros y mangueras" },
            { name: "Sistema Eléctrico", description: "Baterías, alternadores, motores de arranque e iluminación" },
            { name: "Carrocería", description: "Parachoques, puertas, espejos y piezas externas" },
            { name: "Filtros y Lubricantes", description: "Aceites, filtros de aire, aceite, combustible y cabina" },
            { name: "Enfriamiento", description: "Radiadores, termostatos, bombas de agua y mangueras" },
            { name: "Aire Acondicionado", description: "Compresores, evaporadores y carga de refrigerante" },
            { name: "Escape", description: "Silenciadores, catalizadores y tubos de escape" },
            { name: "Combustible", description: "Bombas de gasolina, inyectores y tanques" },
            { name: "Neumáticos", description: "Llantas, rines, válvulas y sensores de presión" },
            { name: "Accesorios", description: "Limpiaparabrisas, alfombras y elementos estéticos" },
            { name: "Consumibles", description: "Líquidos de frenos, refrigerantes, grasas y pegamentos" }
        ];

        const workshops = await this.prisma.workshop.findMany();

        if (workshops.length === 0) {
            this.logger.warn('INVENTARIO SEED: No hay talleres registrados para crear categorías.');
            return;
        }

        let createdCount = 0;
        for (const workshop of workshops) {
            for (const cat of defaultCategories) {
                const existing = await this.prisma.partCategory.findUnique({
                    where: {
                        name_workshopId: {
                            name: cat.name,
                            workshopId: workshop.id
                        }
                    }
                });

                if (!existing) {
                    await this.prisma.partCategory.create({
                        data: {
                            name: cat.name,
                            description: cat.description,
                            workshopId: workshop.id
                        }
                    });
                    createdCount++;
                }
            }
        }

        if (createdCount > 0) {
            this.logger.log(`INVENTARIO SEED: ${createdCount} categorías de repuestos creadas.`);
        } else {
            this.logger.log(`INVENTARIO SEED: No se crearon nuevas categorías (ya existen).`);
        }
    }
}
