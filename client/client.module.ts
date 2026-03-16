import { Module } from '@nestjs/common';
import { VehicleController } from './infrastructure/controllers/vehicle/vehicle.controller';
import { ServiceRequestController } from './infrastructure/controllers/service-request/service-request.controller';
import { BidController } from './infrastructure/controllers/bid/bid.controller';
import { VehicleUCase } from './application/use-cases/vehicle/vehicle.ucase';
import { ServiceRequestUCase } from './application/use-cases/service-request/service-request.ucase';
import { BidUCase } from './application/use-cases/bid/bid.ucase';
import VehiclePersistence from './infrastructure/persistence/vehicle/persistence';
import ServiceRequestPersistence from './infrastructure/persistence/service-request/persistence';
import BidPersistence from './infrastructure/persistence/bid/persistence';
import { PrismaService } from 'src/config/prisma.service';

@Module({
    controllers: [
        VehicleController,
        ServiceRequestController,
        BidController
    ],
    providers: [
        PrismaService,
        VehicleUCase,
        ServiceRequestUCase,
        BidUCase,
        VehiclePersistence,
        ServiceRequestPersistence,
        BidPersistence
    ],
    exports: [
        VehicleUCase,
        ServiceRequestUCase,
        BidUCase,
        VehiclePersistence,
        ServiceRequestPersistence,
        BidPersistence
    ]
})
export class ClientModule {}
