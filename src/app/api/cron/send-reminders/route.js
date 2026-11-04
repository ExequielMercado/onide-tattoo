import {
  createCalendarClient,
  createMailer,
  escapeHtml,
  formatEdmontonDateTime,
  getBookingContactFromEvent,
  getTomorrowInEdmonton,
  STUDIO_ADDRESS,
  STUDIO_MAPS_URL,
} from '@/lib/booking';

export const runtime = 'nodejs';

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('CRON_SECRET is not configured');
    return Response.json({ error: 'Cron authentication is not configured' }, { status: 500 });
  }

  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const baseUrl = process.env.APP_URL || 'https://www.onidetattoo.com';
    if (!calendarId) {
      throw new Error('GOOGLE_CALENDAR_ID must be configured');
    }

    const { dayKey, timeMin, timeMax } = getTomorrowInEdmonton();
    const calendar = createCalendarClient();
    const mailer = createMailer();
    const events = [];
    let pageToken;

    do {
      const response = await calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 2500,
        pageToken,
      });
      events.push(...(response.data.items || []));
      pageToken = response.data.nextPageToken || undefined;
    } while (pageToken);

    let sent = 0;
    let skipped = 0;
    const failures = [];

    for (const event of events) {
      if (!event.id || event.status === 'cancelled' || !event.start?.dateTime) {
        skipped += 1;
        continue;
      }

      const privateProperties = event.extendedProperties?.private || {};
      if (privateProperties.reminderSentFor === dayKey) {
        skipped += 1;
        continue;
      }

      const { email, name } = getBookingContactFromEvent(event);
      if (!email) {
        console.warn(`Skipping reminder for event ${event.id}: no customer email found`);
        skipped += 1;
        continue;
      }

      const appointmentDate = formatEdmontonDateTime(new Date(event.start.dateTime));

     try {
        await mailer.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: 'Reminder: your tattoo appointment is tomorrow',
          html: `
            <p>Hi ${escapeHtml(name)},</p>
            <p>This is a reminder that your tattoo appointment is scheduled for <strong>${escapeHtml(appointmentDate)}</strong>.</p>
            <p>📍 Location: 10359 82 Ave NW, Suite 201, Edmonton, AB T6E 1Z9 (Whyte Ave, Old Strathcona) - Phantom Avenue - <a href="https://www.google.com/maps/search/?api=1&query=10359+82+Ave+NW+Suite+201+Edmonton+AB+T6E+1Z9">View on Google Maps</a></p>
            <p>Please let us know if you will attend:</p>
            <div style="margin-top: 20px;">
              <a href="https://www.onidetattoo.com/api/attendance?action=yes&id=${event.id}" style="display:inline-block;padding:12px 24px;background-color:#28a745;color:white;text-decoration:none;border-radius:5px;font-weight:bold;margin-right:15px;">Yes, I'll attend</a>
              <a href="https://www.onidetattoo.com/api/attendance?action=no&id=${event.id}" style="display:inline-block;padding:12px 24px;background-color:#dc3545;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">I can't attend</a>
            </div>
          `,
        });

        await calendar.events.patch({
          calendarId,
          eventId: event.id,
          requestBody: {
            extendedProperties: {
              ...event.extendedProperties,
              private: {
                ...privateProperties,
                reminderSentFor: dayKey,
              },
            },
          },
        });
        sent += 1;
      } catch (error) {
        console.error(`Failed to send reminder for event ${event.id}:`, error);
        failures.push(event.id);
      }
    }

    if (failures.length > 0) {
      return Response.json(
        { error: 'Some reminders could not be sent', sent, skipped, failed: failures.length },
        { status: 500 },
      );
    }

    return Response.json({ success: true, day: dayKey, sent, skipped }, { status: 200 });
  } catch (error) {
    console.error('Daily booking reminders failed:', error);
    return Response.json({ error: 'Unable to send booking reminders' }, { status: 500 });
  }
}
