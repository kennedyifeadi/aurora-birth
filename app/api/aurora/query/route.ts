import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AuroraQuestion from '@/models/AuroraQuestion';

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    await connectDB();
    const questions = await AuroraQuestion.find({});

    const normalizedInput = normalizeText(text);
    const inputWords = normalizedInput.split(' ');

    let bestMatch = null;
    let maxMatches = 0;

    for (const q of questions) {
      let matches = 0;
      for (const keyword of q.keywords) {
        const normalizedKeyword = normalizeText(keyword);
        if (normalizedInput.includes(normalizedKeyword)) {
          matches += 2; // Higher weight for exact phrase match
        } else {
          const keywordWords = normalizedKeyword.split(' ');
          for (const kw of keywordWords) {
            if (inputWords.includes(kw)) {
              matches += 1;
            }
          }
        }
      }

      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = q;
      }
    }

    if (bestMatch && maxMatches > 0) {
      return NextResponse.json({
        response: bestMatch.responseText,
        category: bestMatch.category,
      });
    }

    return NextResponse.json({
      response: "I'm not sure I understand. Could you please rephrase or provide more detail about how you are feeling?",
      category: "unknown",
    });
  } catch (error: any) {
    console.error('Aurora Query Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
