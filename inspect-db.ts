import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGODB_URI || "";

async function inspectDatabase() {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    console.log("✅ Connected to MongoDB successfully\n");
    
    const db = client.db("restaurant_pos");
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("=== COLLECTIONS IN 'restaurant_pos' DATABASE ===");
    console.log(`Total collections: ${collections.length}\n`);
    
    for (const collection of collections) {
      console.log(`📁 Collection: ${collection.name}`);
    }
    console.log("\n");
    
    // Inspect each collection
    for (const collection of collections) {
      const collName = collection.name;
      const coll = db.collection(collName);
      const count = await coll.countDocuments();
      console.log(`\n=== ${collName} ===`);
      console.log(`Documents count: ${count}`);
      
      if (count > 0 && count <= 3) {
        // Get all documents if count is small
        const docs = await coll.find({}).limit(3).toArray();
        console.log("Sample documents:");
        console.log(JSON.stringify(docs, null, 2));
      } else if (count > 0) {
        // Get sample document to understand schema
        const sample = await coll.findOne({});
        console.log("Sample document structure:");
        console.log(JSON.stringify(sample, null, 2));
      }
    }
    
    await client.close();
  } catch (error) {
    console.error("❌ Error inspecting database:", error);
  }
}

inspectDatabase();
