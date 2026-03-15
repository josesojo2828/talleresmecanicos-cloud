import { IUser } from "../user/user";
import { IDecimal, IJson } from "../utils";

export interface IPermission {
  id: string;
  name: string;
  list: string[];
  users?: IUser[];
}

export interface ISecurityLimit {
  id: string;
  dailyLimit: IDecimal;
  userId: string;
  user?: IUser;
}

export interface ISession {
  id: string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt: Date;
  userId: string;
  user?: IUser;
  createdAt: Date;
}

export interface ICurrency {
  id: string;
  code: string;
  name: string;
  decimals: number;
  isCrypto: boolean;
  isActive: boolean;
}

export interface IDevice {
  id: string;
  deviceId: string;
  fcmToken?: string | null;
  userId: string;
  user?: IUser;
  createdAt: Date;
}

export interface IAuditLog {
  id: string;
  action: string;
  details?: IJson | null;
  userId: string;
  user?: IUser;
  createdAt: Date;
}

export interface INotification {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  userId: string;
  user?: IUser;
  createdAt: Date;
}

export interface IBeneficiary {
  id: string;
  alias: string;
  targetAddress: string;
  userId: string;
  user?: IUser;
  createdAt: Date;
}
