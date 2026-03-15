
export interface ICreateSupportAssignmentDto {
    userId: string;
    countryId?: string;
    cityId?: string;
}

export interface IUpdateSupportAssignmentDto {
    countryId?: string;
    cityId?: string;
}
