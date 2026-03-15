import { IUser } from "src/types/user/user";

export class UserMapper {
    public static toDomain(raw: any): IUser {
        return {
            ...raw,
            phone: raw.phone ?? null,
            levelId: raw.levelId ?? null,
            referredById: raw.referredById ?? null,
            token: raw.token ?? "",
            deletedAt: raw.deletedAt ?? null,

            profile: raw.profile ? raw.profile : null,
            address: raw.address ? raw.address : null,
            permissions: raw.permissions ? raw.permissions : null,
        };
    }
}