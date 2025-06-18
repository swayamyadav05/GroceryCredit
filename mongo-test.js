import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
console.log("Testing MongoDB URI:", uri);

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db("GroceryTrack");
        const collections = await db.listCollections().toArray();
        console.log(
            "Collections:",
            collections.map((c) => c.name)
        );
    } catch (err) {
        console.error("MongoDB connection error:", err);
    } finally {
        await client.close();
    }
}

run();
