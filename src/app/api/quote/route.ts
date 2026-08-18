import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      serviceType,
      timeline,
      projectDescription,
    } = body;

    // Basic validation
    if (
      !name ||
      !email ||
      !phone ||
      !serviceType ||
      !projectDescription
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'OHO TECH <onboarding@resend.dev>',
      to: ['kampainfraa@gmail.com'],
      replyTo: email,
      subject: `New Quote Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #0d0d0e;">New Software Quote Request</h1>
          <hr />
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <h3>Project Details</h3>
          <p><strong>Service Type:</strong> ${serviceType}</p>
          <p><strong>Estimated Timeline:</strong> ${timeline || 'Not specified'}</p>
          <h3>Project Requirements & Scope</h3>
          <p>${projectDescription.replace(/\n/g, '<br />')}</p>
          <hr />
          <p>You can directly reply to this email to contact ${name}.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send quote request.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Quote request sent successfully!',
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
