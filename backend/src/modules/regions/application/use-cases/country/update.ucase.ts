import { BadRequestException, Injectable } from "@nestjs/common";
import CountryModel from "../../../domain/models/country.model";
import UpdateCountryPersistence from "../../../infrastructure/persistence/country/update.persistence";
import FindCountryPersistence from "../../../infrastructure/persistence/country/find.persistence";
import { IUpdateCountryDto } from "../../dtos/regions.dto";
import { ICountryUpdateType } from "../../dtos/regions.schema";

@Injectable()
export default class UpdateCountryUCase extends CountryModel {

    constructor(
        private readonly updatePersistence: UpdateCountryPersistence,
        private readonly findPersistence: FindCountryPersistence
    ) {
        super()
    }

    public async execute({ id, data }: { id: string, data: IUpdateCountryDto }) {
        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException("error.not_found");

        const { name, enabled, flag, primaryColor, secondaryColor, tertiaryColor } = data as any;

        const body: ICountryUpdateType = {
            name,
            enabled,
            flag,
            primaryColor,
            secondaryColor,
            tertiaryColor
        };
        
        const entityUpdated = await this.updatePersistence.update({ id, data: body });

        // If country is disabled, disable all its cities
        if (enabled === false) {
             await (this.updatePersistence as any).prisma.city.updateMany({
                where: { countryId: id },
                data: { enabled: false }
            });
        }

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
