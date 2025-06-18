import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { credits, type Credit, type InsertCredit } from "@shared/schema";

export interface IStorage {
  getCredits(): Promise<Credit[]>;
  getCreditsByMonth(year: number, month: number): Promise<Credit[]>;
  getCredit(id: number): Promise<Credit | undefined>;
  createCredit(credit: InsertCredit): Promise<Credit>;
  updateCredit(id: number, credit: Partial<InsertCredit>): Promise<Credit | undefined>;
  deleteCredit(id: number): Promise<boolean>;
}

interface MongoCredit {
  _id: ObjectId;
  date: string;
  description: string;
  amount: string;
  createdAt: Date;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private collection: Collection<MongoCredit>;
  private connected: boolean = false;

  constructor() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is required");
    }
    this.client = new MongoClient(uri);
    this.db = this.client.db("credit_tracker");
    this.collection = this.db.collection<MongoCredit>("credits");
  }

  private async ensureConnection(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  private convertFromMongo(mongoCredit: MongoCredit): Credit {
    return {
      id: parseInt(mongoCredit._id.toString().slice(-8), 16),
      date: mongoCredit.date,
      description: mongoCredit.description,
      amount: mongoCredit.amount,
      createdAt: mongoCredit.createdAt,
    };
  }

  async getCredits(): Promise<Credit[]> {
    await this.ensureConnection();
    const mongoCredits = await this.collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return mongoCredits.map(this.convertFromMongo);
  }

  async getCreditsByMonth(year: number, month: number): Promise<Credit[]> {
    await this.ensureConnection();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const mongoCredits = await this.collection
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    return mongoCredits.map(this.convertFromMongo);
  }

  async getCredit(id: number): Promise<Credit | undefined> {
    await this.ensureConnection();
    const objectId = new ObjectId(id.toString(16).padStart(24, '0'));
    const mongoCredit = await this.collection.findOne({ _id: objectId });
    return mongoCredit ? this.convertFromMongo(mongoCredit) : undefined;
  }

  async createCredit(insertCredit: InsertCredit): Promise<Credit> {
    await this.ensureConnection();
    const mongoCredit: Omit<MongoCredit, '_id'> = {
      ...insertCredit,
      createdAt: new Date(),
    };
    
    const result = await this.collection.insertOne(mongoCredit as MongoCredit);
    const newCredit = await this.collection.findOne({ _id: result.insertedId });
    
    if (!newCredit) {
      throw new Error("Failed to create credit");
    }
    
    return this.convertFromMongo(newCredit);
  }

  async updateCredit(id: number, updateData: Partial<InsertCredit>): Promise<Credit | undefined> {
    await this.ensureConnection();
    const objectId = new ObjectId(id.toString(16).padStart(24, '0'));
    
    const result = await this.collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result ? this.convertFromMongo(result) : undefined;
  }

  async deleteCredit(id: number): Promise<boolean> {
    await this.ensureConnection();
    const objectId = new ObjectId(id.toString(16).padStart(24, '0'));
    const result = await this.collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }
}

export class MemStorage implements IStorage {
  private credits: Map<number, Credit>;
  private currentId: number;

  constructor() {
    this.credits = new Map();
    this.currentId = 1;
  }

  async getCredits(): Promise<Credit[]> {
    return Array.from(this.credits.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getCreditsByMonth(year: number, month: number): Promise<Credit[]> {
    const allCredits = await this.getCredits();
    return allCredits.filter(credit => {
      const creditDate = new Date(credit.date);
      return creditDate.getFullYear() === year && creditDate.getMonth() === month - 1;
    });
  }

  async getCredit(id: number): Promise<Credit | undefined> {
    return this.credits.get(id);
  }

  async createCredit(insertCredit: InsertCredit): Promise<Credit> {
    const id = this.currentId++;
    const credit: Credit = {
      ...insertCredit,
      id,
      createdAt: new Date(),
    };
    this.credits.set(id, credit);
    return credit;
  }

  async updateCredit(id: number, updateData: Partial<InsertCredit>): Promise<Credit | undefined> {
    const existingCredit = this.credits.get(id);
    if (!existingCredit) {
      return undefined;
    }

    const updatedCredit: Credit = {
      ...existingCredit,
      ...updateData,
    };
    this.credits.set(id, updatedCredit);
    return updatedCredit;
  }

  async deleteCredit(id: number): Promise<boolean> {
    return this.credits.delete(id);
  }
}

// Use MongoDB if available, fallback to memory storage
export const storage = process.env.MONGODB_URI ? new MongoStorage() : new MemStorage();
