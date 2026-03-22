import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find all appointments for the user, sorting by date ascending
    const appointments = await Appointment.find({ userId }).sort({ date: 1 });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('API Appointments GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    const { date, note } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Missing date' }, { status: 400 });
    }

    await connectDB();

    const appointment = await Appointment.create({
      userId,
      date: new Date(date),
      note
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('API Appointments POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
