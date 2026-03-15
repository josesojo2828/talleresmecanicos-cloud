import { BadRequestException, Injectable } from "@nestjs/common";
import SessionModel from "src/modules/user/domain/models/session.model";
import { UpdateSessionPersistence, FindSessionPersistence } from "src/modules/user/infrastructure/persistence/session/session.persistence";
import { IUpdateSessionDto } from "src/modules/user/application/dtos/user.dto";
import { ISessionUpdateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class UpdateSessionUCase extends SessionModel {

    constructor(
        private readonly updatePersistence: UpdateSessionPersistence,
        private readonly findPersistence: FindSessionPersistence
    ) {
        super()
    }

    public async execute({ data, id }: { data: IUpdateSessionDto, id: string }) {
        const { ipAddress, userAgent, expiresAt } = data;

        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const body: ISessionUpdateType = {};
        if (ipAddress) body.ipAddress = ipAddress;
        if (userAgent) body.userAgent = userAgent;
        if (expiresAt) body.expiresAt = expiresAt;

        const entityUpdated = await this.updatePersistence.update({ data: body, id });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
