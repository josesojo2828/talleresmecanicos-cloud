import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ICityWhereType, ICountryWhereType } from "src/modules/regions/application/dtos/regions.schema";
import FindCityPersistence from "src/modules/regions/infrastructure/persistence/city/find.persistence";
import FindCountryPersistence from "src/modules/regions/infrastructure/persistence/country/find.persistence";
import { IUserWhereType } from "src/modules/user/application/dtos/user.schema";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import PartPersistence from "src/modules/part/infrastructure/persistence/persistence";
import WorkshopClientPersistence from "src/modules/workshop/infrastructure/persistence/workshop-client.persistence";
import { ObjectSelect, SUPPORT_SELECT } from "src/types/support";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Controller('app')
export default class ApplicationController {

    constructor(
        private readonly countryService: FindCountryPersistence,
        private readonly cityService: FindCityPersistence,
        private readonly userService: FindUserPersistence,
        private readonly partService: PartPersistence,
        private readonly workshopClientService: WorkshopClientPersistence
    ) { }

    @Get('check')
    private check() {
        return { status: 'ok' };
    }

    @Get('select/:slug')
    @UseGuards(JwtAuthGuard)
    private async select(
        @Param('slug') slug: SUPPORT_SELECT, 
        @Query() query: { param: string, parentId?: string },
        @CurrentUser() user: any
    ): Promise<ObjectSelect[]> {
        const scope = getScopeFilter(user) as any;

        if (slug === 'COUNTRY') {
            const countryFilters = scope.OR ? scope.OR.map((f: any) => {
                if (f.countryId) return { id: f.countryId };
                if (f.cityId) return { cities: { some: { id: f.cityId } } };
                return f;
            }) : [];

            const wh: any = {
                AND: [
                    { name: { contains: query.param, mode: 'insensitive' } },
                    { enabled: true }
                ]
            }

            if (countryFilters.length > 0) {
                wh.AND.push({ OR: countryFilters });
            }

            const entity = await this.countryService.select({ where: wh });
            return entity;
        }
        else if (slug === 'CITY') {
            const cityFilters = scope.OR ? scope.OR.map((f: any) => {
                if (f.cityId) return { id: f.cityId };
                if (f.countryId) return { countryId: f.countryId };
                return f;
            }) : [];

            const wh: any[] = [{ name: { contains: query.param, mode: 'insensitive' } }, { enabled: true }]
            if (query.parentId) wh.push({ countryId: query.parentId });
            
            if (cityFilters.length > 0) {
                wh.push({ OR: cityFilters });
            }

            return await this.cityService.select({ where: { AND: wh } });
        }
        else if (slug === 'USER') {
            const userFilters = scope.OR ? scope.OR.map((f: any) => {
                if (f.countryId) return { countryId: f.countryId };
                if (f.cityId) return { 
                    OR: [
                        { cityId: f.cityId },
                        { workshop: { cityId: f.cityId } }
                    ]
                };
                return f;
            }) : [];

            const wh: any = {
                AND: [
                    { enabled: true },
                    { role: 'CLIENT' },
                ]
            };

            if (userFilters.length > 0) {
                wh.AND.push({ OR: userFilters });
            }

            if (query.param) {
                wh.AND.push({
                    OR: [
                        { firstName: { contains: query.param, mode: 'insensitive' } },
                        { lastName: { contains: query.param, mode: 'insensitive' } },
                        { email: { contains: query.param, mode: 'insensitive' } },
                        { phone: { contains: query.param, mode: 'insensitive' } },
                    ]
                });
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
            return [];
        }
        else if (slug === 'PART') {
            const wh: any = {
                AND: [
                    { workshopId: query.parentId }
                ]
            }
            if (query.param) {
                wh.AND.push({
                    OR: [
                        { name: { contains: query.param, mode: 'insensitive' } },
                        { sku: { contains: query.param, mode: 'insensitive' } }
                    ]
                });
            }
            return await this.partService.select({ where: wh });
        }
        else if (slug === 'PART_CATEGORY') {
            const wh: any = {
                AND: [
                    { workshopId: query.parentId },
                    { deletedAt: null }
                ]
            }
            if (query.param) {
                wh.AND.push({
                    name: { contains: query.param, mode: 'insensitive' }
                });
            }
            const data = await this.partService.getAllCategories({ 
                where: wh,
                take: 10
            });
            return data.data.map(i => ({ id: i.id, label: i.name }));
        }
        else if (slug === 'WORKSHOP_CLIENT') {
            const wh: any = {
                AND: [
                    { workshopId: query.parentId }
                ]
            }
            if (query.param) {
                wh.AND.push({
                    OR: [
                        { firstName: { contains: query.param, mode: 'insensitive' } },
                        { lastName: { contains: query.param, mode: 'insensitive' } },
                        { email: { contains: query.param, mode: 'insensitive' } },
                        { phone: { contains: query.param, mode: 'insensitive' } },
                    ]
                });
            }
            return await this.workshopClientService.select({ where: wh });
        }
        return [];
    }
}
