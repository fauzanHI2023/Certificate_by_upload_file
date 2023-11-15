// api/getdata.js

import { MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DB } = process.env;

export default async function handler(req, res) {
  try {
    // Connect to the MongoDB cluster
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Access the specified database
    const db = client.db(MONGODB_DB);

    // Access the collection (replace 'yourCollection' with the actual collection name)
    const collection = db.collection('collection-tanampohon');

    // Perform a query to retrieve data (replace {} with your query)
    const result = await collection.find({}).toArray();

    // Send the data as a JSON response
    res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
}