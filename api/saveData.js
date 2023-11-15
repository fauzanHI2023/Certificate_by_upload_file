import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, certificateNumber } = req.body;

    if (!name || !certificateNumber) {
      return res.status(400).json({ error: 'Name and certificateNumber are required' });
    }

    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db('certificate-tanampohon');
      const collection = db.collection('collection-tanampohon');

      const result = await collection.insertOne({
        name: name,
        certificateNumber: certificateNumber,
        // Add other fields as needed
      });

      client.close();

      return res.status(200).json({ success: true, data: result.ops[0] });
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
