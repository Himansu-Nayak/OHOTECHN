import { apiClient } from './client';
import { ApiResponse, Page, UserDto } from './types';

export interface UpdateProfileParams {
  name?: string;
  phone?: string;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

// 1. Fetch own user profile details
export async function getProfileApi(): Promise<ApiResponse<UserDto>> {
  return apiClient<UserDto>('/api/users/profile', {
    method: 'GET',
  });
}

// 2. Update own user profile details
export async function updateProfileApi(params: UpdateProfileParams): Promise<ApiResponse<UserDto>> {
  return apiClient<UserDto>('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 3. Change password with current password verification
export async function changePasswordApi(params: ChangePasswordParams): Promise<ApiResponse<string>> {
  return apiClient<string>('/api/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 4. Admin fetch paginated users list with search & role filters
export async function getAdminUsersApi(
  page = 0,
  size = 10,
  search?: string,
  role?: string
): Promise<ApiResponse<Page<UserDto>>> {
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('size', size.toString());
  if (search && search.trim() !== '') {
    queryParams.set('search', search.trim());
  }
  if (role && role.trim() !== '') {
    queryParams.set('role', role.trim());
  }

  return apiClient<Page<UserDto>>(`/api/admin/users?${queryParams.toString()}`, {
    method: 'GET',
  });
}

// 5. Admin fetch single user details
export async function getAdminUserByIdApi(id: number | string): Promise<ApiResponse<UserDto>> {
  return apiClient<UserDto>(`/api/admin/users/${id}`, {
    method: 'GET',
  });
}

// 6. Admin toggle user active status (enable/disable)
export async function updateAdminUserStatusApi(id: number | string, enabled: boolean): Promise<ApiResponse<UserDto>> {
  return apiClient<UserDto>(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
  });
}

// 7. Admin update user assigned role
export async function updateAdminUserRoleApi(id: number | string, role: string): Promise<ApiResponse<UserDto>> {
  return apiClient<UserDto>(`/api/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}
