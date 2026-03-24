import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const index = line.indexOf('=');
    if (index > 0) acc[line.substring(0, index).trim()] = line.substring(index + 1).trim();
    return acc;
  }, {});

const uri = envConfig.MONGODB_URI;

function levenshtein(a, b) {
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

async function testMatch() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const qaItems = await db.collection('qas').find({}).toArray();

  const text = "why am i tired";
  const userInput = text.toLowerCase().trim();
  const userWords = userInput.split(/[\s,?!.]+/).filter(Boolean);

  let bestMatch = null;
  let maxMatches = 0;

  for (const item of qaItems) {
    let matchCount = 0;
    for (const kw of item.keywords) {
      const kwWords = kw.toLowerCase().split(' ').filter(Boolean);
      
      const qualifies = kwWords.every(kWord => {
        return userWords.some(uWord => {
          if (uWord === kWord) return true;
          if (uWord.includes(kWord) || (uWord.length > 3 && kWord.includes(uWord))) {
             console.log(`   MATCH Substring: uWord=${uWord} | kWord=${kWord} on QA: "${item.question.substring(0,30)}"`);
             return true;
          }
          if (kWord.length > 3 && levenshtein(uWord, kWord) <= 1) {
             console.log(`   MATCH Fuzzy: uWord=${uWord} | kWord=${kWord} on QA: "${item.question.substring(0,30)}"`);
             return true;
          }
          return false;
        });
      });

      if (qualifies) {
        matchCount += kwWords.length;
      }
    }

    if (matchCount > 0) {
      console.log(`Item: ${item.question.substring(0, 40)} | Score: ${matchCount}`);
    }

    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestMatch = item;
    }
  }

  console.log("\n--- BEST MATCH ---");
  console.log(bestMatch ? bestMatch.question : "NULL");

  await client.close();
}

testMatch();
