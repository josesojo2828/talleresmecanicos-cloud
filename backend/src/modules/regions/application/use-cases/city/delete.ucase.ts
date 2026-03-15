import { BadRequestException, Injectable } from "@nestjs/common";
import CityModel from "../../../domain/models/city.model";
import DeleteCityPersistence from "../../../infrastructure/persistence/city/delete.persistence";
import FindCityPersistence from "../../../infrastructure/persistence/city/find.persistence";

@Injectable()
export default class DeleteCityUCase extends CityModel {

    constructor(
        private readonly deletePersistence: DeleteCityPersistence,
        private readonly findPersistence: FindCityPersistence
    ) {
        super()
    }

    public async execute({ id, user }: { id: string, user: any }) {
        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException("error.not_found");

        await this.deletePersistence.delete({ id });

        return {
            message: 'success.delete',
            data: { id }
        };
    }
}
