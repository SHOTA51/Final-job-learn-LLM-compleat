const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Minimal .env parser to avoid installing dotenv in this environment
function loadEnv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    });
  } catch (e) {
    // ignore
  }
}

loadEnv(path.resolve(__dirname, '..', '.env'));

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    console.log('[test-mongo-no-deps] connecting...');
    await client.connect();
    console.log('[test-mongo-no-deps] connected');
    const res = await client.db().admin().ping();
    console.log('[test-mongo-no-deps] ping:', res);
  } catch (err) {
    console.error('[test-mongo-no-deps] connection error:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
