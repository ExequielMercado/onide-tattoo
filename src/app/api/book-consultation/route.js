import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function getCalendarIds() {
  return (process.env.CALENDARS_TO_CHECK || '')
    .split(',')
    .map((calendarId) => calendarId.trim())
    .filter(Boolean);
}

function createCalendarClient() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Calendar credentials are not configured');
  }

  // Limpieza exhaustiva de la llave privada
  let rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
  // 1. Reemplazar saltos de línea escapados (\\n) por saltos reales (\n)
  let cleanKey = rawKey.replace(/\\n/g, '\n');
  // 2. Limpiar comillas dobles o simples que Next.js haya dejado pegadas en los extremos
  cleanKey = cleanKey.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: cleanKey,
    },
    scopes: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ]
  });

  return google.calendar({ version: 'v3', auth });
}

export async function POST(request) {
  try {
    const booking = await request.json();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const calendarsToCheck = [...new Set([...getCalendarIds(), calendarId].filter(Boolean))];
    const startTime = new Date(booking.preferredDates);

    if (!calendarId || calendarsToCheck.length === 0) {
      throw new Error('Google Calendar IDs are not configured');
    }

    if (
      !booking.name ||
      !booking.email ||
      !booking.preferredDates ||
      Number.isNaN(startTime.getTime())
    ) {
      return Response.json(
        { error: 'Name, email, and a valid preferred date are required' },
        { status: 400 },
      );
    }

    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
    const calendar = createCalendarClient();
    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: calendarsToCheck.map((id) => ({ id })),
      },
    });

    const busyCalendars = Object.values(freeBusyResponse.data.calendars || {});
    const isBusy = busyCalendars.some((calendar) => (calendar.busy || []).length > 0);

    if (isBusy) {
      return NextResponse.json({ error: 'Time slot is already booked' }, { status: 409 });
    }

    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Tattoo consultation — ${booking.name}`,
        description: [
          `Name: ${booking.name}`,
          `Email: ${booking.email}`,
          `Phone: ${booking.phone || 'Not provided'}`,
          `Style: ${booking.style || 'Not provided'}`,
          `Cover Up: ${booking.coverUp || 'Not provided'}`,
          `Placement: ${booking.placement || 'Not provided'}`,
          `Approx. Size: ${booking.size || 'Not provided'}`,
          '',
          'Description:',
          booking.description || 'Not provided',
        ].join('\n'),
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DETALLE DEL ERROR:", error);
    return Response.json(
      { error: 'Unable to create the booking right now. Please try again later.' },
      { status: 500 },
    );
  }
}
