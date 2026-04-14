import { ObjectPage, ObjectSidebar } from "@/types/user/dashboard";
import { IUser } from "@/types/user/user";


// Login types
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

// Register types
export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'CLIENT' | 'TALLER';
    acceptTerms: boolean;
    country: string;
    city: string;
    workshopName?: string;
    workshopAddress?: string;
}

// API Response types
export interface AuthResponse {
    user: IUser;
    token: string;
    refreshToken?: string;
    dashboard?: {
        pages: ObjectPage[];
        sidebar: ObjectSidebar[];
    }
}

// API Response types
export interface LoginAuthResponse {
    access_token: string;
    user: IUser;
    message: string;
    dashboard: {
        pages: ObjectPage[];
        sidebar: ObjectSidebar[];
    }
}

// Error types
export interface AuthError {
    message: string;
    field?: string;
    code?: string;
}

export interface ValidationError {
    field: string;
    message: string;
}

// Auth State types
export interface AuthState {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
