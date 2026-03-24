import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QA from '@/models/QA';

function levenshtein(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
    }
  }
  return matrix[b.length][a.length];
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    // NOTE: The original code used Mongoose (QA model and connectDB).
    // The provided change snippet uses native MongoDB driver syntax (clientPromise, db.collection).
    // For consistency with the original file's structure, I'm adapting the new logic
    // to use the existing Mongoose setup (connectDB and QA model).
    // If a full switch to native driver is intended, `clientPromise` would need to be imported/defined,
    // and `connectDB`/`QA` imports might be removed.
    await connectDB();
    const qaItems = await QA.find();

    const userInput = text.toLowerCase().trim();
    const userWords = userInput.split(/[\s,?!.]+/).filter(Boolean);

    let bestMatch = null;
    let maxMatches = 0;

    // Keyword match iteration with fuzzy overlap scoring
    for (const item of qaItems) {
      let matchCount = 0;
      for (const kw of item.keywords) {
         const kwWords = kw.toLowerCase().split(' ').filter(Boolean);
         
         // Match if EVERY word of the keyword phrase covers SOME word of user input
         const qualifies = kwWords.every((kWord: string) => {
            return userWords.some((uWord: string) => {
               // 1. Stemmed/Substring overlap (kicks vs kicking)
               if (uWord.includes(kWord) || kWord.includes(uWord)) return true;
               // 2. Levenshtein for typos (boby vs body, length > 3 to avoid 'is' vs 'it' false positives)
               if (kWord.length > 3 && levenshtein(uWord, kWord) <= 1) return true;
               return false;
            });
         });

         if (qualifies) {
            matchCount += kwWords.length; 
         }
      }
      if (matchCount > maxMatches) {
         maxMatches = matchCount;
         bestMatch = item;
      }
    }

    let responseText = bestMatch 
       ? bestMatch.response 
       : "I am here to help, but I'm still learning about that topic. For any urgent health concerns, it's always best to consult your doctor or care team.";

    // Safety layer check for high-risk inputs
    const highRiskWords = ['bleed', 'blood', 'severe pain', 'no kick', 'no movement', 'fluid leak', 'unbearable'];
    const containsRisk = highRiskWords.some(word => userInput.includes(word));

    if (containsRisk && (!bestMatch || bestMatch.category !== 'ALERT')) {
        responseText = "I notice you mentioned some symptoms that need careful monitoring. **Please contact your doctor or visit a medical facility immediately** to ensure you and your baby are safe.";
    }

    return NextResponse.json({ text: responseText, category: bestMatch?.category || 'GENERAL' });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
