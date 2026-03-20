import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';

function getUserId(request: Request) {
  return request.headers.get('x-user-id');
}

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const appointments = await Appointment.find({ userId }).sort({ date: 1 });

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error('Get Appointments Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { date, note } = await request.json();
    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    await connectDB();
    const appointment = await Appointment.create({ userId, date, note });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error('Create Appointment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
