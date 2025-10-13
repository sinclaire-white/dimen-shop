import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

// Function to connect to a specific collection
// Returns { client, collection } for DB operations
async function dbConnect(collectionName) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect(); // Connect to MongoDB server
    const db = client.db("dimenshopdb"); // Select database
    const collection = db.collection(collectionName); // Select collection
    return { client, collection };
  } catch (err) {
    console.error("Database connection error:", err);
    throw err; // Propagate error to calling code
  }
}

export default dbConnect;
