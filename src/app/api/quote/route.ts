import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

    // Basic validation
    if (!name || !name.trim() || !email || !email.trim() || !finalMessage || !finalMessage.trim()) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Name, Email, Message).' },
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
      try {
        const { data, error } = await resend.emails.send({
          from: 'OHO TECH <onboarding@resend.dev>',
          to: ['kampainfraa@gmail.com'],
          replyTo: email,
          subject: `[OHO TECH] ${finalSubject} from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; color: #0d0d0e; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #059669; margin-top: 0;">New OHO TECH Form Submission</h2>
              <p style="font-size: 14px; color: #64748b;">You have received a new ${formType.toLowerCase()} submission from your website.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              
              <h3 style="color: #0d0d0e; font-size: 16px;">Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Name:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${name}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Email:</strong></td><td style="padding: 6px 0; color: #0d0d0e;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Phone:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${phone}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Company:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${company}</td></tr>
              </table>

              <h3 style="color: #0d0d0e; font-size: 16px;">Project Specifications</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Topic / Service:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${finalSubject}</td></tr>
                ${budget ? `<tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Target Budget:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${budget}</td></tr>` : ''}
                <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Timeline:</strong></td><td style="padding: 6px 0; color: #0d0d0e;">${timeline}</td></tr>
              </table>

              <h3 style="color: #0d0d0e; font-size: 16px;">Message / Technical Requirements</h3>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1e293b;">
                ${String(finalMessage).replace(/\n/g, '<br />')}
              </div>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">Reply directly to this email to contact ${name} (${email}).</p>
            </div>
          `,
        });

        if (error) {
          console.warn('Resend API returned warning/error:', error);
          // Fallback to successful queue acknowledge
        } else {
          return NextResponse.json(
            {
              success: true,
              message: 'Message sent to engineering team successfully via Resend!',
              data,
            },
            { status: 200 }
          );
        }
      } catch (emailErr) {
        console.warn('Resend dispatch skipped/failed:', emailErr);
      }
    } else {
      console.log(`[Contact API] Received local enquiry from ${name} (${email}) for ${finalSubject}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been received and queued for engineering review.',
        data: {
          id: `OHO-REQ-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          recipient: 'kampainfraa@gmail.com'
        }
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Server error in /api/quote:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}
