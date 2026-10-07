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
  budget?: string;
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
  // 1. Runtime validation before network call
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

  let backendData: ContactEnquiry | undefined;

  // 2. Persist to Spring Boot backend database & CRM lead pipeline FIRST
  // This is the source of truth (PostgreSQL)
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

    if (backendRes.success && backendRes.data) {
      backendData = backendRes.data;
    } else {
      // If the backend actively rejected it, return failure
      return {
        success: false,
        message: backendRes.message || 'Failed to securely save your enquiry. Please try again.',
      };
    }
  } catch (backendErr: any) {
    console.error('Spring Boot CRM backend save failed:', backendErr);
    return {
      success: false,
      message: 'Failed to connect to our secure systems. Please try again later.',
    };
  }

  // 3. Send Notification Email via Resend Next.js API Route (/api/quote)
  // Email is supplemental; the lead is already safely stored in the CRM
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
        budget: params.budget || '',
        timeline: params.timeline || '',
        message: params.message,
        projectDescription: params.message,
        formType: params.formType || 'Contact Enquiry',
      }),
    });

    const resendData = await resendRes.json();
    if (resendRes.ok && resendData.success) {
      return {
        success: true,
        message: 'Your message has been received successfully! Our engineering team will contact you within 24 hours.',
        data: backendData,
      };
    } else {
      console.warn('Email notification dispatch failed, but lead was persisted:', resendData.error);
      return {
        success: true,
        message: 'Your enquiry was securely saved in our system, but the confirmation email was delayed.',
        data: backendData,
      };
    }
  } catch (err: any) {
    console.warn('Resend email fetch warning, but lead was persisted:', err);
    return {
      success: true,
      message: 'Your enquiry was securely saved in our system, but the confirmation email was delayed.',
      data: backendData,
    };
  }
}
