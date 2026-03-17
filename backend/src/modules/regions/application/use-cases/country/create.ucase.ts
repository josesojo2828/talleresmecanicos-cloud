import { BadRequestException, Injectable } from "@nestjs/common";
import CountryModel from "../../../domain/models/country.model";
import CreateCountryPersistence from "../../../infrastructure/persistence/country/create.persistence";
import FindCountryPersistence from "../../../infrastructure/persistence/country/find.persistence";
import { ICreateCountryDto } from "../../dtos/regions.dto";
import { ICountryCreateType } from "../../dtos/regions.schema";

@Injectable()
export default class CreateCountryUCase extends CountryModel {

    constructor(
        private readonly createPersistence: CreateCountryPersistence,
        private readonly findPersistence: FindCountryPersistence
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateCountryDto }) {
        const { name, enabled, flag, primaryColor, secondaryColor, tertiaryColor } = data;

        const body: ICountryCreateType = {
            name,
            enabled: enabled !== undefined ? enabled : false,
            flag,
            primaryColor,
            secondaryColor,
            tertiaryColor
        };

        const entityCreated = await this.createPersistence.save({ data: body });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
