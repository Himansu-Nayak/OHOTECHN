import { apiClient } from './client';
import { ApiResponse, ContactEnquiry, LeadSource } from './types';
import { validateContactForm } from '@/lib/validators';
import { getCapturedUtmParams } from '@/lib/utmTracker';

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
  interestedProduct?: string;
  source?: LeadSource;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
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

  // Retrieve captured UTM campaign metadata from session
  const utmSession = getCapturedUtmParams();

  const utmSource = params.utmSource || utmSession.utmSource;
  const utmMedium = params.utmMedium || utmSession.utmMedium;
  const utmCampaign = params.utmCampaign || utmSession.utmCampaign;
  const utmTerm = params.utmTerm || utmSession.utmTerm;
  const utmContent = params.utmContent || utmSession.utmContent;
  const landingPage = params.landingPage || utmSession.landingPage;

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

  // 2. Save to Spring Boot backend database & CRM lead pipeline
  try {
    const backendRes = await apiClient<ContactEnquiry>('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        phone: params.phone,
        company: params.company,
        subject: params.subject || params.serviceType,
        message: params.message,
        interestedProduct: params.interestedProduct || params.serviceType,
        source: params.source,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        landingPage,
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
