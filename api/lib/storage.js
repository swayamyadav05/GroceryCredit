import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import { credits, insertCreditSchema } from "../../shared/schema.js";
import { eq, sql } from "drizzle-orm";
import "dotenv/config";

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

const db = drizzle(pool);

export async function getCredits() {
    return db.select().from(credits);
}

export async function getCreditsByMonth(year, month) {
    const monthStr = month.toString().padStart(2, "0");
    const likePattern = `${year}-${monthStr}-%`;
    return db
        .select()
        .from(credits)
        .where(sql`date LIKE ${likePattern}`);
}

export async function createCredit(data) {
    const validated = insertCreditSchema.parse(data);
    const [created] = await db.insert(credits).values(validated).returning();
    return created;
}

export async function updateCredit(id, update) {
    const [updated] = await db
        .update(credits)
        .set(update)
        .where(eq(credits.id, id))
        .returning();
    return updated ?? null;
}

export async function deleteCredit(id) {
    const result = await db
        .delete(credits)
        .where(eq(credits.id, id))
        .returning();
    return result.length > 0;
}
