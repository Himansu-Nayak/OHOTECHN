import type { UserDto } from './user.types';

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  user: UserDto;
}
