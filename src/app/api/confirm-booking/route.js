import { NextResponse } from 'next/server';
import {
  ARTIST_EMAIL,
  createCalendarClient,
  createMailer,
  escapeHtml,
  getBookingDescription,
  getBookingTimes,
  getCalendarIds,
  readBookingToken,
  ensureBookingIsFree,
} from '@/lib/booking';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const token = new URL(request.url).searchParams.get('data');
    if (!token) {
      return NextResponse.json({ error: 'Missing booking approval data' }, { status: 400 });
    }

    const booking = readBookingToken(token);
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const calendar = createCalendarClient();
    const { startTime, endTime } = getBookingTimes(booking);

    if (!calendarId || !(await ensureBookingIsFree(calendar, calendarId, getCalendarIds(), startTime, endTime))) {
      return new Response('<h1>That time is no longer available.</h1>', {
        status: 409,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Tattoo consultation — ${booking.name}`,
        description: getBookingDescription(booking),
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
      },
    });

    const mailer = createMailer();
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: booking.email,
      subject: 'Your tattoo consultation is confirmed',
      html: `
        <p>Hi ${escapeHtml(booking.name)},</p>
        <p>Your tattoo consultation has been confirmed for <strong>${escapeHtml(startTime.toLocaleString('en-CA'))}</strong>.</p>
        <p>📍 Location: Edmonton, AB - <a href="https://maps.app.goo.gl/LQhMDV7jpsroYqb37?g_st=ic">View on Google Maps</a></p>
        <p>We look forward to seeing you.</p>
      `,
    });

    return new Response('<h1>Booking approved and confirmation sent.</h1>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Booking confirmation failed:', error);
    return NextResponse.json({ error: 'Unable to confirm booking' }, { status: 500 });
  }
}
