import { apiClient } from './client';
import { ApiResponse, DeveloperAnalyticsDto } from './types';

export async function getDeveloperAnalyticsApi(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<DeveloperAnalyticsDto>> {
  let url = '/api/developer/analytics';
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (params.toString()) url += `?${params.toString()}`;

  return apiClient<DeveloperAnalyticsDto>(url, {
    method: 'GET',
  });
}
