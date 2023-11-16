import { MongoClient } from 'mongodb';


export default async function handler(req, res) {
  try {
    console.log('Starting function...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    // Connect to the MongoDB cluster
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('certificate-tanampohon');
    const collection = db.collection('collection-tanampohon');

    // Perform a query to retrieve data (replace {} with your query)
    const result = await collection.find({}).toArray();

    // Send the data as a JSON response
    res.status(200).json({ data: result });
} catch (error) {
    console.error('Error saving data to MongoDB:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
