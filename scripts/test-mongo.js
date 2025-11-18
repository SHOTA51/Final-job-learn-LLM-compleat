require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    console.log('[test-mongo] connecting...');
    await client.connect();
    console.log('[test-mongo] connected');
    const res = await client.db().admin().ping();
    console.log('[test-mongo] ping:', res);
  } catch (err) {
    console.error('[test-mongo] connection error:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
