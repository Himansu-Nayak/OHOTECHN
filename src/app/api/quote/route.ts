import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'OHO TECH <onboarding@resend.dev>';

// Safe HTML escaper to prevent injection
function escapeHtml(unsafe: string) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone = 'Not provided',
      company = 'N/A',
      serviceType,
      subject,
      budget,
      timeline = 'Not specified',
      projectDescription,
      message,
      formType = 'Enquiry / Quote Request',
    } = body;

    const finalMessage = projectDescription || message;
    const finalSubject = subject || serviceType || formType;

    // Basic required validation
    if (!name || !name.trim() || !email || !email.trim() || !finalMessage || !finalMessage.trim()) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Name, Email, Message).' },
        { status: 400 }
      );
    }

    // Length validation
    if (name.length > 100 || email.length > 150 || finalMessage.length > 5000) {
      return NextResponse.json(
        { error: 'Input exceeds maximum allowed length.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: ['kampainfraa@gmail.com'],
        replyTo: email.trim(),
        subject: `[OHO TECH] ${escapeHtml(finalSubject)} from ${escapeHtml(name)}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #0d0d0e; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #059669; margin-top: 0;">New OHO TECH Form Submission</h2>
            <p style="font-size: 14px; color: #64748b;">You have received a new ${escapeHtml(formType.toLowerCase())} submission from your website.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            
            <h3 style="color: #0d0d0e; font-size: 16px;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Name:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Email:</strong></td><td style="padding: 6px 0; color: #0d0d0e;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Phone:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${escapeHtml(phone)}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Company:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${escapeHtml(company)}</td></tr>
            </table>

            <h3 style="color: #0d0d0e; font-size: 16px;">Project Specifications</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Topic / Service:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${escapeHtml(finalSubject)}</td></tr>
              ${budget ? `<tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Target Budget:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${escapeHtml(budget)}</td></tr>` : ''}
              <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Timeline:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${escapeHtml(timeline)}</td></tr>
            </table>

            <h3 style="color: #0d0d0e; font-size: 16px;">Message / Technical Requirements</h3>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1e293b;">
              ${escapeHtml(finalMessage).replace(/\n/g, '<br />')}
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Reply directly to this email to contact ${escapeHtml(name)} (${escapeHtml(email)}).</p>
          </div>
        `,
      });

      if (error) {
        console.error('Resend API returned warning/error:', error);
        return NextResponse.json(
          { error: 'Email provider failed to deliver the message. Please try again.' },
          { status: 502 }
        );
      } else {
        return NextResponse.json(
          {
            success: true,
            message: 'Message sent to engineering team successfully!',
            data,
          },
          { status: 200 }
        );
      }
    } else {
      console.warn('RESEND_API_KEY is missing. Simulating delivery for local dev.');
      return NextResponse.json(
        {
          success: true,
          message: 'Your enquiry has been received and queued (local mode).',
          data: {
            id: `OHO-REQ-${Date.now().toString(36).toUpperCase()}`,
            timestamp: new Date().toISOString(),
          }
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error('Server error in /api/quote:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
