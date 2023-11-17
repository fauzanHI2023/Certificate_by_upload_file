// api/getCount.js

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db('certificate-hi-tanampohon');
    const collection = db.collection('tanampohon');

    const count = await collection.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
