import {
  ARTIST_EMAIL,
  createCalendarClient,
  createMailer,
  escapeHtml,
  formatEdmontonDateTime,
  getBookingContactFromEvent,
  STUDIO_ADDRESS,
} from '@/lib/booking';

export const runtime = 'nodejs';

function responsePage(title, message, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>${title}</title><body style="font-family:Arial,sans-serif;background:#090909;color:#f5f5f5;padding:48px 20px;text-align:center"><h1>${title}</h1><p>${message}</p></body></html>`,
    {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    },
  );
}

export async function GET(request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const eventId = url.searchParams.get('id');

  if (!eventId || (action !== 'yes' && action !== 'no')) {
    return responsePage('Invalid response', 'The attendance link is missing or invalid.', 400);
  }

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      throw new Error('GOOGLE_CALENDAR_ID is not configured');
    }

    const calendar = createCalendarClient();
    const result = await calendar.events.get({ calendarId, eventId });
    const event = result.data;
    if (event.status === 'cancelled') {
      return responsePage('Appointment unavailable', 'This appointment has already been cancelled.', 410);
    }

    const { email, name } = getBookingContactFromEvent(event);
    if (!email) {
      throw new Error(`Customer email is missing for event ${eventId}`);
    }

    const privateProperties = event.extendedProperties?.private || {};
    if (privateProperties.attendanceResponse === action) {
      return responsePage(
        'Thank you',
        action === 'yes'
          ? 'Your attendance confirmation has already been received.'
          : 'Your cancellation notice has already been received.',
      );
    }

    const responseLabel = action === 'yes' ? 'confirmed they will attend' : 'said they cannot attend';
    const mailer = createMailer();
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER || ARTIST_EMAIL,
      subject: `Attendance ${action === 'yes' ? 'confirmed' : 'cancelled'}: ${name}`,
      html: `
        <h2>Appointment attendance response</h2>
        <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) ${responseLabel}.</p>
        <p><strong>Appointment:</strong> ${escapeHtml(
          event.start?.dateTime
            ? formatEdmontonDateTime(new Date(event.start.dateTime))
            : 'Date unavailable',
        )}</p>
        <p><strong>Location:</strong> ${escapeHtml(STUDIO_ADDRESS)}</p>
      `,
    });

    await calendar.events.patch({
      calendarId,
      eventId,
      requestBody: {
        extendedProperties: {
          ...event.extendedProperties,
          private: {
            ...privateProperties,
            attendanceResponse: action,
            attendanceResponseAt: new Date().toISOString(),
          },
        },
      },
    });

    return responsePage(
      'Thank you',
      action === 'yes'
        ? 'Your attendance confirmation has been received.'
        : 'Your cancellation notice has been received. Onide has been notified.',
    );
  } catch (error) {
    if (error?.code === 404) {
      return responsePage('Appointment not found', 'We could not find this appointment.', 404);
    }

    console.error('Attendance response failed:', error);
    return responsePage(
      'Unable to record response',
      'We could not process your response right now. Please contact Onide directly.',
      500,
    );
  }
}
