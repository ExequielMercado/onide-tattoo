import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export const ARTIST_EMAIL = 'onidetattoo@gmail.com';
export const STUDIO_ADDRESS =
  '10359 82 Ave NW, Suite 201, Edmonton, AB T6E 1Z9 (Whyte Ave, Old Strathcona) - Phantom Avenue';
export const STUDIO_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=10359+82+Ave+NW+Suite+201+Edmonton+AB+T6E+1Z9';

export const BOOKING_SLOTS = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

export function getCalendarIds() {
  return (process.env.CALENDARS_TO_CHECK || '')
    .split(',')
    .map((calendarId) => calendarId.trim())
    .filter(Boolean);
}

export function createCalendarClient() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Calendar credentials are not configured');
  }

  let rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  let cleanKey = rawKey.replace(/\\n/g, '\n');
  cleanKey = cleanKey.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: cleanKey,
    },
    scopes: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly',
    ],
  });

  return google.calendar({ version: 'v3', auth });
}

export function createMailer() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error('SMTP credentials are not configured');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // Esto es OBLIGATORIO para el puerto 465 en Gmail
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getZonedDateParts(date) {
  const parts = getDateTimePartsInEdmonton(date);
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
  };
}

function getNthSunday(year, monthIndex, occurrence) {
  const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const firstSunday = 1 + ((7 - firstDayOfMonth.getUTCDay()) % 7);
  return firstSunday + (occurrence - 1) * 7;
}

function getEdmontonOffsetMinutes(date) {
  const year = date.getUTCFullYear();
  const daylightTimeStarts = Date.UTC(
    year,
    2,
    getNthSunday(year, 2, 2),
    9,
  );
  const daylightTimeEnds = Date.UTC(
    year,
    10,
    getNthSunday(year, 10, 1),
    8,
  );

  return date.getTime() >= daylightTimeStarts && date.getTime() < daylightTimeEnds
    ? -6 * 60
    : -7 * 60;
}

function getDateTimePartsInEdmonton(date) {
  const localDate = new Date(date.getTime() + getEdmontonOffsetMinutes(date) * 60 * 1000);
  return {
    year: String(localDate.getUTCFullYear()),
    month: String(localDate.getUTCMonth() + 1).padStart(2, '0'),
    day: String(localDate.getUTCDate()).padStart(2, '0'),
    hour: String(localDate.getUTCHours()).padStart(2, '0'),
    minute: String(localDate.getUTCMinutes()).padStart(2, '0'),
    second: String(localDate.getUTCSeconds()).padStart(2, '0'),
  };
}

export function formatEdmontonDateTimeWithOffset(date) {
  const parts = getDateTimePartsInEdmonton(date);
  const offsetMinutes = getEdmontonOffsetMinutes(date);
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absoluteOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, '0');
  const offsetRemainder = String(absoluteOffset % 60).padStart(2, '0');

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${sign}${offsetHours}:${offsetRemainder}`;
}

function getUtcTimeForZonedDateTime(year, month, day, hour = 0, minute = 0, second = 0) {
  const requestedUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  const candidates = [-6 * 60, -7 * 60]
    .map((offsetMinutes) => new Date(requestedUtc - offsetMinutes * 60 * 1000))
    .filter((candidate) => {
      const actual = getDateTimePartsInEdmonton(candidate);
      return (
        Number(actual.year) === year &&
        Number(actual.month) === month &&
        Number(actual.day) === day &&
        Number(actual.hour) === hour &&
        Number(actual.minute) === minute &&
        Number(actual.second) === second
      );
    });

  if (candidates.length === 0) {
    throw new Error('The requested Edmonton local time does not exist');
  }

  return candidates[0];
}

export function getEdmontonDayRange(dayKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey || '');
  if (!match) {
    throw new Error('Invalid date; expected YYYY-MM-DD');
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    throw new Error('Invalid calendar date');
  }

  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  return {
    dayKey,
    timeMin: getUtcTimeForZonedDateTime(year, month, day),
    timeMax: getUtcTimeForZonedDateTime(
      nextDate.getUTCFullYear(),
      nextDate.getUTCMonth() + 1,
      nextDate.getUTCDate(),
    ),
  };
}

export function getTomorrowInEdmonton(now = new Date()) {
  const todayParts = getZonedDateParts(now);
  const tomorrow = new Date(Date.UTC(
    Number(todayParts.year),
    Number(todayParts.month) - 1,
    Number(todayParts.day) + 1,
  ));
  const dayAfter = new Date(tomorrow);
  dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);

  return {
    dayKey: tomorrow.toISOString().slice(0, 10),
    timeMin: getUtcTimeForZonedDateTime(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth() + 1,
      tomorrow.getUTCDate(),
    ),
    timeMax: getUtcTimeForZonedDateTime(
      dayAfter.getUTCFullYear(),
      dayAfter.getUTCMonth() + 1,
      dayAfter.getUTCDate(),
    ),
  };
}

export function formatEdmontonDateTime(date) {
  const localDate = new Date(date.getTime() + getEdmontonOffsetMinutes(date) * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(localDate);
}

export function getBookingContactFromEvent(event) {
  const description = event.description || '';
  const fields = Object.fromEntries(
    description.split(/\r?\n/).map((line) => {
      const separator = line.indexOf(':');
      return separator < 0
        ? ['', '']
        : [line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim()];
    }),
  );

  return {
    email: event.extendedProperties?.private?.bookingEmail || fields.email || '',
    name: event.extendedProperties?.private?.bookingName || fields.name || 'there',
  };
}

export function createBookingToken(booking) {
  const payload = Buffer.from(JSON.stringify(booking)).toString('base64url');
  const secret = process.env.BOOKING_APPROVAL_SECRET;

  if (!secret) {
    throw new Error('BOOKING_APPROVAL_SECRET is not configured');
  }

  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function readBookingToken(token) {
  const [payload, signature] = token.split('.');
  const secret = process.env.BOOKING_APPROVAL_SECRET;

  if (!payload || !signature || !secret) {
    throw new Error('Invalid booking approval token');
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest();
  const receivedSignature = Buffer.from(signature, 'base64url');

  if (
    receivedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    throw new Error('Invalid booking approval token signature');
  }

  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}

export function getActionUrl(path, token) {
  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl.replace(/\/$/, '')}${path}?data=${encodeURIComponent(token)}`;
}

export function getBookingTimes(booking) {
  const localDateTime = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    booking.preferredDates || '',
  );
  let startTime;

  if (localDateTime) {
    const [, yearText, monthText, dayText, hourText, minuteText, secondText = '0'] =
      localDateTime;
    const requested = {
      year: Number(yearText),
      month: Number(monthText),
      day: Number(dayText),
      hour: Number(hourText),
      minute: Number(minuteText),
      second: Number(secondText),
    };

    startTime = getUtcTimeForZonedDateTime(
      requested.year,
      requested.month,
      requested.day,
      requested.hour,
      requested.minute,
      requested.second,
    );
    const actual = getDateTimePartsInEdmonton(startTime);
    if (
      Number(actual.year) !== requested.year ||
      Number(actual.month) !== requested.month ||
      Number(actual.day) !== requested.day ||
      Number(actual.hour) !== requested.hour ||
      Number(actual.minute) !== requested.minute ||
      Number(actual.second) !== requested.second
    ) {
      throw new Error('Preferred date is not a valid Edmonton local time');
    }
  } else {
    startTime = new Date(booking.preferredDates);
  }

  if (Number.isNaN(startTime.getTime())) {
    throw new Error('Invalid booking date');
  }

  return {
    startTime,
    endTime: new Date(startTime.getTime() + 30 * 60 * 1000),
  };
}

export function getBookingSlotTimes(dayKey, time) {
  if (!BOOKING_SLOTS.includes(time)) {
    throw new Error('Invalid booking time');
  }

  return getBookingTimes({ preferredDates: `${dayKey}T${time}:00` });
}

export async function ensureBookingIsFree(calendar, calendarId, calendarsToCheck, startTime, endTime) {
  const calendarIds = [...new Set([...calendarsToCheck, calendarId].filter(Boolean))];
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      items: calendarIds.map((id) => ({ id })),
    },
  });

  const busyCalendars = Object.values(response.data.calendars || {});
  if (busyCalendars.some((calendar) => (calendar.busy || []).length > 0)) {
    return false;
  }

  return true;
}

export function getBookingDescription(booking) {
  return [
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone || 'Not provided'}`,
    `Cover Up: ${booking.coverUp || 'Not provided'}`,
    `Placement: ${booking.placement || 'Not provided'}`,
    `Approx. Size: ${booking.size || 'Not provided'}`,
    '',
    'Description:',
    booking.description || 'Not provided',
  ].join('\n');
}
