import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IDefaultUserInclude, IUserIncludeType, IUserOrderByType, IUserWhereType, IUserWhereUniqueType } from "src/modules/user/application/dtos/user.schema";
import { UserMapper } from "src/modules/user/domain/mapper/user.mapper";
import { ObjectSelect } from "src/types/support";
import { IUser } from "src/types/user/user";

@Injectable()
export default class FindUserPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async getAll({ where, orderBy, skip, take, include }: {
        where?: IUserWhereType,
        orderBy?: IUserOrderByType,
        skip?: number,
        take?: number,
        include?: IUserIncludeType
    }) {
        const [total, data] = await Promise.all([
            this.prisma.user.count({ where }),
            this.prisma.user.findMany({
                where,
                orderBy,
                take,
                skip,
                include: include || IDefaultUserInclude
            })
        ]);

        return {
            total,
            data: data.map(user => UserMapper.toDomain(user))
        };
    }

    public async find({ where, include }: { where: IUserWhereUniqueType, include?: IUserIncludeType }): Promise<IUser | null> {
        const user = await this.prisma.user.findUnique({
            where,
            include: include || IDefaultUserInclude
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    public async findFirst({ where, include }: { where: IUserWhereType, include?: IUserIncludeType }): Promise<IUser | null> {
        const user = await this.prisma.user.findFirst({
            where,
            include: include || IDefaultUserInclude
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    public async select({ where }: { where: IUserWhereType }): Promise<ObjectSelect[]> {
        const entiy = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            },
            skip: 0,
            take: 100,
        })

        if (!entiy || !entiy.length) return [];

        return entiy.map((item) => ({
            id: item.id,
            label: `${item.firstName} ${item.lastName} - ${item.email}`,
        }));
    }
}