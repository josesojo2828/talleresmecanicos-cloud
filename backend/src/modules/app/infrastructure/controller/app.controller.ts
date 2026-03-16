import { Controller, Get, Param, Query } from "@nestjs/common";
import { ICityWhereType, ICountryWhereType } from "src/modules/regions/application/dtos/regions.schema";
import FindCityPersistence from "src/modules/regions/infrastructure/persistence/city/find.persistence";
import FindCountryPersistence from "src/modules/regions/infrastructure/persistence/country/find.persistence";
import { IUserWhereType } from "src/modules/user/application/dtos/user.schema";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { ObjectSelect, SUPPORT_SELECT } from "src/types/support";
// import VehiclePersistence from "src/modules/client/infrastructure/persistence/vehicle/persistence";

@Controller('app')
export default class AppicationController {

    constructor(
        private readonly countryService: FindCountryPersistence,
        private readonly cityService: FindCityPersistence,
        private readonly userService: FindUserPersistence,
        // private readonly vehicleService: VehiclePersistence,
    ) { }

    @Get('check')
    private check() {
        return { status: 'ok' };
    }

    @Get('select/:slug')
    private async select(@Param('slug') slug: SUPPORT_SELECT, @Query() query: { param: string, parentId?: string }): Promise<ObjectSelect[]> {
        if (slug === 'COUNTRY') {
            const wh: ICountryWhereType = {
                AND: [
                    { name: { contains: query.param } },
                    { enabled: true }
                ]
            }

            const entity = await this.countryService.select({ where: wh });
            return entity;
        }
        else if (slug === 'CITY') {

            const wh: ICityWhereType[] = [{ name: { contains: query.param } }, { enabled: true }]
            if (query.parentId) wh.push({ countryId: query.parentId });
            return await this.cityService.select({ where: {AND:wh} });
        }
        else if (slug === 'USER') {
            const wh: IUserWhereType = {
                AND: [
                    { firstName: { contains: query.param } },
                    { lastName: { contains: query.param } },
                    { email: { contains: query.param } },
                    { phone: { contains: query.param } },
                    { enabled: true }
                ]
            }
            return await this.userService.select({ where: wh });
        }
        else if (slug === 'VEHICLE') {
            const wh: any = {
                AND: [
                    { userId: query.parentId },
                    {
                        OR: [
                            { brand: { contains: query.param, mode: 'insensitive' } },
                            { model: { contains: query.param, mode: 'insensitive' } },
                            { enabled: true }
                        ]
                    }
                ]
            }
            // return this.vehicleService.select({ where: wh });
        }

    }


}
