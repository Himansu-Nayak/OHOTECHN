import { apiClient } from './client';
import { ApiResponse, ContactEnquiry } from './types';
import { validateContactForm } from '@/lib/validators';

export interface ContactParams {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  serviceType?: string;
  timeline?: string;
  formType?: string;
}

export async function submitContactApi(params: ContactParams): Promise<ApiResponse<ContactEnquiry>> {
  // Runtime validation before network call
  const validation = validateContactForm({
    name: params.name,
    email: params.email,
    phone: params.phone,
    message: params.message,
  });

  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    return {
      success: false,
      message: firstError || 'Please fill in all required form fields correctly.',
    };
  }

  let emailSent = false;
  let emailError = '';

  // 1. Send Email via Resend Next.js API Route (/api/quote) to kampainfraa@gmail.com
  try {
    const resendRes = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        phone: params.phone || '',
        company: params.company || '',
        subject: params.subject || params.serviceType || 'Contact Enquiry',
        serviceType: params.serviceType || params.subject,
        timeline: params.timeline || '',
        message: params.message,
        projectDescription: params.message,
        formType: params.formType || 'Contact Enquiry',
      }),
    });

    const resendData = await resendRes.json();
    if (resendRes.ok && resendData.success) {
      emailSent = true;
    } else {
      emailError = resendData.error || 'Failed to send email notification.';
    }
  } catch (err: any) {
    console.warn('Resend email fetch warning:', err);
    emailError = err.message || 'Email service unreachable.';
  }

  // 2. Try saving to Spring Boot backend database if available
  try {
    const backendRes = await apiClient<ContactEnquiry>('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        phone: params.phone,
        subject: params.subject || params.serviceType,
        message: params.message,
      }),
    });
    if (backendRes.success) {
      return {
        success: true,
        message: 'Your message has been sent successfully!',
        data: backendRes.data,
      };
    }
  } catch (backendErr) {
    console.warn('Spring Boot backend enquiry save skipped/unavailable:', backendErr);
  }

  // If email was sent via Resend, return success even if backend is offline
  if (emailSent) {
    return {
      success: true,
      message: 'Your message has been sent successfully to kampainfraa@gmail.com!',
    };
  }

  return {
    success: false,
    message: emailError || 'Failed to submit form. Please check your connection.',
  };
}
