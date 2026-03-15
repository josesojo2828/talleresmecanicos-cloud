import { BadRequestException, Injectable } from "@nestjs/common";
import CityModel from "../../../domain/models/city.model";
import CreateCityPersistence from "../../../infrastructure/persistence/city/create.persistence";
import { ICreateCityDto } from "../../dtos/regions.dto";
import { ICityCreateType } from "../../dtos/regions.schema";

@Injectable()
export default class CreateCityUCase extends CityModel {

    constructor(
        private readonly createPersistence: CreateCityPersistence
    ) {
        super()
    }

    public async execute({ data, user }: { data: ICreateCityDto, user: any }) {
        const { name, countryId, enabled } = data;

        // #1. si el pais esta en enable false, la ciudad no se puede actualizar el enable a true.
        if (enabled === true) {
            const country = await (this.createPersistence as any).prisma.country.findUnique({ where: { id: countryId } });
            if (country && !country.enabled) {
                throw new BadRequestException("No se puede habilitar una ciudad si el país está deshabilitado");
            }
        }

        const body: ICityCreateType = {
            name,
            country: { connect: { id: countryId } },
            enabled: enabled !== undefined ? enabled : true
        }

        const entityCreated = await this.createPersistence.save({ data: body });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
