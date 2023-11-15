// api/saveData.js
import { MongoClient } from 'mongodb';

export default async (req, res) => {
    try {
        const { name } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();

        const db = client.db('certificate-tanampohon');
        const collection = db.collection('collection-tanampohon');

        await collection.insertOne({ name });

        client.close();

        res.status(200).json({ success: true, data: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, error: 'Error saving data' });
    }
};
