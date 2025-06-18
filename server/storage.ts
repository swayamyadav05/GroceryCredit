import { credits, type Credit, type InsertCredit } from "@shared/schema";

export interface IStorage {
  getCredits(): Promise<Credit[]>;
  getCreditsByMonth(year: number, month: number): Promise<Credit[]>;
  getCredit(id: number): Promise<Credit | undefined>;
  createCredit(credit: InsertCredit): Promise<Credit>;
  updateCredit(id: number, credit: Partial<InsertCredit>): Promise<Credit | undefined>;
  deleteCredit(id: number): Promise<boolean>;
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

export const storage = new MemStorage();
