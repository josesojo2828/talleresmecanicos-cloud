import { BadRequestException, Injectable } from "@nestjs/common";
import CountryModel from "../../../domain/models/country.model";
import DeleteCountryPersistence from "../../../infrastructure/persistence/country/delete.persistence";
import FindCountryPersistence from "../../../infrastructure/persistence/country/find.persistence";

@Injectable()
export default class DeleteCountryUCase extends CountryModel {

    constructor(
        private readonly deletePersistence: DeleteCountryPersistence,
        private readonly findPersistence: FindCountryPersistence
    ) {
        super()
    }

    public async execute({ id }: { id: string }) {
        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException("error.not_found");

        await this.deletePersistence.delete({ id });

        return {
            message: 'success.delete',
            data: { id }
        };
    }
}
