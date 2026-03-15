import { BadRequestException, Injectable } from "@nestjs/common";
import SessionModel from "src/modules/user/domain/models/session.model";
import { DeleteSessionPersistence, FindSessionPersistence } from "src/modules/user/infrastructure/persistence/session/session.persistence";

@Injectable()
export default class DeleteSessionUCase extends SessionModel {

    constructor(
        private readonly deletePersistence: DeleteSessionPersistence,
        private readonly findPersistence: FindSessionPersistence
    ) {
        super()
    }

    public async execute({ id }: { id: string }) {
        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const entityDeleted = await this.deletePersistence.delete({ id });

        return {
            message: 'success.delete',
            data: entityDeleted
        };
    }
}
