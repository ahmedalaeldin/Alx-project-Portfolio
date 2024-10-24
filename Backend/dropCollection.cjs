const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://accahmedalaeldin:oTf9OWXBDdoKEPf9@cluster0.o1imf.mongodb.net';

// Create a new MongoClient
const client = new MongoClient(uri);

async function dropCollection() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Select the database
        const db = client.db('tracker-db');

        // Drop the 'users' collection
        const result = await db.collection('users').drop();
        console.log('Collection dropped:', result);
    } catch (err) {
        console.error('Error dropping collection:', err);
    } finally {
        // Close the connection
        await client.close();
    }
}

// Call the function to drop the collection
dropCollection();
