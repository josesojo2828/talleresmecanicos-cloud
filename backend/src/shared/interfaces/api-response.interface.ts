// src/common/interfaces/api-response.interface.ts

export type SupportedLang = 'es' | 'en' | 'pt';

export interface ApiResponse<T = any> {
    body: T;
    status: number;
    message: string | string[];
    error?: string;
    lang: SupportedLang;
    duration: string;
}
