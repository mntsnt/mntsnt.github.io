import { NextResponse } from 'next/server';
import { saveMessage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, _gotcha } = body;

    // Honeypot spam protection
    if (_gotcha) {
      // Silently discard spam bots
      return NextResponse.json({ success: true, message: 'Message received' });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 1. Save to database / local messages store
    await saveMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // 2. Deliver via Formspree or Resend
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/xzzrnwrk';

    try {
      if (process.env.RESEND_API_KEY) {
        // Send via Resend
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: ['mintesnoh@gmail.com'],
            reply_to: email,
            subject: `[Portfolio Contact] ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          }),
        });
      } else if (formspreeEndpoint) {
        // Forward to Formspree
        await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
          }),
        });
      }
    } catch (deliverErr) {
      console.warn('External delivery warning:', deliverErr);
      // We still return success since it is safely recorded in the database
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email directly.' },
      { status: 500 }
    );
  }
}
