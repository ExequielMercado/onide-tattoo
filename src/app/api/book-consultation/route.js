import {
  ARTIST_EMAIL,
  createBookingToken,
  createMailer,
  escapeHtml,
  createCalendarClient,
  ensureBookingIsFree,
  getBookingTimes,
  getCalendarIds,
  formatEdmontonDateTime,
} from '@/lib/booking';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const requestData = await request.json();
    const booking = { ...requestData, style: '' };

    if (
      !booking.name ||
      !booking.email ||
      !booking.preferredDates
    ) {
      return Response.json(
        { error: 'Name, email, and a valid preferred date are required' },
        { status: 400 },
      );
    }

    let startTime;
    let endTime;
    try {
      ({ startTime, endTime } = getBookingTimes(booking));
    } catch {
      return Response.json({ error: 'A valid preferred date is required' }, { status: 400 });
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      throw new Error('GOOGLE_CALENDAR_ID is not configured');
    }

    const isAvailable = await ensureBookingIsFree(
      createCalendarClient(),
      calendarId,
      getCalendarIds(),
      startTime,
      endTime,
    );
    if (!isAvailable) {
      return Response.json({ error: 'Time slot is already booked' }, { status: 409 });
    }

    const token = createBookingToken(booking);
    const phone = (booking.phone || '').replace(/\D/g, '');
    const appUrl = "https://www.onidetattoo.com";
    const approveUrl = `${appUrl}/api/confirm-booking?data=${encodeURIComponent(token)}`;
    const rejectUrl = `${appUrl}/api/reject-booking?data=${encodeURIComponent(token)}`;
    const mailer = createMailer();
    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: ARTIST_EMAIL,
      subject: `New consultation request from ${booking.name}`,
      html: `
        <h2>New tattoo consultation request</h2>
        <p><strong>Name:</strong> ${escapeHtml(booking.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a></p>
        <p><strong>Phone:</strong> ${escapeHtml(booking.phone || 'Not provided')}
          ${phone ? `(<a href="https://wa.me/${phone}">Open WhatsApp</a>)` : ''}</p>
        <p><strong>Cover Up:</strong> ${escapeHtml(booking.coverUp || 'Not provided')}</p>
        <p><strong>Placement:</strong> ${escapeHtml(booking.placement || 'Not provided')}</p>
        <p><strong>Size:</strong> ${escapeHtml(booking.size || 'Not provided')}</p>
        <p><strong>Preferred date:</strong> ${escapeHtml(formatEdmontonDateTime(startTime))}</p>
        <p><strong>Description:</strong> ${escapeHtml(booking.description || 'Not provided')}</p>
        <p>
          <a href="${approveUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;padding:10px 20px;color:#ffffff;background-color:#16a34a;border-radius:4px;">Approve Appointment</a>
          <a href="${rejectUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;padding:10px 20px;color:#ffffff;background-color:#dc2626;border-radius:4px;margin-left:8px;">Reject</a>
        </p>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Si los botones de arriba no funcionan, copia y pega el siguiente enlace en tu navegador para APROBAR la cita:<br>
          <a href="${approveUrl}">${approveUrl}</a>
        </p>
      `,
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
