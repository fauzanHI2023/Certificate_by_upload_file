import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, certificateNumber, pdfDataUri } = req.body;

    console.log('Request Body:', req.body);

    console.log(JSON.stringify({
        name: name,
        email: email,
        certificateNumber: certificateNumber,
        pdfDataUri: pdfDataUri,
    }));

    if (!name || !certificateNumber) {
      return res.status(400).json({ error: 'Name and certificateNumber are required' });
    }

    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db('certificate-hi-tanampohon');
      const collection = db.collection('tanampohon');

      const result = await collection.insertOne({
        name: name,
        email: email,
        certificateNumber: certificateNumber,
        pdfDataUri: pdfDataUri,
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
