import { apiClient } from './client';
import { ApiResponse, DeviceActivation, License, LicenseStatus } from './types';

export async function getMyLicensesApi(): Promise<ApiResponse<License[]>> {
  return apiClient<License[]>('/api/licenses/my', {
    method: 'GET',
  });
}

export async function getLicenseByIdApi(id: number | string): Promise<ApiResponse<License>> {
  return apiClient<License>(`/api/licenses/${id}`, {
    method: 'GET',
  });
}

export async function getLicenseByKeyApi(licenseKey: string): Promise<ApiResponse<License>> {
  return apiClient<License>(`/api/licenses/key/${encodeURIComponent(licenseKey)}`, {
    method: 'GET',
  });
}

export async function activateDeviceApi(licenseKey: string, params: { deviceIdentifier: string; deviceName?: string; operatingSystem?: string; applicationVersion?: string }): Promise<ApiResponse<DeviceActivation>> {
  return apiClient<DeviceActivation>(`/api/licenses/${encodeURIComponent(licenseKey)}/activate`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function deactivateDeviceApi(licenseKey: string, deviceIdentifier: string): Promise<ApiResponse<DeviceActivation>> {
  return apiClient<DeviceActivation>(`/api/licenses/${encodeURIComponent(licenseKey)}/deactivate`, {
    method: 'POST',
    body: JSON.stringify({ deviceIdentifier }),
  });
}

export async function getLicenseDevicesApi(licenseKey: string): Promise<ApiResponse<DeviceActivation[]>> {
  return apiClient<DeviceActivation[]>(`/api/licenses/${encodeURIComponent(licenseKey)}/devices`, {
    method: 'GET',
  });
}

// Admin APIs
export async function getAdminLicensesApi(): Promise<ApiResponse<License[]>> {
  return apiClient<License[]>('/api/admin/licenses', {
    method: 'GET',
  });
}

export async function updateAdminLicenseStatusApi(id: number | string, status: LicenseStatus): Promise<ApiResponse<License>> {
  return apiClient<License>(`/api/admin/licenses/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function revokeAdminLicenseApi(id: number | string): Promise<ApiResponse<License>> {
  return apiClient<License>(`/api/admin/licenses/${id}/revoke`, {
    method: 'POST',
  });
}
