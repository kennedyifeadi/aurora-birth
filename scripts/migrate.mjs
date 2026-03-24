import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load .env robustly
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const index = line.indexOf('=');
    if (index > 0) {
      const key = line.substring(0, index).trim();
      const value = line.substring(index + 1).trim();
      acc[key] = value;
    }
    return acc;
  }, {});

const atlasUri = envConfig.MONGODB_URI;
const localUri = 'mongodb://localhost:27017/aurora_birth';

async function migrate() {
  if (!atlasUri) {
    console.error('Atlas URI missing in .env');
    process.exit(1);
  }

  const localClient = new MongoClient(localUri);
  const atlasClient = new MongoClient(atlasUri);

  try {
    await localClient.connect();
    await atlasClient.connect();
    console.log('Connected to both local and Atlas clusters flawlessly.');

    const localDb = localClient.db();
    const atlasDb = atlasClient.db(); // Maps database name automatically from the Atlas connection string

    const collections = ['users', 'profiles', 'appointments'];

    for (const collName of collections) {
      console.log(`\nMigrating ${collName}...`);
      const docs = await localDb.collection(collName).find({}).toArray();
      if (docs.length === 0) {
        console.log(`No documents found in local ${collName}.`);
        continue;
      }

      console.log(`Found ${docs.length} documents locally.`);
      try {
        // use ordered: false to skip duplicate insertions if they partially seeded things before flawlessly
        const result = await atlasDb.collection(collName).insertMany(docs, { ordered: false });
        console.log(`Successfully migrated ${result.insertedCount} items to Atlas.`);
      } catch (insertError) {
        if (insertError.writeErrors) {
          console.log(`Skipped ${insertError.writeErrors.length} duplicate/existing items. Migrated rest.`);
        } else {
          console.error(`Error inserting into Atlas ${collName}:`, insertError.message);
        }
      }
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await localClient.close();
    await atlasClient.close();
    console.log('\nMigration processes closed flawlessly.');
  }
}

migrate();
