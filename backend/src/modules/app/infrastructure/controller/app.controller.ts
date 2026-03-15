import { Controller, Get, Param, Query } from "@nestjs/common";
import { ICityWhereType, ICountryWhereType } from "src/modules/regions/application/dtos/regions.schema";
import FindCityPersistence from "src/modules/regions/infrastructure/persistence/city/find.persistence";
import FindCountryPersistence from "src/modules/regions/infrastructure/persistence/country/find.persistence";
import { IUserWhereType } from "src/modules/user/application/dtos/user.schema";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { ObjectSelect, SUPPORT_SELECT } from "src/types/support";

@Controller('app')
export default class AppicationController {

    constructor(
        private readonly countryService: FindCountryPersistence,
        private readonly cityService: FindCityPersistence,
        private readonly userService: FindUserPersistence,
    ) { }

    @Get('check')
    private check() {
        return { status: 'ok' };
    }

    @Get('select/:slug')
    private select(@Param('slug') slug: SUPPORT_SELECT, @Query() query: { param: string, parentId?: string }): Promise<ObjectSelect[]> {

        if (slug === 'COUNTRY') {
            const wh: ICountryWhereType = {
                AND: [
                    { name: { contains: query.param } },
                ]
            }
            return this.countryService.select({ where: wh });
        }
        else if (slug === 'CITY') {
            const wh: ICityWhereType = {
                AND: [
                    { name: { contains: query.param } },
                ]
            }
            return this.cityService.select({ where: wh });
        }
        else if (slug === 'USER') {
            const wh: IUserWhereType = {
                AND: [
                    { firstName: { contains: query.param } },
                    { lastName: { contains: query.param } },
                    { email: { contains: query.param } },
                    { phone: { contains: query.param } },
                ]
            }
            return this.userService.select({ where: wh });
        }

    }

}
