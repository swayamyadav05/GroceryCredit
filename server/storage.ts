import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import {
    credits,
    type Credit,
    type InsertCredit,
    insertCreditSchema,
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import "dotenv/config";

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});
export const db = drizzle(pool);

export async function getCredits(): Promise<Credit[]> {
    return db.select().from(credits);
}

export async function getCreditsByMonth(
    year: number,
    month: number
): Promise<Credit[]> {
    // Assuming date is stored as 'YYYY-MM-DD'
    const monthStr = month.toString().padStart(2, "0");
    const likePattern = `${year}-${monthStr}-%`;
    return db
        .select()
        .from(credits)
        .where(sql`date LIKE ${likePattern}`);
}

export async function createCredit(data: any): Promise<Credit> {
    const validated = insertCreditSchema.parse(data);
    const [created] = await db.insert(credits).values(validated).returning();
    return created;
}

export async function updateCredit(
    id: number,
    update: any
): Promise<Credit | null> {
    const [updated] = await db
        .update(credits)
        .set(update)
        .where(eq(credits.id, id))
        .returning();
    return updated ?? null;
}

export async function deleteCredit(id: number): Promise<boolean> {
    const result = await db
        .delete(credits)
        .where(eq(credits.id, id))
        .returning();
    return result.length > 0;
}
