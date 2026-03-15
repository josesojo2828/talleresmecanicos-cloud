const TOKEN_KEY = "somos_nexo_token";
const REFRESH_TOKEN_KEY = "somos_nexo_refresh_token";
const USER_KEY = "somos_nexo_user";

/**
 * Save authentication token to storage
 */
export const setToken = (token: string, rememberMe: boolean = false): void => {
    if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
};

/**
 * Get authentication token from storage
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from storage
 */
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
};

/**
 * Save refresh token
 */
export const setRefreshToken = (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove refresh token
 */
export const removeRefreshToken = (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Save user data to storage
 */
export const setUser = (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from storage
 */
export const getUser = (): any | null => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
};

/**
 * Remove user data from storage
 */
export const removeUser = (): void => {
    localStorage.removeItem(USER_KEY);
};

/**
 * Clear all auth data
 */
export const clearAuthData = (): void => {
    removeToken();
    removeRefreshToken();
    removeUser();
};

/**
 * Check if token is expired (basic check)
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp;
    } catch (error) {
        return true;
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;
    return !isTokenExpired(token);
};
