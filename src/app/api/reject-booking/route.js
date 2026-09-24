import { NextResponse } from 'next/server';
import { readBookingToken } from '@/lib/booking';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const token = new URL(request.url).searchParams.get('data');
    if (!token) {
      return NextResponse.json({ error: 'Missing booking rejection data' }, { status: 400 });
    }

    readBookingToken(token);
    return new Response('<h1>Booking request rejected.</h1>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Booking rejection failed:', error);
    return NextResponse.json({ error: 'Unable to reject booking' }, { status: 500 });
  }
}
