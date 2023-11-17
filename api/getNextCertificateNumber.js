import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Connect to the MongoDB cluster
    const client = await MongoClient.connect(process.env.MONGODB_URI);
  
    // Access the specified database
    const db = client.db('certificate-hi-tanampohon');
  
    // Access the collection (replace 'yourCollection' with the actual collection name)
    const collection = db.collection('tanampohon');
  
    // Perform a query to retrieve the next certificate number
    const result = await collection.countDocuments();
    const nextCertificateNumber = result + 1;
  
    // Send the next certificate number as a JSON response
    res.status(200).json({ nextCertificateNumber });
  } catch (error) {
    console.error('Error getting next certificate number:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
}
