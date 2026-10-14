export interface UserDto {
  id: number;
  name: string;
  email: string;
  officialEmail?: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DEVELOPER' | 'SUPPORT' | 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_DEVELOPER' | 'ROLE_SUPPORT' | string;
  enabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt?: string;
}
