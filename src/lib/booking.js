import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export const ARTIST_EMAIL = 'onidetattoo@gmail.com';

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
  const startTime = new Date(booking.preferredDates);

  if (Number.isNaN(startTime.getTime())) {
    throw new Error('Invalid booking date');
  }

  return {
    startTime,
    endTime: new Date(startTime.getTime() + 30 * 60 * 1000),
  };
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
    `Style: ${booking.style || 'Not provided'}`,
    `Cover Up: ${booking.coverUp || 'Not provided'}`,
    `Placement: ${booking.placement || 'Not provided'}`,
    `Approx. Size: ${booking.size || 'Not provided'}`,
    '',
    'Description:',
    booking.description || 'Not provided',
  ].join('\n');
}
