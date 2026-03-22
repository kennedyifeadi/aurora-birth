import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Profile from '@/models/Profile';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(userId).select('-passwordHash');
    const profile = await Profile.findOne({ userId });

    return NextResponse.json({
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
      },
      profile: profile || {}
    });
  } catch (error) {
    console.error('API Profile GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    const payload = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Remove user/email fields if they accidentally leak into profile payload 
    // to keep User and Profile tables segregated
    const { name, email, ...profileData } = payload;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { ...profileData, userId },
      { upsert: true, new: true }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('API Profile POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
