import { DatabaseItemInterface } from './database-item.interface';

export interface ResetPasswordInterface {
  email: string;
}

export interface PasswordResetInterface {
  org: number;
  uid: number;
  token: string;
}

export interface SetNewPasswordInterface extends PasswordResetInterface {
  password: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface OrganizationLoginInterface extends LoginInterface {
  orgId: string;
}

export type PermissionType = 'admin' | 'waiter' | 'manager' | 'sales';

export enum UserRolesEnum {
  ADMIN = 'Admin',
  WAITER = 'WAITER',
  SALES = 'SALES',
}

export type permissionAccessType =
  | 'read'
  | 'create'
  | 'update'
  | 'professional'
  | 'fullAccess';

export interface PermissionInterface extends DatabaseItemInterface {
  userId?: number | string | any | undefined;
  permission: PermissionType;
  admin: boolean | number;
  create: boolean | number;
  read: boolean | number;
  update: boolean | number;
  delete: boolean | number;
  professional: boolean | number;
}

export interface UserInterface extends DatabaseItemInterface {
  fullName: string | any;
  id: any;
  email: string | any;
  username: string | any;
  // phone: string | number | any;
  role: UserRolesEnum;
  organizationIds: any;
  photoURL?: string;
  status?: string;
  created_at?: string;
  createdBy: string;
  pin?: string;
  permissions?: PermissionInterface[];
}

export interface UserRegistrationInterface extends DatabaseItemInterface {
  name: string;
  email: string;
  phone: string;
  username: string;
  photoURL?: string;
  createdBy: string;
  dateOfBirth: string | null;
}

export interface UserSessionInterface {
  user: UserInterface;
  token: string;
}

export interface SignupInterface {
  fullName: string;
  email: string;
  phone: string | number;
  password: string;
  confrimPassword: string;
  permissions?: PermissionInterface;
  organization: string;
}
