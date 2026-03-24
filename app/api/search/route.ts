import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QA from '@/models/QA';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    await connectDB();

    // Fuzzy look inside questions or keywords array using Regex
    const items = await QA.find({
      $or: [
        { question: { $regex: q, $options: 'i' } },
        { keywords: { $regex: q, $options: 'i' } }
      ]
    }).limit(5); // Limit output to keep layout compact triggers

    const results = items.map(item => ({
      id: item._id,
      question: item.question,
      response: item.response,
      category: item.category
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
