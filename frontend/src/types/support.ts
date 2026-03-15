
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
    | 'USER';

export interface ObjectSelect {
    id: string,
    label: string
}
