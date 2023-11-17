import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);

    const db = client.db('certificate-hi-tanampohon');
    const collection = db.collection('tanampohon');

    // Find the count and increment it
    const result = await collection.findOneAndUpdate(
      { type: 'certificateCount' },
      { $inc: { count: 1 } },
      { returnDocument: 'after' }
    );

    const certificateNumber = result.value.count;
    res.status(200).json({ certificateNumber });
  } catch (error) {
    console.error('Error getting next certificate number:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
