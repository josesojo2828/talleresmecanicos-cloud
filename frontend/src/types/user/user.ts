import { IUserRole } from "../enums";

export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: IUserRole;
  enabled: boolean;
  countryId?: string;
  profile?: IProfile | null;
  workshop?: any;
  supportAssignments?: any[];
  forumPosts?: any[];
  forumComments?: any[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface IProfile {
  id: string;
  avatarUrl?: string | null;
  userId: string;
  user?: IUser;
}