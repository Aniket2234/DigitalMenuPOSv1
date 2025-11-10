import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGODB_URI || "";

async function inspectDatabase() {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    console.log("✅ Connected to MongoDB successfully\n");
    
    const db = client.db("mingsdb");
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("=== COLLECTIONS FOUND ===");
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
      
      if (count > 0) {
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
