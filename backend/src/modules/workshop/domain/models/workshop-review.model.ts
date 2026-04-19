import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class WorkshopReviewModel {
    abstract create(data: any, user: any): Promise<any>;
    abstract findByWorkshop(workshopId: string, options?: any): Promise<any>;
    abstract findOne(id: string): Promise<any>;
}
