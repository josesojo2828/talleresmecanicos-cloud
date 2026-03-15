import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { LoadUserService } from "./load.user";
import { LoadRegionsService } from "./load.regions";
import { LoadForumService } from "./load.forum";
import { LoadPublicationsService } from "./load.publications";

/**
 * Main seed coordinator to ensure correct order of execution.
 */
@Injectable()
export class MainSeedService implements OnApplicationBootstrap {
    private readonly logger = new Logger(MainSeedService.name);

    constructor(
        private readonly regions: LoadRegionsService,
        private readonly users: LoadUserService,
        private readonly forum: LoadForumService,
        private readonly publications: LoadPublicationsService
    ) { }

    async onApplicationBootstrap() {
        this.logger.log('--- INICIANDO PROCESO DE SEEDING COORDINADO ---');
        
        try {
            // 1. Regions (Master data)
            await this.regions.execute();
            
            // 2. Users (Depends on roles and potentially regions for workshops)
            await this.users.execute();
            
            this.logger.log('MainSeedService: Llamando a Forum Seeder...');
            // 3. Forum (Depends on users)
            await this.forum.execute();
            
            // 4. Publications (Depends on users and workshops)
            await this.publications.execute();

            this.logger.log('--- SEEDING FINALIZADO CON ÉXITO ---');
        } catch (error) {
            this.logger.error('Error durante el proceso de seeding:', error);
        }
    }
}
