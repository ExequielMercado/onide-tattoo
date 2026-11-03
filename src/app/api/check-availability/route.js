import {
  BOOKING_SLOTS,
  createCalendarClient,
  getBookingSlotTimes,
  getCalendarIds,
  getEdmontonDayRange,
} from '@/lib/booking';

export const runtime = 'nodejs';

async function getCalendarEvents(calendar, calendarId, timeMin, timeMax) {
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

  return events;
}

function getEventInterval(event) {
  if (event.start?.dateTime && event.end?.dateTime) {
    return {
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    };
  }

  if (event.start?.date && event.end?.date) {
    return {
      start: getEdmontonDayRange(event.start.date).timeMin,
      end: getEdmontonDayRange(event.end.date).timeMin,
    };
  }

  return null;
}

export async function GET(request) {
  const dayKey = new URL(request.url).searchParams.get('date');
  let dayRange;

  try {
    dayRange = getEdmontonDayRange(dayKey);
  } catch {
    return Response.json({ error: 'A valid date in YYYY-MM-DD format is required' }, { status: 400 });
  }

  try {
    const { timeMin, timeMax } = dayRange;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      throw new Error('GOOGLE_CALENDAR_ID is not configured');
    }

    const calendarIds = [...new Set([calendarId, ...getCalendarIds()])];
    const calendar = createCalendarClient();
    const calendarEvents = await Promise.all(
      calendarIds.map((id) => getCalendarEvents(calendar, id, timeMin, timeMax)),
    );
    const busyIntervals = calendarEvents
      .flat()
      .filter((event) => event.status !== 'cancelled')
      .map(getEventInterval)
      .filter(Boolean);

    const bookedSlots = BOOKING_SLOTS.filter((slot) => {
      const { startTime, endTime } = getBookingSlotTimes(dayKey, slot);
      return busyIntervals.some(
        ({ start, end }) => start < endTime && end > startTime,
      );
    });

    return Response.json(
      {
        date: dayKey,
        bookedSlots,
        availableSlots: BOOKING_SLOTS.filter((slot) => !bookedSlots.includes(slot)),
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      },
    );
  } catch (error) {
    console.error('Availability lookup failed:', error);
    return Response.json({ error: 'Unable to check appointment availability' }, { status: 500 });
  }
}
