export type IDecimal = number; // O string, si prefieres precisión total para cálculos financieros
export type IJson = string | number | boolean | { [key: string]: IJson } | IJson[] | null;