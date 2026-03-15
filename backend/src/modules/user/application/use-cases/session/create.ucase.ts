import { Injectable } from "@nestjs/common";
import SessionModel from "src/modules/user/domain/models/session.model";
import { CreateSessionPersistence } from "src/modules/user/infrastructure/persistence/session/session.persistence";
import { ICreateSessionDto } from "src/modules/user/application/dtos/user.dto";
import { ISessionCreateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class CreateSessionUCase extends SessionModel {

    constructor(
        private readonly createPersistence: CreateSessionPersistence
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateSessionDto }) {
        const { token, expiresAt, ipAddress, userAgent, userId } = data;

        const body: ISessionCreateType = {
            token,
            expiresAt,
            ipAddress,
            userAgent,
            user: { connect: { id: userId } }
        }

        const entityCreated = await this.createPersistence.save({ data: body });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
