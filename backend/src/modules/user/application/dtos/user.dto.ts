
export interface ICreateUserDto {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: any; // UserRole enum
    enabled?: boolean;
    countryId?: string;
    cityId?: string;
}

export interface IUpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: any; // UserRole enum
    enabled?: boolean;
    passwordHash?: string;
}

export interface ICreateProfileDto {
    avatarUrl?: string;
    userId: string;
}

export interface IUpdateProfileDto {
    avatarUrl?: string;
}

export interface ICreateSessionDto {
    token: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
    userId: string;
}

export interface IUpdateSessionDto {
    ipAddress?: string;
    userAgent?: string;
    expiresAt?: Date;
}

export interface ICreateDeviceDto {
    deviceId: string;
    fcmToken?: string;
    userId: string;
}

export interface IUpdateDeviceDto {
    fcmToken?: string;
}

export interface ICreateNotificationDto {
    title: string;
    content: string;
    userId: string;
}

export interface IUpdateNotificationDto {
    title?: string;
    content?: string;
    isRead?: boolean;
}
