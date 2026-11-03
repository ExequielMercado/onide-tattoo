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
  STUDIO_ADDRESS,
  STUDIO_MAPS_URL,
  formatEdmontonDateTime,
} from '@/lib/booking';

export const runtime = 'nodejs';

function getCalendarDateTimes(preferredDates) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/.exec(
    preferredDates || '',
  );
  if (!match) {
    throw new Error('Booking date must use Edmonton local date and time');
  }

  const [, year, month, day, hour, minute] = match;
  const localStart = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)),
  );
  const localEnd = new Date(localStart.getTime() + 30 * 60 * 1000);
  const formatLocal = (date) => {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:00-07:00`;
  };

  return {
    startDateTime: `${year}-${month}-${day}T${hour}:${minute}:00-07:00`,
    endDateTime: formatLocal(localEnd),
  };
}

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
    const { startDateTime, endDateTime } = getCalendarDateTimes(booking.preferredDates);

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
        extendedProperties: {
          private: {
            bookingEmail: booking.email,
            bookingName: booking.name,
          },
        },
        start: {
          dateTime: startDateTime,
          timeZone: 'America/Edmonton',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'America/Edmonton',
        },
      },
    });

    const mailer = createMailer();
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: booking.email,
      subject: 'Your tattoo consultation is confirmed',
      html: `
        <p>Hi ${escapeHtml(booking.name)},</p>
        <p>Your tattoo consultation has been confirmed for <strong>${escapeHtml(formatEdmontonDateTime(startTime))}</strong>.</p>
        <p>📍 Location: 10359 82 Ave NW, Suite 201, Edmonton, AB T6E 1Z9 (Whyte Ave, Old Strathcona) - Phantom Avenue - <a href="https://www.google.com/maps/search/?api=1&query=10359+82+Ave+NW+Suite+201+Edmonton+AB+T6E+1Z9">View on Google Maps</a></p>
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
