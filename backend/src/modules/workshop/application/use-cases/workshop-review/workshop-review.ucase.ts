import { BadRequestException, Injectable, ForbiddenException, ConflictException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { WorkshopReviewModel } from "../../../domain/models/workshop-review.model";
import WorkshopReviewPersistence from "../../../infrastructure/persistence/workshop-review/persistence";
import { ICreateWorkshopReviewDto } from "../../dtos/workshop-review.dto";
import WorkshopPersistence from "../../../infrastructure/persistence/workshop/persistence";

@Injectable()
export class WorkshopReviewUCase extends WorkshopReviewModel {
    constructor(
        private readonly persistence: WorkshopReviewPersistence,
        private readonly workshopPersistence: WorkshopPersistence
    ) {
        super();
    }

    async create(data: ICreateWorkshopReviewDto, user: any) {
        const { rating, comment, workshopId } = data;

        // 1. Validar que el usuario sea un CLIENTE
        if (user.role !== UserRole.CLIENT) {
            throw new ForbiddenException("Solo los clientes pueden calificar talleres");
        }

        // 2. Validar que el taller exista
        const workshop = await this.workshopPersistence.find({ id: workshopId });
        if (!workshop) {
            throw new BadRequestException("El taller especificado no existe");
        }

        // 3. Validar que no haya calificado antes (Regla de oro: una sola vez)
        const existingReview = await this.persistence.findFirst({
            userId: user.id,
            workshopId: workshopId,
            deletedAt: null
        });

        if (existingReview) {
            throw new ConflictException("Ya has calificado este taller anteriormente");
        }

        // 4. Validar el rango de calificación
        if (rating < 1 || rating > 5) {
            throw new BadRequestException("La calificación debe estar entre 1 y 5 estrellas");
        }

        const body = {
            rating,
            comment,
            user: { connect: { id: user.id } },
            workshop: { connect: { id: workshopId } }
        };

        return {
            message: 'success.review_created',
            data: await this.persistence.create(body)
        };
    }

    async findByWorkshop(workshopId: string) {
        return await this.persistence.getAll({
            where: { workshopId, deletedAt: null },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        const review = await this.persistence.find({ id });
        if (!review) throw new BadRequestException("No se encontró la calificación");
        return review;
    }

    async delete(id: string) {
        await this.findOne(id); // Verificar que existe
        return {
            message: 'success.review_deleted',
            data: await this.persistence.delete(id)
        };
    }
}
