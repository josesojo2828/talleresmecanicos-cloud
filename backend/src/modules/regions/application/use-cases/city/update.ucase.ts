import { BadRequestException, Injectable } from "@nestjs/common";
import CityModel from "../../../domain/models/city.model";
import UpdateCityPersistence from "../../../infrastructure/persistence/city/update.persistence";
import FindCityPersistence from "../../../infrastructure/persistence/city/find.persistence";
import { IUpdateCityDto } from "../../dtos/regions.dto";
import { ICityUpdateType } from "../../dtos/regions.schema";

@Injectable()
export default class UpdateCityUCase extends CityModel {

    constructor(
        private readonly updatePersistence: UpdateCityPersistence,
        private readonly findPersistence: FindCityPersistence
    ) {
        super()
    }

    public async execute({ id, data, user }: { id: string, data: IUpdateCityDto, user: any }) {
        const entity = await this.findPersistence.find({ where: { id }, include: { country: true } });
        if (!entity) throw new BadRequestException("error.not_found");

        const { name, countryId, enabled } = data;

        // #1. si el pais esta en enable false, la ciudad no se puede actualizar el enable a true.
        if (enabled === true) {
            const countryToVerify = countryId 
                ? await (this.updatePersistence as any).prisma.country.findUnique({ where: { id: countryId } })
                : (entity as any).country;

            if (countryToVerify && !countryToVerify.enabled) {
                throw new BadRequestException("No se puede habilitar una ciudad si el país está deshabilitado");
            }
        }

        const body: ICityUpdateType = {
            name,
            enabled: enabled,
            country: countryId ? { connect: { id: countryId } } : undefined
        }

        const entityUpdated = await this.updatePersistence.update({ id, data: body });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
