
export type SUPPORT_SELECT =
    | 'TRANSACTION'
    | 'CRYPTOWALLET'
    | 'CURRENCY'
    | 'BANKACCOUNT'
    | 'REGIONS'
    | 'COUNTRY'
    | 'STATE'
    | 'CITY'
    | 'SUBSCRIPTION'
    | 'SUBSCRIPTIONPLAN'
    | 'USER'
    | 'CATEGORY_ITEMS'
    | 'VEHICLE'
    | 'PART'
    | 'PART_CATEGORY';

export interface ObjectSelect {
    id: string,
    label: string
}
