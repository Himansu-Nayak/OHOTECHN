import { apiClient } from './client';
import { ApiResponse, ContactEnquiry } from './types';

export interface ContactParams {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function submitContactApi(params: ContactParams): Promise<ApiResponse<ContactEnquiry>> {
  return apiClient<ContactEnquiry>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
