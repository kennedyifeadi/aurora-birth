import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BabyReading from '@/models/BabyReading';

function getUserId(request: Request) {
  return request.headers.get('x-user-id');
}

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '7');

    await connectDB();
    const readings = await BabyReading.find({ userId })
      .sort({ recordedAt: -1 })
      .limit(limit);

    return NextResponse.json(readings);
  } catch (error: any) {
    console.error('Get Baby Readings Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    await connectDB();

    const reading = await BabyReading.create({ ...data, userId });

    return NextResponse.json(reading, { status: 201 });
  } catch (error: any) {
    console.error('Create Baby Reading Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
