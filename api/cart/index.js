import { MongoClient, ObjectId } from 'mongodb';

const connectionString = process.env.MONGODB_URI || process.env.DATABASE_URL;
let client;

async function connectToDatabase() {
  if (!connectionString) {
    throw new Error('MongoDB connection string not provided');
  }
  
  if (!client) {
    client = new MongoClient(connectionString);
    await client.connect();
  }
  return client.db("restaurant_pos");
}

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const database = await connectToDatabase();
    console.log('MongoDB connected successfully');
    
    if (req.method === 'GET') {
      console.log('Fetching cart items...');
      const cartItems = await database.collection('cart').find({}).toArray();
      console.log(`Found ${cartItems.length} cart items`);
      res.status(200).json(cartItems);
    } else if (req.method === 'POST') {
      // DISABLED: Write operation blocked to prevent database modifications
      console.warn('POST to cart is disabled - database is in READ-ONLY mode');
      res.status(403).json({ 
        error: 'Database is in READ-ONLY mode',
        message: 'Write operations are disabled'
      });
    } else if (req.method === 'DELETE') {
      // DISABLED: Delete operation blocked to prevent database modifications
      console.warn('DELETE on cart is disabled - database is in READ-ONLY mode');
      res.status(403).json({ 
        error: 'Database is in READ-ONLY mode',
        message: 'Delete operations are disabled'
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      connectionString: connectionString ? 'Present' : 'Missing'
    });
    res.status(500).json({ 
      error: 'Cart operation failed',
      details: error.message 
    });
  }
}