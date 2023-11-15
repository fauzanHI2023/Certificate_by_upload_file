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

        // Find the document with the certificate counter
        const counterDoc = await collection.findOne({ _id: 'certificateCounter' });

        // If the document doesn't exist, create it
        if (!counterDoc) {
        await collection.insertOne({ _id: 'certificateCounter', value: 1 });
        }

        // Increment the certificate number and get the next value
        const nextCertificateNumber = await collection.findOneAndUpdate(
        { _id: 'certificateCounter' },
        { $inc: { value: 1 } },
        { returnDocument: 'after' }
        );

        await collection.insertOne({ name, certificateNumber: nextCertificateNumber.value, });

        client.close();

        res.status(200).json({ success: true, data: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, error: 'Error saving data' });
    }
};
